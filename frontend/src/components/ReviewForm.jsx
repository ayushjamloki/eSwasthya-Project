// frontend/src/components/ReviewForm.js
import React, { useState } from 'react';

const ReviewForm = ({ doctorId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        doctorId,
        rating,
        comment,
        // optionally include patient info here
      }),
    });

    if (response.ok) {
      setSubmitted(true);
    } else {
      alert('Something went wrong!');
    }
  };

  return submitted ? (
    <p>✅ Thank you for your feedback!</p>
  ) : (
    <form onSubmit={handleSubmit}>
      <h3>Leave a Review</h3>
      <label>
        Rating:
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          {[5, 4, 3, 2, 1].map((num) => (
            <option key={num} value={num}>{num} Star{num > 1 && 's'}</option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Comment:
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      </label>
      <br />
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
