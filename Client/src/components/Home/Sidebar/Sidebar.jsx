import './sidebar.css'
import mountain_view from '../Assets/Mountain_view.jpg';

export default function Sidebar({setCategory}){
    return(
        <div className='sidebar'>
            <div className="sidebarItem">
                <span className="sidebarTitle">ABOUT ME</span>
                <img src={mountain_view} alt="" className='sidebarImg' />
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus doloribus nobis maiores pariatur, itaque deleniti libero dolor corrupti, eligendi odio non voluptates fugiat.</p>
            </div>
            <div className="sidebarItem">
                <span className="sidebarTitle">CATEGORIES</span>
                <ul className="sidebarList">
                    <li className="sidebarListItem" onClick={()=>{setCategory('Politics')}}>Politics</li>
                    <li className="sidebarListItem" onClick={()=>{setCategory('Business')}}>Business</li>
                    <li className="sidebarListItem" onClick={()=>{setCategory('Sports')}}>Sports</li>
                    <li className="sidebarListItem" onClick={()=>{setCategory('Fashion')}}>Fashion</li>
                    <li className="sidebarListItem" onClick={()=>{setCategory('Technology')}}>Technology</li>
                </ul>
            </div>
            <div className="sidebarSocial">
                <span className="sidebarTitle">FOLLOW US</span>
                <i className="sidebarIcon fa-brands fa-square-facebook"></i>
                <i className="sidebarIcon fa-brands fa-twitter"></i>
                <i className="sidebarIcon fa-brands fa-square-pinterest"></i>
                <i className="sidebarIcon fa-brands fa-square-instagram"></i>
            </div>
        </div>
    )
}