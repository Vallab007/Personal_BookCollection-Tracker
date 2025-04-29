-- Create the database
CREATE DATABASE IF NOT EXISTS BookcollectionDB;
USE BookcollectionDB;

-- Create Authors table
CREATE TABLE IF NOT EXISTS Authors (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Create Genres table
CREATE TABLE IF NOT EXISTS Genres (
    genre_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Create Books table with full structure
CREATE TABLE IF NOT EXISTS Books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_id INT,
    genre_id INT,
    publication_year INT NOT NULL,
    isbn VARCHAR(20),
    status ENUM('Read', 'Unread') DEFAULT 'Unread',
    rating INT CHECK (rating >= 1 AND rating <= 5),
    cover_url VARCHAR(255),

    FOREIGN KEY (author_id) REFERENCES Authors(author_id) ON DELETE SET NULL,
    FOREIGN KEY (genre_id) REFERENCES Genres(genre_id) ON DELETE SET NULL
);
-- Insert sample authors
INSERT INTO Authors (name) VALUES ('J.K. Rowling'), ('J.R.R. Tolkien'), ('George Orwell');

-- Insert sample genres
INSERT INTO Genres (name) VALUES ('Fantasy'), ('Science Fiction'), ('Mystery');
SELECT * FROM Authors;
SELECT * FROM Genres;
INSERT INTO Books (title, author_id, genre_id, publication_year, isbn, status, rating, cover_url)
VALUES ('Sample Book', 1, 1, 2020, '1234567890', 'Unread', 4, 'https://via.placeholder.com/150');
INSERT INTO Authors (name) VALUES ('Sample Author');
INSERT INTO Genres (name) VALUES ('Sample Genre');
-- Insert authors and genres first
INSERT INTO Authors (name) VALUES ('J.K. Rowling');
INSERT INTO Genres (name) VALUES ('Fantasy');

-- Now insert a book
INSERT INTO Books (title, author_id, genre_id, publication_year, isbn, status, rating, cover_url)
VALUES ('Harry Potter and the Sorcerer''s Stone', 1, 1, 1997, '9780747532743', 'Unread', 5, 'https://m.media-amazon.com/images/I/81iqZ2HHD-L.jpg');
SHOW DATABASES;
