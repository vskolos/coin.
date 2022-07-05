// CSS
import 'normalize.css'
import '../common/common.scss'
// import '../../node_modules/choices.js/public/assets/styles/choices.min.css'

// Libraries
// import Choices from 'choices.js'

// Blocks
import createHeader from '../blocks/header/header'
import createLogo from '../blocks/logo/logo'
import createMenu from '../blocks/menu/menu'
import createMain from '../blocks/main/main'
import createContainer from '../blocks/container/container'
import createButton from '../blocks/button/button'
import createTopRow from '../blocks/top-row/top-row'
import createAccountInfo from '../blocks/account-info/account-info'
import createBalanceChart from '../blocks/balance-chart/balance-chart'
import createMoneyTransferHistory from '../blocks/money-transfer-history/money-transfer-history'

// API
import account from '../api/account'

// Utilities
import logout from '../utilities/logout'
import reload from '../utilities/reload'
import monthlyBalance from '../utilities/monthly-balance'
import monthlyTransactions from '../utilities/monthly-transactions'
import chartInit from '../utilities/chart-init'

// SVG
import Burger from '../assets/images/burger.svg'
import Arrow from '../assets/images/arrow.svg'

export default async function renderHistoryPage(id) {
  const response = await account(id, localStorage.token)
  const data = response.payload

  const body = document.body
  const header = createHeader()
  const headerContainer = createContainer()
  const logo = createLogo()
  const burger = createButton({ icon: Burger })
  const menu = createMenu([
    { text: 'Банкоматы', disabled: false, handler: () => reload('/map') },
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

  const topRow = createTopRow({
    title: 'История баланса',
    account: data.account,
    balance: data.balance,
    button: {
      text: 'Вернуться назад',
      icon: Arrow,
    },
  })

  const backButton = topRow.querySelector('.button')
  backButton.addEventListener('click', () =>
    reload(`/accounts/${data.account}`)
  )

  const accountInfo = createAccountInfo()
  const balanceChart = createBalanceChart('Динамика баланса')
  balanceChart.classList.add('balance-chart--wide')
  const transactionsChart = createBalanceChart(
    'Соотношение входящих/исходящих транзакций'
  )
  transactionsChart.classList.add('balance-chart--wide')
  const moneyTransferHistory = createMoneyTransferHistory(data, 25)

  headerContainer.append(logo, burger, menu)
  header.append(headerContainer)

  accountInfo.append(balanceChart, transactionsChart, moneyTransferHistory)
  mainContainer.append(topRow, accountInfo)
  main.append(mainContainer)

  burger.classList.add('button--burger')
  burger.addEventListener('click', () => {
    menu.classList.toggle('menu--visible')
  })

  body.innerHTML = ''
  body.append(header, main)

  const balanceChartCanvas = balanceChart.querySelector('canvas')
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
  const monthlyTransactionsData = monthlyTransactions(data, 12)
  const monthlyTransactionsSum = []

  monthlyTransactionsData
    .map((entry) => entry.income)
    .forEach((income, index) => {
      monthlyTransactionsSum.push(
        income + monthlyTransactionsData.map((entry) => entry.outcome)[index]
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
}
