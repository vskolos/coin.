import { HOST } from './config'

// Запрос на список валют счёта
export default async function currencies(token) {
  const response = await fetch(`http://${HOST}/currencies`, {
    headers: {
      Authorization: `Basic ${token}`,
    },
  })

  return await response.json()
}
