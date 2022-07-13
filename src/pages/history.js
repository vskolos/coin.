// CSS
import 'normalize.css'
import '../common/common.scss'

// Libraries

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
import reload from '../app'
import logout from '../utilities/logout'
import monthlyBalance from '../utilities/monthly-balance'
import monthlyTransactions from '../utilities/monthly-transactions'
import chartInit from '../utilities/chart-init'
import handleError from '../utilities/handle-error'

// SVG
import Arrow from '../assets/images/arrow.svg'

export default async function renderHistoryPage(id) {
  const body = document.body
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

  const topRow = createTopRow(['title', 'account', 'balance', 'button'], {
    title: 'История баланса',
    account: id,
    button: {
      text: 'Вернуться назад',
      icon: Arrow,
      handler: () => reload(`/accounts/${id}`),
    },
  })

  const accountInfo = createAccountInfo()
  const balanceChart = createBalanceChart('Динамика баланса')
  balanceChart.classList.add('balance-chart--wide')
  const transactionsChart = createBalanceChart(
    'Соотношение входящих/исходящих транзакций'
  )
  transactionsChart.classList.add('balance-chart--wide')
  const moneyTransferHistory = new MoneyTransferHistory(null, 25)

  accountInfo.append(
    balanceChart,
    transactionsChart,
    moneyTransferHistory.element
  )
  mainContainer.append(topRow, accountInfo)
  main.append(mainContainer)

  body.innerHTML = ''
  body.append(header, main)

  account(id, localStorage.token)
    .then((response) => {
      if (response.error) {
        throw new Error(response.error)
      }
      return response.payload
    })
    .then((data) => {
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
      mainContainer.replaceChild(newTopRow, topRow)

      const balanceChartCanvas = balanceChart.querySelector('canvas')
      balanceChartCanvas.classList.remove('balance-chart__canvas--skeleton')
      const monthlyBalanceData = monthlyBalance(data, 12)

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

      const transactionsChartCanvas = transactionsChart.querySelector('canvas')
      transactionsChartCanvas.classList.remove(
        'balance-chart__canvas--skeleton'
      )
      const monthlyTransactionsData = monthlyTransactions(data, 12)
      const monthlyTransactionsSum = []

      monthlyTransactionsData
        .map((entry) => entry.income)
        .forEach((income, index) => {
          monthlyTransactionsSum.push(
            income +
              monthlyTransactionsData.map((entry) => entry.outcome)[index]
          )
        })

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

      const newMoneyTransferHistory = new MoneyTransferHistory(data, 25)
      accountInfo.replaceChild(
        newMoneyTransferHistory.element,
        moneyTransferHistory.element
      )
    })
    .catch((error) => handleError(error))
}
