#!/bin/bash
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  StructIQ — Project Structure Analyzer"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -z "$GROQ_API_KEY" ]; then
  echo "⚠  GROQ_API_KEY not set. AI insights will be disabled."
  echo "   Get a free key at: https://console.groq.com"
  echo "   Then run: export GROQ_API_KEY=your_key_here"
  echo ""
fi

cd "$(dirname "$0")/backend"

echo "📦 Installing dependencies..."
pip install -r requirements.txt -q

echo "🚀 Starting Flask server on http://localhost:5000"
echo "🌐 Open frontend/index.html in your browser"
echo ""
python app.py
