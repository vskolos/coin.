import shortMonthName from './short-month-name'

// account = { account, balance, mine, transactions }
// transactions = [ transaction1, transaction2, ... ]
// transactionN = { amount, date, from, to }
export default function monthlyTransactions(account, months) {
  const id = account.account
  const transactions = account.transactions
  let income = 0
  let outcome = 0

  const date = new Date()
  let firstDayCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1)

  const monthlyTransactions = []

  if (!transactions.length) {
    monthlyTransactions.push({
      month: shortMonthName(date),
      income: income,
      outcome: outcome,
    })
    return monthlyTransactions
  }

  // TODO: Rewrite function using array.map and array.reduce

  for (let i = 0; i < transactions.length; i++) {
    const transaction = transactions[transactions.length - i - 1]
    const incoming = transaction.to === id
    const transactionDate = new Date(transaction.date)

    if (transactionDate.getTime() > firstDayCurrentMonth.getTime()) {
      if (incoming) income += transaction.amount
      else outcome += transaction.amount
    } else {
      firstDayCurrentMonth.setMonth(firstDayCurrentMonth.getMonth() - 1)
      monthlyTransactions.push({
        month: shortMonthName(firstDayCurrentMonth),
        income: income,
        outcome: outcome,
      })

      income = 0
      outcome = 0

      if (monthlyTransactions.length === months) break
    }
  }

  if (!monthlyTransactions.length) {
    transactions.reduce((prev, curr) => {
      if (curr.to === id) return prev + curr
      return prev
    }, income)

    transactions.reduce((prev, curr) => {
      if (curr.from === id) return prev + curr
      return prev
    }, outcome)

    monthlyTransactions.push({
      month: shortMonthName(date),
      income: income,
      outcome: outcome,
    })
  }

  return monthlyTransactions.reverse()
}
