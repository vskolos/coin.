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

export default class CurrencyExchangeForm {
  constructor({ parent, accountCurrency, fromCurrency, toCurrency }) {
    this.parent = parent
    this.accountCurrency = accountCurrency
    this.fromCurrency = fromCurrency ? fromCurrency : 'BTC'
    this.toCurrency = toCurrency ? toCurrency : 'ETH'
    this.element = el('form.currency-exchange-form')

    const title = el('p.currency-exchange-form__title', 'Обмен валюты')
    const options = el('.currency-exchange-form__options')

    const from = el(
      'label.currency-exchange-form__label',
      el('span.currency-exchange-form__label-text', 'Из')
    )
    this.fromSelect = el(
      'select.currency-exchange-form__select.js-exchange-from'
    )
    const to = el(
      'label.currency-exchange-form__label',
      el('span.currency-exchange-form__label-text', 'в')
    )
    this.toSelect = el('select.currency-exchange-form__select.js-exchange-to')

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

    from.append(this.fromSelect)
    to.append(this.toSelect)
    options.append(from, to, amount)
    this.element.append(title, options, button)

    this.element.addEventListener('submit', (e) => {
      e.preventDefault()
    })
  }

  mount(parent = this.parent) {
    parent.append(this.element)

    allCurrencies()
      .then((response) => {
        if (response.error) {
          throw new Error(response.error)
        }
        return response.payload
      })
      .then((currencies) => {
        currencies.forEach((currency) => {
          this.fromSelect.append(
            el('option.currency-exchange-form__option', currency, {
              value: currency,
            })
          )
          this.toSelect.append(
            el('option.currency-exchange-form__option', currency, {
              value: currency,
            })
          )
        })

        const fromChoices = new Choices(this.fromSelect, {
          allowHTML: false,
          searchEnabled: false,
          itemSelectText: '',
        })
        fromChoices.setChoiceByValue(this.fromCurrency)

        const toChoices = new Choices(this.toSelect, {
          allowHTML: false,
          searchEnabled: false,
          itemSelectText: '',
        })
        toChoices.setChoiceByValue(this.toCurrency)

        const validation = new JustValidate(this.element, {
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
                  amount: this.element.amount.value,
                },
                localStorage.token
              )
              if (response.error) {
                throw new Error(response.error)
              }
              const modal = new Modal({
                title: 'Обмен завершён',
                text: `Вы обменяли ${this.element.amount.value} ${
                  fromChoices.getValue().value
                } на ${toChoices.getValue().value}`,
              })
              modal.open()
              this.accountCurrency.fetch()
              this.element.amount.value = ''
            } catch (error) {
              handleError(error)
            }
          })
      })
      .catch((error) => handleError(error))
  }
}
