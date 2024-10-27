import React from "react";
import { Link } from 'react-router-dom';
import './styles/home.css';
import { useSelector } from "react-redux";
import logo from '../assets/img/logo2.jpg'
import config from "../config";





const Home = () => {
    const isAuth = useSelector(state => state.user.isAuth)

    return (

                <div className="wrapper">
                    <img src={logo} className="logo" alt="" />
                    <h1 className="h1" >{config.nameCargo}</h1>
                    <div className="buttons">
                    {!isAuth &&
                        <Link to="/login">
                            <div className="auth__button button">Войти</div>
                        </Link>
                    }
                    {!isAuth &&
                        <Link to="/registration">
                            <div className="reg__button button">Регистрация</div>
                        </Link>
                    }
                    {isAuth &&
                        <Link to="/main">
                            <div className="reg__button button">Главная</div>
                        </Link>
                    }

                    </div>
                </div>

    )
}

export default Home;