<template>
  <div :class="styleClass" @click="myClick" @dblclick="myClick">
    {{getDigit}}
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'candidate',
  data () {
    return {
      clickFlag: 0
    }
  },
  props: {
    digit: {
      type: Number,
      default: 1,
      required: true,
      validator: function (value) {
        return value >= 1 && value <= 9
      }
    },
    gridIndex: {
      type: Object
    },
    index: {
      type: Object
    },
    state: {
      type: String,
      default: 'disactive'
    }
  },
  computed: {
    getDigit () {
      // console.log('getDigit()')
      return this.digit === 0 ? '' : this.digit
    },
    styleClass () {
      return this.state === 'active' ? 'candidate active' : 'candidate disactive'
    }
  },
  methods: {
    ...mapMutations('game', [
      'setDigit',
      'switchMode',
      'setCandidate'
    ]),
    myClick () {
      // console.log('myClick()', this.clickFlag)
      if (!this.clickFlag) {
        setTimeout(() => {
          if (this.clickFlag === 1) {
            this.switchState()
          }
          else {
            this.selectCandidate()
          }
          this.clickFlag = 0
        }, 300)
      }
      this.clickFlag++
    },
    switchState () {
      console.log('switchState')
      this.setCandidate({gridIndex: this.gridIndex, cellIndex: this.index, digit: this.digit})
    },
    selectCandidate () {
      // console.log('selectCandidate', this.index, this.gridIndex, this.state)
      if (this.state === 'active') {
        this.setDigit({gridIndex: this.gridIndex, cellIndex: this.index, digit: this.digit})
      }
      else {
        this.setDigit({gridIndex: this.gridIndex, cellIndex: this.index, digit: 0})
      }
      this.switchMode({gridIndex: this.gridIndex, cellIndex: this.index})
    }
  }
}
</script>

<style lang="stylus">
.candidate {
  font-family: Segoe UI, Arial;
  font-size: 10px;
  width: 14px;
  height: 14px;
  padding: 0px;
  border: 0px;
  /* background none !important */
  text-align: center;
  vertical-align: middle;
  position: relative;
  left: -1px;
  background-color: rgba(60, 144, 255, 0.1);
}

.candidate:hover {
  border 1px solid #30c030
}

.disactive {
  color: rgba(160, 160, 160, 0.1);
}

.active {
  color: #30c030;
}
</style>
