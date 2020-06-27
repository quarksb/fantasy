<template>
  <div id="container" >
    <h2>This is a butterFly</h2>
    <div class="basic">
        <div class="body"></div>
        <div class="wing" :style="{
            transform: `rotateY(${angle}deg)`,
        }"></div>
        <div class="wing right"  :style="{
            transform: `rotateY(${-angle}deg)`,
        }"></div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'butterfly',
  data () {
    return {
      angle: 45
    }
  },
  computed: {

  },
  created () {

  },
  mounted () {
  },
  methods: {
    stop () {

    }
  }
}
</script>

<style type="text/css">
#container{
    display: flex;
    justify-content: center;
    align-content: center;
}
.basic{
    position: relative;
    width: 100px;
    height: 100px;
}
.body{
    position: absolute;
    background-color: #000;
    width: 20px;
    height: 100px;
}
.wing{
    position: absolute;
    transform-origin: right;
    left: -100px;
    background-color: rgb(10, 101, 219);
    width: 100px;
    height: 100px;
}
.right{
    left: 10px;
    transform-origin: left;
}
</style>
