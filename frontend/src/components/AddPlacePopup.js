import PopupWithForm from "./PopupWithForm";
import { useEffect } from "react";
import useFormAndValidation from "../hooks/useFormAndValidation";

function AddPlacePopup ({ isOpen, isLoading, onClose, onAddPlace }) {
    const {values, handleChange, errors, isValid, resetForm} = useFormAndValidation()

    // эффект для очитки формы про иткрытии popup
    useEffect(() => {
        resetForm({name: "", link: ""})
    }, [isOpen, resetForm])

    function handleSubmit (event) {
        event.preventDefault();
        onAddPlace({
            name: (isValid && values["name"]),
            link: (isValid && values["link"])
        })
    }

    return (
        <PopupWithForm
            isOpen={isOpen}
            onClose={onClose}
            name="add-photo"
            title="Новое место"
            buttonText={isLoading ? "Сохранение..." : "Создать"}
            disabled={!isValid}
            onSubmit={handleSubmit}>

            <input
              className="popup__input"
              id='popup-add-name-photo'
              maxLength="30" minLength="2"
              name="name"
              type="text"
              placeholder='Название'
              autoComplete="off"
              onChange={handleChange}
              value={values["name"] ? values["name"] : ""}
              required
            />
            <span className={`popup__input-error ${!isValid && 'popup__error_visible'}`}>{errors["name"]}</span>
            <input
                className="popup__input"
                id='link'
                maxLength="200" minLength="2"
                name="link"
                type="url"
                placeholder="Ссылка на картинку"
                autoComplete="off"
                // onChange={handleCardLink}
                onChange={handleChange}
                // value={cardLink}
                value={values["link"] ? values["link"] : ""}
                required
            />
            <span className={`popup__input-error ${!isValid && 'popup__error_visible'}`} id="link-error">{errors["link"]}</span>
        </PopupWithForm>
    )
}

export default AddPlacePopup