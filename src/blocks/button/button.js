import { el } from 'redom'
import './button.scss'

export default function createButton(text) {
  return el('button.button', text)
}
