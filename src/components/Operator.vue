<template>
  <div id="operator">
    <table cellspacing="1" cellpadding="0">
      <tr>
        <td>
          <q-btn color="primary" @click="operate(1)">1</q-btn>
        </td>
        <td>
          <q-btn color="primary" @click="operate(2)">2</q-btn>
        </td>
        <td>
          <q-btn color="primary" @click="operate(3)">3</q-btn>
        </td>
        <td>
          <q-btn color="primary" @click="operate(4)">4</q-btn>
        </td>
        <td>
          <q-btn color="primary" @click="operate(5)">5</q-btn>
        </td>
        <td colspan="2" style="height: 100%;">
          <q-btn color="primary" @click="switchCurrentCellMode">Switch</q-btn>
        </td>
      </tr>
      <tr>
        <td>
          <q-btn color="primary" @click="operate(6)">6</q-btn>
        </td>
        <td>
          <q-btn color="primary" @click="operate(7)">7</q-btn>
        </td>
        <td>
          <q-btn color="primary" @click="operate(8)">8</q-btn>
        </td>
        <td>
          <q-btn color="primary" @click="operate(9)">9</q-btn>
        </td>
        <td>
          <q-btn color="primary" @click="operate(0)">x</q-btn>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import {QBtn} from 'quasar'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'operator',
  components: {
    QBtn
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState('game', [
      'currentCell'
    ])
  },
  methods: {
    ...mapActions('game', [
      'operate',
      'switchCurrentCellMode'
    ])
  }
}
</script>

<style lang="stylus">
#operator  td {
    padding: 10px;
  }
</style>
