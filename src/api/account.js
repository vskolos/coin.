import { URL } from './config.js'

export default async function account(id, token) {
  const response = await fetch(`${URL}/account/${id}`, {
    headers: {
      Authorization: `Basic ${token}`,
    },
  })

  return await response.json()
}
