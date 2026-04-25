import express from 'express';
import { getAllBooks, getBookById } from '../controllers/book.user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getAllBooks);
router.get('/:id', protect, getBookById);

export default router;