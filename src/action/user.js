import axios from 'axios'
import {setUser} from "../reducers/userReducer";
import config from '../config';

let configUrl = config.apiUrl;
export const registration = (name, surname, phone, password, referrer, selectedFilial, isChecked) => {
    return async dispatch => {
        try {
            // Отправляем запрос на сервер для регистрации пользователя
            const registrationResponse = await axios.post(`${configUrl}/api/auth/registration`, {
                name,
                surname,
                phone,
                password,
                referrer,
                selectedFilial,
                isChecked
            });

            // Если регистрация прошла успешно, авторизуем пользователя
            const loginResponse = await axios.post(`${configUrl}/api/auth/login`, {
                phone,
                password
            });

            // Получаем токен из ответа и сохраняем его в локальном хранилище
            localStorage.setItem('token', loginResponse.data.token);
            

            // Отправляем action для обновления состояния с информацией о пользователе
            dispatch(setUser(loginResponse.data.user));

            // Возвращаем сообщение об успешной регистрации
            alert(registrationResponse.data.message);

            return true; 

        } catch (error) {
            // Обрабатываем ошибку
            alert(error.response.data.message);
            return false; 

        }
    }
}


export const login =  (phone, password) => {
    return async dispatch => {
        try {
            const response = await axios.post(`${configUrl}/api/auth/login`, {
                phone,
                password
            })
            dispatch(setUser(response.data.user))
            localStorage.setItem('token', response.data.token)
            const isAdmin = response.data.user.role === 'admin';
            localStorage.setItem('isAdmin', isAdmin);
            dispatch(setUser(response.data.user));
            return true; 
            
        } catch (e) {
            alert(e.response.data.message)
            return false; 
        }
    }
}


export const auth =  () => {
    return async dispatch => {
        try {
            const response = await axios.get(`${configUrl}/api/auth/auth`, 
                {headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}}
            )
            dispatch(setUser(response.data.user))
            // localStorage.removeItem('token')
            const isAdmin = response.data.user.role === 'admin';
            localStorage.setItem('isAdmin', isAdmin);
            dispatch(setUser(response.data.user));

            
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const { message, errors } = error.response.data;
                console.log('Validation errors:', errors);
                alert(message);
              } else {
                console.error('Error:', error.message);
              }
        }
    }
}


  
  