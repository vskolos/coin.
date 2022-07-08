import { HOST } from './config'

export default async function allCurrencies() {
  const response = await fetch(`http://${HOST}/all-currencies`)

  return await response.json()
}
