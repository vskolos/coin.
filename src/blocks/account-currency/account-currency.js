import { el } from 'redom'
import './account-currency.scss'
import currencies from '../../api/currencies'
import handleError from '../../utilities/handle-error'

// currencies = [ currency1, currency2, ... ]
//   currencyN = { code, amount }
export default class AccountCurrency {
  constructor({ token = localStorage.token, onInit }) {
    this.onInit = onInit
    this.token = token
    this.element = el('.account-currency')
    const title = el('p.account-currency__title', 'Ваши валюты')
    this.list = el('ul.account-currency__list')

    this.element.append(title, this.list)

    for (let i = 0; i < 6; i++) {
      this.add()
    }

    this.fetch()
  }

  fetch() {
    currencies(this.token)
      .then((response) => {
        if (response.error) {
          throw new Error(response.error)
        }
        return response.payload
      })
      .then((currencies) => {
        this.list.innerHTML = ''
        Object.keys(currencies).forEach((key) => {
          this.add(currencies[key])
        })
      })
      .then(() => this.onInit())
      .catch((error) => handleError(error))
  }

  add(currency) {
    const li = el('li.account-currency__item')
    const code = el('span.account-currency__code')
    const amount = el('span.account-currency__amount')

    if (currency) {
      code.textContent = currency.code
      amount.textContent = currency.amount
        .toLocaleString('ru-RU')
        .replace(',', '.')
    } else {
      code.classList.add('account-currency__code--skeleton')
      amount.classList.add('account-currency__amount--skeleton')
    }

    li.append(code, amount)
    this.list.append(li)
  }
}
