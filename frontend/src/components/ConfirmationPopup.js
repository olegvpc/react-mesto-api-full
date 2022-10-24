import PopupWithForm from "./PopupWithForm";

function ConfirmationPopup ({ isOpen, onClose, card, onCardDelete }) {

    function handleSubmit (event) {
        event.preventDefault();

        onCardDelete(card)
    }
    return (
        // <></>
        <PopupWithForm
            isOpen={isOpen}
            onClose={onClose}
            disabled={false}
            name="confirm"
            title="Вы уверены?"
            buttonText="Да"
            onSubmit={handleSubmit}
        />
    )
}

export default ConfirmationPopup