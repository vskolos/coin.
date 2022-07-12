import reload from '../app'

export default function logout() {
  localStorage.removeItem('token')
  reload()
}
