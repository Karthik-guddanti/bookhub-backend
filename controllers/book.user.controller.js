import Book from '../models/book.model.js';

export const getAllBooks = async (req, res) => {
  try {
    const filter = {};

    if (req.query.author) {
      filter.author = { $regex: req.query.author, $options: 'i' };
    }
    if (req.query.title) {
      filter.title = { $regex: req.query.title, $options: 'i' };
    }
    if (req.query.description) {
      filter.description = { $regex: req.query.description, $options: 'i' };
    }
    const books = await Book.find(filter);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};