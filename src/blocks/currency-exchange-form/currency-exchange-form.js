import { el } from 'redom'
import '../../../node_modules/choices.js/public/assets/styles/choices.min.css'
import './currency-exchange-form.scss'
import Choices from 'choices.js'
import JustValidate from 'just-validate'
import Modal from '../modal/modal'
import createPrimaryButton from '../button/--primary/button--primary'
import allCurrencies from '../../api/all-currencies'
import currencyBuy from '../../api/currency-buy'
import setInputFilter from '../../utilities/set-input-filter'
import handleError from '../../utilities/handle-error'

export default function createCurrencyExchangeForm() {
  const form = el('form.currency-exchange-form')

  const title = el('p.currency-exchange-form__title', 'Обмен валюты')
  const options = el('.currency-exchange-form__options')

  const from = el(
    'label.currency-exchange-form__label',
    el('span.currency-exchange-form__label-text', 'Из')
  )
  const fromSelect = el(
    'select.currency-exchange-form__select.js-exchange-from'
  )
  const to = el(
    'label.currency-exchange-form__label',
    el('span.currency-exchange-form__label-text', 'в')
  )
  const toSelect = el('select.currency-exchange-form__select.js-exchange-to')

  const amount = el('label.currency-exchange-form__label', 'Сумма')
  const amountInput = el(
    'input.currency-exchange-form__input.currency-exchange-form__input--amount',
    {
      placeholder: '0.1235421',
      name: 'amount',
    }
  )
  amount.append(amountInput)

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

  allCurrencies()
    .then((response) => {
      if (response.error) {
        throw new Error(response.error)
      }
      return response.payload
    })
    .then((currencies) => {
      currencies.forEach((currency) => {
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

      const fromChoices = new Choices(fromSelect, {
        allowHTML: false,
        searchEnabled: false,
        itemSelectText: '',
      })
      fromChoices.setChoiceByValue('BTC')

      const toChoices = new Choices(toSelect, {
        allowHTML: false,
        searchEnabled: false,
        itemSelectText: '',
      })
      toChoices.setChoiceByValue('ETH')

      const validation = new JustValidate(form, {
        errorLabelStyle: {},
        errorLabelCssClass: 'currency-exchange-form__label-text--invalid',
        errorFieldCssClass: 'currency-exchange-form__input--invalid',
      })

      validation
        .addField('.currency-exchange-form__input--amount', [
          {
            rule: 'required',
            errorMessage: 'Введите сумму перевода',
          },
        ])
        .onSuccess(async () => {
          try {
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
            const modal = new Modal({
              title: 'Обмен завершён',
              text: `Вы обменяли ${form.amount.value} ${
                fromChoices.getValue().value
              } на ${toChoices.getValue().value}`,
            })
            modal.open()
            form.amount.value = ''
          } catch (error) {
            handleError(error)
          }
        })
    })
    .catch((error) => handleError(error))

  return form
}
