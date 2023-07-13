import React from 'react';
import successfully from '../../images/successfully.svg';
import unsuccessfully from '../../images/unsuccessfully.svg';

export default function InfoTooltip({ isOpen, isSuccess, onClose }) {
  return (
    <div
      className={`popup popup_type_auth ${isOpen ? "popup_opened" : ''}`}
      onClick={onClose}
    >
      <div
        className="popup__container"
        onClick={(evt) => evt.stopPropagation()}
      >
        <button
          className="popup__close-button popup__close"
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
        />
        <div className='popup__result-auth'>
          <img src={isSuccess ? successfully : unsuccessfully} alt={isSuccess ? 'Успешный вход' : 'ошибка входа'} className="popup__auth-image" />

          <h2
            className='popup__title popup__title_type_success'
          >{isSuccess ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}
          </h2>
        </div>

      </div>
    </div>

  )
}