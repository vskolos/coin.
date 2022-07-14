import { HOST } from './config'

// Запрос на создание счёта
export default async function createAccount(token) {
  const response = await fetch(`http://${HOST}/create-account`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${token}`,
    },
  })

  return await response.json()
}
