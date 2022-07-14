import shortMonthName from './short-month-name'

// Вычисление состояний баланса счёта за последние months месяцев
export default function monthlyBalance(account, months) {
  const id = account.account
  const transactions = account.transactions
  let balance = account.balance

  const date = new Date()

  // Вычисляем начало текущего месяца для сравнения
  let firstDayCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1)

  // Месяц еще не закончился, поэтому текущий баланс и будет балансом текущего месяца
  const monthlyBalance = [
    {
      month: shortMonthName(date),
      balance: balance,
    },
  ]

  for (let i = 0; i < transactions.length; i++) {
    // Перебираем транзакции с конца, т.к. идем с последнего месяца назад
    const transaction = transactions[transactions.length - i - 1]
    const incoming = transaction.to === id
    const transactionDate = new Date(transaction.date)

    if (transactionDate.getTime() > firstDayCurrentMonth.getTime()) {
      // Если мы еще в текущем месяце, корректируем баланс в зависимости от типа транзакции (входящая/исходящая)
      balance -= incoming ? transaction.amount : -transaction.amount
    } else {
      // Если транзакции текущего месяца закончились

      // Переводим нашу переменную на месяц назад
      firstDayCurrentMonth.setMonth(firstDayCurrentMonth.getMonth() - 1)

      // Добавляем элемент с актуальным балансом месяца в массив
      monthlyBalance.push({
        month: shortMonthName(firstDayCurrentMonth),
        balance: balance,
      })

      // Заканчиваем перебор, как только набрали заданное количество месяцев данных
      if (monthlyBalance.length === months) break
    }
  }

  // Возвращаем массив наоборот, т.к. мы начинали с конца
  return monthlyBalance.reverse()
}
