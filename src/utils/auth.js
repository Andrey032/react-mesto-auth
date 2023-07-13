export const BASE_URL = "https://auth.nomoreparties.co";

export function register(email, password) {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      email: email,
      password: password,
      })
  })
  .then(res => handleResponse(res))
}

export function login(email, password) {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password,
    })      
  })
  .then(res => handleResponse(res))
}

export function getUserData(token) {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
    .then(res => handleResponse(res))
};

function handleResponse(res) {
  return res.ok ? res.json() : Promise.reject(`${res.status} ${res.statusText}`)
}
