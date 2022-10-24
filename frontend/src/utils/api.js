class Api {
  constructor(data) {
    this._baseUrl = data.baseUrl;
    this._headers = data.headers;
  }

  // ответ с сайта - DRY
  _checkResponse(response) {
    if (response.ok) {
        return response.json();
    }
    // если ошибка отклоняем
    return Promise.reject(`Ошибка запроса API: ${response.status}`);
}

  // Получение карточек при загрузке
  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'GET',
      headers: this._headers,
    })
    .then(this._checkResponse);
  }

  // Получение данных о пользователе
  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      headers: this._headers
    })
    .then(this._checkResponse);
  }

  // Установка данных о пользователе
  setUserInfo(userData) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: userData.name,
        about: userData.about
      })
      })
      .then(this._checkResponse);
}


  // Добавление карточки пользователем
  addUserCard(data) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        link: data.link
      })
    })
    .then(this._checkResponse);
  };

  // Удаление карточки пользователем
  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: 'DELETE',
      headers: this._headers
    })
    .then(this._checkResponse);
  };

  //   Установка лайка
  changeLikeCardStatus(id, noLikes) {
    if (noLikes) {
      return fetch(`${this._baseUrl}/cards/${id}/likes`, {
        method: 'PUT',
        headers: this._headers
      })
      .then(this._checkResponse);
    } else {
        return fetch(`${this._baseUrl}/cards/${id}/likes`, {
        method: 'DELETE',
        headers: this._headers
      })
      .then(this._checkResponse)
      }
  }

    // Обновление аватара профиля
  updateUserAvatar(data) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: data.avatar
      })
    })
    .then(this._checkResponse)
  };
}

const token = localStorage.getItem('jwt');
const api = new Api({
  // baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-45',
  baseUrl: 'http://localhost:4000',
  // baseUrl: 'https://api.olegvpc.students.nomoredomains.icu',
  headers: {
    // authorization: 'c6ae09bb-60e1-4878-abd8-c5707855c0f1',
    authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

export default api