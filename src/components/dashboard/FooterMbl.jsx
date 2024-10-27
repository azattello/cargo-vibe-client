import React, { useState } from "react";
import './css/Sidebar.css';
import './css/sidebarmobile.css';
// import apps from '../../assets/img/apps.png';
import track from '../../assets/img/track2.png';
import list from '../../assets/img/list.png';
import users from '../../assets/img/users.png';
import truck from '../../assets/img/truck.png';
import message from '../../assets/img/message.png';
import lost from '../../assets/img/lost.png'

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";



const FooterMbl = ({ onNavItemClick }) => {
    const [selectedNavItem, setSelectedNavItem] = useState(sessionStorage.getItem('selectedNavItem') || "addTrack");
    const [mobileMenu, setMobileMenu] = useState(false);
    
    const role = localStorage.getItem('role')
    const name = useSelector(state => state.user.currentUser.name);
   
    const phone = useSelector(state => state.user.currentUser.phone);




    const toggleSidebar = () => setMobileMenu(!mobileMenu);

    const handleNavItemClick = (navItem) => {
        setSelectedNavItem(navItem);
        onNavItemClick(navItem);
        setMobileMenu(!mobileMenu)
      };
      



    return (
      
       <div className="mainSidebar_mobile">

        {/* {mobileMenu && ( */}
        <div id="sidebar" className={`sidebar-mobile ${mobileMenu ? 'open' : ''}`}>
           
            
            <div className="navigation-admin">
        
    
            <div className={`nav-link ${selectedNavItem === "addTrack" && "nav-active"}`} onClick={() => handleNavItemClick("addTrack")}>
                <img src={track} alt="" className="nav-icon" />
                <h5 className="nav-title">Добавить трек</h5>
                <div></div>
            </div>
            <div className={`nav-link ${selectedNavItem === "allUsers" && "nav-active"}`} onClick={() => handleNavItemClick("allUsers")}>
                <img src={users} alt="" className="nav-icon" />
                <h5 className="nav-title">Все пользователи</h5>
                <div></div>
            </div>
            
            <div className={`nav-link ${selectedNavItem === "trackList" && "nav-active"}`} onClick={() => handleNavItemClick("trackList")}>
                <img src={list} alt="" className="nav-icon" />
                <h5 className="nav-title">Список треков</h5>
                <div></div>
            </div>

            <div className={`nav-link ${selectedNavItem === "Lost" && "nav-active"}`} onClick={() => handleNavItemClick("Lost")}>
                <img src={lost} alt="" className="nav-icon" />
                <h5 className="nav-title">Потеряшки</h5>
                <div></div>
            </div>
    
            
            {role !== 'filial' && 
            <div className={`nav-link ${selectedNavItem === "myCargo" && "nav-active"}`} onClick={() => handleNavItemClick("myCargo")}>
                <img src={truck} alt="" className="nav-icon" />
                <h5 className="nav-title">Мой карго</h5>
                <div></div>
            </div>
            }
            {role !== 'filial' && 
            <div className={`nav-link ${selectedNavItem === "mailing" && "nav-active"}`} onClick={() => handleNavItemClick("mailing")}>
                <img src={message} alt="" className="nav-icon" />
                <h5 className="nav-title">Партнерская программа</h5>
                <div></div>
            </div>
            }
          </div>    
      </div>

        {/* )} */}
      <div className="footer-admin">
            <p>{name  + '  ' + phone}</p>
            <Link to="/main" className="linkToSite">Ваш сайт</Link>
            <div className="linkToSite" onClick={toggleSidebar}>меню</div>
          </div>

      </div>

    )
}

export default FooterMbl;