import React, { useState, useEffect } from 'react';
import './css/admin.css';
import Title from "./title";
import search from "../../assets/img/search.png"
import axios from 'axios';
import config from '../../config';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const TrackList = () => {
    const [tracks, setTracks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(100);
    const [searchTerm, setSearchTerm] = useState('');
    const [statuses, setStatuses] = useState([]);
    
    const [statusFilter, setStatusFilter] = useState(''); // Для фильтрации по статусу
    const [statusFilterText, setStatusFilterText] = useState(''); // Для фильтрации по статусу
    const [showStatuses, setShowStatuses] = useState(false); // Для управления видимостью всплывающего окна

    const [filials, setFilials] = useState([]);
   
    const [filialFilterText, setFilialFilterText] = useState(''); // Для фильтрации по статусу
    const [showFilials, setShowFilials] = useState(false); // Для управления видимостью всплывающего окна
    
    const [sortByDate, setSortByDate] = useState('latest');// Изначально сортируем по последнему добавленному
    
    const [userFilter, setUserFilter] = useState(''); // Для фильтрации по наличию пользователя
    const [showUserFilter, setShowUserFilter] = useState(false); // Для управления видимостью всплывающего окна
    const [textUserFilter, setTextUserFilter] = useState(''); 
    
    const [totalUsers, setTotalUsers] = useState(0);

    const [bookmarksWithoutStatus, setBookmarksWithoutStatus] = useState([]);
    const [isBookmarksVisible, setIsBookmarksVisible] = useState(false);



    // Функция для установки нового значения currentPage
    const setPage = (newPage) => {
        setCurrentPage(newPage <= 0 ? 1 : newPage);
    };
    const fetchBookmarksWithoutStatus = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/api/track/getBookmarksWithoutStatus`);
            setBookmarksWithoutStatus(response.data);
            setIsBookmarksVisible(true); // Показываем блок с закладками
        } catch (error) {
            console.error('Ошибка при получении закладок без статуса:', error.message);
        }
    };
    
    const handleCloseBookmarks = () => {
        setIsBookmarksVisible(false); // Закрываем блок с закладками
    };
    

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/api/track/tracks`, {
                    params: {
                        page: currentPage,
                        limit: perPage,
                        search: searchTerm, // Передаем поисковой запрос в параметрах запроса
                        sortByDate: sortByDate, // Добавляем параметр сортировки
                        status: statusFilter, // Передаем статус для фильтрации
                        userFilter: userFilter // Передаем параметр для фильтрации по наличию пользователя
                    }
                });

                setTracks(response.data.tracks);
                setTotalUsers(response.data.totalCount); // Обновление общего количества пользователей
            } catch (error) {
                console.error('Ошибка при получении трек-кодов:', error.message);
            }
        };

        fetchTracks();
    }, [currentPage, perPage, searchTerm, sortByDate, statusFilter, userFilter ]);


    useEffect(() => {
        const fetchStatuses = async () => {
          try {
            const response = await axios.get(`${config.apiUrl}/api/status/getStatus`);
            setStatuses(response.data);
          } catch (error) {
            console.error('Ошибка при получении списка статусов:', error.message);
          }
        };
      
        fetchStatuses();
      }, []);

      useEffect(() => {
        const fetchFilials = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/api/filial/getFilial`);
                setFilials(response.data.map(f => f.filial)); // Извлекаем только филиалы из ответа
            } catch (error) {
                console.error('Ошибка при получении списка филиалов:', error.message);
            }
        };

        fetchFilials();
    }, []);


    const handlePageChange = (e) => {
        setCurrentPage(e.target.value);
    };

    const handlePerPageChange = (e) => {
        setPerPage(e.target.value);
    };

    const handlePageChangePlus = (e) => {
       setPage(currentPage + 1);
    }

    const handlePageChangeMinus= (e) => {
        setPage(currentPage - 1);
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); // Обновляем поисковый запрос при изменении текста в поле поиска
        setPage(1)
    };

    const handleSortByDate = (type) => {
        setSortByDate(type);
        setCurrentPage(1); // При изменении типа сортировки сбрасываем страницу на первую
    };



        const getStatusText = (statusId) => {
        const status = statuses.find((status) => status._id === statusId);
        if (status) {
            return status.statusText;
        }

        const filial = filials.find((filial) => filial._id === statusId);
        return filial ? filial.filialText : 'Статус не найден';
    };


    const toggleStatuses = () => {
        setShowStatuses(!showStatuses);
    };

    const toggleFilials = () => {
        setShowFilials(!showFilials);
    };

    const toggleUserFilter = () => {
        setShowUserFilter(!showUserFilter);
    };


    const handleStatusFilter = (statusId, statusText) => {
        setStatusFilter(statusId);
        setStatusFilterText(statusText);
        setShowStatuses(false); // Закрываем всплывающее окно после выбора статуса
        setPage(1); // Сбрасываем на первую страницу при изменении фильтра
    };

    const handleFilialFilter = (statusId, statusText) => {
        setStatusFilter(statusId);
        setFilialFilterText(statusText);
        setShowFilials(false); // Закрываем всплывающее окно после выбора статуса
        setPage(1); // Сбрасываем на первую страницу при изменении фильтра
    };

   
    const handleUserFilter = (filterUser, userFilterText) => {
        setUserFilter(filterUser)
        setTextUserFilter(userFilterText);
        setShowUserFilter(!showUserFilter);
        setPage(1); // Сбрасываем на первую страницу при изменении фильтра
    };


    return (
        <div className="mainAdmin">
            <Title text="Список посылок"/>
                    <div className="users-container">
                    <div className="header-bar">
                        <div className="search-bar">
                            <img src={search} alt="" className="searchIcon"/>
                            <input type="text" className="searchInput" placeholder="Поиск..." value={searchTerm} onChange={handleSearchChange} />
                        </div>

                        <div className="filter-bar">
                            
                            <button className="filter-point" onClick={fetchBookmarksWithoutStatus}>
                                Добавлен в базу
                            </button>

                            <div className={`filter-point ${sortByDate === 'latest' ? 'filter-point-active' : ''}`} onClick={() => handleSortByDate('latest')}> {/* Обработчик для сортировки по последнему добавленному */}
                                Свежие по дате
                            </div>
                            <div className={`filter-point ${sortByDate === 'oldest' ? 'filter-point-active' : ''}`} onClick={() => handleSortByDate('oldest')}> {/* Обработчик для сортировки по первому добавленному */}
                                Старые по дате
                            </div>
                            <div className="status-filter">
                                <div className="filter-point" onClick={toggleUserFilter}>
                                        {textUserFilter || 'Пользователь'} ↓
                                    </div>
                                    {showUserFilter && (
                                        <div className="statuses-popup">                                   
                                        <div className="filter-point-status" onClick={() => handleUserFilter('', 'Пользователь')}>
                                                Все
                                            </div>
                                            <div className="filter-point-status" onClick={() => handleUserFilter('exists', 'Добавлен')}>
                                                Добавлен
                                            </div>
                                            <div className="filter-point-status" onClick={() => handleUserFilter('notExists', 'Не добавлен')}>
                                                Не добавлен
                                            </div>

                                        </div>
                                    )}
                            </div>

                            <div className="status-filter">
                                <div className="filter-point" onClick={toggleStatuses}>
                                    {statusFilterText || 'По статусам'} ↓
                                </div>

                                    {showStatuses && (
                                        <div className="statuses-popup">
                                        <div className="filter-point-status" onClick={() => handleStatusFilter('', '')}>
                                            Все треки
                                        </div>
                                        {statuses.map((status) => (
                                            <div key={status._id} className="filter-point-status" onClick={() => handleStatusFilter(status._id, status.statusText)}>
                                                {status.statusText}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="status-filter">
                                <div className="filter-point" onClick={toggleFilials}>
                                    {filialFilterText  || 'По филиалам'} ↓
                                </div>

                                    {showFilials && (
                                        <div className="statuses-popup">
                                        <div className="filter-point-status" onClick={() => handleFilialFilter('', '')}>
                                            Все треки
                                        </div>
                                        {filials.map((filial) => (
                                            <div key={filial._id} className="filter-point-status" onClick={() => handleFilialFilter(filial._id, filial.filialText)}>
                                                {filial.filialText}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            
                           
                        </div>
                    </div>
                    {!isBookmarksVisible && (
                        <>
                         <p className='totalCount'>Найдено: {totalUsers}</p>
                    

                        <div className="table-user">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Трек-код</th>
                                    <th>Место посылки</th>
                                    <th>Вес посылки</th>
                                    <th>Сумма</th>
                                    <th>Пользователь</th>
                                    <th>Статус</th>
                                    <th>Дата статуса</th>
                                </tr>
                                </thead>
                                <tbody>
                                {tracks.map((track, index) => (
                                    <tr key={index}>
                                    <td>{track.track}</td>
                                    <td>{track.place  || '-'}</td>

                                    {/* Вес посылки */}
                                    <td>
                                        <p className={`tdUserTrack ${!track.weight ? 'user-unknown' : ''}`}>
                                        {track.weight  || 'Неизвестно'}
                                        </p>
                                    </td>

                                    {/* Сумма */}
                                    <td>
                                        <p className={`tdUserTrack ${!track.price ? 'user-unknown' : ''}`}>
                                        {track.price ? `${track.price} ${track.currency === 'dollar' ? '$' : track.currency === 'tenge' ? '₸' : 'Неизвестно'}` : 'Неизвестно'}
                                        </p>
                                    </td>

                                    {/* Пользователь */}
                                    <td>
                                        <p className={`tdUserTrack ${!track.user ? 'user-unknown' : ''}`}>
                                        {track.user || 'Неизвестно'}
                                        </p>
                                    </td>

                                    {/* Статус */}
                                    <td>{getStatusText(track.history[track.history.length - 1].status)}</td>

                                    {/* Дата статуса */}
                                    <td>{formatDate(track.history[track.history.length - 1].date)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            
                            </div>

                            
                        <div className="page-point-bar">
                            <div className="page-point" onClick={handlePageChangeMinus}>Предедущая страница</div>
                            <div  className="page-point">
                                        <label htmlFor="page">Номер страницы: </label>
                                        <input type="number" id="page" value={currentPage} onChange={handlePageChange} />
                                    </div>
                                    <div  className="page-point">
                                        <label htmlFor="perPage">Кол-во: </label>
                                        <input type="number" id="perPage" value={perPage} onChange={handlePerPageChange} />
                                    </div>
                            <div className="page-point" onClick={handlePageChangePlus}>Следующая страница</div>
                        </div>
                        </>
                    )}
                       

                         {/* Вывод закладок без статуса */}
                            {isBookmarksVisible && bookmarksWithoutStatus.length > 0 && (
                            <div className="table-user">
                                <div className="tableheader">
                                    <h3 className='tabelH3'>Треки прикрепленные пользователями но не найденные</h3>
                                    <button onClick={handleCloseBookmarks} className=' cancel-btn'>Закрыть</button>
                                </div>

                                <table className="table">
                                <thead>
                                    <tr>
                                    <th>Пользователь</th>
                                    <th>Трек-код</th>
                                    <th>Дата создания</th>
                                    <th>Описание</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {bookmarksWithoutStatus.map((bookmark, index) => (
                                    <tr key={index}>
                                        <td>{bookmark.user ? `${bookmark.user.name} ${bookmark.user.surname} (${bookmark.user.phone})` : 'Неизвестно'}</td>
                                        <td>{bookmark.trackNumber}</td>
                                        <td>{formatDate(bookmark.createdAt)}</td>
                                        <td>{bookmark.description}</td>
                                    </tr>
                                    ))}
                                </tbody>
                                </table>
                            </div>
                            )}

                </div>
            </div>
    )
}

export default TrackList;