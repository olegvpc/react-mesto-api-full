import PopupWithForm from "./PopupWithForm";
import { useEffect } from "react";
import useFormAndValidation from "../hooks/useFormAndValidation";


function EditAvatarPopup ({ isOpen, isLoading, onClose, onUpdateAvatar }) {
    // const avatarRef = useRef("") // удалять пока не буду - оставлю в качестве напоминалки по использованию

    const {values, handleChange, errors, isValid, resetForm} = useFormAndValidation()

    // Очистка поля для ввода url аватара после закрытия popup
    useEffect(() => {
        // avatarRef.current.value = ''; // удалять пока не буду - оставлю в качестве напоминалки по использованию
        resetForm({avatar: ""})
    }, [isOpen, resetForm])

    function handleSubmit(event) {
        event.preventDefault();
        // console.log(avatarRef.current.value) // строка из Input
        onUpdateAvatar({
        // avatar: avatarRef.current.value, // удалять пока не буду - оставлю в качестве напоминалки по использованию
        avatar: (isValid && values["avatar-link"])
        });
    }

    return (
            <PopupWithForm
                isOpen={isOpen}
                onClose={onClose}
                name="avatar"
                title="Обновить аватар"
                disabled={!isValid}
                buttonText={isLoading ? "Сохранение..." : "Сохранить"}
                onSubmit={handleSubmit}>
                    <input
                        className="popup__input"
                        name="avatar-link"
                        id="avatar-link"
                        placeholder="Ссылка на картинку аватара"
                        type="url"
                        autoComplete="off"
                        onChange={handleChange}
                        value={values["avatar-link"] ? values["avatar-link"] : ""}
                        // ref={avatarRef} // удалять пока не буду - оставлю в качестве напоминалки по использованию
                        required
                    />
                <span className={`popup__input-error ${!isValid && 'popup__error_visible'}`}>{errors["avatar-link"]}</span>
            </PopupWithForm>
    )
}

export default EditAvatarPopup