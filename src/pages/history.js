// App
import reload from '../app'

// Blocks
import createHeader from '../blocks/header/header'
import createMain from '../blocks/main/main'
import createContainer from '../blocks/container/container'
import createTopRow from '../blocks/top-row/top-row'
import createAccountInfo from '../blocks/account-info/account-info'
import createBalanceChart from '../blocks/balance-chart/balance-chart'
import MoneyTransferHistory from '../blocks/money-transfer-history/money-transfer-history'

// API
import account from '../api/account'

// Utilities
import logout from '../utilities/logout'
import monthlyBalance from '../utilities/monthly-balance'
import monthlyTransactions from '../utilities/monthly-transactions'
import chartInit from '../utilities/chart-init'
import handleError from '../utilities/handle-error'

// CSS
import 'normalize.css'
import '../common/common.scss'

// SVG
import Arrow from '../assets/images/arrow.svg'

// Отрисовка страницы подробной истории счёта
export default async function renderHistoryPage(id) {
  const body = document.body

  // Создаём шапку страницы
  const header = createHeader([
    { text: 'Банкоматы', disabled: false, handler: () => reload('/banks') },
    { text: 'Счета', disabled: false, handler: () => reload('/accounts') },
    {
      text: 'Валюта',
      disabled: false,
      handler: () => reload('/currency'),
    },
    { text: 'Выйти', disabled: false, handler: logout },
  ])

  const main = createMain()
  const mainContainer = createContainer()

  // Создаём верхний блок без данных баланса счёта для анимации загрузки
  const topRow = createTopRow(['title', 'account', 'balance', 'button'], {
    title: 'История баланса',
    account: id,
    button: {
      text: 'Вернуться назад',
      icon: Arrow,
      handler: () => reload(`/accounts/${id}`),
    },
  })

  // Создаём блок информации о счёте
  const accountInfo = createAccountInfo()

  // Создаем блок с графиком динамики баланса
  const balanceChart = createBalanceChart('Динамика баланса')
  balanceChart.classList.add('balance-chart--wide')

  // Создаем блок с графиком соотношения транзакций
  const transactionsChart = createBalanceChart(
    'Соотношение входящих/исходящих транзакций'
  )
  transactionsChart.classList.add('balance-chart--wide')

  // Создаём блок истории транзакций с пустыми данными для анимации загрузки
  const moneyTransferHistory = new MoneyTransferHistory(null, 25)

  accountInfo.append(
    balanceChart,
    transactionsChart,
    moneyTransferHistory.element
  )
  mainContainer.append(topRow, accountInfo)
  main.append(mainContainer)

  // Очищаем страницу для перерисовки
  body.innerHTML = ''
  body.append(header, main)

  // Запрашиваем данные счёта с сервера
  account(id, localStorage.token)
    .then((response) => {
      if (response.error) {
        throw new Error(response.error)
      }
      return response.payload
    })
    .then((data) => {
      // Создаём верхний блок с полученным балансом счёта
      const newTopRow = createTopRow(
        ['title', 'account', 'balance', 'button'],
        {
          title: 'Просмотр счёта',
          account: id,
          balance: data.balance,
          button: {
            text: 'Вернуться назад',
            icon: Arrow,
            handler: () => reload(`/accounts/${id}`),
          },
        }
      )

      // Заменяем старый блок на новый
      mainContainer.replaceChild(newTopRow, topRow)

      // Добавляем к canvas блока с графиком динамики баланса анимацию загрузки
      const balanceChartCanvas = balanceChart.querySelector('canvas')
      balanceChartCanvas.classList.remove('balance-chart__canvas--skeleton')

      // Рассчитываем баланс на начало последних шести месяцев
      const monthlyBalanceData = monthlyBalance(data, 12)

      // Инициализируем Chart.js для отрисовки графика
      chartInit(
        balanceChartCanvas,
        {
          labels: monthlyBalanceData.map((entry) => entry.month),
          datasets: [
            {
              data: monthlyBalanceData.map((entry) => entry.balance),
              backgroundColor: '#116ACC',
            },
          ],
        },
        {
          arrayForMin: monthlyBalanceData.map((entry) => entry.balance),
          arrayForMax: monthlyBalanceData.map((entry) => entry.balance),
        }
      )

      // Добавляем к canvas блока с графиком соотношения транзакций анимацию загрузки
      const transactionsChartCanvas = transactionsChart.querySelector('canvas')
      transactionsChartCanvas.classList.remove(
        'balance-chart__canvas--skeleton'
      )

      // Рассчитываем соотношение транзакций на начало последних двенадцати месяцев
      const monthlyTransactionsData = monthlyTransactions(data, 12)
      const monthlyTransactionsSum = []

      // Создаём отдельный массив с суммой всех транзакций по месяцам для определения верхней/нижней границы
      monthlyTransactionsData
        .map((entry) => entry.income)
        .forEach((income, index) => {
          monthlyTransactionsSum.push(
            income +
              monthlyTransactionsData.map((entry) => entry.outcome)[index]
          )
        })

      // Инициализируем Chart.js для отрисовки графика
      chartInit(
        transactionsChartCanvas,
        {
          labels: monthlyTransactionsData.map((entry) => entry.month),
          datasets: [
            {
              data: monthlyTransactionsData.map((entry) => entry.outcome),
              backgroundColor: '#FD4E5D',
            },
            {
              data: monthlyTransactionsData.map((entry) => entry.income),
              backgroundColor: '#76CA66',
            },
          ],
        },
        {
          arrayForMin: monthlyTransactionsSum,
          arrayForMid: monthlyTransactionsData.map((entry) => entry.outcome),
          arrayForMax: monthlyTransactionsSum,
        }
      )

      // Создаём блок истории транзакций с полученными данными и пагинацией
      const newMoneyTransferHistory = new MoneyTransferHistory(data, 25, true)

      // Заменяем старый блок на новый
      accountInfo.replaceChild(
        newMoneyTransferHistory.element,
        moneyTransferHistory.element
      )
    })
    .catch((error) => handleError(error))
}
