import React from 'react';
import './BookCard.css';

const BookCard = ({ book, onEdit, onDelete }) => {
  return (
    <div className="book-card">
      {book.cover_url && <img src={book.cover_url} alt={book.title} />}
      <h3>{book.title}</h3>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Genre:</strong> {book.genre}</p>
      <p><strong>Year:</strong> {book.publication_year}</p>
      <p><strong>Status:</strong> {book.status}</p>
      <p><strong>Rating:</strong> {book.rating}/5</p>
      <div className="actions">
        <button onClick={onEdit}>✏️ Edit</button>
        <button onClick={onDelete}>🗑️ Delete</button>
      </div>
    </div>
  );
};

export default BookCard;
