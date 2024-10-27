import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './styles/login.css';
import phonePNG from '../assets/img/phone.png';
import passwdPNG from '../assets/img/passwd.png';
import { login } from "../action/user";

const Login = () => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate  = useNavigate();
    
    const handleLogin = async () => {
      const loginSuccess = await dispatch(login(phone, password));
      if (loginSuccess) {
          navigate("/main");
      }
    };
 
    return (
      
        <div className="auth">
          
          <div className="form">
            <h1 className="h1-auth">Вход</h1>
            <div className="input__div"><img src={phonePNG} alt="Phone" className="phonePNG"/><input value={phone}  onChange={(event) => setPhone(event.target.value)} setValue={setPhone}  type="number" className="input" placeholder="8............"/></div>
            <div className="input__div"><img src={passwdPNG} alt="Phone" className="phonePNG"/><input value={password} onChange={(event) => setPassword(event.target.value)} setValue={setPassword} type="password" className="input" placeholder="******"/></div>
            
            <button className="buttonLogin" onClick={handleLogin}>Войти</button>
            
            <Link to="/registration" className="link__auth">Зарегистрироваться</Link>

          </div>
          
        </div>

    )
}

export default Login;