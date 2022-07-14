// Libraries
import Choices from 'choices.js'

// App
import reload from '../app'

// Blocks
import createHeader from '../blocks/header/header'
import createMain from '../blocks/main/main'
import createContainer from '../blocks/container/container'
import createTopRow from '../blocks/top-row/top-row'
import AccountsList from '../blocks/accounts-list/accounts-list'
import Modal from '../blocks/modal/modal'

// API
import createAccount from '../api/create-account'

// Utilities
import logout from '../utilities/logout'
import handleError from '../utilities/handle-error'

// CSS
import 'normalize.css'
import '../common/common.scss'
import '../../node_modules/choices.js/public/assets/styles/choices.min.css'

// SVG
import Plus from '../assets/images/plus.svg'

// Отрисовка страницы списка счетов
export default async function renderAccountsPage() {
  const body = document.body

  // Создаём шапку страницы
  const header = createHeader([
    { text: 'Банкоматы', disabled: false, handler: () => reload('/banks') },
    { text: 'Счета', disabled: true, handler: () => reload('/accounts') },
    {
      text: 'Валюта',
      disabled: false,
      handler: () => reload('/currency'),
    },
    { text: 'Выйти', disabled: false, handler: logout },
  ])

  const main = createMain()
  const mainContainer = createContainer()

  // Создаём верхний блок
  const topRow = createTopRow(['title', 'sort', 'button'], {
    title: 'Ваши счета',
    sort: [
      { text: 'Сортировка', value: '' },
      { text: 'По номеру', value: 'account' },
      { text: 'По балансу', value: 'balance' },
      { text: 'По последней транзакции', value: 'last-transaction' },
    ],
    button: {
      text: 'Создать новый счёт',
      icon: Plus,
      handler: async () => {
        try {
          // Запрос создания счёта на сервер
          const data = await createAccount(localStorage.token)
          if (data.error) {
            throw new Error(data.error)
          }

          // Добавляем данные в DOM и в свойство класса на случай сортировки
          accountsList.add(data.payload)
          accountsList.accounts.push(data.payload)

          // Открываем модальное окно в случае успеха
          const modal = new Modal({
            title: 'Счёт создан',
            text: `№ ${data.payload.account}`,
            button: {
              text: 'Перейти к счёту',
              handler: () => {
                document.body.style.removeProperty('overflow')
                reload(`/accounts/${data.payload.account}`)
              },
            },
          })
          modal.open()
        } catch (error) {
          handleError(error)
        }
      },
    },
  })

  // Создаем список счетов
  const accountsList = new AccountsList()

  mainContainer.append(topRow, accountsList.element)
  main.append(mainContainer)

  // Очищаем страницу для перерисовки
  body.innerHTML = ''
  body.append(header, main)

  // Инициализируем Choices.js для вариантов сортировки счетов
  const select = topRow.querySelector('.js-sort')
  new Choices(select, {
    allowHTML: false,
    searchEnabled: false,
    shouldSort: false,
    itemSelectText: '',
  })

  // Добавляем сортировку счетов
  select.addEventListener('change', (event) =>
    accountsList.sort(event.detail.value)
  )
}
