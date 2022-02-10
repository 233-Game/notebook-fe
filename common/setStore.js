import store from '@/store/index'
//获取样式
export function getMap(itemName) {
  let getTheme = store.getters.getTheme
  return getTheme[itemName]
}
