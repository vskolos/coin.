import { el } from 'redom'
import './account-currency.scss'

export default function createAccountCurrency(data) {
  const div = el('.account-currency')
  const title = el('p.account-currency__title', 'Ваши валюты')
  const ul = el('ul.account-currency__list')

  Object.keys(data).forEach((key) => {
    const li = el(
      'li.account-currency__item',
      el('span.account-currency__code', data[key].code),
      el(
        'span.account-currency__amount',
        data[key].amount
          .toLocaleString('ru-RU', { maximumFractionDigits: 10 })
          .replace(',', '.')
      )
    )
    ul.append(li)
  })

  div.append(title, ul)
  return div
}
