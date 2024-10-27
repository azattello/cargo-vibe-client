import React, { useState } from "react";
import { useSelector } from "react-redux"; // Подключаем useSelector из react-redux
import config from "../config";


const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};


const StatusDetail = ({ statusId, updatedBookmarks, statusText}) => {
    const [showDetail, setShowDetail] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const filteredBookmarks = updatedBookmarks.filter(bookmark => bookmark.currentStatus === statusId);

    const userId = useSelector(state => state.user.currentUser.id)

    const sendArchiveRequest = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${config.apiUrl}/api/archive/${userId}/archive`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookmarksToArchive: filteredBookmarks }),
            });

            if (!response.ok) {
                throw new Error('Ошибка при отправке запроса');
            }

            const data = await response.json();
            console.log(data.message); // Ответ от сервера
            window.location.reload(); 
        } catch (error) {
            console.error('Произошла ошибка:', error.message);
        } finally {
            setLoading(false);
        }
    };
    
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
                // Перезагрузить страницу или обновить список закладок
                window.location.reload();
            } catch (error) {
                console.error('Произошла ошибка при удалении закладки:', error.message);
            }
        }
    };

    return (
        <div className="status-detail">
             <div key={statusId} className="status-client" onClick={() => setShowDetail(!showDetail)}>  
                <p className="status__title">{statusText}</p>
                <div className="quantity"><p className="quantity__p">{updatedBookmarks.filter(bookmark => bookmark.currentStatus === statusId).length}</p></div>
            </div>
            
            {showDetail && (
                    
                        <ul className="ul-detail">    
                            <div className="title2 detail-header">
                                <p>{statusText}</p>
                                <div className="close-detail" onClick={() => setShowDetail(!showDetail)}></div>
                            </div>         
                            <div className="li-container">     
                                {filteredBookmarks.map((bookmark, index) => (
                                <div className="ul-detail-border">
                                <li key={index} className="li-track-detail">
                                    <div className="li-header">
                                        <p>№ {bookmark.trackNumber}</p>
                                        {statusText !== "Получено" && (
                                            <div className="removeLiTrack" onClick={() => removeBookmark(bookmark.trackNumber)}></div>
                                        )}
                                    </div>
                                    <div className="description-li">
                                        <b>Описание:</b> {bookmark.description}
                                    </div>
                                    <ul className="date-li">
                                        <b className="date-text">{statusText}:</b>
                                        {bookmark.history
                                            .filter(historyItem => historyItem.status.toString() === statusId.toString())
                                            .map((history, historyIndex) => (
                                                <li key={historyIndex}>{formatDate(history.date)}</li>
                                            ))}
                                    </ul>
                                    <div className="description-li">
                                        <p><b>Место посылки: </b> {bookmark.place}</p>
                                    </div>
                                    <div className="details-container">
                                        <div className="description-li">
                                            <b>Сумма:</b> <span>{bookmark.price ? `${bookmark.price} ${bookmark.price ? '₸' : 'Неизвестно'}` : 'Неизвестно'}</span>
                                        </div>
                                        <div className="description-li">
                                            <b>Вес:</b> <span>{bookmark.weight ? `${bookmark.weight} кг` : 'Неизвестно'}</span>
                                        </div>
                                    </div>
                                </li>
                            </div>
                            

                                ))}
                                

                    <div className="area2"></div>
                    <div className="area2"></div>

                            </div>
                            {filteredBookmarks.length > 0 && statusText === "Получено" && (
                                <div className="confirm__container">
                                    {loading ? (
                                            <div className="confirm__track" disabled={false}>Загрузка...</div>
                                        ) : (
                                            <div className="confirm__track" onClick={sendArchiveRequest}>Подтвердить получение</div>
                                        )}
                                </div>
                            )}

                        </ul>

            )}
            {showDetail &&  (
                <div className="overflow_detail"></div>
            )}
        </div>

    );
};

export default StatusDetail;
