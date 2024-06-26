import './home.css'
import Header from "../Header/Header"
import Posts from '../Posts/Posts';
import Sidebar from '../Sidebar/Sidebar';
import { useState } from 'react';

export default function Home({user, search, searchTerm}){
    const [category,setCategory] = useState('all')
    return(
        <>
            <Header/>
            <div className="home">
                <Posts user={user} category={category} search={search} searchTerm={searchTerm}/>
                <Sidebar setCategory={setCategory}/>
            </div>
        </>
    )
}