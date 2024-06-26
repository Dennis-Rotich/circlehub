import './post.css'
import { useNavigate,Link } from 'react-router-dom'


export default function Post({post}){
    const navigate = useNavigate()
    return(
        <div className="post">
            <img src={`http://127.0.0.1:5000/static/images/${post.image}`} alt="" className="postImg" />
            <div className="postInfo">
                <div className="postCats">
                    <span className="postCat">{post.category}</span>
                    <span className="postTitle">
                       {(localStorage.getItem('username'))?<Link className='link' to={`/${post.id}`}>{post.title}</Link>:post.title}
                    </span>
                    <hr />
                    <span className="postDate">{post.username}</span>
                    <span className="postDate">{new Date(post.created).toDateString()}</span>
                </div>
            </div> 
            <p className="postDesc">
                {post.content}
            </p>
        </div>

    )
}