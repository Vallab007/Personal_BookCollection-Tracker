import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddBookModal.css'; // Reuse same styles

function EditBookModal({ book, onClose, onUpdate }) {
  const [form, setForm] = useState({ ...book });

  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [authorRes, genreRes] = await Promise.all([
          axios.get('http://localhost:5000/api/authors'),
          axios.get('http://localhost:5000/api/genres')
        ]);
        setAuthors(authorRes.data);
        setGenres(genreRes.data);
      } catch (err) {
        console.error('Failed to load dropdowns:', err);
      }
    };
    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.author_id || !form.genre_id) {
      alert('Please fill all required fields.');
      return;
    }

    onUpdate(form); // call App.js updateBook()
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Edit Book</h2>
        <form onSubmit={handleSubmit}>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />

          <select name="author_id" value={form.author_id} onChange={handleChange} required>
            <option value="">Select Author</option>
            {authors.map(author => (
              <option key={author.author_id} value={author.author_id}>{author.name}</option>
            ))}
          </select>

          <select name="genre_id" value={form.genre_id} onChange={handleChange} required>
            <option value="">Select Genre</option>
            {genres.map(genre => (
              <option key={genre.genre_id} value={genre.genre_id}>{genre.name}</option>
            ))}
          </select>

          <input name="publication_year" placeholder="Year" value={form.publication_year} onChange={handleChange} />
          <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} />
          <select name="status" value={form.status} onChange={handleChange}>
            <option>Unread</option>
            <option>Read</option>
          </select>
          <input name="rating" placeholder="Rating (1–5)" value={form.rating} onChange={handleChange} />
          <input name="cover_url" placeholder="Cover Image URL" value={form.cover_url} onChange={handleChange} />

          <button type="submit">Update</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default EditBookModal;
