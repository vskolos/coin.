import reload from './reload'

export default function logout() {
  localStorage.removeItem('token')
  reload()
}
