import { HOST } from './config'

// Запрос авторизации пользователя
export default async function login(login, password) {
  const data = { login: login, password: password }
  const response = await fetch(`http://${HOST}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return await response.json()
}
