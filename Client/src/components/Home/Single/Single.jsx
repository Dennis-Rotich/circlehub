import './single.css'
import Sidebar from '../Sidebar/Sidebar'
import SinglePost from '../SinglePost/SinglePost'
import {useState,useEffect} from 'react'

export default function Single({username}){
    return(
        <div className="single">
            <Sidebar/>
            <SinglePost username={username}/>
        </div>
    )
}