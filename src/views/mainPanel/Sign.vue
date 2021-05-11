<template>
  <div>
    <drawer
      :drawer="signDrawer"
      @closeDrawer="closeDrawer"
      head-title="标签"
      :right-btn="sideIcon"
      @iconOperate="addSign"
    >
      <!--    滑动列表-->
      <Scroll
        ref="scroll"
        class="better-scroll"
        scroll-height="calc(100vh - 70px)"
      >
        <template v-slot:searchInput> <span></span></template>
        <template v-slot:scrollContent>
          <el-menu
            class="el-menu-vertical-demo"
            active-text-color="#000000"
            :unique-opened="true"
            @open="computedScroll()"
            @close="computedScroll()"
          >
            <file-menu
              v-for="(item, key) in signList"
              :key="key"
              :idnex="key"
              :node="item"
              @menuOptions="delSign"
            ></file-menu>
          </el-menu>
        </template>
      </Scroll>
    </drawer>
    <!--    删除标签-->
    <tip
      ref="delSign"
      tip-icon="#iconsousuo_lajitong"
      tip-title="删除标签"
      @definite="definiteDelete"
    >
      <div class="font_size_30 msgTip">确定删除该标签吗?</div>
    </tip>
    <!--    添加标签-->
    <tip
      ref="addSign"
      tip-icon="#icontianjiabiaoqian"
      tip-title="添加标签"
      @definite="addSignDefinite"
    >
      <input
        v-model="addSignName"
        placeholder="请输入标签名"
        maxlength="10"
        type="text"
        autofocus="autofocus"
        class="msgTip font_size_30"
      />
    </tip>
  </div>
</template>

<script>
import drawer from '@/components/basisModule/drawer'
import Scroll from '@/components/basisModule/scroll'
import fileMenu from '@/components/basisModule/fileMenu'
import Tip from '@/components/panel/Tip'

export default {
  name: 'sign',
  props: {
    signDrawer: {
      default: false,
      type: Boolean,
    },
  },
  components: {
    drawer,
    Scroll,
    fileMenu,
    Tip,
  },
  data() {
    return {
      sideIcon: ['#icontianjiabiaoqian'],
      //  标签列表
      signList: [
        { id: '1', label: '标签', children: [{ id: '10', label: '标签1' }] },
      ],
      addSignName: '',
    }
  },
  methods: {
    //调用父组件事件，监听drawer关闭
    closeDrawer() {
      this.$parent.changSidBarClass(false, 'Sign')
    },
    //  刷新scroll
    computedScroll() {
      //点击展页时有动画存在，因此需要给动画完成时间再重新计算scroll高度
      setTimeout(() => {
        this.$refs.scroll.defineFun((that) => {
          that.refresh()
        })
      }, 300)
    },
    //  添加标签
    addSign() {
      this.$refs.addSign.open()
    },
    //删除标签
    delSign(id) {
      this.$refs.delSign.open()
      console.log(id)
    },
    //确定删除标签
    definiteDelete() {},
    //确定添加标签
    addSignDefinite() {},
  },
}
</script>

<style scoped lang="scss">
@import 'static/style/base';
.msgTip {
  display: block;
  padding: 20px 40px;
  border: none;
  outline: none;
  text-align: center;
}
</style>
