import { Link } from 'react-router-dom';
import useFormValidation from '../../utils/useFormValidation';

export default function Register({ onRegister }) {
  const { handleChange, values, errors } = useFormValidation();

  function handleSubmit(evt) {
    evt.preventDefault()
    onRegister(values.email, values.password)
  }

  return (
    <div className="popup__container popup__container_type_auth">
      <h2 className="popup__title popup__title_type_auth">Регистрация</h2>
      <form className="popup__form " onSubmit={handleSubmit}>
        <input
          className='popup__name popup__name_type_auth'
          id="email"
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
          value={values.email ? values.email : ''}
        />
        <span className="popup__error">{errors.email}</span>
        <input
          className='popup__name popup__name_type_auth'
          id="password"
          type="password"
          name="password"
          placeholder="Пароль"
          minLength={3}
          maxLength={30}
          required
          onChange={handleChange}
          value={values.password ? values.password : ''}
        />
        <span className="popup__error">{errors.password}</span>
        <button
          className='popup__button popup__button_type_auth'
          type="submit"
          aria-label="Зарегистрироваться"
        >Зарегистрироваться</button>
      </form>
      <p className='popup__subtitle'>Уже зарегистрированы?<Link to="/sign-in" className='popup__link'> Войти</Link></p>
    </div >
  )
}