const hobby = {
  state: () => ({
    ThemeColor: '#F7F7F7', // 侧边栏背景颜色
    IconFontColor: '#2CBD5F', // 侧边栏字体图标颜色
    IconFontBGC: '#ECF5FF', //侧边栏字体图标背景色、搜索列表触碰色
    SearchListFontColor: '#000000', // 搜索列表触碰后的字体颜色
    IconBorderColor: '#c9e3ff', //侧边栏字体图标边框色
    BtnFillColor: '#E8F0FF', // 信息卡片按钮填充色
    BtnFontColor: '#000000', // 信息卡片按钮字体颜色
    EditPanelColor: '#ffffff', // 主体内容面板
  }),
  mutations: {
    setTheme(state, payload) {
      state.ThemeColor = payload.themeColor
      state.FontColor = payload.FontColor
    },
  },
  getters: {
    getTheme(state) {
      return state
    },
  },
}
export default hobby
