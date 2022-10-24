import {useEffect, useState} from "react";
import { Route, Switch, useHistory } from 'react-router-dom';
import Main from "./Main.js";
import Header from "./Header";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup.js";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import api from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import ConfirmationPopup from "./ConfirmationPopup";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import { register, authorize, verifyToken } from '../utils/auth';

function App() {
    // Стейты для popup (Принимает состояние - открыт-true/не открыт-false)
    const [currentUser, setCurrentUser] = useState({})
    const [cards, setCards] = useState([])
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
    const [isConfirmDeletePopupOpen, setIsConfirmDeletePopupOpen] = useState(false)
    // Стейт для просмотра выбранной карточки
    const [selectedCard, setSelectedCard] = useState({})
    // украшение - изменение визуализации при процессе загрузки API
    const [isLoading, setIsLoading] = useState(false)
    // state авторизации пользователя (вошел в систему или нет)
    const [loggedIn, setLoggedIn] = useState(false);
    // state состояния открытия поп-апа с оповещением при авторизации
    const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
    // state сообщения об успешной/неудачной авторизации
    const [isCreatedUser, setIsCreatedUser] = useState(false);
    // state получения почты пользователя, для отображения в хедере
    const [userEmailOnHeader, setUserEmailOnHeader] = useState('');
    const history = useHistory();
    // ------- закрытие всех popup при Esc или клике на popup---------
    const isOpen = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || isImagePopupOpen || isConfirmDeletePopupOpen || isInfoTooltipOpen

    useEffect(() => {
        function closeByEscapeOrOutPopup(evt) {
            if(evt.key === 'Escape' || evt.target.classList.contains("popup")) {
                closeAllPopups();
            }
        }
        if(isOpen) {
            document.addEventListener('keydown', closeByEscapeOrOutPopup);
            document.addEventListener("mousedown", closeByEscapeOrOutPopup);
            return () => {
                document.removeEventListener('keydown', closeByEscapeOrOutPopup);
                document.addEventListener("mousedown", closeByEscapeOrOutPopup)
            }
        }
    }, [isOpen])

    // проверка наличия токена юзера в localStorage - если есть, то провести аутентификация юзера
    useEffect(() => {
        // console.count("RENDER - TOKEN") // пустой массив зависимостей - Render только при монтировании
        checkToken();
    }, [])

    // если пользователь авторизован, загрузить его данные и корточки с сервера
    useEffect(() => {
        if (loggedIn) {
            Promise.all([api.getUserInfo(), api.getInitialCards()])
                .then(([userData, cardsData]) => {
                    setCurrentUser(userData);
                    setCards(cardsData);
                })
                .catch((err) => {
                    console.log(`ошибка получения данных по API при первичном обращении за карточками и юзером ${err}`);
                })
        }

    }, [loggedIn])

    function handleCardLike(card) {
        // Снова проверяем, есть ли уже лайк на этой карточке
      // console.log(card.likes)
        const isLiked = card.likes.some(item => item === currentUser._id);

        // Отправляем запрос в API и получаем обновлённые данные карточки
        api.changeLikeCardStatus(card._id, !isLiked)
            .then(responsedCard => {
                // Формируем новый массив на основе имеющегося, подставляя в него новую карточку с сервера
                // записываем новое состояние карты в State и обновляем / рендерим ВСЕ КАРТОЧКИ
                setCards((prev) => prev.map((item) => item._id === card._id ? responsedCard : item));
            })
            .catch((err) => {
              console.log(`ошибка получения данных по API при Лайке ${err}`);
            });
    }

    function handleCardDelete(card) {
        // Отправляем запрос в API на удаление и получаем подтверждение удаления
        api.deleteCard(selectedCard._id,)
            .then(responseDelete => {
                // console.log(responseDelete.message) // Пост удалён
                // Формируем новый массив на основе имеющегося, не перенося в него удаленную карточку
                // записываем новое состояние карт в State и обновляем / рендерим ВСЕ КАРТОЧКИ
                setCards((prev) => prev.filter((item) => item._id !== card._id));
                closeAllPopups()
            })
          .catch((err) => {
              console.log(`ошибка получения данных по API при удалении ${err}`);
            });
    }

    function handleUpdateUser(newUserData) {
      // console.log(newUserData) // {name: 'Ivanov', about: 'Prog', avatar: 'https://im.o.jpg', _id: '94241e..', cohort: 'cohort-'}
      setIsLoading(true)
      api.setUserInfo(newUserData)
        .then(responseUserData => {
            // console.log(response)
            // Записываем новые данные юзера в State и обновляем страницу
            setCurrentUser(responseUserData)
            closeAllPopups()
        })
        .catch((err) => {
            console.log(`ошибка получения данных по API при изменении юзера ${err}`);
        })
        .finally(() => setIsLoading(false))
    }

    function handleUpdateAvatar(newLinkAvatar) {
        setIsLoading(true)
        // console.log(newLinkAvatar) // получаем объект {avatar: 'https://homediye.jpg'}
        api.updateUserAvatar(newLinkAvatar)
            .then(responseUserData => {
                // console.log(response) // ответ с сервера - полный объект с данными юзера
                setCurrentUser(responseUserData)
                closeAllPopups()
            })
          .catch((err) => {
              console.log(`ошибка получения данных по API при апдейте аватара ${err}`);
            })
            .finally(() => setIsLoading(false))
    }

    function handleAddPlaceSubmit (data)  {
        setIsLoading(true)
        api.addUserCard(data)
            .then((card) => {
            setCards(cards => ([card, ...cards])) // новая карта в начало списка (до первой перезагрузки)
            closeAllPopups()
            })
        .catch((err)=>{
        console.log(`Ошибка при создании новой карточки: ${err}`)
        })
        .finally(() => setIsLoading(false))
    }

    function handleEditProfileClick () {
        setIsEditProfilePopupOpen(true)
    }

    function handleEditAvatarClick () {
        setIsEditAvatarPopupOpen(true)
    }

    function handleAddPlaceClick () {
        setIsAddPlacePopupOpen(true)
    }

    function handleCardClick (card) {
        setSelectedCard(card)
        setIsImagePopupOpen(true)
    }
    // ----------дополнительное задание - подтверждение удаления
    function handleDeleteClick (card) {
        setIsConfirmDeletePopupOpen(true)
        setSelectedCard(card)
    }
    // ----------дополнительное задание - подтверждение удаления

    function closeAllPopups () {
      setIsEditProfilePopupOpen(false);
      setIsAddPlacePopupOpen(false);
      setIsEditAvatarPopupOpen(false);
      setIsImagePopupOpen(false);
      setIsConfirmDeletePopupOpen(false);
      setIsInfoTooltipOpen(false)
      // setSelectedCard({}); // пока не разобрался - но при убирании popup картинка исчезает быстрее креста popupa
    }

    function onSignOut() {
        localStorage.removeItem('jwt');
        setLoggedIn(false);
        history.push('/sign-in');

    }
    function onRegister(email, password) {
        register(password, email)
          .then((res) => {
            setIsInfoTooltipOpen(true);
            if(res) {
              // console.log(res) // data: {_id: "630db9486390a400146977fa", email: "ol-3@ya.ru"}
              setIsCreatedUser(true);
              history.push('/sign-in');
            }
          })
          .catch(() => {
            setIsInfoTooltipOpen(true);
            setIsCreatedUser(false);
          });
    }
  function onLogin(email, password) {
    authorize(password, email)
      .then((res) => {
        if(res) {
          console.log(res) // {jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M…wMjV9.9pPYi85hDTK9YjUAKDzJysGnSO1LAzQp8Vsql244vr4'}
          setLoggedIn(true);
          setUserEmailOnHeader(email);
          history.push('/');
          localStorage.setItem('jwt', res.jwt);
        }
      })
      .catch(() => {
        setIsInfoTooltipOpen(true);
        setIsCreatedUser(false);
      });
  }

  function checkToken() {
    const token = localStorage.getItem('jwt');
    if(token) {
      verifyToken(token)
      .then((res) => {
        if(res) {
          // console.log(res)
          setUserEmailOnHeader(res.email)
        };
        setLoggedIn(true);
        history.push('/');
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
          <div className="page__content">
            <Header
              userEmailOnHeader={userEmailOnHeader}
              onSignOut={onSignOut}
              loggedIn={loggedIn}
            />
            <Switch>
              <ProtectedRoute
                onEditProfile={handleEditProfileClick}
                onEditAvatar={handleEditAvatarClick}
                onAddPlace={handleAddPlaceClick}
                onCardClick={handleCardClick}
                onConfirm={handleDeleteClick}
                cards={cards}
                onCardLike={handleCardLike}
                component={Main}
                exact path="/"
                loggedIn={loggedIn}

              />
              <Route path="/sign-in">
                <Login
                  onLogin={onLogin}
                />
              </Route>
              <Route path="/sign-up">
                <Register
                  onRegister={onRegister}
                />
              </Route>
            </Switch>
            <ProtectedRoute
                component={Footer}
                exact path="/"
                loggedIn={loggedIn}
              />
            <EditProfilePopup
                isOpen={isEditProfilePopupOpen}
                onClose={closeAllPopups}
                onUpdateUser={handleUpdateUser}
                isLoading={isLoading} />
            <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onClose={closeAllPopups}
                onAddPlace={handleAddPlaceSubmit}
                isLoading={isLoading} />
            <EditAvatarPopup
                isOpen={isEditAvatarPopupOpen}
                onClose={closeAllPopups}
                onUpdateAvatar={handleUpdateAvatar}
                isLoading={isLoading} />
            <ImagePopup
                card={selectedCard}
                onClose={closeAllPopups}
                isOpen={isImagePopupOpen}/>
            <ConfirmationPopup
                isOpen={isConfirmDeletePopupOpen}
                onClose={closeAllPopups}
                card={selectedCard}
                onCardDelete={handleCardDelete}/>
            <InfoTooltip
                isOpen={isInfoTooltipOpen}
                onClose={closeAllPopups}
                isCreatedUser={isCreatedUser}
            />

          </div>
          {/*Конец блока container*/}
        </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
