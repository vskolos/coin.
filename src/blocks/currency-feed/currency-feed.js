import { el } from 'redom'
import './currency-feed.scss'
import currencyFeed from '../../api/currency-feed'
import handleError from '../../utilities/handle-error'

export default class CurrencyFeed {
  constructor(rows) {
    this.rows = rows

    const div = el('.currency-feed')
    const title = el(
      'p.currency-feed__title',
      'Изменение курсов в реальном времени'
    )
    const ul = el('ul.currency-feed__list')

    this.element = div
    this.list = ul

    div.append(title, ul)

    if (localStorage.currencyFeed) {
      const data = JSON.parse(localStorage.currencyFeed)
      localStorage.currencyFeed = '[]'
      data.forEach((entry) => this.add(entry))
    } else {
      localStorage.currencyFeed = '[]'
    }

    currencyFeed()
      .then(
        (socket) =>
          (socket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            if (data.type === 'EXCHANGE_RATE_CHANGE') {
              this.add(data)
            }
          })
      )
      .catch((error) => handleError(error))
  }

  add(data) {
    const li = el('li.currency-feed__item')
    const code = el('span.currency-feed__code', `${data.from}/${data.to}`)
    const rate = el(
      'span.currency-feed__rate',
      data.rate
        .toLocaleString('ru-RU', { maximumFractionDigits: 10 })
        .replace(',', '.')
    )
    if (data.change === 1) {
      code.classList.add('currency-feed__code--positive')
      rate.classList.add('currency-feed__rate--positive')
    } else if (data.change === -1) {
      code.classList.add('currency-feed__code--negative')
      rate.classList.add('currency-feed__rate--negative')
    }
    while (this.list.childNodes.length >= this.rows) {
      this.list.lastChild.remove()
    }
    li.append(code, rate)
    this.list.prepend(li)

    const localStorageData = JSON.parse(localStorage.currencyFeed)
    while (localStorageData.length >= this.rows) {
      localStorageData.pop()
    }
    localStorageData.push(data)
    localStorage.setItem('currencyFeed', JSON.stringify(localStorageData))
  }
}
