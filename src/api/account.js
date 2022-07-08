import { HOST } from './config'

export default async function account(id, token) {
  const response = await fetch(`http://${HOST}/account/${id}`, {
    headers: {
      Authorization: `Basic ${token}`,
    },
  })

  return await response.json()
}
