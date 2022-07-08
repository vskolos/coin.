import { HOST } from './config'

export default async function createAccount(token) {
  const response = await fetch(`http://${HOST}/create-account`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${token}`,
    },
  })

  return await response.json()
}
