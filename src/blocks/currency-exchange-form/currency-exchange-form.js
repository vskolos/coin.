// Libraries
import { el } from 'redom'
import Choices from 'choices.js'
import JustValidate from 'just-validate'

// Blocks
import Modal from '../modal/modal'
import createPrimaryButton from '../button/--primary/button--primary'

// API
import allCurrencies from '../../api/all-currencies'
import currencyBuy from '../../api/currency-buy'

//Utilities
import setInputFilter from '../../utilities/set-input-filter'
import handleError from '../../utilities/handle-error'

// CSS
import '../../../node_modules/choices.js/public/assets/styles/choices.min.css'
import './currency-exchange-form.scss'

// Создание формы обмена валюты
export default function createCurrencyExchangeForm({ onSubmit }) {
  const form = el('form.currency-exchange-form')
  const title = el('p.currency-exchange-form__title', 'Обмен валюты')
  const options = el('.currency-exchange-form__options')
  const from = el(
    'label.currency-exchange-form__label',
    el('span.currency-exchange-form__label-text', 'Из')
  )
  const fromSelect = el(
    'select.currency-exchange-form__select.currency-exchange-form__select--skeleton.js-exchange-from'
  )
  const to = el(
    'label.currency-exchange-form__label',
    el('span.currency-exchange-form__label-text', 'в')
  )
  const toSelect = el(
    'select.currency-exchange-form__select.currency-exchange-form__select--skeleton.js-exchange-to'
  )
  const amount = el('label.currency-exchange-form__label', 'Сумма')
  const amountInput = el(
    'input.currency-exchange-form__input.currency-exchange-form__input--amount',
    {
      placeholder: '0.1235421',
      name: 'amount',
    }
  )
  amount.append(amountInput)

  // Добавляем фильтр на ввод только положительных чисел
  setInputFilter(amountInput, (value) => /^\d*\.?\d*$/.test(value))

  const button = createPrimaryButton({ text: 'Обменять' })
  button.type = 'submit'
  button.name = 'submit'

  from.append(fromSelect)
  to.append(toSelect)
  options.append(from, to, amount)
  form.append(title, options, button)

  form.addEventListener('submit', (e) => {
    e.preventDefault()
  })

  // Запрос списка валют с сервера
  allCurrencies()
    .then((response) => {
      if (response.error) {
        throw new Error(response.error)
      }
      return response.payload
    })
    .then((currencies) => {
      currencies.forEach((currency) => {
        // Добавляем каждую валюту как опцию для select-ов
        fromSelect.append(
          el('option.currency-exchange-form__option', currency, {
            value: currency,
          })
        )
        toSelect.append(
          el('option.currency-exchange-form__option', currency, {
            value: currency,
          })
        )
      })

      // Инициализируем Choices.js для select-ов
      const fromChoices = new Choices(fromSelect, {
        allowHTML: false,
        searchEnabled: false,
        itemSelectText: '',
      })
      const toChoices = new Choices(toSelect, {
        allowHTML: false,
        searchEnabled: false,
        itemSelectText: '',
      })

      // Задаем выставленные по умолчанию значения
      fromChoices.setChoiceByValue('BTC')
      toChoices.setChoiceByValue('ETH')

      // Инициализируем JustValidate для валидации формы
      const validation = new JustValidate(form, {
        errorLabelStyle: {},
        errorLabelCssClass: 'currency-exchange-form__label-text--invalid',
        errorFieldCssClass: 'currency-exchange-form__input--invalid',
      })

      // Настраиваем параметры валидации
      validation
        .addField('.currency-exchange-form__input--amount', [
          {
            rule: 'required',
            errorMessage: 'Введите сумму перевода',
          },
          {
            validator: (value) => {
              return value > 0
            },
            errorMessage: 'Сумма не должна быть 0',
          },
        ])
        .onSuccess(async () => {
          try {
            // Запрос обмена валюты на сервер
            const response = await currencyBuy(
              {
                from: fromChoices.getValue().value,
                to: toChoices.getValue().value,
                amount: form.amount.value,
              },
              localStorage.token
            )
            if (response.error) {
              throw new Error(response.error)
            }

            onSubmit()

            // Открываем модальное окно в случае успеха
            const modal = new Modal({
              title: 'Обмен завершён',
              text: `Вы обменяли ${form.amount.value} ${
                fromChoices.getValue().value
              } на ${toChoices.getValue().value}`,
            })
            modal.open()

            // Сбрасываем значение в поле формы
            form.amount.value = ''
          } catch (error) {
            handleError(error)
          }
        })
    })
    .catch((error) => handleError(error))

  return form
}
