import { el } from 'redom'
import './account-currency.scss'
import currencies from '../../api/currencies'

export default class AccountCurrency {
  constructor(token) {
    const div = el('.account-currency')
    const title = el('p.account-currency__title', 'Ваши валюты')
    const ul = el('ul.account-currency__list')

    this.element = div
    this.list = ul

    div.append(title, ul)

    this.init(token)
  }

  async init(token) {
    const response = await currencies(token)
    const data = response.payload

    Object.keys(data).forEach((key) => this.add(data[key]))
  }

  async reload(token) {
    this.list.innerHTML = ''
    await this.init(token)
  }

  add(data) {
    const li = el(
      'li.account-currency__item',
      el('span.account-currency__code', data.code),
      el(
        'span.account-currency__amount',
        data.amount
          .toLocaleString('ru-RU', { maximumFractionDigits: 10 })
          .replace(',', '.')
      )
    )
    this.list.append(li)
  }
}
