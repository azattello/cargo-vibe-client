import React, { useEffect, useState } from "react";
import './css/admin.css';
import search from "../../assets/img/search.png";
import axios from 'axios';
import config from "../../config";
import { getFilials, getFilialByUserPhone  } from "../../action/filial"; // Импортируем getFilials для получения списка филиалов
import { useSelector } from 'react-redux';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${day}.${month}.${year}`;
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [sortByDate, setSortByDate] = useState('latest'); // Изначально сортируем по последнему добавленному
  const [searchTerm, setSearchTerm] = useState('');
  const [sortByActivity, setSortByActivity] = useState(false);
  const [showByFilialSort, setShowByFilialSort] = useState(false); // Состояние для отображения выпадающего меню для фильтра по филиалу
  const [filials, setFilials] = useState([]); // Список филиалов
  const [sortByFilial, setSortByFilial] = useState(''); // Новый фильтр по филиалу

  const [totalUsers, setTotalUsers] = useState(0);
  
  const [sortByRole, setSortByRole] = useState('');
  const [showByRoleSort, setShowByRoleSort] = useState(false); // Для управления видимостью всплывающего окна

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [invoiceStatus, setInvoiceStatus] = useState('all'); // Новый фильтр по статусу счета
  const [showByInvoceSort, setShowByInvoceSort] = useState(false); // Для управления видимостью всплывающего окна
  const [sortByInvoice, setSortByInvoice] = useState('');

  // Состояния для модального окна и редактируемого пользователя
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [personalRate, setPersonalRate] = useState('');


  const role = useSelector(state => state.user.currentUser.role);
  const userPhone = useSelector(state => state.user.currentUser.phone);
  
  console.log(role)

  useEffect(() => {
    const fetchFilialData = async () => {
      try {
        const data = await getFilialByUserPhone(userPhone);
        console.log(data.filialText); // Исправлено здесь
        setSortByFilial(data.filialText)

      } catch (error) {
        console.error('Ошибка при загрузке данных о филиале:', error);
      }
    };
  
    if (role === "filial") {
      fetchFilialData();
    }
  }, [userPhone,role]);
  

  useEffect(() => {
    // Загружаем список филиалов при загрузке компонента
    const fetchFilials = async () => {
      const allFilials = await getFilials();
      setFilials(allFilials);
    };
    fetchFilials();
  }, []);

  // Функция для установки нового значения currentPage
  const setPage = (newPage) => {
    setCurrentPage(newPage <= 0 ? 1 : newPage);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/api/user/users`, {
          params: {
            page: currentPage,
            limit: perPage,
            search: searchTerm,
            sortByDate: sortByDate,
            sortByActivity: sortByActivity,
            filterByRole : sortByRole,
            filterByFilial: sortByFilial, // Фильтрация по филиалу
            invoiceStatus: invoiceStatus // Передаем статус счета в запрос
          }
        });

        setUsers(response.data.users);
        setTotalUsers(response.data.totalCount); // Обновление общего количества пользователей
      } catch (error) {
        console.error('Ошибка при получении пользователей:', error.message);
      }
    };

    fetchUsers();
  }, [currentPage, perPage, sortByDate, searchTerm, sortByActivity, sortByRole, sortByFilial, invoiceStatus]);

  const handleSortByFilial = (filial) => {
    setSortByFilial(filial);
    setShowByFilialSort(false);
    setCurrentPage(1);
  };

  const handlePageChange = (e) => {
    setCurrentPage(parseInt(e.target.value, 10));
  };

  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value, 10));
  };

  const handlePageChangePlus = () => {
    setPage(currentPage + 1);
  };

  const handlePageChangeMinus = () => {
    setPage(currentPage - 1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Обновляем поисковый запрос при изменении текста в поле поиска
    setPage(1);
  };

  const handleSortByDate = (type) => {
    setSortByDate(type);
    setSortByActivity(false);
    setCurrentPage(1); // При изменении типа сортировки сбрасываем страницу на первую
  };

  const handleSortByActivity = () => {
    setSortByActivity(!sortByActivity);
    setSortByDate('');
    setCurrentPage(1);
  };

  const toggleRoleSort = () => {
    setShowByRoleSort(!showByRoleSort);
  };

  const toggleInvoceSort = () => {
    setShowByInvoceSort(!showByInvoceSort);
  };

  const handleSortByRole = (role) => {
    setSortByRole(role);
    setShowByRoleSort(false);
    setCurrentPage(1);
  };


  const handleInvoiceStatusChange = (status) => {
    setInvoiceStatus(status);
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении фильтра
    if(status === 'all')
      setSortByInvoice('Все счета');
    if(status === 'paid')
      setSortByInvoice('Оплачено');
    if(status === 'pending')
      setSortByInvoice('Неоплачено');
    setShowByInvoceSort(false);

  };

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setPersonalRate(user.personalRate || ''); // Устанавливаем начальное значение личного тарифа
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.post(`${config.apiUrl}/api/user/${currentUser._id}/updatePersonalRate`, {
        personalRate,
      });

      
      

      alert('Изменения успешно сохранены');
      setIsModalOpen(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Ошибка при сохранении изменений:', error.message);
      alert('Ошибка при сохранении изменений');
    }
  };

  const openInvoiceModal = (user) => {
    setSelectedUser(user);
    setIsInvoiceModalOpen(true);
  };

  const closeInvoiceModal = () => {
    setIsInvoiceModalOpen(false);
    setSelectedUser(null);
  };

  const toggleInvoiceTracks = (invoice) => {
    invoice.showTracks = !invoice.showTracks;
    setSelectedUser({...selectedUser});
  };


  const confirmPayment = async (invoiceId) => {
    try {
      await axios.post(`${config.apiUrl}/api/invoice/${selectedUser._id}/confirm-payment/${invoiceId}`);
      alert('Оплата подтверждена');
      // Обновляем состояние пользователя, чтобы сразу отобразить изменение
      setSelectedUser({
        ...selectedUser,
        invoices: selectedUser.invoices.map(inv =>
          inv._id === invoiceId ? { ...inv, status: 'paid' } : inv
        )
      });
    } catch (error) {
      console.error('Ошибка при подтверждении оплаты:', error.message);
      alert('Ошибка при подтверждении оплаты');
    }
  };

  return (
    <div className="users-container">
      <div className="header-bar">
        <div className="search-bar">
          <img src={search} alt="" className="searchIcon" />
          <input
            type="text"
            className="searchInput"
            placeholder="Поиск..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filter-bar">
          <div
            className={`filter-point ${sortByDate === 'latest' ? 'filter-point-active' : ''}`}
            onClick={() => handleSortByDate('latest')}
          >
            Свежие по дате
          </div>
          <div
            className={`filter-point ${sortByDate === 'oldest' ? 'filter-point-active' : ''}`}
            onClick={() => handleSortByDate('oldest')}
          >
            Старые по дате
          </div>
          <div
            className={`filter-point ${sortByActivity ? 'filter-point-active' : ''}`}
            onClick={handleSortByActivity}
          >
            Сортировка по активности
          </div>


          
          <div className="status-filter">
              <div className="filter-point" onClick={toggleInvoceSort}>
                      {sortByInvoice || 'Счет'} ↓
                  </div>
                  {showByInvoceSort && (
                      <div className="statuses-popup">                                   
                      <div className="filter-point-status" onClick={() => handleInvoiceStatusChange('all')}>
                          Все счета
                          </div>
                          <div className="filter-point-status" onClick={() => handleInvoiceStatusChange('paid')}>
                          Оплачено
                          </div>
                          <div className="filter-point-status" onClick={() => handleInvoiceStatusChange('pending')}>
                          Неоплачено
                          </div>

                      </div>
                  )}
            </div>

          <div className="status-filter">
                <div className="filter-point" onClick={toggleRoleSort}>
                        {sortByRole || 'Роль'} ↓
                    </div>
                    {showByRoleSort && (
                        <div className="statuses-popup">                                   
                        <div className="filter-point-status" onClick={() => handleSortByRole('')}>
                                Все
                            </div>
                            <div className="filter-point-status" onClick={() => handleSortByRole('client')}>
                            client
                            </div>
                            <div className="filter-point-status" onClick={() => handleSortByRole('filial')}>
                              filial
                            </div>
                            <div className="filter-point-status" onClick={() => handleSortByRole('admin')}>
                              admin
                            </div>

                        </div>
                    )}
            </div>

            {role === 'admin' && (
            <>
              <div className="status-filter">
                <div className="filter-point" onClick={() => setShowByFilialSort(!showByFilialSort)}>
                  {sortByFilial || 'По филиалам'} ↓
                </div>
                {showByFilialSort && (
                  <div className="statuses-popup">
                    <div className="filter-point-status" onClick={() => handleSortByFilial('')}>
                      Все филиалы
                    </div>
                    {filials.map(filial => (
                      <div
                        key={filial.filial._id}
                        className="filter-point-status"
                        onClick={() => handleSortByFilial(filial.filial.filialText)}
                      >
                        {filial.filial.filialText}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

        </div>


        
      </div>

      <p className='totalCount'>Найдено: {totalUsers}</p>


      <div className="table-user">
        <table className="table">
          <thead>
            <tr>
              <th>№</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Номер</th>
              <th>Филиал</th>
              <th>Дата регистрации</th>
              <th>Пароль</th>
              <th>В пути</th>
              <th>В архиве</th>
              <th>Общее кол-во</th>
              <th>Роль</th>
              <th>Тариф</th>
              <th>Статус счета</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.personalId}</td>
                <td>{user.name}</td>
                <td>{user.surname}</td>
                <td>{user.phone}</td>
                <td>{user.selectedFilial}</td>
                <td>{formatDate(user.createdAt)}</td>
                <td>{user.password}</td>
                <td>{user.bookmarkCount}</td>
                <td>{user.archiveCount}</td>
                <td>{user.bookmarkCount + user.archiveCount}</td>
                <td>{user.role}</td>
                <td>{user.personalRate ? `${user.personalRate}₸` : 'общий'}</td>
                <td>
                    {(!user.invoices || user.invoices.length === 0) ? (
                      <span className="custom-invoice-status custom-invoice-no-invoices">Нет счетов</span>
                    ) : user.invoices.some(invoice => invoice.status === 'pending' && invoice.totalAmount > 0) ? (
                      <span className="custom-invoice-status custom-invoice-pending" onClick={() => openInvoiceModal(user)}>Неоплачено</span>
                    ) : user.invoices.some(invoice => invoice.status === 'paid') ? (
                      <span className="custom-invoice-status custom-invoice-paid" onClick={() => openInvoiceModal(user)}>Оплачено</span>
                    ) : (
                      <span className="custom-invoice-status custom-invoice-no-invoices">Нет счетов</span>
                    )}
                  </td>

                <td>
                  <button className="edit-btn" onClick={() => handleEditClick(user)}>Изменить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

            {/* Модальное окно для редактирования пользователя */}
            {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <h2>Редактирование пользователя</h2>
                <div className="modal-fields">
                  <div className="modal-field">
                    <label>Имя:</label>
                    <span>{currentUser.name}</span>
                  </div>
                  <div className="modal-field">
                    <label>Фамилия:</label>
                    <span>{currentUser.surname}</span>
                  </div>
                  <div className="modal-field">
                    <label>Номер:</label>
                    <span>{currentUser.phone}</span>
                  </div>
                  <div className="modal-field">
                    <label>Личный тариф пользователя:</label>
                    <input
                      type="text"
                      value={personalRate}
                      onChange={(e) => setPersonalRate(e.target.value)}
                    />
                   <p>{currentUser.personalRate ? currentUser.personalRate : ""}</p>
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="btn save-btn" onClick={handleSaveChanges}>
                    Сохранить изменения
                  </button>
                  <button className="btn cancel-btn" onClick={handleCloseModal}>
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {isInvoiceModalOpen && selectedUser && (
  <div className="custom-modal">
    <div className="custom-modal-content">
      <div className="header_custom_modal">
        <h2>Счета пользователя {selectedUser.name} {selectedUser.surname}</h2>
        <button className="custom-btn cancel-btn" onClick={closeInvoiceModal}>Закрыть</button>
      </div>
      <div className="custom-invoice-list">
        {selectedUser.invoices
          .filter(invoice => invoice.totalAmount > 0) // Фильтруем счета, у которых `totalAmount` больше 0
          .sort((a, b) => {
            if (a.status === 'pending' && b.status !== 'pending') return -1; // "pending" счета всегда первыми
            if (a.status !== 'pending' && b.status === 'pending') return 1;
            return new Date(b.createdAt) - new Date(a.createdAt); // Сортируем по дате: новые сначала
          })
          .map((invoice, index) => (
            <div
              key={index}
              className={`custom-invoice-card ${invoice.status === 'pending' ? 'custom-invoice-pending' : 'custom-invoice-paid'}`}
              onClick={() => toggleInvoiceTracks(invoice)}
            >
              <p>Счёт от {formatDate(invoice.createdAt)}</p>
              <p>Статус: {invoice.status === 'pending' ? 'Неоплачено' : 'Оплачено'}</p>
              <p>Сумма: {invoice.totalAmount} ₸</p>
              <p>Вес: {invoice.totalWeight} кг</p>

              {invoice.showTracks && (
                <div className="custom-invoice-tracks">
                  <h4>Трек-коды:</h4>
                  {invoice.bookmarks.map((bookmark, index) => (
                    <p key={index}>{bookmark.trackNumber}</p>
                  ))}
                </div>
              )}

              {/* Кнопка для подтверждения оплаты */}
              {invoice.status === 'pending' && (
                <button
                  className="custom-confirm-btn"
                  onClick={() => confirmPayment(invoice._id)}
                >
                  Подтвердить оплату
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  </div>
)}





        <div className="page-point-bar">
          <div className="page-point" onClick={handlePageChangeMinus}>
            Предыдущая страница
          </div>
          <div className="page-point">
            <label htmlFor="page">Номер страницы: </label>
            <input type="number" id="page" value={currentPage} onChange={handlePageChange} />
          </div>
          <div className="page-point">
            <label htmlFor="perPage">Кол-во: </label>
            <input type="number" id="perPage" value={perPage} onChange={handlePerPageChange} />
          </div>
          <div className="page-point" onClick={handlePageChangePlus}>
            Следующая страница
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
