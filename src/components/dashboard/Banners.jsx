import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config"; // Импорт конфигурации с apiUrl

const Banners = () => {
    const [banners, setBanners] = useState([null, null, null]); // Массив для хранения баннеров

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

    // Функция для загрузки нового баннера
    const handleBannerClick = (index) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/png, image/jpeg"; // Только PNG и JPEG файлы

        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                const formData = new FormData();
                formData.append('banner', file); // Добавляем файл в FormData

                try {
                    const response = await axios.post(`${config.apiUrl}/api/upload/uploadBanner`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    console.log('Успешная загрузка баннера:', response.data);

                    const newBanners = [...banners];
                    newBanners[index] = response.data.url; // Сохраняем URL загруженного баннера
                    setBanners(newBanners);
                } catch (error) {
                    console.error('Ошибка при загрузке баннера:', error);
                }
            }
        };
        input.click(); // Имитируем клик для открытия диалога выбора файла
    };

    // Функция для удаления баннера
    const handleDeleteBanner = async (url) => {
        try {
            const response = await axios.delete(`${config.apiUrl}/api/upload/deleteBanner`, { data: { url } });
            console.log('Баннер успешно удалён:', response.data);

            // Обновляем список баннеров после удаления
            setBanners(banners.filter(banner => banner !== url));
        } catch (error) {
            console.error('Ошибка при удалении баннера:', error);
        }
    };
    
    

    return (
        <div className="banner-list">
            <h1 className="status-list-title">Баннеры</h1>
            <div className="banners">
                {banners.map((banner, index) => (
                    <div
                        key={index}
                        className="banner"
                        onClick={() => handleBannerClick(index)}
                        style={{ cursor: 'pointer', position: 'relative' }} // Добавляем позицию для кнопки удаления
                    >
                        {banner ? (
                            <>
                                <img src={`${config.apiUrl}${banner}`} alt={`banner-${index}`} />
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteBanner(banner); }}
                                    style={{
                                        position: 'absolute',
                                        bottom: '5px',
                                        left: '5px',
                                        background: 'red',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        padding: '5px 10px',
                                    }}
                                >
                                    Удалить
                                </button>
                            </>
                        ) : (
                            <span>Загрузить баннер</span> // Отображаем текст, если баннер не загружен
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Banners;
