// export const BASE_URL = 'https://auth.nomoreparties.co';
// export const BASE_URL = 'https://api.olegvpc.students.nomoredomains.icu';
export const BASE_URL = 'http://localhost:4000';

function getResponse(res) {
  // console.log(res) // {type: 'cors', url: 'http://localhost:4000/users/me', redirected: false, status: 200, ok: true,…}
  // console.log(res.json())
    if(res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка ${res.status}`);
}

export const register = (password, email) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({password, email})
  })
  .then((res) => {
    // console.log(res) // Response {type: 'cors', url: 'https://auth.nomoreparties.co/signup', redirected: false, status: 201, ok: true,
    return getResponse(res)
  })
};

export const authorize = (password, email) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({password, email})
  })
  .then((res) => {
    return getResponse(res)
  })
}

export const verifyToken = (token) => {
  // console.log(`токен из LocalStorage ${token}`)
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization" : `Bearer ${token}`
    }
  })
  .then((res) => {
    return getResponse(res)
  })
}