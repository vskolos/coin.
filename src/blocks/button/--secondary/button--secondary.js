import createButton from '../button.js'
import './button--secondary.scss'

export default function createSecondaryButton(text) {
  const button = createButton(text)
  button.classList.add('button--secondary')

  return button
}
