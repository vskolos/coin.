import { URL } from './config'

export default async function login(login, password) {
  const data = { login: login, password: password }
  const response = await fetch(`${URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return await response.json()
}
