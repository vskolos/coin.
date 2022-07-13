import { el } from 'redom'
import './header.scss'

// Blocks
import createContainer from '../container/container'
import createLogo from '../logo/logo'
import createButton from '../button/button'
import createMenu from '../menu/menu'

// SVG
import Burger from '../../assets/images/burger.svg'

// menuItems = [ item1, item2, ... ]
//   itemN = { text, disabled, handler }
export default function createHeader(menuItems) {
  const header = el('header.header')

  const container = createContainer()
  header.append(container)

  const logo = createLogo()
  container.append(logo)

  if (menuItems) {
    const burger = createButton({ icon: Burger })
    container.append(burger)

    const menuList = []
    menuItems.forEach((item) => {
      menuList.push({
        text: item.text,
        disabled: item.disabled,
        handler: item.handler,
      })
    })
    const menu = createMenu(menuList)
    container.append(menu)

    burger.classList.add('button--burger')
    burger.addEventListener('click', () => {
      menu.classList.toggle('menu--visible')
    })
  }

  return header
}
