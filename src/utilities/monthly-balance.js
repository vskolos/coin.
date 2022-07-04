function getShortMonthName(date) {
  return date.toLocaleString('ru-RU', { month: 'short' }).slice(0, 3)
}

// account = { account, balance, mine, transactions }
// transactions = [ transaction1, transaction2, ... ]
// transactionN = { amount, date, from, to }
export default function monthlyBalance(account, months) {
  const id = account.account
  const transactions = account.transactions
  let balance = account.balance

  const date = new Date()
  let firstDayCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1)

  const monthlyBalance = [
    {
      month: getShortMonthName(date),
      balance: balance,
    },
  ]

  for (let i = 0; i < transactions.length; i++) {
    const transaction = transactions[transactions.length - i - 1]
    const incoming = transaction.to === id
    const transactionDate = new Date(transaction.date)

    if (transactionDate.getTime() > firstDayCurrentMonth.getTime()) {
      balance -= incoming ? transaction.amount : -transaction.amount
    } else {
      firstDayCurrentMonth.setMonth(firstDayCurrentMonth.getMonth() - 1)
      monthlyBalance.push({
        month: getShortMonthName(firstDayCurrentMonth),
        balance: balance,
      })

      if (monthlyBalance.length === months) break
    }
  }

  return monthlyBalance.reverse()
}
