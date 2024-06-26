import './posts.css'
import axios from 'axios'
import {useState} from 'react'
import Post from '../Post/Post'
import { useEffect } from 'react'

export default function Posts({category, search, searchTerm}){
    const [posts, setPosts] = useState([]);

    const handleCategoryChange = async (category) => {
      // const category = e.target.value;
      // setSelectedCategory(category);
      try {
        const response = await axios.get(`http://localhost:5555/posts?category=${category}`);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const handleSearchSubmit = async () => {
      try {
        const response = await axios.get("http://localhost:5555/posts", {
          params: { category: category, title: searchTerm }
        });
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    useEffect(()=>{
      if(searchTerm !== ''){
        handleSearchSubmit(searchTerm)
      }
    },[search])

    useEffect(()=>{
      if(category !== 'all'){
        handleCategoryChange(category)
        console.log(searchTerm);
      }
    },[category])

    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const response = await axios.get("http://localhost:5555/posts");
          setPosts(response.data);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };
  
      fetchPosts();
    }, []);
    return(
        <div className='posts'>
            {posts.map((post)=>{
                return <Post post={post} key={post.id} />
            })}
        </div>
    )
}