import { HOST } from './config'

export default async function banks() {
  const response = await fetch(`http://${HOST}/banks`)

  return await response.json()
}
