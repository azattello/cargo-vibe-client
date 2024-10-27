import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles/main.css';
import { getSettings, getContacts } from '../action/settings';
import { getFilials } from '../action/filial';
// import filials from '../assets/icons/filials.svg';
import filial from '../assets/icons/filials.svg'
import guide from '../assets/icons/help-circle-outline.svg';
import geo from '../assets/icons/map-outline.svg';
// import handshake from '../assets/icons/people-circle-outline.svg';
import whatsapp from '../assets/icons/whatsapp.svg'
import news from '../assets/icons/news.svg';
import news2 from '../assets/icons/community.svg'
// import news2 from '../assets/icons/marketing.png';
import logo from '../assets/img/logo2.jpg';

import Tab from './Tab';
import config from '../config';

import './styles/tab.css';
import house from '../assets/icons/home-outline.svg';
import house2 from '../assets/icons/home.svg';

import box from '../assets/icons/layers-outline.svg';
import box2 from '../assets/icons/layers.svg';

import user from '../assets/icons/person-circle-outline.svg';
import user2 from '../assets/icons/person-circle.svg';

import phoneIcon from '../assets/icons/call-outline.svg';
import whatsappIcon from '../assets/icons/logo-whatsapp.svg';
import instagramIcon from '../assets/icons/logo-instagram.svg';
import telegramIcon from '../assets/icons/telegram.png';

import axios from 'axios';


const Main = () => {
    const location = useLocation();
    const [settings, setSettings] = useState([]);
    const [showAdress, setShowAdress] = useState(false); // Для управления видимостью всплывающего окна
    const [showFilials, setShowFilials] = useState(false); // Для управления видимостью всплывающего окна
    const [userData, setUserData] = useState(null);

    const [banners, setBanners] = useState([null, null, null]); // Массив для хранения баннеров

    const [filials, setFilials] = useState([]); // Состояние для списка филиалов
    const [contacts, setContacts] = useState([]); // Состояние для списка филиалов
    
    const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
    const [isProhibitedItemsOpen, setIsProhibitedItemsOpen] = useState(false);
  
    const [copySuccess, setCopySuccess] = useState("");
    const [exchangeRate, setExchangeRate] = useState(null); // Состояние для курса обмена

    const toggleAboutUs = () => setIsAboutUsOpen(!isAboutUsOpen);
    const toggleProhibitedItems = () => setIsProhibitedItemsOpen(!isProhibitedItemsOpen);

    const fetchSettings = async () => {
        const allSettings = await getSettings();
        setSettings(allSettings || {}); 

        // Получаем курс тенге к доллару из стороннего API
        const exchangeResponse = await axios.get('https://api.exchangerate-api.com/v4/latest/KZT');
        const usdRate = exchangeResponse.data.rates.USD;
        setExchangeRate(usdRate); // Сохраняем курс в состояние
    };
    
    const handleCopy = () => {
        const addressElement = document.querySelector(".chinaAddress");
        const addressText = addressElement ? addressElement.innerText : "";
    
        navigator.clipboard.writeText(addressText).then(
          () => {
            setCopySuccess("Адрес скопирован!");
            setTimeout(() => setCopySuccess(""), 2000); // Убираем сообщение через 2 секунды
          },
          (err) => {
            console.error("Не удалось скопировать текст: ", err);
            setCopySuccess("Ошибка копирования");
          }
        );
      };


     // Функция для получения данных о филиалах при загрузке компонента
     useEffect(() => {

      
        fetchFilials(); // Вызываем функцию получения данных о филиалах при загрузке компонента
      }, []);


      const fetchFilials = async () => {
        // Вызываем функцию getFilials для получения данных о всех филиалах
        const allFilials = await getFilials();
        const allContacts = await getContacts();
        setFilials(allFilials); // Обновляем список филиалов
        setContacts(allContacts);
      };


      

    useEffect(() => {
        fetchSettings();
        

        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`${config.apiUrl}/api/auth/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data.user);
                } else {
                    console.error('Failed to fetch user profile:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error.message);
            }
        };

        fetchUserProfile();
        
    }, []);

    const toggleAdress = () => {
        setShowAdress(!showAdress);
    };

    const toggleFilials = () => {
        setShowFilials(!showFilials);
       
    };


    // Функция для получения существующих баннеров с сервера
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/api/upload/getBanners`);
                const bannerPaths = response.data.banners;

                // Обновляем массив баннеров с путями из базы данных
                if (bannerPaths && bannerPaths.length > 0) {
                    const updatedBanners = [...bannerPaths]; // Сохраняем полученные баннеры
                    // Если меньше трех баннеров, дополняем пустыми элементами для отображения кнопок
                    while (updatedBanners.length < 3) {
                        updatedBanners.push(null);
                    }
                    setBanners(updatedBanners);
                }
            } catch (error) {
                console.error("Ошибка при получении баннеров:", error);
            }
        };

        fetchBanners(); // Вызываем функцию при загрузке компонента
    }, []);

    return (
        <div className="main">
            <header className="header header-main">
                <div className="LogoHeader">
                    <img src={logo} className="logo2" alt="" />
                </div>

                <ul className="Menu">
                    <Link to="/main" className="tabbutton-menu">
                        <img className="icons-svg" src={location.pathname === '/main' ? house2 : house} alt="" />
                        <p style={location.pathname === '/main' ? { color: '#1F800C' } : { color: '#808080' }}>Главная</p>
                    </Link>

                    <Link to="/parcels" className="tabbutton-menu">
                        <img className="icons-svg" src={location.pathname === '/parcels' ? box2 : box} alt="" />
                        <p style={location.pathname === '/parcels' ? { color: '#1F800C' } : { color: '#808080' }}>Посылки</p>
                    </Link>

                    <Link to="/profile" className="tabbutton-menu">
                        <img className="icons-svg" src={location.pathname === '/profile' ? user2 : user} alt="" />
                        <p style={location.pathname === '/profile' ? { color: '#1F800C' } : { color: '#808080' }}>Профиль</p>
                    </Link>

                    {userData && (userData.role === 'admin' || userData.role === 'filial') && (
                        <Link to="/dashboard" className="tabbutton-menu">Панель управления</Link>
                    )}
                </ul>
                {/* <div className='bonus-container'><p className='bonus'>B</p><span  className='bonus-total'>{userData ? userData.bonuses : 0}</span></div> */}
                {/* Отображаем тариф с конвертацией в доллары */}
                <div className="tarif">
                    {exchangeRate && settings.price ? (
                        <>${(settings.price * exchangeRate).toFixed(2)}/кг</> // Конвертируем и округляем до 2 знаков
                    ) : (
                        'Загрузка...'
                    )}
                </div>

            </header>
        
            {banners.filter(Boolean).length > 0 && (
                <div className="banners_client">
                    {banners.filter(Boolean).map((banner, index) => (
                        <div className="banner_client" key={index}>
                            <img src={`${config.apiUrl}${banner}`} alt={`banner-${index}`} />
                        </div>
                    ))}
                </div>
            )}




            <div className="section">

                <div className="blocks__info">
                    <a href={settings.videoLink || '#'} target="_blank" rel="noreferrer" className="block_info">
                        <h3 className="text__block_info">Инструкция</h3>
                        <img className="iconMain" src={guide} alt="" />
                    </a>

                    <div className="block_info" onClick={toggleFilials}>
                        <h3 className="text__block_info">Филиалы</h3>
                        <img className="iconMain" src={filial} alt="" />
                    </div>

                    <div className="block_info" onClick={toggleAdress}>
                        <h3 className="text__block_info">Адрес склада</h3>
                        <img className="iconMain" src={geo} alt="" />
                    </div>

                    <a href={settings.whatsappNumber || '#'} target="_blank" rel="noreferrer" className="block_info">
                        <h3 className="text__block_info">WhatsApp</h3>
                        <img className="iconMain" src={whatsapp} alt="" />
                    </a>

               
                    <Link to="/lost" className="block_info" >
                        <h3 className="text__block_info">Потеряшки</h3>
                        <img className="iconMain" src={news} alt="" />
                    </Link>

                    <Link to="/referral" className="block_info">
                        <h3 className="text__block_info">Партнерская программа</h3>
                        <img className="iconMain" src={news2} alt="" />
                    </Link>
                </div>

              

                {showAdress && (
                    <div className="about">
                        <h3>Адрес склада</h3>
                        {
                            <>
                            {showAdress && <p className='chinaAddress'>{settings.chinaAddress}</p>}
                            <button onClick={handleCopy} className="copyButton">Копировать</button>
                            {copySuccess && <span className="copyMessage">{copySuccess}</span>}
                            </>
                        }
                    </div>
                )}


                {showFilials && (
                    <div className="about">
                        <h3>Филиалы нашего карго</h3>
                         <p>
                         {filials.map((filial) => (
                            <div className="filial-el filial-el-client" key={filial.filial._id}>
                                    <p><b>{'- ' + filial.filial.filialText}</b>  Адрес: {filial.filial.filialAddress}</p>
                            </div>

                            ))}
                        </p>
                    </div>
                )}

                    

                <div className="abouts_container">
                    <div className="about" onClick={toggleAboutUs}>
                        <div className="toggle_header">
                        <h3>О нас</h3>
                        <span className={`arrow ${isAboutUsOpen ? "open" : ""}`}>▼</span>
                        </div>
                        {isAboutUsOpen && <p>{settings.aboutUsText}</p>}
                    </div>

                    <div className="about" onClick={toggleProhibitedItems}>
                        <div className="toggle_header">
                        <h3>Товары, которые нельзя заказывать</h3>
                        <span className={`arrow ${isProhibitedItemsOpen ? "open" : ""}`}>▼</span>
                        </div>
                        {isProhibitedItemsOpen && <p>{settings.prohibitedItemsText}</p>}
                    </div>

                    
                    <div className="about contacts">
                        <h3>Контакты</h3>
                        <div className="contacts__el_main">
                            <img src={phoneIcon} alt="" />
                            <a target="_blank" rel="noreferrer" href={`tel:${contacts.phone}`}>{contacts.phone ? `${contacts.phone}` : ''}</a>
                        </div>
                        <div className="contacts__el_main">
                            <img src={whatsappIcon} alt="" />
                            <a target="_blank" rel="noreferrer" href={contacts.whatsappLink}>{contacts.whatsappPhone ? `${contacts.whatsappPhone}` : ''}</a>
                        </div>
                        <div className="contacts__el_main">
                            <img src={instagramIcon} alt="" />
                            <a target="_blank" rel="noreferrer" href={`https://www.instagram.com/${contacts.instagram}`}>{contacts.instagram ? `${contacts.instagram}` : ''}</a>

                        </div>
                        <div className="contacts__el_main">
                            <img src={telegramIcon} alt="" />
                            <a target="_blank" rel="noreferrer" href={contacts.telegramLink}>{contacts.telegramId ? `${contacts.telegramId}` : ''}</a>

                        </div>
                    </div>

                </div>




            <div className="area"></div>

            </div>
            <Tab />

        </div>
    );
};

export default Main;
