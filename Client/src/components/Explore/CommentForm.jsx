import React, { useState } from 'react';
import axios from 'axios';

function CommentForm({ postId }) {
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(''); 

  const handleSubmit = async (e) => {
    try {
      const response = await axios.post(`http://localhost:5555/posts/${postId}/comments`, {
        user_id: userId,
        message,
        created_at: new Date().toISOString(), 
      });
      console.log(response.data);
      
      setMessage('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Add a comment"></textarea>
      <button type="submit">Add Comment</button>
    </form>
  );
}

export default CommentForm;