import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import BookCard from './BookCard';
import AddBookModal from './AddBookModal';
import EditBookModal from './EditBookModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [books, setBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/books');
      console.log("Books:", res.data);  // Add this line
      setBooks(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Error fetching books:", err);  // Add this line
      toast.error('Failed to load books');
    }
  };

  const addBook = async (bookData) => {
    console.log("📤 Sending book data to backend:", bookData); // Debug log
  
    try {
      const res = await axios.post('http://localhost:5000/api/books', bookData);
      toast.success('✅ Book added!');
      fetchBooks();
    } catch (err) {
      console.error("❌ Error adding book:", err?.response?.data || err.message); // Show backend error
      toast.error('❌ Failed to add book: ' + (err?.response?.data?.error || 'Unknown error'));
    }
  };
  

  const updateBook = async (bookId, bookData) => {
    try {
      await axios.put(`http://localhost:5000/api/books/${bookId}`, bookData);
      toast.success('Book updated!');
      fetchBooks();
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const deleteBook = async (bookId) => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${bookId}`);
      toast.success('Book deleted!');
      fetchBooks();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    setFiltered(books.filter(b => b.title.toLowerCase().includes(text.toLowerCase())));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="App">
      <ToastContainer position="top-right" />
      <header>
        <h1>📚 My Book Collection</h1>
        <div>
          <input
            type="text"
            placeholder="🔍 Search by title..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
          />
          <button onClick={() => setShowAddModal(true)}>+ Add Book</button>
        </div>
      </header>

      <div className="book-grid">
        {filtered.map(book => (
          <BookCard
            key={book.book_id}
            book={book}
            onEdit={() => {
              setSelectedBook(book);
              setShowEditModal(true);
            }}
            onDelete={() => deleteBook(book.book_id)}
          />
        ))}
      </div>

      {showAddModal && (
        <AddBookModal
          onClose={() => setShowAddModal(false)}
          onAdd={addBook}
        />
      )}

      {showEditModal && selectedBook && (
        <EditBookModal
          book={selectedBook}
          onClose={() => {
            setShowEditModal(false);
            setSelectedBook(null);
          }}
          onUpdate={(data) => updateBook(selectedBook.book_id, data)}
        />
      )}
    </div>
  );
}

export default App;
