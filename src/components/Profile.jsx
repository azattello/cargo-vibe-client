import React, { useEffect, useState } from "react";
import './styles/profile.css';
import { useDispatch } from "react-redux";
import { logout } from "../reducers/userReducer";
import defaultProfileImage from '../assets/img/profile.png';
import { useNavigate, useLocation, Link } from "react-router-dom";
import config from "../config";
import house from '../assets/icons/home-outline.svg';
import house2 from '../assets/icons/home.svg';
import box from '../assets/icons/layers-outline.svg';
import box2 from '../assets/icons/layers.svg';
import user from '../assets/icons/person-circle-outline.svg';
import user2 from '../assets/icons/person-circle.svg';
import Tab from './Tab';
import SettingsModal from './SettingsModal';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [userData, setUserData] = useState(null);
    const [profileImage, setProfileImage] = useState(defaultProfileImage);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    

    // Function to handle opening the modal
    const openSettingsModal = () => {
        setIsModalOpen(true);
    };

    // Function to handle closing the modal
    const closeSettingsModal = () => {
        setIsModalOpen(false);
    };



    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`${config.apiUrl}/api/auth/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data.user);

                    // Обновляем URL изображения профиля
                    if (data.user.profilePhoto) {
                        const imageUrl = new URL(data.user.profilePhoto, config.apiUrl).toString();
                        setProfileImage(imageUrl);
                    } else {
                        setProfileImage(defaultProfileImage); // Устанавливаем изображение по умолчанию
                    }
                    setLoading(false);
                } else {
                    console.error('Failed to fetch user profile:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error.message);
            }
        };

        fetchUserProfile();
    }, []);

    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (file) {
          const formData = new FormData();
          formData.append('profileImage', file);
          formData.append('phone', userData.phone);  // Передаем номер телефона
  
          try {
              const response = await fetch(`${config.apiUrl}/api/upload/profile-image`, {
                  method: 'POST',
                  body: formData,
              });
  
              if (response.ok) {
                  const data = await response.json();
                  setProfileImage(`${config.apiUrl}${data.imageUrl}`);
              } else {
                  console.error('Failed to upload image:', response.statusText);
              }
          } catch (error) {
              console.error('Error uploading image:', error.message);
          }
      }
  };

    return (
        <div className="profile">
            <header className="header">
                <div className="LogoHeader">
                    <div className="title2">Профиль</div>
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
            </header>
            <div className="section__profile">

            <SettingsModal isOpen={isModalOpen} onClose={closeSettingsModal} />

            
                <div className="profile__img-wrapper">
                    <img src={profileImage} alt="Profile" className="profile__img" />
                </div>
                <label className="uploadProfile-img">
                    Загрузить фото профиля
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
                {loading ? (
                    <p>Загрузка...</p>
                ) : (
                    userData && (
                        <div>
                            <p className="name info-el">{userData.name} {userData.surname}</p>
                            <p className="info-el">Телефон номер: {userData.phone}</p>
                            <p className="info-el">ID номер: {userData.personalId}</p>
                            <p className="info-el">Филиал: {userData.selectedFilial}</p>
                            <p className="info-el">Пароль: {userData.password}</p>
                            <p className="info-el">Аккаунт создан: {formatDate(userData.createdAt)}</p>
                            <button className="settings-button" onClick={openSettingsModal}>Настройки</button>
                        </div>
                    )
                )}
                 {userData && userData.role === 'admin' && (
                    <Link to="/dashboard" className="verify">Панель управления</Link>
                )}
                {userData && userData.role === 'filial' && (
                    <Link to="/dashboard" className="verify">Панель управления</Link>
                )}
                <div className="logout" onClick={() => {
                    dispatch(logout());
                    navigate("/");
                }}>Выйти</div>
            </div>
            <div className="area3"></div>
            <Tab />
        </div>
    );
};

export default Profile;
