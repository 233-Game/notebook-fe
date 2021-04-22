<template>
  <drawer :drawer="noteBookDrawer" @closeDrawer="closeDrawer">
    <template v-slot:title>
      <!--      头-->
      <div class="book_header">
        <span class="color_87 font_size_18">笔记本</span>
        <span class="font_size">（{{ bookList.length }} 本笔记本）</span>
        <i class="color_87 font_size_18 add_book_icon">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconlajitong"></use>
          </svg>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconadd-files"></use>
          </svg>
        </i>
      </div>
    </template>
    <!--      滑动列表-->
    <scroll class="scroll" scroll-height="calc(100vh - 130px)">
      <template v-slot:scrollContent>
        <div
          class="book_list flex_ACenter"
          v-for="(item, index) in bookList"
          :key="index"
        >
          <el-image class="displayImage" :src="item.url" fit="cover" />
          <div class="rightItem">
            <span class="name font_size_18">{{ item.name }}</span>
            <span class="desc color_87">{{ item.desc }}</span>
            <span class="time font_size">{{ item.time }}</span>
          </div>
        </div>
      </template>
    </scroll>
  </drawer>
</template>

<script>
import drawer from '@/components/basisModule/drawer'
import scroll from '@/components/basisModule/scroll'

export default {
  name: 'NoteBook',
  props: {
    noteBookDrawer: {
      default: false,
      type: Boolean,
    },
  },
  components: {
    drawer,
    scroll,
  },
  data() {
    return {
      //笔记本列表
      bookList: [
        {
          name: '初级',
          url: '/static/img/noteBook.png',
          desc: '这是一个简单的笔记本',
          time: '4-18',
        },
        {
          name: '初级',
          url: '/static/img/noteBook.png',
          desc: '这是一个简单的笔记本',
          time: '4-18',
        },
        {
          name: '初级',
          url: '/static/img/noteBook.png',
          desc: '这是一个简单的笔记本',
          time: '4-18',
        },
        {
          name: '初级',
          url: '/static/img/noteBook.png',
          desc: '这是一个简单的笔记本',
          time: '4-18',
        },
        {
          name: '初级',
          url: '/static/img/noteBook.png',
          desc: '这是一个简单的笔记本',
          time: '4-18',
        },
        {
          name: '初级',
          url: '/static/img/noteBook.png',
          desc: '这是一个简单的笔记本',
          time: '4-18',
        },
        {
          name: '初级',
          url: '/static/img/noteBook.png',
          desc: '这是一个简单的笔记本',
          time: '4-18',
        },
        {
          name: '初级',
          url: '/static/img/noteBook.png',
          desc: '这是一个简单的笔记本',
          time: '4-18',
        },
      ],
    }
  },
  methods: {
    closeDrawer() {
      this.$parent.changSidBarClass(false)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'static/style/base.scss';

.book_header {
  position: relative;
  height: 50px;
}

.add_book_icon {
  position: absolute;
  right: 0;

  .icon {
    margin: 0 10px;
    cursor: pointer;
  }
}

.scroll {
  position: relative;
  box-shadow: none !important;
  border-top: none !important;
}

.book_list {
  width: calc(100% - 20px);
  height: 150px;
  box-sizing: border-box;
  margin: 0 10px;
  padding: 0 10px;
  border-bottom: 1px solid #ececec;

  .displayImage {
    width: 110px;
    height: 110px;
    margin-right: 20px;
  }

  .rightItem {
    position: relative;
    width: 100px;
    height: 110px;
    flex: 1;
    cursor: pointer;

    span {
      display: block;
    }

    .desc {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  .time {
    display: inline-block;
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>
