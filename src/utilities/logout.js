import reload from '../app'

// Выход пользователя из системы
export default function logout() {
  localStorage.removeItem('token')
  reload()
}
