import { el } from 'redom'
import './money-transfer-history.scss'

// account = { account, balance, mine, transactions }
// transactions = [ transaction1, transaction2, ... ]
// transactionN = { amount, date, from, to }
export default function createMoneyTransferHistory(account, count) {
  const transactions = account.transactions

  const div = el('.money-transfer-history')
  const title = el('p.money-transfer-history__title', 'История переводов')
  const table = el('.money-transfer-history__table')
  const header = el('.money-transfer-history__header')

  const headerFrom = el(
    '.money-transfer-history__header-text',
    'Счёт отправителя'
  )
  const headerTo = el('.money-transfer-history__header-text', 'Счёт получателя')
  const headerAmount = el('.money-transfer-history__header-text', 'Сумма')
  const headerDate = el('.money-transfer-history__header-text', 'Дата')

  header.append(headerFrom, headerTo, headerAmount, headerDate)
  table.append(header)

  transactions
    .slice(-count)
    .reverse()
    .forEach((transaction) => {
      const row = el('.money-transfer-history__row')
      const colFrom = el('.money-transfer-history__row-text', transaction.from)
      const colTo = el('.money-transfer-history__row-text', transaction.to)
      const colAmount = el(
        '.money-transfer-history__row-text',
        transaction.amount
      )

      if (transaction.to === account.account) {
        colAmount.classList.add('money-transfer-history__row-text--income')
      } else {
        colAmount.classList.add('money-transfer-history__row-text--outcome')
      }

      const colDate = el(
        '.money-transfer-history__row-text',
        new Date(transaction.date).toLocaleString('ru-RU', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })
      )

      row.append(colFrom, colTo, colAmount, colDate)
      table.append(row)
    })

  div.append(title, table)
  return div
}
