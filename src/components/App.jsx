import { useCallback, useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Header from "./Header/Header.jsx";
import Main from "./Main/Main.jsx";
import Footer from "./Footer/Footer.jsx";
import Register from "./Register/Register.jsx";
import Login from "./Login/Login.jsx";
import PopupWithForm from "./PopupWithForm/PopupWithForm.jsx";
import ImagePopup from "./ImagePopup/ImagePopup.jsx";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import EditProfilePopup from "./EditProfilePopup/EditProfilePopup.jsx";
import EditAvatarPopup from './EditAvatarPopup/EditAvatarPopup.jsx';
import AddPlacePopup from "./AddPlacePopup/AddPlacePopup.jsx";
import InfoTooltip from "./InfoTooltip/InfoTooltip.jsx";
import api from "../utils/api.js";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";
import { register, login, getUserData } from '../utils/auth.js';

function App() {
  // Состояние модальных окон
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [isInfoToolTipPopupOpen, setIsInfoToolTipPopupOpen] = useState(false);
  // Состояние контекста
  const [currentUser, setCurrentUser] = useState({});
  // Состояние карточек
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletedCardId, setIsDeletedCardId] = useState('');

  const [userEmail, setUserEmail] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [isRegistrationSuccessful, setIsRegistrationSuccessful] = useState(false);

  const navigate = useNavigate();


  //Функция сброса стейта
  const closeModalWindows = useCallback(() => {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    setDeletePopupOpen(false);
    setIsInfoToolTipPopupOpen(false);
  }, []);

  const isOpen = isEditProfilePopupOpen || isEditAvatarPopupOpen || isAddPlacePopupOpen || isImagePopupOpen || isDeletePopupOpen || isInfoToolTipPopupOpen;

  //Хук для закрытия попапов по Esc
  useEffect(() => {
    const handleEsc = (evt) => {
      if (evt.keyCode === 27) {
        closeModalWindows()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEsc)

      return () => {
        window.removeEventListener('keydown', handleEsc)
      }
    }
  }, [closeModalWindows, isOpen])

  //Стартовый запрос на серевер
  useEffect(() => {
    setIsLoading(true)
    if (loggedIn) {
      Promise.all([api.getMyInfo(), api.getInitialCards()])
        .then(([user, cards]) => {
          setCurrentUser(user);
          setCards(cards);
          setIsLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);

  useEffect(() => {
    if (localStorage.jwt) {
      getUserData(localStorage.jwt)
        .then(res => {
          setUserEmail(res.data.email)
          setLoggedIn(true)
          navigate('/')
        })
        .catch(err => console.error(`Ошибка авторизации ${err}`))
    } else {
      setLoggedIn(false)
    }
  }, [navigate])

  //Функция изменения состояния для Попап редактировать профиль
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  //Функция изменения состояния для Попап редактировать аватар
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  //Функция изменения состояния для Попап добавить картинку
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  //Функция изменения состояния для Попап открыть картинку
  function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }

  //Функция изменения состояния для Попап удаления картинки
  function handleCardDelete(cardId) {
    setDeletePopupOpen(true);
    setIsDeletedCardId(cardId)
  }


  //Функция обработки запроса лайк и дизлайк
  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    if (isLiked) {
      api
        .deleteLike(card._id)
        .then((res) => {
          setCards((state) => state.map((c) => (c._id === card._id ? res : c)));
        })
        .catch((err) => console.error(err));
    } else {
      api
        .addLike(card._id)
        .then((res) => {
          setCards((state) => state.map((c) => (c._id === card._id ? res : c)));
        })
        .catch((err) => console.error(err));
    }
  }




  //Запрос на сервер для удаления карточки
  function handleDeletionOnSubmit(evt) {
    evt.preventDefault()
    api.deleteCard(isDeletedCardId)
      .then(() => {
        setCards(cards.filter(card => {
          return card._id !== isDeletedCardId
        }))
        closeModalWindows()
      })
      .catch((err) => console.log(err));
  }

  //Запрос на сервер для изменения данных пользователя
  function handleUpdateUser(data) {
    api.setUserInfo(data)
      .then(res => {
        setCurrentUser(res)
        closeModalWindows()
      })
      .catch((err) => console.log(err));
  }

  //Запрос на сервер для изменения аватара
  function handleUpdateAvatar(data) {
    api.setUserAvatar(data)
      .then(res => {
        setCurrentUser(res)
        closeModalWindows()
      })
      .catch((err) => console.log(err));
  }

  //Запрос на сервер для добавления карточки
  function handleAddPlaceSubmit(data) {
    api.addСards(data)
      .then(res => {
        setCards([res, ...cards])
        closeModalWindows()
      })
  }

  function handleRegister(email, password) {
    register(email, password)
      .then((res) => {
        setIsInfoToolTipPopupOpen(true)
        setIsRegistrationSuccessful(true)
        navigate('/sign-in')
      })
      .catch((err) => {
        setIsInfoToolTipPopupOpen(true);
        setIsRegistrationSuccessful(false);
        console.error(`Ошибка при регистрации ${err}`)
      })
  }

  function handleLogin(email, password) {
    login(email, password)
      .then((res) => {
        localStorage.setItem('jwt', res.token)
        setLoggedIn(true)
        navigate('/')
      })
      .catch((err) => {
        setIsInfoToolTipPopupOpen(true);
        setIsRegistrationSuccessful(false);
        console.error(`Ошибка при авторизации ${err}`)
      })
  }

  function handleSignOut() {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    navigate('/sign-in');
  }

  function handleTokenCheck(token) {
    getUserData(token)
      .then(res => {
        setLoggedIn(res.data != null)
        setUserEmail(res.data.email)
        navigate('/')
      })
      .catch(() => console.log('error'))
  }

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header
          userEmail={userEmail}
          onSignOut={handleSignOut}
          loggedIn={loggedIn}
        />
        <Routes>
          <Route path="/" element={
            <ProtectedRoute
              element={Main}
              loggedIn={loggedIn}
              userEmail={userEmail}
              onEditProfile={handleEditProfileClick}
              onEditAvatar={handleEditAvatarClick}
              onAddPlace={handleAddPlaceClick}
              onOpenImage={handleCardClick}
              onCardDelete={handleCardDelete}
              onCardLike={handleCardLike}
              cards={cards}
              isLoading={isLoading}
            />}>
          </Route>

          <Route path='/sign-up' element={<Register
            onRegister={handleRegister}
          />} />

          <Route path='/sign-in' element={<Login
            onLogin={handleLogin}
            onTokenCheck={handleTokenCheck}
          />} />

          <Route path='*' element={<Navigate to='/' replace />} />


        </Routes>

        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeModalWindows}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeModalWindows}
          onAddPlace={handleAddPlaceSubmit}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeModalWindows}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <PopupWithForm
          name="delete"
          title="Вы уверены?"
          textButton="Да"
          isOpen={isDeletePopupOpen}
          onClose={closeModalWindows}
          onSubmit={handleDeletionOnSubmit}
        />

        <ImagePopup
          card={selectedCard}
          isOpen={isImagePopupOpen}
          onClose={closeModalWindows}
        />

        <InfoTooltip
          isOpen={isInfoToolTipPopupOpen}
          isSuccess={isRegistrationSuccessful}
          onClose={closeModalWindows}
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
