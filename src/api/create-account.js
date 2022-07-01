import { URL } from './config.js'

export default async function createAccount(token) {
  const response = await fetch(`${URL}/create-account`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${token}`,
    },
  })

  return await response.json()
}
