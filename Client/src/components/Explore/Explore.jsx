import React, { useEffect, useState } from "react";
import axios from "axios";

function Explore() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5555/posts");
        setCategories(response.data.categories);
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleCategoryChange = async (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    try {
      const response = await axios.get(`http://localhost:5555/posts?category=${category}`);
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:5555/posts", {
        params: { category: selectedCategory, title: searchQuery }
      });
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  return (
    <div>
      <h1>Explore</h1>
      <form onSubmit={handleSearchSubmit}>
        <label htmlFor="category">Filter by Category:</label>
        <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title..."
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={`/posts/${post.id}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Explore;