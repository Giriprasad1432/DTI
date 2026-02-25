from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///smartlib_final.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class IssuedBook(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.String(20), nullable=False)
    book_title = db.Column(db.String(100), nullable=False)
    student_id = db.Column(db.String(20), nullable=False)
    student_name = db.Column(db.String(100), nullable=False)
    mobile = db.Column(db.String(15), nullable=False)
    branch = db.Column(db.String(50), nullable=False)
    year = db.Column(db.String(10), nullable=False)
    due_date = db.Column(db.Date, nullable=False)

with app.app_context():
    db.create_all()
    if not IssuedBook.query.first():
        today = datetime.utcnow().date()
        db.session.add(IssuedBook(book_id="BK101", book_title="Data Structures", student_id="STU101", 
                                  student_name="Rahul Varma", mobile="9876543210", branch="CSE", 
                                  year="3rd Year", due_date=today - timedelta(days=2)))
        db.session.commit()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/books', methods=['GET'])
def get_books():
    role = request.args.get('role')
    sid = request.args.get('student_id')
    search = request.args.get('search', '')
    
    query = IssuedBook.query
    if role == 'student':
        query = query.filter_by(student_id=sid)
    elif search:
        query = query.filter((IssuedBook.student_id.contains(search)) | (IssuedBook.book_id.contains(search)))
    
    books = query.all()
    today = datetime.utcnow().date()
    return jsonify([{
        "id": b.id, "book_id": b.book_id, "title": b.book_title, "student": b.student_name,
        "mobile": b.mobile, "branch": b.branch, "year": b.year,
        "due_date": b.due_date.strftime('%Y-%m-%d'),
        "days_left": (b.due_date - today).days
    } for b in books])

@app.route('/api/issue', methods=['POST'])
def issue_book():
    data = request.json
    new_book = IssuedBook(
        book_id=data['book_no'], book_title=data['book_name'],
        student_id=data['student_no'], student_name=data['student_name'],
        mobile=data['mobile'], branch=data['branch'], year=data['year'],
        due_date=datetime.utcnow().date() + timedelta(days=14)
    )
    db.session.add(new_book)
    db.session.commit()
    return jsonify({"success": True})

@app.route('/api/renew', methods=['POST'])
def renew():
    book = IssuedBook.query.get(request.json.get('id'))
    if book:
        book.due_date = book.due_date + timedelta(days=7)
        db.session.commit()
        return jsonify({"success": True})
    return jsonify({"success": False}), 404

if __name__ == '__main__':
    app.run(debug=True)