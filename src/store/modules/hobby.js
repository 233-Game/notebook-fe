const hobby = {
  state: () => ({
    ThemeColor: '#F7F7F7', // 主体栏颜色
    IconFontColor: '#2CBD5F', // 字体图标颜色
    BtnFillColor: '#E8F0FF', // 信息卡片按钮填充色
    BtnFontColor: '#000000', // 字体颜色
    EditPanelColor: '#FFFFFF', // 编辑版颜色
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
