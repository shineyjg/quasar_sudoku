<template>
  <div style="position: relative;"  @mouseleave="hideContextMenu"  @contextmenu.stop="showContextMenu">
    <cell-menu v-if="showmenu" v-on:menuItemSelected="menuItemSelected" :position="menuPosition"/>
    <input v-else pattern="[0-9]*" maxlength="1" :readonly="readonly" :value="getDigit" @change="change" @dblclick.stop="switchCellMode" :class="cellClass">
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import CellMenu from '@/CellMenu.vue'

export default {
  name: 'cell',
  components: {
    CellMenu
  },
  data () {
    return {
      showmenu: false,
      menuPosition: {
        left: 0,
        top: 0
      }
    }
  },
  props: {
    data: {
      type: Object
    },
    gridIndex: {
      type: Object
    },
    index: {
      type: Object
    }
  },
  computed: {
    ...mapState('game', [
      'check'
    ]),
    readonly () {
      return this.data.origin || !this.$q.platform.is.desktop
    },
    getDigit () {
      // console.log('getDigit()')
      return this.data.digit === 0 ? '' : this.data.digit
    },
    cellClass () {
      // console.log('cellClass', this.currentCell)
      let c = 'origin'

      // if (this.currentCell.gridIndex.r === this.gridIndex.r && this.currentCell.gridIndex.c === this.gridIndex.c && this.currentCell.cellIndex.r === this.index.r && this.currentCell.cellIndex.c === this.index.c) {
      //   c += ' currentCell'
      // }

      if (this.data.origin) {
        return c
      }

      if (this.check && this.data.digit > 0 && this.data.digit !== this.data.answer) {
        return c + ' error'
      }

      return c + ' digit'
    }
  },
  methods: {
    ...mapMutations('game', [
      'setDigit',
      'switchMode',
      'setCurrentCellIndex'
    ]),
    change (e) {
      var v = parseInt(e.target.value || 0)
      // console.log('Cell.change()', v)
      this.setDigit({gridIndex: this.gridIndex, cellIndex: this.index, digit: v})
    },
    switchCellMode () {
      if (this.data.origin) {
        return
      }
      this.switchMode({gridIndex: this.gridIndex, cellIndex: this.index})
    },
    showContextMenu (e) {
      e.preventDefault()
      this.setCurrentCellIndex({gridIndex: this.gridIndex, cellIndex: this.index})
      if (this.data.origin) {
        return
      }
      this.showmenu = true
      // console.log('contextmenu', this.showmenu, this.menuPosition.left, this.menuPosition.top)
      return false
    },
    hideContextMenu () {
      // console.log('hideContextMenu')
      this.showmenu = false
    },
    menuItemSelected (d) {
      // console.log(d)
      this.showmenu = false
      this.setDigit({gridIndex: this.gridIndex, cellIndex: this.index, digit: d})
    }
  }
}
</script>

<style lang="stylus">
.origin
  font-family Segoe UI, Arial
  font-size 30px
  color black
  width 46px
  height 46px
  padding 0px
  border 0px
  /* background none !important */
  text-align center
  vertical-align middle
  position relative
  left -1px
  background-color rgba(60, 144, 255, 0.1)
.digit
  color #30c030
.error
  color #c05050
</style>
