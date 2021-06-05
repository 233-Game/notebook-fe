<template>
  <div v-if="noteList.length > 0" class="note-list">
    <transition-group name="note">
      <div
        class="noteList"
        :class="isCheckNote === index ? 'checkNote' : ''"
        v-for="(item, index) in noteList"
        :key="item.id"
        @click="onCheckNote(index)"
      >
        <div class="titleAndOpera">
          <span class="title_content color_87">{{ item.title }}</span>
          <div class="opera">
            <el-tooltip
              :hide-after="0"
              effect="dark"
              content="分享笔记"
              placement="bottom"
            >
              <i @click.stop.prevent="onOpera(0, index)">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#iconfenxiang"></use>
                </svg>
              </i>
            </el-tooltip>
            <el-tooltip
              :hide-after="0"
              effect="dark"
              content="收藏笔记"
              placement="bottom"
            >
              <i @click.stop.prevent="onOpera(1, index)">
                <svg class="icon" aria-hidden="true">
                  <use :xlink:href="isCollect(item)"></use>
                </svg>
              </i>
            </el-tooltip>
            <el-tooltip
              :hide-after="0"
              effect="dark"
              content="删除笔记"
              placement="bottom"
            >
              <i @click.stop.prevent="onOpera(2, index)">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#iconlajilou"></use>
                </svg>
              </i>
            </el-tooltip>
          </div>
        </div>
        <!--            创建时间-->
        <div class="font_size">{{ item.updated_at }}</div>
        <!--            笔记文字内容-->
        <div class="noteContent">{{ item.content }}</div>
      </div>
    </transition-group>
  </div>
  <el-empty v-else description="暂无笔记" />
</template>

<script>
import { compareWidth } from '../../../common/commonFunction'
import { getMap } from '../../../common/setStore'
import { reactive } from 'vue'
import noteServe from '@/api/noteApi'

export default {
  name: 'NoteList',
  components: {},
  props: {
    noteList: {
      type: Array,
    },
    total: {
      default: 0,
      type: Number,
    },
  },
  data() {
    return {
      isCheckNote: 0,
    }
  },
  setup() {
    //排序方式
    let sortLi = reactive([
      '排序方式',
      ' 创建日期（最早优先）',
      '创建日期（最新优先）',
      '更新日期（最早优先）',
      '更新日期（最新优先）',
      '标题（升序排列）',
      '标题（降序排列）',
    ])
    //编辑区图标列表
    let iconList = reactive([
      { desc: '删除笔记', icon: 'iconlajilou' },
      { desc: '复制链接', icon: 'iconfuzhi' },
      { desc: '笔记信息', icon: 'iconinfo' },
    ])

    //获取具体的笔记
    function getNoteContent(noteId) {
      return noteServe.getNoteContent(noteId).then((res) => res)
    }

    //收藏笔记
    function collectNote(noteId) {
      return noteServe.collectNote(noteId).then((res) => res)
    }

    return {
      sortLi,
      iconList,
      getNoteContent,
      collectNote,
    }
  },
  methods: {
    onOpera(num, index) {
      switch (num) {
        case 0:
          //分享
          console.log('分享')
          break
        case 1:
          //收藏
          break
        case 2:
          this.delete(index)
          break
      }
    },
    isCollect(data) {
      if (data.collect === 1) {
        return '#iconshoucang'
      }
      return '#iconshoucang1'
    },
    onCheckNote(index) {
      this.isCheckNote = index
      this.$emit('select', this.noteList[index])
    },
    delete(index) {
      this.$emit('delete', index)
    },
  },
  computed: {
    cssVar() {
      let width = compareWidth(1200)
      //true 正常显示 false 特殊处理
      return {
        '--varWidth': width ? '25%' : '35%',
        '--icon_font_bgc': getMap('IconFontBGC'),
        '--search_list_font_color': getMap('SearchListFontColor'),
      }
    },
    computedWidth() {
      let width = compareWidth(1200)
      return width ? 'calc((100vw - 100px)*0.25)' : 'calc((100vw - 100px)*0.35)'
    },
    haveNote() {
      return this.noteList.length === this.total
    },
  },
}
</script>

<style scoped lang="scss">
@import 'static/style/base';

.note {
  width: 100%;
  height: 100vh;
}

.noteTitle {
  width: var(--varWidth);
  height: 100%;
  border-right: 1px solid #ececec;

  .handle {
    position: relative;
    width: 100%;
    height: 50px;
    padding: 10px 0;
    cursor: default;

    span:first-child {
      display: inline-block;
      margin-left: 20px;
    }
  }

  .addIcon {
    position: absolute;
    right: 20px;
    cursor: pointer;
    vertical-align: middle;
  }
}

.optionCard {
  li {
    padding: 15px 20px;
    cursor: pointer;
  }

  li:hover {
    background-color: var(--icon_font_bgc);
    color: var(--search_list_font_color);
  }

  li:first-child:hover {
    background-color: #fff;
    font-size: 14px !important;
    color: #999999;
    cursor: default;
  }

  li:first-child {
    color: #999999;
    font-size: 14px !important;
  }
}

.editNote {
  flex: 1;
  width: 30%;
  height: 100%;
}

.editNoteIcon {
  outline: none;
}

.noteList {
  box-sizing: border-box;
  width: 100%;
  height: 95px;
  padding: 10px 20px;

  .titleAndOpera {
    position: relative;
    font-size: 18px;
  }

  .title_content {
    display: inline-block;
  }

  .opera {
    display: inline-block;
    position: absolute;
    right: 0;

    i {
      outline: none;
    }

    svg {
      margin-left: 15px;
    }
  }

  .noteContent {
    margin-top: 10px;
    font-size: 14px;
    color: #333333;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}

//  笔记选中后的样式
.checkNote {
  border: 3px solid #999999;
}
</style>

<style lang="scss">
.note-list {
  .el-popover {
    padding: 0 !important;
  }

  .note-leave-to {
    opacity: 0;
    //transform: translateX(-80px);
  }

  .note-leave-active {
    transition: all 0.5s ease;
    position: absolute;
  }

  .note-move {
    transition: all 0.5s ease;
  }
}
</style>
