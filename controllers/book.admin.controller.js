import Book from '../models/book.model.js';

export const addBook = async (req, res) => {
  try {
    const { title, author, description, imageUrl } = req.body;
    const adminUserId = req.user._id;

    const book = new Book({
      title,
      author,
      description,
      imageUrl,
      addedBy: adminUserId,
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ addedBy: req.user._id });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { title, author, description, imageUrl } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to update this book' });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.imageUrl = imageUrl || book.imageUrl;

    const updatedBook = await book.save();
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to delete this book' });
    }

    await book.deleteOne();
    res.status(200).json({ message: 'Book removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};