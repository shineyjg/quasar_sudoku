<template>
  <q-layout
    ref="layout"
    view="lHh Lpr fff"
    :left-class="{'bg-grey-2': true}"
  >
    <q-toolbar slot="header" class="glossy">
      <q-btn
        flat
        @click="$refs.layout.toggleLeft()"
      >
        <q-icon name="menu" />
      </q-btn>

      <q-toolbar-title>
        Sudoku
        <div slot="subtitle">by Vincent Yang</div>
      </q-toolbar-title>
    </q-toolbar>

    <div slot="left">
      <!--
        Use <q-side-link> component
        instead of <q-item> for
        internal vue-router navigation
      -->

      <q-list no-border link inset-delimiter>
        <q-list-header>Level</q-list-header>
        <q-item>
          <q-radio v-model="gameLevel" val="0" label="Very Easy" unchecked-icon=""
  checked-icon="done" class="full-width"/>
        </q-item>
        <q-item>
          <q-radio v-model="gameLevel" val="1" label="Easy" unchecked-icon=""
  checked-icon="done" class="full-width"/>
        </q-item>
        <q-item>
          <q-radio v-model="gameLevel" val="2" label="Moderate" unchecked-icon=""
  checked-icon="done" class="full-width"/>
        </q-item>
        <q-item>
          <q-radio v-model="gameLevel" val="3" label="Difficult" unchecked-icon=""
  checked-icon="done" class="full-width"/>
        </q-item>
        <q-item>
          <q-radio v-model="gameLevel" val="4" label="Very Difficult" unchecked-icon=""
  checked-icon="done" class="full-width"/>
        </q-item>
        <q-item>
          <q-btn loader class="full-width" color="primary" @click="myNewGame">New Game</q-btn>
        </q-item>
        <q-item>
          <q-checkbox v-model="gameCheck" label="Check Error" unchecked-icon="clear"
  checked-icon="done" class="full-width"/>
        </q-item>
        <q-item>
          <q-btn class="full-width" color="primary" @click="removeError">Remove Errors</q-btn>
        </q-item>
      </q-list>
    </div>

    <!--
      Replace following <div> with
      <router-view /> component
      if using subRoutes
    -->
    <div class="layout-padding" :class="paddingClass">
      <span>{{currentLevel}}</span>
      <span style="margin-left: 40px;">{{gameTime}}</span>
      <span v-if="isSolved" style="margin-left: 40px;">You win</span>
      <br>
      <br>
      <board />
      <operator style="margin-top: 10px;"/>
    </div>
  </q-layout>
</template>

<script>
import {
  dom,
  event,
  openURL,
  QLayout,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain,
  QRadio,
  QCheckbox
} from 'quasar'
import Board from '@/Board.vue'
import Operator from '@/Operator.vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import util from '../store/modules/model/util'
const
  { viewport } = dom,
  { position } = event,
  moveForce = 30,
  rotateForce = 40,
  RAD_TO_DEG = 180 / Math.PI

function getRotationFromAccel (accelX, accelY, accelZ) {
  /* Reference: http://stackoverflow.com/questions/3755059/3d-accelerometer-calculate-the-orientation#answer-30195572 */
  const sign = accelZ > 0 ? 1 : -1
  const miu = 0.001

  return {
    roll: Math.atan2(accelY, sign * Math.sqrt(Math.pow(accelZ, 2) + miu * Math.pow(accelX, 2))) * RAD_TO_DEG,
    pitch: -Math.atan2(accelX, Math.sqrt(Math.pow(accelY, 2) + Math.pow(accelZ, 2))) * RAD_TO_DEG
  }
}

let timeHandle

export default {
  name: 'index',
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QRadio,
    QCheckbox,
    Board,
    Operator
  },
  data () {
    return {
      orienting: window.DeviceOrientationEvent && !this.$q.platform.is.desktop,
      rotating: window.DeviceMotionEvent && !this.$q.platform.is.desktop,
      moveX: 0,
      moveY: 0,
      rotateY: 0,
      rotateX: 0,
      gameLevel: '0',
      startTime: new Date().getTime(),
      nowTime: new Date().getTime()
    }
  },
  computed: {
    ...mapState('game', [
      'level',
      'check',
      'isSolved'
    ]),
    ...mapGetters('game', [
      'currentLevel'
    ]),
    paddingClass () {
      return this.$q.platform.is.desktop ? 'my-layout-padding' : 'my-layout-padding-mobile'
    },
    gameTime () {
      return util.formatTime(this.nowTime - this.startTime)
    },
    gameCheck: {
      get () {
        return this.check
      },
      set (val) {
        // console.log('setGameCheck()', val)
        this.setCheck(val)
      }
    },
    position () {
      const transform = `rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg)`
      return {
        top: this.moveY + 'px',
        left: this.moveX + 'px',
        '-webkit-transform': transform,
        '-ms-transform': transform,
        transform
      }
    }
  },
  watch: {
    // whenever question changes, this function will run
    isSolved: function () {
      if (timeHandle) {
        clearInterval(timeHandle)
        timeHandle = undefined
      }
    }
  },
  methods: {
    ...mapMutations('game', [
      'setLevel',
      'setCheck',
      'removeError'
    ]),
    ...mapActions('game', [
      'newGame'
    ]),
    myNewGame (event, done) {
      if (timeHandle) {
        clearInterval(timeHandle)
        timeHandle = undefined
      }
      this.newGame(parseInt(this.gameLevel)).then(() => {
        this.startTime = new Date().getTime()
        this.nowTime = new Date().getTime()
        if (!timeHandle) {
          timeHandle = setInterval(() => {
            this.nowTime = new Date().getTime()
          }, 300)
        }
        if (done) {
          done()
        }
      })
    },
    launch (url) {
      openURL(url)
    },
    move (evt) {
      const
        {width, height} = viewport(),
        {top, left} = position(evt),
        halfH = height / 2,
        halfW = width / 2

      this.moveX = (left - halfW) / halfW * -moveForce
      this.moveY = (top - halfH) / halfH * -moveForce
      this.rotateY = (left / width * rotateForce * 2) - rotateForce
      this.rotateX = -((top / height * rotateForce * 2) - rotateForce)
    },
    rotate (evt) {
      if (evt.rotationRate &&
          evt.rotationRate.beta !== null &&
          evt.rotationRate.gamma !== null) {
        this.rotateX = evt.rotationRate.beta * 0.7
        this.rotateY = evt.rotationRate.gamma * -0.7
      }
      else {
        /* evt.acceleration may be null in some cases, so we'll fall back
           to evt.accelerationIncludingGravity */
        const
          accelX = evt.acceleration.x || evt.accelerationIncludingGravity.x,
          accelY = evt.acceleration.y || evt.accelerationIncludingGravity.y,
          accelZ = evt.acceleration.z || evt.accelerationIncludingGravity.z - 9.81,
          rotation = getRotationFromAccel(accelX, accelY, accelZ)

        this.rotateX = rotation.roll * 0.7
        this.rotateY = rotation.pitch * -0.7
      }
    },
    orient (evt) {
      if (evt.beta === null || evt.gamma === null) {
        window.removeEventListener('deviceorientation', this.orient, false)
        this.orienting = false

        window.addEventListener('devicemotion', this.rotate, false)
      }
      else {
        this.rotateX = evt.beta * 0.7
        this.rotateY = evt.gamma * -0.7
      }
    }
  },
  mounted () {
    this.myNewGame()
    this.$nextTick(() => {
      if (this.orienting) {
        window.addEventListener('deviceorientation', this.orient, false)
      }
      else if (this.rotating) {
        window.addEventListener('devicemove', this.rotate, false)
      }
      else {
        document.addEventListener('mousemove', this.move)
      }
    })
  },
  beforeDestroy () {
    if (this.orienting) {
      window.removeEventListener('deviceorientation', this.orient, false)
    }
    else if (this.rotating) {
      window.removeEventListener('devicemove', this.rotate, false)
    }
    else {
      document.removeEventListener('mousemove', this.move)
    }
  }
}
</script>

<style lang="stylus">
.my-layout-padding {
    padding: 2rem 8rem;
  }
.my-layout-padding-mobile {
    padding: 1rem 0rem;
  }
</style>
