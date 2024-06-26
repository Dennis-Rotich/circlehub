import './write.css'
import Forest from '../Assets/Forest.jpg'
import { useState,useEffect } from 'react'
import axios from 'axios'

export default function Write(){
    const [title,setTitle] = useState('')
    const [content,setContent] = useState('')
    const [category,setCategory] = useState('')
    const [postId,setPostId] = useState(null)
    const id = localStorage.getItem('user_id')
    const [file,setFile] = useState(null)
    const [image,setImage] = useState('')
    
    const handleFormSubmit = async(e) => {
        e.preventDefault()
        setTitle('')
        setContent('')
        console.log(category);
        if(file){
            console.log(file);
            const Data =new FormData();
            Data.append("file",file)
            try{
                const response = await axios.post('/image',Data)
            }catch(err){
                console.error(err);
            }
            try {
                const response = await axios.post(`/post`, {"title": title, "content":content, 'user_id':id,"category":category,"image":file.name})
                setPostId(response.data.id)
            } catch (error) { console. log(error); }
        }
        window.location.replace('/')
    }



    // const handleSubmit = async () => { try { const response = await axios. post("/posts", { "title": {title}, "content":  {content}, 'user_id':{id}}); console. log(response); } catch (error) { console. log(error); } };
    

    return(
        <div className="write">
            {file && 
            <img src={URL.createObjectURL(file)} alt="" className="writeImg" />
            }
            <form className="writeForm" onSubmit={(e)=>{handleFormSubmit(e)}}>
                <div className="writeFormGroup">
                    <label htmlFor="fileInput">
                        <i className="writeIcon fa-solid fa-plus"></i>
                    </label>
                    <input type="file" id='fileInput' style={{display:"none"}} onChange={e=>setFile(e.target.files[0])}/>
                    <input type="text" placeholder='Title' className='writeInput' autoFocus={true} value={title} onChange={(e)=>{setTitle(e.target.value)}}/>
                </div>
                <div className="writeFormGroup">
                    <textarea placeholder='Tell your story...' type='text' className='writeInput writeText' value={content} onChange={(e)=>{setContent(e.target.value)}}></textarea>
                    <div className="radioGroup">
                        <label className='radio'>
                            <input type="radio" value="Politics" name='category' onClick={()=>{setCategory('Politics')}}/>
                            Politics
                            <span></span>
                        </label>
                        <label className='radio'>
                            <input type="radio" value="Sports" name='category' onClick={()=>{setCategory('Sports')}}/>
                            Sports
                            <span></span>
                        </label>
                        <label className='radio'>
                            <input type="radio" value="Technology" name='category' onClick={()=>{setCategory('Technology')}}/>
                            Technology
                            <span></span>
                        </label>
                        <label className='radio'>
                            <input type="radio" value="Business" name='category' onClick={()=>{setCategory('Business')}}/>
                            Business
                            <span></span>
                        </label>
                        <label className='radio'>
                            <input type="radio" value="Fashion" name='category' onClick={()=>{setCategory('Fashion')}}/>
                            Fashion
                            <span></span>
                        </label>
                    </div>
                    <button className='writeSubmit' type='submit'>Publish</button>
                </div>
            </form>
        </div>
    )
}