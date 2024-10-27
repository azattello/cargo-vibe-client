import React, { useState } from "react";
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Sidebar from "./Sidebar";
// import MainAdmin from "./MainAdmin";
import AddTrack from "./AddTrack";
import TrackList from "./TrackList";
import AllUsers from "./AllUsers";
import Statistics from "./Statistics";
import MyCargo from "./MyCargo";
// import Mailing from "./Mailing";
import Lost from "./Lost";
import PartnerProgramAdmin from "./PartnerProgramAdmin";
import FooterMbl from "./FooterMbl";

const Dashboard = () => {
  const [selectedNavItem, setSelectedNavItem] = useState(sessionStorage.getItem('selectedNavItem') || "addTrack");

  const handleNavItemClick = (navItem) => {
    setSelectedNavItem(navItem);
    sessionStorage.setItem('selectedNavItem', navItem);
  };

  
  
    const role = useSelector(state => state.user.currentUser.role);
    console.log(role)

    // Если пользователь не является администратором, перенаправляем его на страницу /main
    if (role !== 'admin' && role !== 'filial') {

      return <Navigate to="/main" />;

    }

    localStorage.setItem("role", role)

    return (
      <>
      <div className="footer__menu">
        <FooterMbl onNavItemClick={handleNavItemClick} />
        </div>  
        <div className="dashboard">
          <Sidebar onNavItemClick={handleNavItemClick} />
          {/* {selectedNavItem === "mainAdmin" && <MainAdmin />} */}
          {selectedNavItem === "addTrack" && <AddTrack />}
          {selectedNavItem === "trackList" && <TrackList />}
          {selectedNavItem === "Lost" && <Lost />}
          {selectedNavItem === "allUsers" && <AllUsers />}
          {selectedNavItem === "statistics" && <Statistics />}
          {selectedNavItem === "myCargo" && <MyCargo />}
          {selectedNavItem === "mailing" && <PartnerProgramAdmin />}
        </div>
        
      </>

    )
}

export default Dashboard;