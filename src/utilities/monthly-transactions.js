import shortMonthName from './short-month-name'

// Вычисление сумм входящих/исходящих транзакций за последние month месяцев
export default function monthlyTransactions(account, months) {
  const id = account.account
  const transactions = account.transactions
  let income = 0
  let outcome = 0

  const date = new Date()

  // Вычисляем начало текущего месяца для сравнения
  let firstDayCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1)

  const monthlyTransactions = []

  // Если транзакций нет, создаем элемент с нулевыми значениями
  if (!transactions.length) {
    monthlyTransactions.push({
      month: shortMonthName(date),
      income: income,
      outcome: outcome,
    })
    return monthlyTransactions
  }

  for (let i = 0; i < transactions.length; i++) {
    // Перебираем транзакции с конца, т.к. идем с последнего месяца назад
    const transaction = transactions[transactions.length - i - 1]
    const incoming = transaction.to === id
    const transactionDate = new Date(transaction.date)

    if (transactionDate.getTime() > firstDayCurrentMonth.getTime()) {
      // Если мы еще в текущем месяце, корректируем суммы в зависимости от типа транзакции (входящая/исходящая)
      if (incoming) income += transaction.amount
      else outcome += transaction.amount
    } else {
      // Если транзакции текущего месяца закончились

      // Переводим нашу переменную на месяц назад
      firstDayCurrentMonth.setMonth(firstDayCurrentMonth.getMonth() - 1)

      // Добавляем элемент с актуальными суммами транзакций за месяц в массив
      monthlyTransactions.push({
        month: shortMonthName(firstDayCurrentMonth),
        income: income,
        outcome: outcome,
      })

      // Обнуляем суммы для корректного вычисления в предыдущем месяце
      income = 0
      outcome = 0

      // Заканчиваем перебор, как только набрали заданное количество месяцев данных
      if (monthlyTransactions.length === months) break
    }
  }

  // Если транзакции были, но итоговый массив пуст, все транзакции были в текущем месяце
  if (!monthlyTransactions.length) {
    // Вычисляем поступления
    transactions.reduce((prev, curr) => {
      if (curr.to === id) return prev + curr
      return prev
    }, income)

    // Вычисляем расходы
    transactions.reduce((prev, curr) => {
      if (curr.from === id) return prev + curr
      return prev
    }, outcome)

    // Добавляем элемент в массив
    monthlyTransactions.push({
      month: shortMonthName(date),
      income: income,
      outcome: outcome,
    })
  }

  // Возвращаем массив наоборот, т.к. мы начинали с конца
  return monthlyTransactions.reverse()
}
