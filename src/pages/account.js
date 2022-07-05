// CSS
import 'normalize.css'
import '../common/common.scss'
import '../../node_modules/choices.js/public/assets/styles/choices.min.css'

// Libraries
// import Choices from 'choices.js'
import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
} from 'chart.js'

// Blocks
import createHeader from '../blocks/header/header.js'
import createLogo from '../blocks/logo/logo.js'
import createMenu from '../blocks/menu/menu.js'
import createMain from '../blocks/main/main.js'
import createContainer from '../blocks/container/container.js'
import createButton from '../blocks/button/button.js'
import createTopRow from '../blocks/top-row/top-row.js'
import createAccountInfo from '../blocks/account-info/account-info.js'
import createMoneyTransferForm from '../blocks/money-transfer-form/money-transfer-form.js'
import createBalanceChart from '../blocks/balance-chart/balance-chart.js'
import createMoneyTransferHistory from '../blocks/money-transfer-history/money-transfer-history'

// API
import account from '../api/account.js'

// Utilities
import logout from '../utilities/logout.js'
import reload from '../utilities/reload.js'
import monthlyBalance from '../utilities/monthly-balance.js'

// SVG
import Burger from '../assets/images/burger.svg'
import Arrow from '../assets/images/arrow.svg'

export default async function renderAccountPage(id) {
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
    title: 'Просмотр счёта',
    account: data.account,
    balance: data.balance,
    button: {
      text: 'Вернуться назад',
      icon: Arrow,
    },
  })

  const backButton = topRow.querySelector('.button')
  backButton.addEventListener('click', () => reload('/accounts'))

  const accountInfo = createAccountInfo()
  const moneyTransferForm = createMoneyTransferForm()
  const balanceChart = createBalanceChart('Динамика баланса')
  const moneyTransferHistory = createMoneyTransferHistory(data, 10)

  headerContainer.append(logo, burger, menu)
  header.append(headerContainer)

  accountInfo.append(moneyTransferForm, balanceChart, moneyTransferHistory)
  mainContainer.append(topRow, accountInfo)
  main.append(mainContainer)

  burger.classList.add('button--burger')
  burger.addEventListener('click', () => {
    menu.classList.toggle('menu--visible')
  })

  body.innerHTML = ''
  body.append(header, main)

  const balanceChartCanvas = balanceChart.querySelector('canvas')

  Chart.register(BarElement, BarController, CategoryScale, LinearScale)
  Chart.defaults.font = {
    family: '"Work Sans", Helvetica, sans-serif',
    size: window.innerWidth >= 768 ? 20 : 10,
    lineHeight: 1.1,
    weight: 500,
  }
  Chart.defaults.color = '#000'

  const monthlyBalances = monthlyBalance(data, 6)
  const chartMonthNames = monthlyBalances.map((entry) => entry.month)
  const chartBalances = monthlyBalances.map((entry) => entry.balance)

  new Chart(balanceChartCanvas, {
    type: 'bar',
    data: {
      labels:
        window.innerWidth > 576 ? chartMonthNames : chartMonthNames.slice(3),
      datasets: [
        {
          data:
            window.innerWidth > 576 ? chartBalances : chartBalances.slice(3),
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      onResize: (chart, size) => {
        if (size.width >= 480) {
          chart.data.labels = chartMonthNames
          chart.data.datasets[0].data = chartBalances
        } else {
          chart.data.labels = chartMonthNames.slice(3)
          chart.data.datasets[0].data = chartBalances.slice(3)
        }
        if (size.width >= 320) {
          Chart.defaults.font.size = 20
        } else {
          Chart.defaults.font.size = 14
        }
      },
      backgroundColor: '#116ACC',
      maxBarThickness: 50,
      scales: {
        x: {
          grid: {
            drawOnChartArea: false,
            drawBorder: false,
            drawTicks: false,
          },
          ticks: {
            font: {
              weight: 700,
            },
          },
        },
        y: {
          min:
            window.innerWidth >= 576
              ? Math.min(Math.min(...chartBalances), 0)
              : Math.min(Math.min(...chartBalances.slice(3)), 0),
          max:
            window.innerWidth >= 576
              ? Math.max(...chartBalances)
              : Math.max(...chartBalances.slice(3)),
          grid: {
            drawOnChartArea: false,
            drawBorder: false,
            drawTicks: false,
          },
          position: 'right',
          ticks: {
            callback: (val) => {
              return val === 0 || val === Math.max(...chartBalances)
                ? Math.ceil(val).toLocaleString('ru-RU')
                : ''
            },
            padding: 24,
          },
        },
      },
      layout: {
        padding: 10,
      },
    },
    plugins: [
      {
        id: 'chartAreaBorder',
        beforeDraw(chart, args, options) {
          const {
            ctx,
            chartArea: { left, top, width, height },
          } = chart
          ctx.save()
          ctx.strokeStyle = options.borderColor
          ctx.lineWidth = options.borderWidth
          ctx.setLineDash(options.borderDash || [])
          ctx.lineDashOffset = options.borderDashOffset
          ctx.strokeRect(left, top, width, height)
          ctx.restore()
        },
      },
    ],
  })
}
