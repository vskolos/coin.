import { el } from 'redom'
import Logo from '../../assets/images/logo.svg'
import './logo.scss'

export default function createLogo() {
  const logo = el('div.logo')
  logo.innerHTML = Logo

  return logo
}
