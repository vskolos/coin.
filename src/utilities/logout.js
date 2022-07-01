import reload from './reload.js'

export default function logout() {
  localStorage.removeItem('token')
  reload()
}
