<template>
  <div id="board">
    <table cellspacing="1" cellpadding="0">
      <tr v-for="r in dimrange">
        <td class="boardCell" v-for="c in dimrange">
          <grid :index="{r: r, c: c}" :data="board[r][c]"/>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import Grid from '@/Grid.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'board',
  components: {
    Grid
  },
  computed: {
    ...mapState('game', [
      'board'
    ]),
    ...mapGetters('game', {
      dimrange: 'dimrange'
    })
  },
  methods: {
  }
}
</script>

<style lang="stylus">
table,tr,td,div
    margin 0px
    padding 0px
    border 0px

b
    color #FFFFFF
    font-weight bold

a
    color #FFAEAE
    text-decoration none

a:hover
    color #FFFFFF
    text-decoration none


td.boardCellGroupA,td.boardCellGroupB
    background-color #940302

td.boardCellGroupA td.boardCell
    width 44px
    height 44px
    border 1px solid #EC0904
    background-color #DA0603

td.boardCellGroupB td.boardCell
    width 44px
    height 44px
    border 1px solid #D40703
    background-color #C40502

.staticValue
    font-family Segoe UI, Arial
    text-align center
    vertical-align middle
    font-size 30px
    color #6C0000

.staticValue,.editValue
    width 42px
    height 42px
    padding 0px
    margin 0px
    border 1px solid #DA0603

.editValue:hover
    background #940302

label
    position relative
    top 3px
    line-height 24px
    font-size 15px
    color #FFFFFF

select
    font-family Arial
    color #999999
    font-weight normal
    font-size 12px
    border-top solid 1px #CCCCCC
    border-left solid 1px #E2E3EA
    border-bottom solid 1px #FFFFFF
    border-right solid 1px #E2E3EA
    margin 3px 0px
    min-width 100px
    background #FDFDFD

#timeFinished
    font-family Segoe UI, Arial
    font-size 46px
    font-weight bold
    line-height 40px

.finishedLabel,#timeFinished
    color #FBF2A8

.editValue input
    font-family Segoe UI, Arial
    font-size 30px
    color #FFFFFF
    width 44px
    /*height 44px*/
    padding 0px
    border 0px
    background none !important
    text-align center
    vertical-align middle
    position relative
    left -1px

input[type="submit"]
    font-family Arial
    font-size 18px
    color #FFFFFF
    text-transform uppercase
    border 0px
    min-width 162px
    min-height 34px
    background url('~statics/images/submitBackground.png') repeat-x
    margin 8px 0px
    cursor pointer

input[type="submit"].gameControls
    font-family Arial
    font-size 16px
    color #FFFFFF
    text-transform uppercase
    border 0px
    min-width 28px
    min-height 28px
    background url('~statics/images/submitSmallBackground.png') repeat-x
    margin 8px 0px
    padding 2px 16px
    cursor pointer

.gameControlSet
    height 142px
    position relative
    top -8px

#buttonSolve
    margin-top 119px
    color #FFAEAE

#youWon
    width 100%
    height 100%
    position absolute
    top 0px
    right 0px
    background url('~statics/images/shade.png') repeat

#youWon div
    width 400px
    background #940302
    font-size 40px
    color #FFFFFF
    text-align center
    padding 40px
    margin 100px auto 0px auto

small
    font-size 14px
    color #FFFD7B

.noErrors
    font-size 18px
    font-weight bold
    color #FFFFFF

.errorsFound
    font-size 18px
    font-weight bold
    color #ED823F

.error
    border 1px solid #ED823F
</style>
