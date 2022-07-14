import { HOST } from './config'

// Запрос списка всех валют
export default async function allCurrencies() {
  const response = await fetch(`http://${HOST}/all-currencies`)

  return await response.json()
}
