//引入路由
// import route from '@/router/index'
import BScroll from '@better-scroll/core'
//上拉加载插件
import PullUp from '@better-scroll/pull-up'
//下拉刷新插件
import PullDown from '@better-scroll/pull-down'
//滑轮滚动插件
import MouseWheel from '@better-scroll/mouse-wheel'
BScroll.use(MouseWheel)
BScroll.use(PullUp)
BScroll.use(PullDown)
export default {
  //  请求地址
  // webUrl: 'note.blankqwq.com',
  //滚动条初始化
  //ref指定的元素 TIME_BOUNCE 到底的回弹时间
  __init_scroll(ref, TIME_BOUNCE = 700) {
    return new BScroll(ref, {
      scrollY: true,
      bounceTime: TIME_BOUNCE,
      useTransition: true,
      mouseWheel: true,
      pullUpLoad: {
        //拉高90时触发
        threshold: -90,
      },
      pullDownRefresh: {
        threshold: 90,
        stop: 40,
      },
    })
  },
  //  开启下拉刷新，上拉加载，等操作
  __pulling(that, operaName = '', fun = null) {
    that.on(operaName, () => {
      fun()
    })
  },
  //  比对当前屏幕宽与给定的宽
  //true正常显示 false特殊处理
  compareWidth(width = 0) {
    const windowWidth = document.body.clientWidth
    if (width >= windowWidth) {
      return false
    }
    return true
  },
}
