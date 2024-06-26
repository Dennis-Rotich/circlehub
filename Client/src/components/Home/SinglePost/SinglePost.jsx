import './singlePost.css'
import './comments.css'
import Pfp from '../Assets/profile.jpg'
import axios from 'axios'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'

export default function SinglePost({}){
    const { id } = useParams();
    const [updateMode,setUpdateMode] = useState(false)
    const navigate = useNavigate()
    const [postId, setPostId] = useState(null)
    const [title,setTitle] = useState('')
    const [message, setMessage] = useState('');
    const [desc,setDesc] = useState('')
    const [post, setPost] = useState(null);
    const [upvotes, setUpvotes] = useState(0);
    const [downvotes, setDownvotes] = useState(0);
    const [error, setError] = useState(null);
    const [username,setUsername] = useState('')
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
      setUsername(localStorage.getItem('username'))
    },[])

    useEffect(() => {
      const fetchPost = async () => {
        try {
          const response = await axios.get(`http://localhost:5555/posts/${id}`);
          setPost(response.data);
          setPostId(response.data.id)
          setTitle(response.data.title)
          setDesc(response.data.content)
          setUpvotes(response.data.upvotes);
          setDownvotes(response.data.downvotes);
          setIsLoading(false);
          console.log(response.data)
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
    
    const handeDelete = async()=>{
        try{
            await axios.delete(`http://127.0.0.1:5555/posts/${post.id}`)
            navigate('/')
        }catch(err){
            console.error(err);
        }
    }

    const handleUpdate = async()=>{
        try{
            await axios.patch(`http://127.0.0.1:5555/posts/${post.id}`,{"title":title,"content":desc})
            setUpdateMode(false)
        }catch(err){
            console.error(err);
        }
    }

    const voting = async (voteType) => {
      if(voteType === 'upvote'){
        setUpvotes(upvotes+1)
      }
      if(voteType === 'downvote'){
        setDownvotes(downvotes+1)
      }

      try {
        const response = await fetch(`/posts/${post.id}/post_action?vote=${voteType}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }})}catch(err){console.error(err);}}
    
    const handleSubmit = async (e) => {
      e.preventDefault();
            const userId = localStorage.getItem('user_id')      
            try {
              const response = await axios.post(`http://localhost:5555/posts/${postId}/comments`, {
                user_id: userId,
                message,
                created_at: new Date().toISOString(), 
              });
              console.log(response.data);
              setMessage('');
              window.location.reload('/')
            } catch (error) {
              console.error('Error creating comment:', error);
            }
          };      

    return(
        <div className="singlePost">
            <div className="singlePostWrapper">
                <img src={`http://127.0.0.1:5555/static/images/${post.image}`} alt="" className="singlePostImg" />
                {updateMode?<input type='text' value={title} className='singlePostTitleInput' autoFocus onChange={(e)=>{setTitle(e.target.value)}}/>:(
                    <h1 className="singlePostTitle">
                    {title}
                    {post.username !== username && (
                        <div className="singlePostVote">
                            <i className="singlePostIcon fa-regular fa-thumbs-up" onClick={()=>{voting('upvote')}}>{upvotes}</i>
                            <i className="singlePostIcon fa-regular fa-thumbs-down" onClick={()=>{voting('downvote')}}>{downvotes}</i>
                        </div>
                    )}
                    {post.username === username && (
                        <>
                        <div className="singlePostVote">
                          <i className="singlePostIcon fa-regular fa-thumbs-up">{upvotes}</i>
                          <i className="singlePostIcon fa-regular fa-thumbs-down">{downvotes}</i>
                        </div>
                        <div className="singlePostEdit">
                            <i className="singlePostIcon fa-solid fa-pen-to-square" onClick={()=>{setUpdateMode(true)}}></i>
                            <i className="singlePostIcon fa-solid fa-trash" onClick={handeDelete}></i>
                        </div>
                        </>
                    )}
                    </h1>
                )}
                <div className="singlePostInfo">
                    <span className="singlePostAuthor">Author: <b>{post.username}</b></span>
                    <span className="singlePostDate">{new Date(post.created).toDateString()}</span>
                </div>
                {updateMode?<textarea className='singlePostDescInput' value={desc} onChange={(e)=>{setDesc(e.target.value)}}/>:(<p className='singlePostDesc'>{desc}</p>)}
                {updateMode && (<button className="singlePostBtn" onClick={handleUpdate}>Update</button>)}
            </div>
                <div className="commentWrapper">
                <div className="comment-session">
                      <div className="post-comment">
                          {post.comments.map((comment)=>{
                          return(<div className="comment-list">
                          <div className="flex">
                            <div className="user">
                              <div className="user-image"><img src={Pfp} alt="" /></div>
                              <div className="user-meta">
                                <div className="name">{comment.username}</div>
                                <div className="day">{comment.created}</div>
                              </div>
                            </div>
                          </div>
                          <div className="comment">{comment.message}</div>
                        </div>)
                        })}
                          {post.username !== username && (<form className='commentBox' onSubmit={handleSubmit}>
                          <div className="user">
                            <div className="image"><img src={Pfp} alt="" /></div>
                            <div className="name">{localStorage.getItem('username')}</div>
                          </div>
                          <textarea name="comment" onChange={(e) => setMessage(e.target.value)}></textarea>
                          <button className="commentSubmit" type='submit'>Comment</button>
                        </form>)}
                      </div>
                    </div>
                </div>   
        </div>
    )
}