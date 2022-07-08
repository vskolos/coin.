import { HOST } from './config'

export default async function currencies(token) {
  const response = await fetch(`http://${HOST}/currencies`, {
    headers: {
      Authorization: `Basic ${token}`,
    },
  })

  return await response.json()
}
