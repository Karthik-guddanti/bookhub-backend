import express from 'express';
import {
  addBook,
  getMyBooks,
  updateBook,
  deleteBook,
} from '../controllers/book.admin.controller.js';
import { protect, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', protect, isAdmin, addBook);
router.get('/', protect, isAdmin, getMyBooks);
router.put('/:id', protect, isAdmin, updateBook);
router.delete('/:id', protect, isAdmin, deleteBook);

export default router;