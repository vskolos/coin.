import { HOST } from './config'

// Запрос на обмен валюты
export default async function currencyBuy(data, token) {
  const response = await fetch(`http://${HOST}/currency-buy`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return await response.json()
}
