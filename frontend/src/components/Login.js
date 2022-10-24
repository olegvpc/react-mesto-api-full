import { useState} from 'react';


function Login({onLogin}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleEmailChange(evt) {
    setEmail(evt.target.value);
  }

  function handlePasswordChange(evt) {
    setPassword(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onLogin(email, password);
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
        <h3 className="login-form__title">Вход</h3>
        <input className="login-form__input" placeholder="Email"
            type="email" onChange={handleEmailChange} value={email} required />
        <input className="login-form__input" placeholder="Пароль"
            type="password" onChange={handlePasswordChange} value={password} required />
        <button className="login-form__button" type="submit">Войти</button>
    </form>
  )
}

export default Login;