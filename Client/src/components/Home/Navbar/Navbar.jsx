import './navbar.css'
import profile_pic from '../Assets/profile.jpg'
import { Link } from 'react-router-dom'

export default function Navbar({user, setUser, setSearchTerm, setSearch}){
    if(localStorage.getItem("user_id")){
        setUser(true);
      }
    return(
        <div className="top">
            <div className="topleft">
                <i className="topIcon fa-brands fa-square-facebook"></i>
                <i className="topIcon fa-brands fa-twitter"></i>
                <i className="topIcon fa-brands fa-square-pinterest"></i>
                <i className="topIcon fa-brands fa-square-instagram"></i>
            </div>
            <div className="topcenter">
                <ul className="topList">
                    <li className='topListItem'>
                        <Link to="/" className='link'>HOME</Link>
                    </li>
                    <li className='topListItem'>
                        <Link to="/newpost" className='link'>WRITE</Link>
                    </li>
                    <li className='topListItem' onClick={()=>{localStorage.removeItem('user_id');localStorage.removeItem('access_token');localStorage.removeItem('first_name');localStorage.removeItem('last_name');localStorage.removeItem('username');setUser(false);window.location.replace('/')}}>
                        {user && "LOGOUT"}
                    </li>
                </ul>
            </div>
            <div className="topright">
                {
                    user?<Link to='/account'><img src={profile_pic} alt="" className='topImg'/></Link>:
                    <Link to='/signup' className='link'>LOGIN</Link>
                }
                
                {/* <i className="topSearchIcon fa-solid fa-magnifying-glass" onClick={()=>{setSearch(true);console.log('Searching...');}}></i>
                <input type='text' placeholder='search' className='topRightSearch' onChange={(e)=>{setSearchTerm(e.target.value);console.log(e.target.value);}}/> */}
            </div>
        </div>
    )
}