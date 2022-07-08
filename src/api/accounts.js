import { HOST } from './config'

export default async function accounts(token) {
  const response = await fetch(`http://${HOST}/accounts`, {
    headers: {
      Authorization: `Basic ${token}`,
    },
  })

  return await response.json()
}
