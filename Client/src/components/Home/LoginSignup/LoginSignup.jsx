import React, { useState,useEffect, useRef } from "react";
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import './LoginSignup.css'
import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'

function LoginSignup({setUser}){
    // const userRef = useRef()
    // const passwordRef = useRef()
    const navigate = useNavigate() 
    const[action,setAction] = useState("Login")
    const[endpoint,setEndpoint] = useState("signup")
    const[userName,setUserName] = useState("")
    const[firstName,setFirstName] = useState("")
    const[lastName,setLastName] = useState("")
    const[password,setPassword] = useState("")
    const handleSubmit = async () => {
        if (action === 'Login'){
            try {
                const response = await axios.post(`/login`, {"username":userName,"password":password});
                localStorage.removeItem('access_token');
                localStorage.removeItem('user_id');
                localStorage.removeItem('username');
                localStorage.setItem('access_token',response['data']['access_token']);
                localStorage.setItem('user_id',response['data']['id']);
                localStorage.setItem('username',response['data']['username']);
                localStorage.setItem('first_name',response['data']['first_name']);
                localStorage.setItem('last_name',response['data']['last_name']);
                console.log('Logged in successfully');
                setUser(true)
                navigate('/')
            } catch (error) { console.log(error);
                alert('Unregistered user')
                setAction('Sign Up')
            }
        }
        if (action === 'Sign Up'){
            try {
                const response = await axios.post(`/user`, {"username":userName,"first_name":firstName,"last_name":lastName,"password":password}); 
                localStorage.removeItem('access_token');
                localStorage.removeItem('user_id');
                localStorage.removeItem('username')
                localStorage.setItem('access_token',response['data']['access_token']);
                localStorage.setItem('user_id',response['data']['id']);
                localStorage.setItem('username',response['data']['username'])
                localStorage.setItem('first_name',response['data']['first_name']);
                localStorage.setItem('last_name',response['data']['last_name']);
                console.log('Logged in successfully');
                setUser(true)
                alert('User created, you can now log in');
                navigate('/')
            } catch (error) { console. log(error); }
        }
        setFirstName('')
        setLastName('')
        setPassword('')
        setUserName('')
    }

    return(
        <div className="container_head">
        <div className="container">
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                {action === 'Login'?<div></div>:<div className="input">
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder="First Name" value={firstName} onChange={(e)=>{setFirstName(e.target.value)}}/>
                </div>}
                {action === 'Login'?<div></div>:<div className="input">
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder="Last Name" value={lastName} onChange={(e)=>{setLastName(e.target.value)}}/>
                </div>}
                <div className="input">
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder="Username" value={userName} onChange={(e)=>{setUserName(e.target.value)}}/>
                </div>
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder="Password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
                </div>
            </div>
            <div className="submit_container_1">
                <div className="submit" onClick={handleSubmit}>Submit</div>
            </div>
            <div className="submit_container">
                <div className={action==='Login'?'submit gray':'submit'} onClick={()=>{setAction('Sign Up');setEndpoint('signup')}}>Sign Up</div>
                <div className={action==='Sign Up'?'submit gray':'submit'} onClick={()=>{setAction('Login');setEndpoint('login')}}>Login</div>
            </div>
        </div>
        </div>
    )
}

export default LoginSignup