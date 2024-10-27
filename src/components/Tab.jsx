import React from "react";
import { Link, useLocation  } from 'react-router-dom';
import './styles/tab.css';
import house from '../assets/icons/home-outline.svg';
import house2 from '../assets/icons/home.svg';

import box from '../assets/icons/layers-outline.svg';
import box2 from '../assets/icons/layers.svg';

import user from '../assets/icons/person-circle-outline.svg';
import user2 from '../assets/icons/person-circle.svg';



const Tab = () => {
    const location = useLocation();


    return (
      
        <div className="Tab">
            <Link to="/main" className="tabbutton">
                <img className="icons-svg" src={location.pathname === '/main' ? house2 : house} alt="" />
                <p style={location.pathname === '/main' ? { color: '#01DA01' } : { color: '#808080' } }>Главная</p>
            </Link>
            
            <Link to="/parcels" className="tabbutton" >
                <img className="icons-svg" src={location.pathname === '/parcels' ? box2 : box}  alt="" />
                <p style={location.pathname === '/parcels' ? { color: '#01DA01' } : { color: '#808080' } }>Посылки</p>
            </Link>

            {/* <Link to="/notification" className="tabbutton" >
                <img src={location.pathname === '/notification' ? bell2 : bell} alt="" />
                <p>Уведомление</p>
            </Link> */}

            <Link to="/profile" className="tabbutton" >
                <img className="icons-svg" src={location.pathname === '/profile' ? user2 : user}  alt="" />
                <p style={location.pathname === '/profile' ? { color: '#01DA01' } : { color: '#808080' } }>Профиль</p>
            </Link>
            
        </div>

    )
}

export default Tab;