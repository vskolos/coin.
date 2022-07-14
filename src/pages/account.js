// App
import reload from '../app'

// Blocks
import createHeader from '../blocks/header/header'
import createMain from '../blocks/main/main'
import createContainer from '../blocks/container/container'
import createTopRow from '../blocks/top-row/top-row'
import createAccountInfo from '../blocks/account-info/account-info'
import createMoneyTransferForm from '../blocks/money-transfer-form/money-transfer-form'
import createBalanceChart from '../blocks/balance-chart/balance-chart'
import MoneyTransferHistory from '../blocks/money-transfer-history/money-transfer-history'

// API
import account from '../api/account'

// Utilities
import logout from '../utilities/logout'
import monthlyBalance from '../utilities/monthly-balance'
import chartInit from '../utilities/chart-init'
import handleError from '../utilities/handle-error'

// CSS
import 'normalize.css'
import '../common/common.scss'

// SVG
import Arrow from '../assets/images/arrow.svg'

// Отрисовка страницы информации о счёте
export default async function renderAccountPage(id) {
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
    title: 'Просмотр счёта',
    account: id,
    button: {
      text: 'Вернуться назад',
      icon: Arrow,
      handler: () => reload('/accounts'),
    },
  })

  mainContainer.append(topRow)

  // Создаём блок информации о счёте
  const accountInfo = createAccountInfo()

  // Создаём форму перевода средств
  const moneyTransferForm = createMoneyTransferForm(id)

  // Создаем блок с графиком динамики баланса
  const balanceChart = createBalanceChart('Динамика баланса')

  // Добавляем переход на страницу детальной истории
  balanceChart.style.cursor = 'pointer'
  balanceChart.addEventListener('click', () =>
    reload(`/accounts/${id}/history`)
  )

  // Создаём блок истории транзакций с пустыми данными для анимации загрузки
  const moneyTransferHistory = new MoneyTransferHistory(null, 10)

  // Добавляем переход на страницу детальной истории
  moneyTransferHistory.element.style.cursor = 'pointer'
  moneyTransferHistory.element.addEventListener('click', () =>
    reload(`/accounts/${id}/history`)
  )

  accountInfo.append(
    moneyTransferForm,
    balanceChart,
    moneyTransferHistory.element
  )
  mainContainer.append(accountInfo)
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
            handler: () => reload('/accounts'),
          },
        }
      )

      // Заменяем старый блок на новый
      mainContainer.replaceChild(newTopRow, topRow)

      // Добавляем к canvas блока с графиком динамики баланса анимацию загрузки
      const balanceChartCanvas = balanceChart.querySelector('canvas')
      balanceChartCanvas.classList.remove('balance-chart__canvas--skeleton')

      // Рассчитываем баланс на начало последних шести месяцев
      const monthlyBalanceData = monthlyBalance(data, 6)

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

      // Создаём блок истории транзакций с полученными данными
      const newMoneyTransferHistory = new MoneyTransferHistory(data, 10)

      // Добавляем переход на страницу детальной истории
      newMoneyTransferHistory.element.style.cursor = 'pointer'
      newMoneyTransferHistory.element.addEventListener('click', () =>
        reload(`/accounts/${id}/history`)
      )

      // Заменяем старый блок на новый
      accountInfo.replaceChild(
        newMoneyTransferHistory.element,
        moneyTransferHistory.element
      )
    })
    .catch((error) => handleError(error))
}
