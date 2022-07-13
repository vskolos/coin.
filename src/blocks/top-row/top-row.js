import { el } from 'redom'
import createPrimaryButton from '../button/--primary/button--primary'
import './top-row.scss'

// elements = [ 'title', 'filter', 'button', 'account', 'balance' ]
// data = { title, filter, button, account, balance }
//   filter = { option1, option2, ... }
//     optionN = { text, value }
//   button = { text, icon, handler }
export default function createTopRow(elements, data) {
  const row = el('.top-row')
  const title = el('h1.top-row__title', data.title)
  const select = el('select.top-row__select.js-sort')
  let button
  const account = el('.top-row__account')
  const balance = el('.top-row__balance')
  const balanceTitle = el('span.top-row__balance-title', 'Баланс')
  const balanceAmount = el('span.top-row__balance-amount')

  if (data.filter) {
    data.filter.forEach((option) => {
      select.append(
        el('option.top-row__option', option.text, { value: option.value })
      )
    })
  }

  if (data.button) {
    button = createPrimaryButton(data.button)
  }

  if (data.account) {
    account.textContent = `№ ${data.account}`
  } else {
    account.classList.add('top-row__account--skeleton')
  }

  if (data.balance) {
    balanceAmount.textContent = `${data.balance
      .toLocaleString('ru-RU')
      .replace(',', '.')}`
  } else {
    balanceAmount.classList.add('top-row__balance-amount--skeleton')
  }

  balance.append(balanceTitle, balanceAmount)
  if (elements.includes('title')) row.append(title)
  if (elements.includes('filter')) row.append(select)
  if (elements.includes('button')) row.append(button)
  if (elements.includes('account')) row.append(account)
  if (elements.includes('balance')) row.append(balance)

  return row
}
