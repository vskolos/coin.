import { el } from 'redom'
import './button.scss'

// data = { text, icon }
export default function createButton(data) {
  const button = el('button.button')

  if (data.icon) {
    const icon = el('.button__icon')
    icon.innerHTML = data.icon
    button.append(icon)
  }

  if (data.text) {
    const text = el('span.button__text', data.text)
    button.append(text)
  }

  return button
}
