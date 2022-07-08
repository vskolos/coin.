import { el } from 'redom'
import './account-currency.scss'
import currencies from '../../api/currencies'

export default class AccountCurrency {
  constructor(currencies, token = localStorage.token) {
    const div = el('.account-currency')
    const title = el('p.account-currency__title', 'Ваши валюты')
    const ul = el('ul.account-currency__list')

    this.element = div
    this.list = ul
    this.token = token

    div.append(title, ul)

    Object.keys(currencies).forEach((key) => this.add(currencies[key]))
  }

  static async create(token = localStorage.token) {
    const response = await currencies(token)
    const data = response.payload
    return new AccountCurrency(data, token)
  }

  async fetchCurrencies() {
    const response = await currencies(this.token)
    const data = response.payload
    return data
  }

  async reload() {
    const currencies = await this.fetchCurrencies()
    this.list.innerHTML = ''
    Object.keys(currencies).forEach((key) => this.add(currencies[key]))
  }

  add(currency) {
    const li = el('li.account-currency__item')
    const code = el('span.account-currency__code', currency.code)
    const amount = el(
      'span.account-currency__amount',
      currency.amount.toLocaleString('ru-RU').replace(',', '.')
    )
    li.append(code, amount)
    this.list.append(li)
  }
}
