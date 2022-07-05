import { URL } from './config'

// data = { from, to, amount }
export default async function transferFunds(data, token) {
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
