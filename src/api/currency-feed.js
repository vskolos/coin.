import { HOST } from './config'

// Запрос соединения через веб-сокет для получения данных по курсам валют
export default async function currencyFeed() {
  return new WebSocket(`ws://${HOST}/currency-feed`)
}
