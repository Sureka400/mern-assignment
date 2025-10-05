import React, { useState, useEffect, useContext } from 'react';
import API from '../api/api';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function BookDetails(){
  const { id } = useParams();
  const [bookData, setBookData] = useState(null);
  const { user } = useContext(AuthContext);

  const fetch = async () => {
    try {
      const res = await API.get(/books/${id});
      setBookData(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(()=>{ fetch(); }, [id]);

  const submitReview = async (rating, text) => {
    try {
      await API.post('/reviews', { bookId: id, rating, reviewText: text });
      fetch();
    } catch (err) { console.error(err); alert(err.response?.data?.message || 'Error'); }
  };

  if (!bookData) return <div>Loading...</div>;
  const { book, reviews, avgRating } = bookData;

  return (
    <div>
      <h2>{book.title}</h2>
      <p>Author: {book.author}</p>
      <p>{book.description}</p>
      <p>Average Rating: {avgRating} ({reviews.length} reviews)</p>

      <div>
        <h3>Reviews</h3>
        {reviews.map(r => (
          <div key={r._id}>
            <strong>{r.userId?.name || 'Unknown'}</strong> — {r.rating} ⭐
            <p>{r.reviewText}</p>
          </div>
        ))}
      </div>

      {user ? (
        <div>
          <h4>Add / Edit your review</h4>
          <ReviewForm onSubmit={submitReview} />
        </div>
      ) : <p><a href="/login">Login</a> to write a review.</p>}
    </div>
  )
}