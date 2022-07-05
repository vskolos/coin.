import createButton from '../button'
import './button--primary.scss'

// data = { text, icon }
export default function createPrimaryButton(data) {
  const button = createButton(data)
  button.classList.add('button--primary')

  return button
}
