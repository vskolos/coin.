// Libraries
import { el } from 'redom'

// Blocks
import createContainer from '../container/container'
import createLogo from '../logo/logo'
import createButton from '../button/button'
import createMenu from '../menu/menu'

// CSS
import './header.scss'

// SVG
import Burger from '../../assets/images/burger.svg'

// Создание шапки страницы
export default function createHeader(menuItems) {
  const header = el('header.header')

  const container = createContainer()
  header.append(container)

  const logo = createLogo()
  container.append(logo)

  if (menuItems) {
    const burger = createButton({
      icon: Burger,
      handler: () => {
        menu.classList.toggle('menu--visible')
      },
    })
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
  }

  return header
}
