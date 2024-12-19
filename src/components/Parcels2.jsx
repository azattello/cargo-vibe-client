import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import { useSelector } from 'react-redux';
import './styles/parcels2.css';
import { getStatus } from "../action/status";
import { FaCheckCircle, FaTimesCircle, FaTrash } from 'react-icons/fa';
import InvoiceSummary from './InvoiceSummary';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${day}-${month}-${year}`;
};

const Parcels2 = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [notFoundBookmarks, setNotFoundBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookmarks, setTotalBookmarks] = useState(0);
  const [unpaidTracks, setUnpaidTracks] = useState(new Set()); // Треки в неоплаченном счете

  const userId = useSelector(state => state.user.currentUser?.id);

  useEffect(() => {
    const fetchBookmarksAndStatuses = async () => {
      try {
        // Получаем закладки пользователя с учетом пагинации
        const bookmarksResponse = await axios.get(`${config.apiUrl}/api/bookmark/bookmarks/${userId}?page=${currentPage}`);
        setBookmarks(bookmarksResponse.data.updatedBookmarks || []);
        setNotFoundBookmarks(bookmarksResponse.data.notFoundBookmarks || []);
        setTotalPages(bookmarksResponse.data.totalPages || 1);
        setTotalBookmarks(bookmarksResponse.data.totalBookmarks || 0);


          // Загружаем неоплаченный счет и находим все неоплаченные треки
          const invoiceResponse = await axios.get(`${config.apiUrl}/api/invoice/${userId}/current-invoice`);
          if (invoiceResponse.data && invoiceResponse.data.bookmarks) {
            const unpaidSet = new Set(invoiceResponse.data.bookmarks.map(b => b.trackNumber));
            setUnpaidTracks(unpaidSet);
          }


        // Получаем все статусы через getStatus
        const statusesData = await getStatus();
        setStatuses(statusesData || []);

        setLoading(false);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchBookmarksAndStatuses();
    }
  }, [userId, currentPage]);

  const removeBookmark = async (trackNumber) => {
    const confirmDelete = window.confirm("Вы уверены, что хотите удалить эту закладку?");
    if (confirmDelete) {
      try {
        const response = await fetch(`${config.apiUrl}/api/bookmark/${userId}/delete/${trackNumber}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Ошибка при удалении закладки');
        }

        console.log('Закладка успешно удалена');
        setBookmarks((prevBookmarks) => prevBookmarks.filter(bookmark => bookmark.trackDetails?.track !== trackNumber));
        setNotFoundBookmarks((prevNotFound) => prevNotFound.filter(bookmark => bookmark.trackNumber !== trackNumber));
      } catch (error) {
        console.error('Произошла ошибка при удалении закладки:', error.message);
      }
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="bookmark-summary">
            <div>Загрузка закладок...</div>
      </div>
    )
    
  }

  
  const getTrackClass = (bookmark) => {
    if (bookmark.isPaid) {
      return 'paid-track';
    } else if (unpaidTracks.has(bookmark.trackNumber)) {
      return 'unpaid-track';
    } else {
      return 'no-invoice-track';
    }
  };

  
  // Сортируем статусы так, чтобы "Получено" всегда было последним
  const sortedStatuses = [...statuses].sort((a, b) => {
    if (a.statusText === 'Получено') return 1;
    if (b.statusText === 'Получено') return -1;
    return 0;
  });

  return (
    <div className="container">
      <InvoiceSummary userId={userId} newBookmarks={bookmarks} />
      <div className="bookmark-summary">
        <p>Показано {bookmarks.length + notFoundBookmarks.length } из {totalBookmarks} закладок</p>
      </div>

      {/* Отображение не найденных закладок */}
      <div className="not-found-list">
        {notFoundBookmarks.map((bookmark, index) => (
          <div className="bookmark-card" key={index}>
            <div className="bookmark-header">
              <p className="bookmark-h2">{bookmark.trackNumber}</p>
              <FaTrash className="removeLiBookmark" onClick={() => removeBookmark(bookmark.trackNumber)} />
            </div>
            <div className="statuses-bookmark">
              <div className="description">
                <b>Описание: </b>{bookmark.description}
              </div>
              <div className="status-item">
                <FaCheckCircle className="status-icon completed" />
                <div className="status-text">
                  <p>Дата регистрации клиентом:</p>
                  <span className='date-bookmarks'>{bookmark.createdAt ? formatDate(bookmark.createdAt) : 'нет данных'}</span>
                </div>
              </div>
              {sortedStatuses.map((status, index) => (
                <div className="status-item" key={index}>
                  <FaTimesCircle className="status-icon pending" />
                  <div className="status-text">
                    <p>{status.statusText}</p>
                    <span className="date-bookmarks">неизвестно</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {bookmarks.length === 0 ? (
        <p></p>
      ) : (
        <>
          <div className="bookmarks-list">
            {bookmarks.map((bookmark) => (
              <div className="bookmark-card" key={bookmark._id}>
               <div className={`bookmark-header ${getTrackClass(bookmark)}`}>
               
                  <h2 className="bookmark-h2">{bookmark.trackDetails?.track}</h2>
                  <FaTrash className="removeLiBookmark" onClick={() => removeBookmark(bookmark.trackDetails?.track)} />
                </div>

                <div className="statuses-bookmark">
                  <p className="description">{bookmark.description}</p>
                  <div className="price-weight">
                    <div className="description">
                        <b>Сумма:</b> <span>{bookmark.price ? `${bookmark.price + "₸"}` : 'Неизвестно'}</span>
                    </div>
                    <div className="description">
                        <b>Вес:</b> <span>{bookmark.weight ? `${bookmark.weight} кг` : 'Неизвестно'}</span>
                    </div>
                  </div>
               
                  <div className="status-item">
                    <FaCheckCircle className="status-icon completed" />
                    <div className="status-text">
                      <p>Дата регистрации клиентом:</p>
                      <span className='date-bookmarks'>{bookmark.createdAt ? formatDate(bookmark.createdAt) : 'нет данных'}</span>
                    </div>
                  </div>
                  {sortedStatuses.map((status, index) => {
                    // Проверяем, есть ли статус в истории закладки
                    const historyItem = bookmark.history?.find(
                      (item) => item.status.statusText === status.statusText
                    );

                    return (
                      <div className="status-item" key={index}>
                        {historyItem ? (
                          <FaCheckCircle className="status-icon completed" />
                        ) : (
                          <FaTimesCircle className="status-icon pending" />
                        )}
                        <div className="status-text">
                          <p>{status.statusText}</p>
                          <span className="date-bookmarks">
                            {historyItem ? formatDate(historyItem.date) : 'нет данных'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {/* Пагинация */}
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="pagination-button">
          &laquo;
        </button>
        <span className="pagination-info">Страница {currentPage} из {totalPages}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="pagination-button">
          &raquo;
        </button>
      </div>
    </div>
  );
};

export default Parcels2;