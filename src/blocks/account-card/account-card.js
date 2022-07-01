import { el } from 'redom'
import './account-card.scss'
import createPrimaryButton from '../button/--primary/button--primary.js'
import reload from '../../utilities/reload'

// account = { account, balance, mine, transactions }
// transactions = [ transaction1, transaction2, ... ]
// transactionN = { amount, date, from, to }
export default function createAccountCard(account) {
  const card = el('.account-card')
  const id = el('.account-card__id', account.account)
  const balance = el('.account-card__balance', `${account.balance} ₽`)

  const lastTransaction = el('.account-card__transaction')
  const lastTransactionTitle = el(
    'span.account-card__transaction-title',
    'Последняя транзакция:'
  )
  const lastTransactionDate = account.transactions.length
    ? el(
        'span.account-card__transaction-date',
        `${new Date(account.transactions[0].date).toLocaleString('ru-RU', {
          month: 'long',
          year: 'numeric',
          day: 'numeric',
        })}`
      )
    : el('.span.account-card__transaction-date', '–')
  lastTransaction.append(lastTransactionTitle, lastTransactionDate)

  const button = createPrimaryButton({ text: 'Открыть' })

  button.addEventListener('click', () =>
    reload(`?page=account&account=${account.account}`)
  )

  card.append(id, balance, lastTransaction, button)

  return card
}
