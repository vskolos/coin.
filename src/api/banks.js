import { HOST } from './config'

// Запрос списка координат банков
export default async function banks() {
  const response = await fetch(`http://${HOST}/banks`)

  return await response.json()
}
