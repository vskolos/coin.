import { URL } from './config'

export default async function transferFunds(from, to, amount, token) {
  const data = { from: from, to: to, amount: amount }
  const response = await fetch(`${URL}/transfer-funds`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return await response.json()
}
