import { el } from 'redom'
import './currency-feed.scss'
import currencyFeed from '../../api/currency-feed'
import handleError from '../../utilities/handle-error'

export default class CurrencyFeed {
  constructor() {
    try {
      this.feed = JSON.parse(localStorage.currencyFeed)
      if (!this.feed) {
        throw new Error()
      }
    } catch {
      localStorage.currencyFeed = '[]'
      this.feed = []
    }
    this.rows = 12

    this.element = el('.currency-feed')
    const title = el(
      'p.currency-feed__title',
      'Изменение курсов в реальном времени'
    )
    this.list = el('ul.currency-feed__list')
    this.element.append(title, this.list)

    this.load()

    currencyFeed()
      .then(
        (socket) =>
          (socket.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data)
              if (data.type === 'EXCHANGE_RATE_CHANGE') {
                this.add(data)
                this.feed.push(data)
                localStorage.currencyFeed = JSON.stringify(
                  this.feed.slice(-100)
                )
              }
            } catch (error) {
              throw new Error(error)
            }
          })
      )
      .catch((error) => handleError(error))
  }

  load() {
    if (this.feed) {
      this.list.innerHTML = ''
      this.feed.slice(-this.rows).forEach((entry) => this.add(entry))
    }
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
    while (this.list.childElementCount >= this.rows) {
      this.list.lastChild.remove()
    }
    li.append(code, rate)
    this.list.prepend(li)
  }
}
