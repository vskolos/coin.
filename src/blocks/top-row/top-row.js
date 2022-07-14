import { el } from 'redom'
import createPrimaryButton from '../button/--primary/button--primary'
import './top-row.scss'

// Создание верхнего блока сайта
export default function createTopRow(elements, data) {
  const row = el('.top-row')
  const title = el('h1.top-row__title', data.title)
  const select = el('select.top-row__select.js-sort')
  let button
  const account = el('.top-row__account')
  const balance = el('.top-row__balance')
  const balanceTitle = el('span.top-row__balance-title', 'Баланс')
  const balanceAmount = el('span.top-row__balance-amount')

  if (data.sort) {
    // Если передали параметры сортировки, добавляем её
    data.sort.forEach((option) => {
      select.append(
        el('option.top-row__option', option.text, { value: option.value })
      )
    })
  }

  if (data.button) {
    // Если передали кнопку, добавляем её
    button = createPrimaryButton(data.button)
  }

  if (data.account) {
    // Если передали номер счёта, добавляем его
    account.textContent = `№ ${data.account}`
  } else {
    // Иначе добавляем класс для визуализации загрузки
    account.classList.add('top-row__account--skeleton')
  }

  if (data.balance || data.balance === 0) {
    // Если передали баланс счёта, добавляем его
    balanceAmount.textContent = `${data.balance
      // Приводим число в формат 1 000 000.00
      .toLocaleString('ru-RU')
      .replace(',', '.')}`
  } else {
    // Иначе добавляем класс для визуализации загрузки
    balanceAmount.classList.add('top-row__balance-amount--skeleton')
  }

  balance.append(balanceTitle, balanceAmount)

  // Добавляем в DOM элементы, которые необходимо отобразить
  if (elements.includes('title')) row.append(title)
  if (elements.includes('sort')) row.append(select)
  if (elements.includes('button')) row.append(button)
  if (elements.includes('account')) row.append(account)
  if (elements.includes('balance')) row.append(balance)

  return row
}
