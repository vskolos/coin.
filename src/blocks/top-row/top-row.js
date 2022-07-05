import { el } from 'redom'
import createPrimaryButton from '../button/--primary/button--primary'
import './top-row.scss'

// data = { title, filter, button, account, balance }
// filter = { placeholder, options }
// button = { text, icon }
export default function createTopRow(data) {
  const row = el('.top-row')

  const title = el('h1.top-row__title', data.title)
  row.append(title)

  if (data.filter) {
    const select = el('select.top-row__select.js-choices')

    if (data.filter.placeholder) {
      select.append(
        el('option.top-row__option', data.filter.placeholder, { value: '' })
      )
    }

    data.filter.options.forEach((option) => {
      select.append(el('option.top-row__option', option))
    })

    row.append(select)
  }

  if (data.button) {
    row.append(
      createPrimaryButton({ text: data.button.text, icon: data.button.icon })
    )
  }

  if (data.account) {
    row.append(el('.top-row__account', `№ ${data.account}`))
  }

  if (data.balance) {
    row.append(
      el(
        '.top-row__balance',
        el('span.top-row__balance-title', 'Баланс'),
        el(
          'span.top-row__balance-amount',
          `${data.balance.toLocaleString('ru-RU')}`
        )
      )
    )
  }

  return row
}
