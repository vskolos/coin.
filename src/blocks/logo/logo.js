import { el } from 'redom'
import './logo.scss'
import Logo from '../../assets/images/logo.svg'

// Создание логотипа
export default function createLogo() {
  const logo = el('.logo')
  logo.innerHTML = Logo

  return logo
}
