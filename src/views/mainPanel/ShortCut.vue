<template>
  <div>
    <drawer
      :drawer="shortDrawer"
      @closeDrawer="closeDrawer"
      head-title="文件夹"
      :right-btn="sideIcon"
      @iconOperate="addFile"
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
              v-for="(item, key) in nodeList"
              :key="key"
              :idnex="key"
              :node="item"
              @menuOptions="menuOptions"
              :is-collect="true"
            ></file-menu>
          </el-menu>
        </template>
      </Scroll>
    </drawer>
    <!--    删除收藏-->
    <tip
      ref="delCollect"
      tip-icon="#iconsousuo_lajitong"
      tip-title="删除文件"
      @definite="definiteDelete"
    >
      <div class="font_size_30 msgTip">确定删除该文件吗?</div>
    </tip>
    <!--    添加文件夹-->
    <tip
      ref="addFile"
      tip-icon="#icontianjiawenjianjia"
      tip-title="添加文件夹"
      @definite="addFilesDefinite"
    >
      <input
        v-model="addFileName"
        placeholder="请输入文件夹名"
        maxlength="10"
        type="text"
        autofocus="autofocus"
        @click.stop.prevent=""
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
  name: 'ShortCut',
  props: {
    shortDrawer: {
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
      sideIcon: ['#iconzujian-shuzuzhi'],
      //  节点列表
      nodeList: [
        { id: '0', label: '收藏' },
        {
          id: '1',
          label: '一级 1',
          children: [
            {
              id: '4',
              label: '二级 1-1',
              children: [
                {
                  id: '9',
                  label: '三级 1-1-1',
                },
                {
                  id: '10',
                  label: '三级 1-1-2',
                },
              ],
            },
          ],
        },
        {
          id: '2',
          label: '一级 2',
          children: [
            {
              id: '5',
              label: '二级 2-1',
            },
            {
              id: '6',
              label: '二级 2-2',
            },
          ],
        },
        {
          id: '3',
          label: '一级 3',
          children: [
            {
              id: '7',
              label: '二级 3-1',
              children: [
                {
                  id: '101',
                  label: '二级 3-1',
                },
              ],
            },
            {
              id: '8',
              label: '二级 3-2',
            },
          ],
        },
      ],
      //  添加目录的名称
      addFileName: '',
    }
  },
  methods: {
    //调用父组件事件，监听drawer关闭
    closeDrawer() {
      this.$parent.changSidBarClass(false, 'ShortCut')
    },
    //  添加目录
    addFile() {
      this.$refs.addFile.open()
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
    //  菜单选项
    menuOptions(id, index) {
      switch (index) {
        //添加文件夹
        case 0:
          this.$refs.addFile.open()
          break
        //添加文件
        case 1:
          break
        //删除文件或文件夹
        case 2:
          console.log('shortCut', id)
          this.$refs.delCollect.open()
          break
      }
    },
    //  tip确定删除
    definiteDelete() {
      console.log('sure')
    },
    //  添加文件夹确定
    addFilesDefinite() {},
  },
}
</script>

<style scoped lang="scss">
@import 'static/style/base.scss';
.headTitle {
  display: block;
  height: 50px;
}
.msgTip {
  display: block;
  padding: 20px 40px;
  border: none;
  outline: none;
  text-align: center;
}
</style>
