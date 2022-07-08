import { HOST } from './config'

export default async function currencyFeed() {
  return new WebSocket(`ws://${HOST}/currency-feed`)
}
