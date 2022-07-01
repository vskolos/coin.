import { URL } from './config.js'

export default async function accounts(token) {
  const response = await fetch(`${URL}/accounts`, {
    headers: {
      Authorization: `Basic ${token}`,
    },
  })

  return await response.json()
}
