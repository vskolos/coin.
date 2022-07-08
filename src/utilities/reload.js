import renderLoginPage from '../pages/login'
import renderAccountsPage from '../pages/accounts'
import renderAccountPage from '../pages/account'
import renderHistoryPage from '../pages/history'
import renderCurrencyPage from '../pages/currency'
import renderBanksPage from '../pages/banks'

export default function reload(path = '') {
  const origin = location.origin
  const pathname = path ? path.split('?')[0] : location.pathname
  const search = path ? path.split('?')[1] : location.search

  if (path) {
    history.pushState(
      {},
      '',
      `${origin}${pathname}${search ? `?${search}` : ''}`
    )
  }

  if (!localStorage.token) {
    history.pushState({}, '', origin)
    renderLoginPage()
  } else if (pathname === '/accounts') {
    const params = new URLSearchParams(search)
    if (params.has('sort')) {
      renderAccountsPage(params.get('sort'))
    } else {
      renderAccountsPage()
    }
  } else if (pathname.match(/^\/accounts\/\d+$/)) {
    renderAccountPage(pathname.split('/')[2])
  } else if (pathname.match(/^\/accounts\/\d+\/history$/)) {
    renderHistoryPage(pathname.split('/')[2])
  } else if (pathname === '/currency') {
    renderCurrencyPage()
  } else if (pathname === '/banks') {
    renderBanksPage()
  } else {
    history.pushState({}, '', `${origin}/accounts`)
    renderAccountsPage()
  }
}
