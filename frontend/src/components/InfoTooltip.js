import React from 'react';
import successIcon from '../images/success-icon.svg';
import failIcon from '../images/fail-icon.svg';

function InfoTooltip({ isOpen, onClose, isCreatedUser }) {

  return (
    <div className={`popup ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container">
        <img className="popup__image-status" alt="Картинка статуса успешности" src={isCreatedUser ? successIcon : failIcon} />
        <p className="popup__info-text">
          {isCreatedUser ? "Вы успешно зарегистрировались!" : "Что-то пошло не так! Попробуйте ещё раз."}
        </p>
        <button type="button" className="popup__btn-close transition" onClick={onClose} />
      </div>
    </div>
  )
}

export default InfoTooltip;