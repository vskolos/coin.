import createButton from '../button.js'
import './button--secondary.scss'

// data = { text, icon }
export default function createSecondaryButton(data) {
  const button = createButton(data)
  button.classList.add('button--secondary')

  return button
}
