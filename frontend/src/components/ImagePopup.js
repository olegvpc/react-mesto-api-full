
function ImagePopup ({ card, onClose, isOpen }) {
    return (
        <div className={`popup popup_show-img ${isOpen && 'popup_opened'}`}>
          <figure className="popup__frame">
            <button aria-label="закрыть форму"
                    className="popup__btn-close transition"
                    type="button"
                    onClick={onClose}
            />
            <img alt={card?.name} className="popup__photo" src={card?.link}/>
              <p className="popup__image-title">{card?.name}</p>
          </figure>
        </div>
    )
}

export default ImagePopup
