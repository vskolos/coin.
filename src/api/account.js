import { URL } from './config'

export default async function account(id, token) {
  const response = await fetch(`${URL}/account/${id}`, {
    headers: {
      Authorization: `Basic ${token}`,
    },
  })

  return await response.json()
}
