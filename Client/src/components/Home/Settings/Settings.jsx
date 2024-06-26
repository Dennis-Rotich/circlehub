import './settings.css'
import Sidebar from '../Sidebar/Sidebar'
import Cliff from '../Assets/profile.jpg'
import { useState,useEffect } from 'react';
import axios from 'axios'

export default function Settings({setUsername}){
    const [user, setUser] = useState({'username':'',"first_name":"","last_name":""});
    const [userName,setUserName] = useState(null)
    const [firstName,setFirstName] = useState(null)
    const [lastName,setLastName] = useState(null)
    const [password,setPassword] = useState(null)
    
    useEffect(()=>{
      setUsername(user.username)
    },[user])

    useEffect(() => {
      // Fetch user data when the component mounts
      fetchUserData();
    }, []);
  
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access_token')
        const id = localStorage.getItem("user_id")
        const response = await fetch(`http://127.0.0.1:5555/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await response.json();
        setUser(userData);
        setUserName(userData.username)
        setFirstName(userData.first_name)
        setLastName(userData.last_name)
        setPassword(userData.password)
        localStorage.setItem('last_name',userData.last_name)
        localStorage.setItem('first_name',userData.first_name)
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const handleUpdate = async()=>{
      console.log(lastName);
      const id = localStorage.getItem("user_id")
      const token = localStorage.getItem("access_token")
      try{
        await axios.patch(`http://127.0.0.1:5555/users/${id}`,{
          headers: {
            'Authorization':  `Bearer ${token}`
          },
          body: JSON.stringify({"username":userName,"first_name":firstName,"last_name":lastName,"password":password})
        })
        //window.location.reload()
      }catch(err){
        console.error(err);
      }
    }

    return(
        <div className="settings">
            <div className="settingsWrapper">
                <div className="settingsTitle">
                    <span className="settingsUpdateTitle">Update Your Account</span>
                    <span className="settingsDeleteTitle">Delete Account</span>
                </div>
                <form className="settingsForm">
                    <label >Profile Picture</label>
                    <div className="settingsPP">
                        <img src={Cliff} alt="" />
                        <label htmlFor="fileInput">
                            <i className="settingsPPIcon fa-regular fa-circle-user"></i>
                        </label>
                        <input type="file" id='fileInput' style={{display:'none'}}/>
                    </div>
                    <label>Username</label>
                    <input type="text" placeholder={localStorage.getItem('username')} onChange={(e)=>{setUserName(e.target.value)}}/>
                    <label>First name</label>
                    <input type="text" placeholder={localStorage.getItem('first_name')} onChange={(e)=>{setFirstName(e.target.value)}}/>
                    <label>Last name</label>
                    <input type="text" placeholder={localStorage.getItem('last_name')} onChange={(e)=>{setLastName(e.target.value)}}/>
                    <label>Password</label>
                    <input type="password" onChange={(e)=>{setPassword(e.target.value)}}/>
                    <button className="settingsSubmit" onClick={()=>{handleUpdate()}}>Update</button>
                </form>
            </div>
            <Sidebar/>
        </div>
    )
}