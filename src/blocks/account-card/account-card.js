import { el } from 'redom'
import './account-card.scss'
import createPrimaryButton from '../button/--primary/button--primary'
import reload from '../../app'

// account = { account, balance, mine, transactions }
// transactions = [ transaction1, transaction2, ... ]
// transactionN = { amount, date, from, to }
export default function createAccountCard(account) {
  const card = el('.account-card')
  const id = el('.account-card__id')
  const balance = el('.account-card__balance')
  const lastTransaction = el('.account-card__transaction')
  const lastTransactionTitle = el('span.account-card__transaction-title')
  const lastTransactionDate = el('span.account-card__transaction-date')
  lastTransaction.append(lastTransactionTitle, lastTransactionDate)
  const button = createPrimaryButton({ text: 'Открыть' })

  if (account) {
    id.textContent = account.account
    balance.textContent = `${account.balance
      .toLocaleString('ru-RU')
      .replace(',', '.')} ₽`

    lastTransactionTitle.textContent = 'Последняя транзакция:'
    lastTransactionDate.textContent = account.transactions.length
      ? new Date(account.transactions[0].date).toLocaleString('ru-RU', {
          month: 'long',
          year: 'numeric',
          day: 'numeric',
        })
      : '-'
    button.addEventListener('click', () =>
      reload(`/accounts/${account.account}`)
    )
  } else {
    id.classList.add('account-card__id--skeleton')
    balance.classList.add('account-card__balance--skeleton')
    lastTransaction.classList.add('account-card__transaction--skeleton')
    button.classList.add('button--skeleton')
  }

  card.append(id, balance, lastTransaction, button)
  return card
}
