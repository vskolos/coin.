// accounts = [ account1, account2, ... ]
// account = { account, balance, mine, transactions }
// transactions = [ transaction1, transaction2, ... ]
// transactionN = { amount, date, from, to }
export default function sortAccounts(accounts, sortBy = '') {
  if (!sortBy) {
    return
  } else if (sortBy === 'account') {
    accounts.sort((a, b) => a.account - b.account)
  } else if (sortBy === 'balance') {
    accounts.sort((a, b) => b.balance - a.balance)
  } else if (sortBy === 'last-transaction') {
    accounts.sort((a, b) => {
      if (a.transactions.length === 0 && b.transactions.length === 0) {
        return 0
      } else if (a.transactions.length === 0) {
        return 1
      } else if (b.transactions.length === 0) {
        return -1
      }
      return (
        new Date(b.transactions[b.transactions.length - 1].date).getTime() -
        new Date(a.transactions[a.transactions.length - 1].date).getTime()
      )
    })
  }
}
