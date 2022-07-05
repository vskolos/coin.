import { el } from 'redom'
import createPrimaryButton from '../button/--primary/button--primary'
import './login-form.scss'

export default function createLoginForm() {
  const form = el('form.login-form')
  const title = el('p.login-form__title', 'Вход в аккаунт')
  const login = el(
    'label.login-form__label',
    el('span.login-form__label-text', 'Логин'),
    el('input.login-form__input', {
      placeholder: 'Введите логин',
      type: 'text',
      name: 'login',
    })
  )
  const password = el(
    'label.login-form__label',
    el('span.login-form__label-text', 'Пароль'),
    el('input.login-form__input', {
      placeholder: 'Введите пароль',
      type: 'password',
      name: 'password',
    })
  )
  const button = createPrimaryButton({ text: 'Войти' })
  button.type = 'submit'

  form.addEventListener('submit', (e) => {
    e.preventDefault()
  })

  form.append(title, login, password, button)
  return form
}
