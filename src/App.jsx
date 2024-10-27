import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './components/styles/global.css';
import Home from "./components/Home";
import Registration from "./components/Registration";
import Login from "./components/Login";
import Main from "./components/Main";
import Parcels from "./components/Parcels";
import Notification from "./components/Notification";
import Profile from "./components/Profile";
import LostClient from "./components/LostClient";
import Dashboard from "./components/dashboard/Dashboard";
import { useDispatch } from "react-redux";
import { auth } from "./action/user";
import { useSelector } from 'react-redux';
import NotFound from "./components/NotFound";
import Referral from "./components/Referral";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(auth());
  }, [dispatch]);

  const isAuth = useSelector(state => state.user.isAuth);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={isAuth ? <Navigate to="/main" /> : <Login />} />
        <Route path="/registration" element={isAuth ? <Navigate to="/main" /> : <Registration />} />
        
        {isAuth && (
          <>
            <Route path="/main" element={<Main />} />
            <Route path="/parcels" element={<Parcels />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lost" element={<LostClient />} />
            <Route path="/referral" element={<Referral />} />
          </>
        )}
        
        {/* Обработка всех остальных маршрутов */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
