import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Post() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [upvotes, setUpvotes] = useState(0);
    const [downvotes, setDownvotes] = useState(0);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchPost = async () => {
        try {
          const response = await axios.get(`http://localhost:5555/posts/${id}`);
          setPost(response.data);
          setUpvotes(response.data.upvotes);
          setDownvotes(response.data.downvotes);
          setIsLoading(false);
        } catch (error) {
          setError("Error fetching post");
          setIsLoading(false);
        }
      };

      fetchPost();
    }, [id]);

    const vote = async (voteType) => {
      try {
        const response = await fetch(`/posts/${post.id}/post_action?vote=${voteType}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to update votes');
        }

        const data = await response.json();

        setUpvotes(data.upvotes);
        setDownvotes(data.downvotes);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    if (!post) {
      return <div>Post not found</div>;
    }

    return (
      <div>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
        <p>{post.image_url}</p>
        <p>Category: {post.category}</p>
        <p>Upvotes: {upvotes}</p>
        <p>Downvotes: {downvotes}</p>
        <button onClick={() => vote('upvote')}>Upvote</button>
        <button onClick={() => vote('downvote')}>Downvote</button>
      </div>
    );
  }

  export default Post;