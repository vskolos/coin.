import renderAccountsPage from '../pages/accounts.js'
import renderAccountPage from '../pages/account.js'
import renderLoginPage from '../pages/login.js'

export default function reload(path = '') {
  const origin = location.origin
  const pathname = path ? path : location.pathname

  if (path) {
    history.pushState({}, '', `${origin}${path}`)
  }

  if (!localStorage.token) {
    history.pushState({}, '', origin)
    renderLoginPage()
  } else if (pathname === '/accounts') {
    renderAccountsPage()
  } else if (pathname.match(/^\/accounts\/\d+$/)) {
    renderAccountPage(pathname.split('/')[2])
  } else {
    history.pushState({}, '', `${origin}/accounts`)
    renderAccountsPage()
  }
}
