import { el } from 'redom'
import './money-transfer-history.scss'

// account = { account, balance, mine, transactions }
//   transactions = [ transaction1, transaction2, ... ]
//     transactionN = { amount, date, from, to }
export default class MoneyTransferHistory {
  constructor(account, count) {
    this.element = el('.money-transfer-history')
    const title = el('p.money-transfer-history__title', 'История переводов')
    this.table = el('.money-transfer-history__table')
    const header = el('.money-transfer-history__header')

    const headerFrom = el(
      '.money-transfer-history__header-text',
      'Счёт отправителя'
    )
    const headerTo = el(
      '.money-transfer-history__header-text',
      'Счёт получателя'
    )
    const headerAmount = el('.money-transfer-history__header-text', 'Сумма')
    const headerDate = el('.money-transfer-history__header-text', 'Дата')

    header.append(headerFrom, headerTo, headerAmount, headerDate)
    this.table.append(header)
    this.element.append(title, this.table)

    if (account) {
      this.account = account
      const transactions = account.transactions

      if (transactions) {
        transactions
          .slice(-count)
          .reverse()
          .forEach((transaction) => this.add(transaction))
      }
    } else {
      for (let i = 0; i < 6; i++) {
        this.add()
      }
    }
  }

  add(transaction) {
    const row = el('.money-transfer-history__row')
    const colFrom = el('.money-transfer-history__row-text')
    const colTo = el('.money-transfer-history__row-text')
    const colAmount = el('.money-transfer-history__row-text')
    const colDate = el('.money-transfer-history__row-text')

    if (transaction) {
      colFrom.textContent = transaction.from
      colTo.textContent = transaction.to
      colAmount.textContent = transaction.amount
        .toLocaleString('ru-RU')
        .replace(',', '.')
      colDate.textContent = new Date(transaction.date).toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      })

      if (transaction.to === this.account.account) {
        colAmount.classList.add('money-transfer-history__row-text--income')
      } else {
        colAmount.classList.add('money-transfer-history__row-text--outcome')
      }
    } else {
      colFrom.append(el('.money-transfer-history__row-text-skeleton'))
      colTo.append(el('.money-transfer-history__row-text-skeleton'))
      colAmount.append(el('.money-transfer-history__row-text-skeleton'))
      colDate.append(el('.money-transfer-history__row-text-skeleton'))
    }

    row.append(colFrom, colTo, colAmount, colDate)
    this.table.append(row)
  }
}
