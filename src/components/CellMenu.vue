<template>
  <div id="menu">
    <table cellspacing="1" cellpadding="0">
      <tr v-for="r in dim">
        <td class="boardCell" v-for="c in dim">
          <div class="item" @click="myClick(data[r][c])">
    {{data[r][c]}}
  </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>

export default {
  name: 'cellMenu',
  data () {
    return {
      data: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ],
      dim: [0, 1, 2]
    }
  },
  props: ['position'],
  methods: {
    myClick (d) {
      // console.log(d)
      this.$emit('menuItemSelected', d)
    }
  }
}
</script>

<style lang="stylus">
#menu {
  left: 0px;
  top: 0px;
}
.item {
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
  color: #30c030;
  background-color: rgba(60, 144, 255, 0.1);
}

.item:hover {
  border 1px solid #30c030;
}
</style>
