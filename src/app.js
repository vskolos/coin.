import renderAccountsPage from './pages/accounts.js'
import renderAccountPage from './pages/account.js'
import renderLoginPage from './pages/login.js'

const params = new URLSearchParams(document.location.search)
const page = params.get('page')
const account = params.get('account')

if (!localStorage.token) {
  renderLoginPage()
} else if (page === 'accounts') {
  renderAccountsPage()
} else if (page === 'account' && account) {
  renderAccountPage(account)
} else {
  renderAccountsPage()
}
