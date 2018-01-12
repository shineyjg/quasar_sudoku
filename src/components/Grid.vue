<template>
  <div>
    <table cellspacing="1" cellpadding="0">
      <tr v-for="r in dim">
        <td v-for="c in dim" class="cell" :class="style(r,c)" @click="setCurrentCellIndex({gridIndex: index, cellIndex: {r: r, c: c}})">
          <cell v-if="data[r][c].mode===0" :data="data[r][c]" :gridIndex="index" :index="{r: r, c: c}"/>         
          <candidate-grid v-else :candidate="data[r][c].candidate" :gridIndex="index" :index="{r: r, c: c}"/>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import Cell from '@/Cell.vue'
import CandidateGrid from '@/CandidateGrid.vue'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'grid',
  components: {
    Cell,
    CandidateGrid
  },
  data () {
    return {
    }
  },
  props: ['data', 'index', 'candidate'],
  computed: {
    ...mapState('game', [
      'currentCell'
    ]),
    dim () {
      return Array.from(Array(this.data.length), (v, k) => k)
    },
    gridId () {
      return 'grid' + this.index.r + this.index.c
    }
  },
  methods: {
    ...mapMutations('game', [
      'setCurrentCellIndex'
    ]),
    style (r, c) {
      if (this.currentCell.gridIndex.r === this.index.r && this.currentCell.gridIndex.c === this.index.c && this.currentCell.cellIndex.r === r && this.currentCell.cellIndex.c === c) {
        return 'currentCell'
      }
      return ''
    },
    launch (url) {
    },
    move (evt) {
    }
  }
}
</script>

<style lang="stylus">
.cell
  border 1px solid rgba(60, 144, 255, 0.3)
.currentCell
  border 1px solid #30c030
</style>
