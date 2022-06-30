import createButton from '../button.js'
import Burger from '../../../assets/images/burger.svg'
import './button--burger.scss'

export default function createBurgerButton() {
  const button = createButton()
  button.classList.add('button--burger')
  button.innerHTML = Burger

  return button
}
