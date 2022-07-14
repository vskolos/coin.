// Libraries
import { el } from 'redom'
import JustValidate from 'just-validate'

// Blocks
import createPrimaryButton from '../button/--primary/button--primary'
import setInputFilter from '../../utilities/set-input-filter'
import autocomplete from '../../utilities/autocomplete'
import Modal from '../modal/modal'

// API
import transferFunds from '../../api/transfer-funds'

// Utilities
import handleError from '../../utilities/handle-error'

// CSS
import './money-transfer-form.scss'

// SVG
import Envelope from '../../assets/images/envelope.svg'

// Создание формы перевода средств
export default function createMoneyTransferForm(id) {
  // Выключаем автодополнение, т.к. ниже есть своя реализация
  const form = el('form.money-transfer-form', { autocomplete: 'off' })
  const title = el('p.money-transfer-form__title', 'Новый перевод')
  const account = el(
    'label.money-transfer-form__label',
    el('span.money-transfer-form__label-text', 'Номер счёта получателя')
  )
  const accountInput = el(
    'input.money-transfer-form__input.money-transfer-form__input--account',
    {
      placeholder: '80304641174040315022502625',
      name: 'account',
    }
  )
  account.append(accountInput)

  // Добавляем фильтр на ввод только цифр в номер счёта
  setInputFilter(accountInput, (value) => /^\d*$/.test(value))

  const amount = el(
    'label.money-transfer-form__label',
    el('span.money-transfer-form__label-text', 'Сумма перевода')
  )
  const amountInput = el(
    'input.money-transfer-form__input.money-transfer-form__input--amount',
    {
      placeholder: '1000 ₽',
      name: 'amount',
    }
  )
  amount.append(amountInput)

  // Добавляем фильтр на ввод только положительных чисел в сумму перевода
  setInputFilter(amountInput, (value) => /^\d*\.?\d*$/.test(value))

  const button = createPrimaryButton({ text: 'Отправить', icon: Envelope })
  button.type = 'submit'

  if (localStorage.accounts) {
    // Если ранее уже сохраняли номера счетов, загружаем их
    try {
      const data = JSON.parse(localStorage.accounts).filter((val) =>
        // Фильтруем только числовые строки на случай мусорных значений
        val.match(/^\d+$/)
      )

      // Активируем автодополнение для поля формы
      autocomplete(accountInput, data)
    } catch {
      // Если в свойстве localStorage был мусор, инициализируем его
      localStorage.accounts = '[]'
    }
  } else {
    // Иначе инициализируем свойство localStorage
    localStorage.accounts = '[]'
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
  })

  form.append(title, account, amount, button)

  // Инициализируем JustValidate для валидации формы
  const validation = new JustValidate(form, {
    errorLabelStyle: {},
    errorLabelCssClass: 'money-transfer-form__label-text--invalid',
    errorFieldCssClass: 'money-transfer-form__input--invalid',
  })

  // Настраиваем параметры валидации
  validation
    .addField('.money-transfer-form__input--account', [
      {
        rule: 'required',
        errorMessage: 'Введите номер счёта',
      },
      {
        validator: (value) => {
          return id !== value
        },
        errorMessage: 'Перевод самому себе невозможен',
      },
    ])
    .addField('.money-transfer-form__input--amount', [
      {
        rule: 'required',
        errorMessage: 'Введите сумму перевода',
      },
      {
        validator: (value) => {
          return value > 0
        },
        errorMessage: 'Сумма перевода должна быть больше 0',
      },
    ])
    .onSuccess(async () => {
      try {
        // Запрос перевода средств на сервер
        const response = await transferFunds(
          {
            from: id,
            to: form.account.value,
            amount: form.amount.value,
          },
          localStorage.token
        )
        if (response.error) {
          throw new Error(response.error)
        }
        // Открываем модальное окно в случае успеха
        const modal = new Modal({
          title: 'Перевод завершён',
          text: `Вы перевели ${form.amount.value}₽ на счёт №${form.account.value}`,
        })
        modal.open()

        // Сбрасываем значения в полях формы
        form.account.value = ''
        form.amount.value = ''

        if (localStorage.accounts) {
          // Если ранее уже сохраняли номера счетов, добавляем к ним новый
          try {
            const data = JSON.parse(localStorage.accounts).filter((val) =>
              val.match(/^\d+$/)
            )
            if (!data.includes(accountInput.value)) {
              // Проверяем список счетов на дубликаты
              data.push(accountInput.value)
            }
            localStorage.accounts = JSON.stringify(data)
          } catch {
            // Если в свойстве localStorage был мусор, записываем в него номер счёта
            localStorage.accounts = `[${accountInput.value}]`
          }
        } else {
          // Иначе инициализируем свойство номером счёта
          localStorage.accounts = `[${accountInput.value}]`
        }
      } catch (error) {
        handleError(error)
      }
    })

  return form
}
