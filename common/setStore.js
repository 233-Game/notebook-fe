import store from '@/store/index'
export function getMap(itemName) {
  let getTheme = store.getters.getTheme
  return getTheme[itemName]
}
