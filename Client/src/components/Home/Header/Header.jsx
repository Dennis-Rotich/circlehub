import './header.css'
import blog_pic from '../Assets/blogpic.jpg';

export default function Header(){
    return(
        <div className="header">
            <div className="headerTitles">
                <span className="headerTitleSm">Exciting!</span>
                <span className="headerTitleLg">Circle Hub</span>
            </div>
            <img src={blog_pic} alt="" className='headerImage'/>
        </div>
    )
}