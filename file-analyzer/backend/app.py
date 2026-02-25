import os
import re
import hashlib
import zipfile
import shutil
import json
import tempfile
import traceback
import httpx
from pathlib import Path
from collections import defaultdict
from dotenv import load_dotenv

load_dotenv()

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['MAX_CONTENT_LENGTH'] = None  # No limit — filtering handles size
UPLOAD_FOLDER = tempfile.mkdtemp()
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# In-memory chat sessions: { session_id: { analysis, files_summary, history } }
chat_sessions = {}

# ─────────────────────────────────────────────────────────────────────────────
#  MODELS
#  llama3-8b-8192 is DECOMMISSIONED — use these instead:
#    - llama-3.3-70b-versatile  : best quality, use for analysis (1 call)
#    - llama-3.1-8b-instant     : fast & cheap, use for chat (many calls)
# ─────────────────────────────────────────────────────────────────────────────
MODEL_ANALYSIS = "llama-3.3-70b-versatile"
MODEL_CHAT     = "llama-3.1-8b-instant"

# ─────────────────────────────────────────────────────────────────────────────
#  BASE FILTER SETS
# ─────────────────────────────────────────────────────────────────────────────

BASE_SKIP_DIRS = {
    '.git', '.svn', '.hg',
    'node_modules', '.npm', '.yarn', 'bower_components', '.pnp',
    '__pycache__', 'venv', '.venv', 'env', 'site-packages',
    '.pytest_cache', '.mypy_cache', '.ruff_cache', 'htmlcov',
    'build', 'dist', 'out', 'output', 'bin', 'obj', 'target',
    '.next', '.nuxt', '.svelte-kit', '.output', '.vercel',
    '.gradle', '.m2',
    '.idea', '.vscode', '.vs', '__MACOSX', '.Spotlight-V100',
    '.Trashes', '.fseventsd',
    'coverage', '.nyc_output',
    '.cache', 'tmp', 'temp', '.temp', 'logs',
    'vendor', 'third_party', 'extern', 'external', 'deps',
}

BASE_SKIP_EXTENSIONS = {
    '.pyc', '.pyo', '.pyd', '.class', '.o', '.obj', '.so',
    '.dll', '.exe', '.lib', '.a', '.dylib', '.wasm',
    '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.ico', '.tiff',
    '.tif', '.webp', '.heic', '.heif', '.raw', '.psd', '.ai',
    '.eps', '.sketch', '.fig',
    '.mp3', '.mp4', '.wav', '.avi', '.mov', '.mkv', '.flac',
    '.ogg', '.webm', '.m4a', '.aac',
    '.tar', '.gz', '.bz2', '.xz', '.rar', '.7z', '.zip', '.tgz', '.tbz2',
    '.ttf', '.otf', '.woff', '.woff2', '.eot',
    '.doc', '.xls', '.ppt', '.docx', '.xlsx', '.pptx',
    '.odt', '.ods', '.odp', '.pages', '.numbers', '.key',
    '.db', '.sqlite', '.sqlite3', '.pkl', '.pickle',
    '.npy', '.npz', '.h5', '.hdf5', '.parquet', '.feather', '.arrow',
    '.lock', '.sum',
    '.log', '.out',
    '.map', '.js.map', '.css.map',
    '.bin', '.dat', '.iso', '.img', '.dmg', '.apk', '.ipa',
    '.jar', '.war', '.ear',
    '.pt', '.pth', '.ckpt', '.safetensors', '.onnx', '.pb', '.tflite',
    '.pem', '.crt', '.cer', '.key', '.p12', '.pfx',
}

BASE_SKIP_FILENAMES = {
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
    'Pipfile.lock', 'poetry.lock', 'Cargo.lock', 'composer.lock',
    'Gemfile.lock', '.DS_Store', 'Thumbs.db', 'desktop.ini',
    '.gitkeep', '.gitignore', '.dockerignore', '.npmignore',
}

# All inner values are proper Python SETS (no colons)
CONTEXT_SKIP_DIRS = {
    'web':      {'static', 'assets', 'public', 'www', 'media', 'uploads', 'images'},
    'ml':       {'checkpoints', 'weights', 'models', 'datasets', 'data', 'runs', 'wandb', 'mlruns'},
    'mobile':   {'Pods', '.gradle', 'build', 'DerivedData', 'xcuserdata'},
    'data':     {'raw', 'processed', 'interim', 'external', 'figures', 'reports'},
    'academic': {'references', 'bibliography', 'figures', 'images', 'graphs'},
    'general':  set(),
}

CONTEXT_SKIP_EXTENSIONS = {
    'web':      {'.svg', '.webp', '.gif', '.mp4', '.webm', '.woff', '.woff2'},
    'ml':       {'.npy', '.npz', '.h5', '.csv', '.parquet', '.pt', '.pth', '.ckpt'},
    'mobile':   {'.apk', '.ipa', '.xcarchive', '.dSYM'},
    'data':     {'.csv', '.xlsx', '.parquet', '.feather', '.pkl', '.json'},
    'academic': {'.pdf', '.docx', '.pptx', '.png', '.jpg'},
    'general':  set(),
}

FOCUS_KEEP_TYPES = {
    'code_only': {'code'},
    'docs_only': {'doc'},
    'both':      {'code', 'doc', 'other'},
}

MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024
MAX_DEEP_ANALYZE    = 500

CODE_EXTENSIONS = {
    '.py', '.js', '.ts', '.jsx', '.tsx', '.java', '.cpp',
    '.c', '.h', '.cs', '.go', '.rb', '.php', '.swift',
    '.kt', '.rs', '.scala', '.r', '.m', '.vue', '.svelte',
}

DOC_EXTENSIONS = {
    '.txt', '.md', '.rst', '.csv', '.json', '.xml',
    '.yaml', '.yml', '.toml', '.ini', '.cfg', '.conf',
    '.html', '.css', '.scss', '.sass', '.less',
    '.sh', '.bash', '.zsh', '.fish', '.ps1', '.bat', '.cmd',
    '.sql', '.graphql', '.proto', '.tf', '.hcl',
    '.env.example', '.editorconfig', '.prettierrc', '.eslintrc',
}


# ─────────────────────────────────────────────────────────────────────────────
#  GROQ via httpx
# ─────────────────────────────────────────────────────────────────────────────

def call_groq(messages, model=MODEL_ANALYSIS, max_tokens=600, temperature=0.3):
    api_key = os.environ.get("GROQ_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("GROQ_API_KEY not set. Add it to your .env file and restart Flask.")

    try:
        resp = httpx.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
            },
            timeout=60,
        )
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"].strip()

    except httpx.HTTPStatusError as e:
        status = e.response.status_code
        try:
            detail = e.response.json().get('error', {}).get('message', str(e))
        except Exception:
            detail = str(e)
        if status == 401:
            raise RuntimeError("Invalid Groq API key — check console.groq.com/keys")
        elif status == 429:
            raise RuntimeError("Groq rate limit hit — wait a moment and try again")
        elif status == 400 and 'decommissioned' in detail:
            raise RuntimeError(f"Model decommissioned: {detail}")
        else:
            raise RuntimeError(f"Groq API error {status}: {detail}")
    except httpx.TimeoutException:
        raise RuntimeError("Groq request timed out — try again")


# ─────────────────────────────────────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────────────────────────────────────

def build_filters(user_context: dict):
    ptype = user_context.get('project_type', 'general')
    focus = user_context.get('focus_area', 'both')

    skip_dirs   = BASE_SKIP_DIRS       | CONTEXT_SKIP_DIRS.get(ptype, set())
    skip_exts   = BASE_SKIP_EXTENSIONS | CONTEXT_SKIP_EXTENSIONS.get(ptype, set())
    skip_fnames = set(BASE_SKIP_FILENAMES)
    keep_types  = FOCUS_KEEP_TYPES.get(focus, {'code', 'doc', 'other'})

    if user_context.get('skip_tests'):
        skip_dirs |= {'tests', 'test', '__tests__', 'spec', 'specs', 'e2e', 'fixtures', 'mocks', '__mocks__'}
        skip_fnames |= {'jest.config.js', 'jest.config.ts', 'vitest.config.ts', 'pytest.ini', 'setup.cfg'}

    if user_context.get('skip_configs'):
        skip_exts   |= {'.ini', '.cfg', '.conf', '.toml', '.editorconfig'}
        skip_fnames |= {'.prettierrc', '.eslintrc', '.babelrc', 'tsconfig.json',
                        'webpack.config.js', 'vite.config.ts', 'rollup.config.js'}

    for d in user_context.get('extra_skip_dirs', []):
        d = d.strip().lower()
        if d:
            skip_dirs.add(d)

    for e in user_context.get('extra_skip_exts', []):
        e = e.strip().lower()
        if e and not e.startswith('.'):
            e = '.' + e
        if e:
            skip_exts.add(e)

    return skip_dirs, skip_exts, skip_fnames, keep_types


def is_likely_binary(filepath):
    try:
        with open(filepath, 'rb') as f:
            return b'\x00' in f.read(8192)
    except Exception:
        return True


def scan_folder(root_path, skip_dirs, skip_exts, skip_fnames, keep_types):
    file_list = []
    skipped_large = skipped_binary = skipped_context = 0

    for dirpath, dirnames, filenames in os.walk(root_path):
        dirnames[:] = [
            d for d in dirnames
            if d.lower() not in {s.lower() for s in skip_dirs}
            and not d.startswith('.')
            and not d.startswith('__')
        ]

        rel_dir = os.path.relpath(dirpath, root_path)
        depth   = 0 if rel_dir == '.' else rel_dir.count(os.sep) + 1

        for fname in filenames:
            if fname.startswith('.') or fname in skip_fnames:
                continue
            ext = Path(fname).suffix.lower()
            if ext in skip_exts:
                skipped_context += 1
                continue
            if fname.endswith('.min.js') or fname.endswith('.min.css'):
                skipped_context += 1
                continue

            full_path = os.path.join(dirpath, fname)
            try:
                size = os.path.getsize(full_path)
            except Exception:
                continue

            if size > MAX_FILE_SIZE_BYTES:
                skipped_large += 1
                continue

            if ext in CODE_EXTENSIONS:
                ftype = 'code'
            elif ext in DOC_EXTENSIONS:
                ftype = 'doc'
            else:
                if is_likely_binary(full_path):
                    skipped_binary += 1
                    continue
                ftype = 'other'

            if ftype not in keep_types:
                skipped_context += 1
                continue

            rel_path = os.path.relpath(full_path, root_path).replace('\\', '/')
            file_list.append({
                'name': fname, 'path': rel_path, 'ext': ext,
                'size': size, 'depth': depth, 'type': ftype,
            })

    file_list.sort(key=lambda f: f['path'])
    return file_list, skipped_large, skipped_binary, skipped_context


def resolve_root(extracted_path):
    try:
        entries = [e for e in os.listdir(extracted_path)
                   if not e.startswith('.') and e != '__MACOSX']
        if len(entries) == 1:
            candidate = os.path.join(extracted_path, entries[0])
            if os.path.isdir(candidate):
                return candidate
    except Exception:
        pass
    return extracted_path


def build_folder_tree(root_path, file_list):
    root_name = os.path.basename(root_path) or 'project'
    tree = {'name': root_name, 'type': 'folder', 'children': []}
    for f in file_list:
        parts = f['path'].split('/')
        node  = tree
        for part in parts[:-1]:
            if not part:
                continue
            found = next(
                (c for c in node.get('children', [])
                 if c['name'] == part and c['type'] == 'folder'), None
            )
            if not found:
                found = {'name': part, 'type': 'folder', 'children': []}
                node['children'].append(found)
            node = found
        node['children'].append({
            'name': parts[-1], 'type': f['type'],
            'ext': f['ext'], 'size': f['size'],
        })
    return tree


def detect_duplicates(file_list, root_path):
    hash_map = defaultdict(list)
    for f in file_list:
        full_path = os.path.join(root_path, f['path'])
        try:
            with open(full_path, 'rb') as fh:
                file_hash = hashlib.md5(fh.read(8192)).hexdigest()
            hash_map[file_hash].append(f['path'])
        except Exception:
            pass
    return {h: paths for h, paths in hash_map.items() if len(paths) > 1}


def analyze_naming_consistency(file_list):
    patterns = {'snake_case': 0, 'camelCase': 0, 'PascalCase': 0, 'kebab-case': 0, 'mixed': 0}
    for f in file_list:
        name = Path(f['name']).stem
        if not name or len(name) < 2:
            continue
        if '_' in name and name == name.lower():
            patterns['snake_case'] += 1
        elif '-' in name and name == name.lower():
            patterns['kebab-case'] += 1
        elif name[0].isupper() and '_' not in name and '-' not in name:
            patterns['PascalCase'] += 1
        elif name[0].islower() and any(c.isupper() for c in name):
            patterns['camelCase'] += 1
        else:
            patterns['mixed'] += 1
    total    = sum(patterns.values())
    dominant = max(patterns.values()) if total else 0
    score    = round((dominant / total) * 100, 1) if total else 100.0
    return patterns, score


def analyze_imports(file_list, root_path):
    import_graph = defaultdict(list)
    import_patterns = {
        '.py':  [r'^import\s+([\w.]+)', r'^from\s+([\w.]+)\s+import'],
        '.js':  [r'(?:import|require)\s*[\(\'\"](\.[\w./\-]+)[\'\"]'],
        '.ts':  [r'(?:import|require)\s*[\(\'\"](\.[\w./\-]+)[\'\"]'],
        '.jsx': [r'(?:import|require)\s*[\(\'\"](\.[\w./\-]+)[\'\"]'],
        '.tsx': [r'(?:import|require)\s*[\(\'\"](\.[\w./\-]+)[\'\"]'],
        '.vue': [r'(?:import|require)\s*[\(\'\"](\.[\w./\-]+)[\'\"]'],
    }
    code_files = [f for f in file_list if f['ext'] in import_patterns][:MAX_DEEP_ANALYZE]
    for f in code_files:
        full_path = os.path.join(root_path, f['path'])
        try:
            with open(full_path, 'r', encoding='utf-8', errors='ignore') as fh:
                content = ''.join(line for i, line in enumerate(fh) if i < 500)
            for pattern in import_patterns[f['ext']]:
                for match in re.findall(pattern, content, re.MULTILINE):
                    if isinstance(match, tuple):
                        match = match[0]
                    if match and (match.startswith('.') or '/' in match):
                        import_graph[f['path']].append(match)
        except Exception:
            pass
    return dict(import_graph)


def detect_circular(import_graph):
    cycles = []
    adj    = defaultdict(list)
    files  = list(import_graph.keys())
    for src, imports in import_graph.items():
        for imp in imports:
            for candidate in files:
                if imp in candidate or candidate.replace('/', '.').replace('.py', '') in imp:
                    if candidate not in adj[src]:
                        adj[src].append(candidate)
                    break
    visited = set()
    for start in files:
        if start in visited:
            continue
        stack = [(start, [start], {start})]
        while stack:
            node, path, path_set = stack.pop()
            visited.add(node)
            for nb in adj.get(node, []):
                if nb in path_set:
                    cycle_start = path.index(nb)
                    cycles.append(path[cycle_start:] + [nb])
                    if len(cycles) >= 5:
                        return cycles
                elif nb not in visited:
                    stack.append((nb, path + [nb], path_set | {nb}))
    return cycles[:5]


def compute_scores(file_list, duplicates, naming_score, cycles, max_depth):
    issues = []
    deductions = 0
    dup_count = sum(len(v) for v in duplicates.values())
    if dup_count:
        deductions += min(20, dup_count * 5)
        issues.append({'severity': 'medium', 'msg': f'{dup_count} duplicate files detected'})
    if max_depth > 7:
        deductions += 15
        issues.append({'severity': 'high', 'msg': f'Heavily over-nested — max depth {max_depth} (recommended: ≤6)'})
    elif max_depth > 5:
        deductions += 8
        issues.append({'severity': 'medium', 'msg': f'Slightly deep nesting — depth {max_depth}'})
    if naming_score < 60:
        deductions += 15
        issues.append({'severity': 'high', 'msg': f'Very inconsistent naming — {naming_score}% consistency'})
    elif naming_score < 75:
        deductions += 8
        issues.append({'severity': 'medium', 'msg': f'Inconsistent naming conventions — {naming_score}%'})
    elif naming_score < 88:
        deductions += 3
        issues.append({'severity': 'low', 'msg': f'Naming could be more consistent — {naming_score}%'})
    if cycles:
        deductions += len(cycles) * 10
        issues.append({'severity': 'high', 'msg': f'{len(cycles)} circular dependency chain(s) detected'})
    folder_file_counts = defaultdict(int)
    for f in file_list:
        folder = '/'.join(f['path'].split('/')[:-1]) or 'root'
        folder_file_counts[folder] += 1
    bloated = [k for k, v in folder_file_counts.items() if v > 20]
    if bloated:
        deductions += 10
        issues.append({'severity': 'medium', 'msg': f'Bloated folders (20+ files): {", ".join(bloated[:3])}'})
    root_files = [f for f in file_list if '/' not in f['path']]
    if len(root_files) > 8:
        deductions += 5
        issues.append({'severity': 'low', 'msg': f'{len(root_files)} files loose at root — consider subfolder organization'})
    score = max(0, 100 - deductions)
    grade = 'A' if score >= 90 else 'B' if score >= 75 else 'C' if score >= 60 else 'D'
    return score, grade, issues


def get_groq_insights(summary_data, user_context):
    api_key = os.environ.get("GROQ_API_KEY", "").strip()
    if not api_key:
        return {
            'plain_summary': 'Set GROQ_API_KEY in your .env file to enable AI insights.',
            'top_recommendations': ['Add GROQ_API_KEY to .env', 'Restart Flask server', 'Re-upload project'],
            'beginner_tip': 'Get a free key at console.groq.com — no credit card needed!',
            'session_id': None,
        }
    try:
        ptype     = user_context.get('project_type', 'general')
        focus     = user_context.get('focus_area', 'both')
        user_note = user_context.get('user_note', '')

        prompt = (
            "You are a friendly assistant helping a student understand their project structure.\n\n"
            f"Project type: {ptype}\n"
            f"Focus area: {focus}\n"
            + (f"User note: {user_note}\n" if user_note else "")
            + f"Total files analyzed: {summary_data.get('total_files', 0)}\n"
            f"Max folder depth: {summary_data.get('max_depth', 0)}\n"
            f"Duplicate files: {summary_data.get('duplicate_count', 0)}\n"
            f"Naming consistency: {summary_data.get('naming_score', 0)}%\n"
            f"Circular dependencies: {summary_data.get('circular_count', 0)}\n"
            f"Health score: {summary_data.get('health_score', 0)}/100 (Grade: {summary_data.get('grade', 'N/A')})\n"
            f"Issues: {json.dumps(summary_data.get('issues', [])[:5])}\n"
            f"File types: {json.dumps(summary_data.get('file_types', {}))}\n\n"
            "Respond ONLY with valid JSON — no markdown, no code fences:\n"
            '{"plain_summary": "2-3 sentence explanation", '
            '"top_recommendations": ["rec 1", "rec 2", "rec 3"], '
            '"beginner_tip": "one short encouraging tip"}'
        )

        raw = call_groq(
            messages=[{"role": "user", "content": prompt}],
            model=MODEL_ANALYSIS,
            max_tokens=600,
            temperature=0.3,
        )
        raw = re.sub(r'^```(?:json)?\s*', '', raw)
        raw = re.sub(r'\s*```$', '', raw)
        result = json.loads(raw)
        return result

    except (json.JSONDecodeError, ValueError):
        return {
            'plain_summary': 'Analysis complete. AI summary temporarily unavailable.',
            'top_recommendations': ['Review issues listed', 'Reduce deep nesting', 'Remove duplicates'],
            'beginner_tip': 'Keep related files together in clearly named folders.',
        }
    except Exception as e:
        return {
            'plain_summary': f'Analysis complete. AI unavailable: {str(e)}',
            'top_recommendations': ['Review issues listed', 'Reduce deep nesting', 'Remove duplicates'],
            'beginner_tip': 'Keep related files together in clearly named folders.',
        }


# ─────────────────────────────────────────────────────────────────────────────
#  ROUTES
# ─────────────────────────────────────────────────────────────────────────────

@app.route('/analyze', methods=['POST'])
def analyze():
    files = request.files.getlist('files')
    if not files or all(f.filename == '' for f in files):
        return jsonify({'error': 'No files received. Please upload a folder or a .zip file.'}), 400

    raw_ctx = request.form.get('user_context', '{}')
    try:
        user_context = json.loads(raw_ctx)
    except Exception:
        user_context = {}

    skip_dirs, skip_exts, skip_fnames, keep_types = build_filters(user_context)
    work_dir = tempfile.mkdtemp(dir=UPLOAD_FOLDER)

    try:
        if len(files) == 1 and files[0].filename.lower().endswith('.zip'):
            save_path = os.path.join(work_dir, 'upload.zip')
            files[0].save(save_path)
            extracted_path = os.path.join(work_dir, 'extracted')
            os.makedirs(extracted_path)
            with zipfile.ZipFile(save_path, 'r') as zf:
                for member in zf.infolist():
                    member_path = os.path.realpath(os.path.join(extracted_path, member.filename))
                    if not member_path.startswith(os.path.realpath(extracted_path)):
                        continue
                    zf.extract(member, extracted_path)
            root_path = resolve_root(extracted_path)
        else:
            root_path = os.path.join(work_dir, 'folder')
            os.makedirs(root_path)
            for f in files:
                if not f.filename:
                    continue
                rel  = f.filename.replace('\\', '/')
                dest = os.path.realpath(os.path.join(root_path, rel))
                if not dest.startswith(os.path.realpath(root_path)):
                    continue
                os.makedirs(os.path.dirname(dest), exist_ok=True)
                f.save(dest)

        file_list, skipped_large, skipped_binary, skipped_context = scan_folder(
            root_path, skip_dirs, skip_exts, skip_fnames, keep_types
        )

        if not file_list:
            return jsonify({
                'error': 'No analyzable files found after filtering.'
            }), 400

        duplicates                    = detect_duplicates(file_list, root_path)
        naming_patterns, naming_score = analyze_naming_consistency(file_list)
        import_graph                  = analyze_imports(file_list, root_path)
        cycles                        = detect_circular(import_graph)
        folder_tree                   = build_folder_tree(root_path, file_list)
        max_depth                     = max((f['depth'] for f in file_list), default=0)

        type_counts = defaultdict(int)
        ext_counts  = defaultdict(int)
        for f in file_list:
            type_counts[f['type']] += 1
            ext_counts[f['ext']]   += 1

        health_score, grade, issues = compute_scores(
            file_list, duplicates, naming_score, cycles, max_depth
        )

        skipped_total = skipped_large + skipped_binary + skipped_context
        summary_data  = {
            'total_files':     len(file_list),
            'skipped_total':   skipped_total,
            'max_depth':       max_depth,
            'duplicate_count': sum(len(v) for v in duplicates.values()),
            'naming_score':    naming_score,
            'circular_count':  len(cycles),
            'health_score':    health_score,
            'grade':           grade,
            'issues':          issues,
            'file_types':      dict(type_counts),
        }

        ai_insights = get_groq_insights(summary_data, user_context)

        # ── Create a chat session so user can ask follow-up questions ──────
        import uuid
        session_id = str(uuid.uuid4())

        # Compact file list for chat context (path + type only, no sizes)
        files_for_chat = [{'path': f['path'], 'type': f['type'], 'ext': f['ext']} for f in file_list[:300]]

        chat_sessions[session_id] = {
            'summary':  summary_data,
            'issues':   issues,
            'cycles':   cycles,
            'duplicates': [{'files': paths} for _, paths in list(duplicates.items())[:10]],
            'naming':   {'score': naming_score, 'patterns': naming_patterns},
            'file_list': files_for_chat,
            'project_type': user_context.get('project_type', 'general'),
            'history':  [],
        }

        return jsonify({
            'success':    True,
            'session_id': session_id,
            'summary': {
                'total_files':     len(file_list),
                'skipped_large':   skipped_large,
                'skipped_binary':  skipped_binary,
                'skipped_context': skipped_context,
                'total_folders':   len(set('/'.join(f['path'].split('/')[:-1]) for f in file_list)),
                'max_depth':       max_depth,
                'health_score':    health_score,
                'grade':           grade,
                'naming_score':    naming_score,
                'naming_patterns': naming_patterns,
            },
            'issues':                 issues,
            'duplicates':             [{'files': paths} for _, paths in list(duplicates.items())[:10]],
            'cycles':                 cycles,
            'import_graph':           {k: v[:5] for k, v in list(import_graph.items())[:20]},
            'file_type_distribution': dict(type_counts),
            'ext_distribution':       dict(sorted(ext_counts.items(), key=lambda x: -x[1])[:10]),
            'folder_tree':            folder_tree,
            'files':                  file_list[:200],
            'ai_insights':            ai_insights,
            'applied_context': {
                'project_type': user_context.get('project_type', 'general'),
                'focus_area':   user_context.get('focus_area', 'both'),
                'skip_tests':   user_context.get('skip_tests', False),
                'skip_configs': user_context.get('skip_configs', False),
                'user_note':    user_context.get('user_note', ''),
            },
        })

    except zipfile.BadZipFile:
        return jsonify({'error': 'The ZIP file appears corrupted or invalid.'}), 400
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500
    finally:
        shutil.rmtree(work_dir, ignore_errors=True)


@app.route('/chat', methods=['POST'])
def chat():
    """
    AI agent chat — answers questions about the analyzed project.
    Uses the stored analysis data so no re-analysis needed.
    POST body: { session_id, message }
    """
    data = request.get_json(silent=True) or {}
    session_id = data.get('session_id', '').strip()
    message    = data.get('message', '').strip()

    if not message:
        return jsonify({'error': 'Empty message'}), 400
    if not session_id or session_id not in chat_sessions:
        return jsonify({'error': 'Session not found. Please re-analyze your project first.'}), 404

    session = chat_sessions[session_id]
    history = session['history']

    # Build system context from stored analysis
    system_ctx = f"""You are an expert code review assistant analyzing a {session['project_type']} project.

PROJECT ANALYSIS SUMMARY:
- Total files: {session['summary']['total_files']}
- Health score: {session['summary']['health_score']}/100 (Grade {session['summary']['grade']})
- Max folder depth: {session['summary']['max_depth']}
- Naming consistency: {session['naming']['score']}%
- Naming patterns: {json.dumps(session['naming']['patterns'])}
- Circular dependencies: {len(session['cycles'])} found
- Duplicate files: {len(session['duplicates'])} groups

ISSUES FOUND:
{json.dumps(session['issues'], indent=2)}

CIRCULAR DEPENDENCY CHAINS:
{json.dumps(session['cycles'], indent=2) if session['cycles'] else 'None detected'}

DUPLICATE FILE GROUPS:
{json.dumps(session['duplicates'][:5], indent=2) if session['duplicates'] else 'None detected'}

FILE LIST (first 150):
{chr(10).join(f["path"] for f in session['file_list'][:150])}

Answer the user's question clearly and specifically. Reference actual file names and paths. 
If they ask about fixing something, give concrete actionable steps.
Keep answers concise but complete."""

    # Build messages with history (last 6 turns)
    messages = [{"role": "system", "content": system_ctx}]
    for turn in history[-6:]:
        messages.append({"role": "user",      "content": turn['user']})
        messages.append({"role": "assistant", "content": turn['assistant']})
    messages.append({"role": "user", "content": message})

    try:
        reply = call_groq(
            messages=messages,
            model=MODEL_CHAT,       # fast 8b model for chat
            max_tokens=800,
            temperature=0.4,
        )
        history.append({'user': message, 'assistant': reply})
        session['history'] = history[-20:]  # keep last 20 turns

        return jsonify({'success': True, 'reply': reply})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/chat/clear', methods=['POST'])
def chat_clear():
    data = request.get_json(silent=True) or {}
    session_id = data.get('session_id', '')
    if session_id in chat_sessions:
        chat_sessions[session_id]['history'] = []
    return jsonify({'success': True})


@app.route('/health', methods=['GET'])
def health():
    api_key = os.environ.get("GROQ_API_KEY", "").strip()
    return jsonify({'status': 'ok', 'groq_configured': bool(api_key)})


if __name__ == '__main__':
    app.run(debug=True, port=5000)