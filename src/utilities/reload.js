export default function reload(search = '') {
  const url = window.location.href.split('?')[0].replace(/\/$/, '')
  window.location.assign(`${url}/${search}`)
}
