from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# ✅ Database: BookcollectionDB
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="010403",
        database="BookcollectionDB"
    )

@app.route('/ping')
def ping():
    return 'pong', 200

@app.route('/api/books', methods=['GET'])
def get_books():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT b.book_id, b.title, b.publication_year, b.isbn, b.status,
                   b.rating, b.cover_url,
                   a.name AS author, a.author_id,
                   g.name AS genre, g.genre_id
            FROM Books b
            JOIN Authors a ON b.author_id = a.author_id
            JOIN Genres g ON b.genre_id = g.genre_id
        """)
        books = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(books)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/books', methods=['POST'])
def add_book():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
            INSERT INTO Books (title, author_id, genre_id, publication_year, isbn, status, rating, cover_url)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            data['title'], data['author_id'], data['genre_id'],
            data['publication_year'], data['isbn'], data['status'],
            data['rating'], data['cover_url']
        )
        print("📥 Book Data:", data)
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Book added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
            UPDATE Books SET title=%s, author_id=%s, genre_id=%s, publication_year=%s,
                             isbn=%s, status=%s, rating=%s, cover_url=%s
            WHERE book_id=%s
        """
        values = (
            data['title'], data['author_id'], data['genre_id'],
            data['publication_year'], data['isbn'], data['status'],
            data['rating'], data['cover_url'], book_id
        )
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Book updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Books WHERE book_id = %s", (book_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Book deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/authors', methods=['GET'])
def get_authors():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Authors")
        authors = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(authors)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/genres', methods=['GET'])
def get_genres():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Genres")
        genres = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(genres)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
