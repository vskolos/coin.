import { HOST } from './config'

// Запрос на перевод средств со счёта на счёт
export default async function transferFunds(data, token) {
  const response = await fetch(`http://${HOST}/transfer-funds`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return await response.json()
}
