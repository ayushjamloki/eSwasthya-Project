import express from 'express';
const router = express.Router();
import Review from '../models/Review.js';

// Get all reviews for a doctor
router.get('/:doctorId', async (req, res) => {
  const reviews = await Review.find({ doctorId: req.params.doctorId }).sort({ createdAt: -1 });
  res.json(reviews);
});

// Post a review
router.post('/', async (req, res) => {
  const { doctorId, patientName, rating, comment } = req.body;
  const review = new Review({ doctorId, patientName, rating, comment });
  await review.save();
  res.json(review);
});

export default router;

