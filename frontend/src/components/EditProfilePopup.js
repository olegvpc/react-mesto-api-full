import PopupWithForm from "./PopupWithForm";
import { useEffect, useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import useFormAndValidation from "../hooks/useFormAndValidation";

function EditProfilePopup ({ isOpen, isLoading, onClose, onUpdateUser }) {
    const {values, handleChange, errors, isValid, setValues, setIsValid} = useFormAndValidation()
    // Подписка на контекст
    const currentUser = useContext(CurrentUserContext);

    useEffect(() => {
        if(isOpen) {
            setValues({"name": currentUser.name, "about": currentUser.about})
        }
        setIsValid(false)
    }, [isOpen, currentUser.name, currentUser.about, setIsValid, setValues])

    function handleSubmit(event) {
      // Запрещаем браузеру переходить по адресу формы
      event.preventDefault();

      // Передаём значения управляемых компонентов во внешний обработчик
      onUpdateUser({
        name: (isValid && values["name"]),
        about: (isValid && values["about"]),
      });
    }

    return (
        <PopupWithForm
            isOpen={isOpen}
            onClose={onClose}
            name="profile"
            disabled={!isValid}
            title="Редактировать профиль"
            buttonText={isLoading ? "Сохранение..." : "Сохранить"}
            onSubmit={handleSubmit}>

            <input className="popup__input"
                id='popup-name'
                maxLength="20" minLength="2"
                name="name"
                type="text"
                placeholder='Введите свое имя'
                autoComplete="off"
                // Чтобы Реакт не ругался в консоли на то, что изначально в
                // инпуты в value приходит значение undefined, нужно сделать
                // вот такую проверку:
                value={values["name"] || ''}
                onChange={handleChange}
                required
            />
            <span className={`popup__input-error ${!isValid && 'popup__error_visible'}`} >{errors["name"]}</span>
            <input className="popup__input"
                id='popup-about'
                maxLength="30" minLength="2"
                name="about"
                type="text"
                placeholder='Введите описание'
                autoComplete="off"
                // Чтобы Реакт не ругался в консоли на то, что изначально в
                // инпуты в value приходит значение undefined, нужно сделать
                // вот такую проверку:
                value={values["about"] || ''}
                onChange={handleChange}
                required
            />

            <span className={`popup__input-error ${!isValid && 'popup__error_visible'}`}>{errors["about"]}</span>
        </PopupWithForm>
    )
}

export default EditProfilePopup