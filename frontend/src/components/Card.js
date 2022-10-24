import React, { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";


function Card ({ card, onCardClick, onCardLike, onCardDelete, onConfirm }) {
    //Подписка на контекст CurrentUserContext
    const currentUser = useContext(CurrentUserContext);

    // Определяем, являемся ли мы владельцем текущей карточки
    const isOwn = card.owner === currentUser._id;
    // console.log(card.owner, currentUser._id)

    // Создаём переменную, которую после зададим в `className` для кнопки удаления
    const cardDeleteButtonClassName = (
      `card__delete-btn transition ${isOwn ? '' : 'card__delete-btn_hidden'}`
    );
    // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
    const isLiked = card.likes.some(item => item === currentUser._id);

    // Создаём переменную, которую после зададим в `className` для кнопки лайка
    const cardLikeButtonClassName = (
        `card__like transition ${isLiked ? 'card__like_active' : ''}`
    );

    function handleClick() {
        onCardClick(card);
    }

    function handleLikeClick() {
        onCardLike(card)
    }

    function handleDelete() {
        // onCardDelete(card)
        onConfirm(card)
    }

    return (
        <li className="cards__item">
          <figure className="card">
            <button className={cardDeleteButtonClassName}
                    type="button" onClick={handleDelete}/>
            <img className="card__image"
                 onClick={handleClick}
                 src={card.link}
                 alt={`Изображение на фото ${card.name}`}/>
            <div className="card__wrapper">
              <h2 className="card__title">{card.name}</h2>
                {/*<h6>{Math.random()}</h6>   проверка рендеринга*/}
              <div className="card__like-container">
                <button className={cardLikeButtonClassName} onClick={handleLikeClick}/>
                <span className="card__like-counter">{card.likes.length}</span>
              </div>
            </div>
          </figure>
        </li>
    )
}

export default Card