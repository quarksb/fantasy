<template>
  <div class="container" >
    <div class="basic" >
        <div class="body" :style="{
            transform: `matrix3d(${matrixA.toString()})`
        }"
        ></div>
        <div class="wing" :style="{
            transform: `matrix3d(${matrixA.toString()}) rotateY(${30+angle}deg)`,
        }"></div>
        <div class="wing right"  :style="{
            transform: `matrix3d(${matrixA.toString()}) rotateY(${150-angle}deg)`,
        }"></div>
    </div>
  </div>
</template>

<script type="text/javascript">
import { mat4 } from 'gl-matrix'
export default {
  name: 'butterfly',
  props: {
    matrix: {
      type: Float32Array,
      default: () => mat4.create()
    }
  },
  data () {
    return {
      time: 0,
      num: 1
    }
  },
  computed: {
    angle () {
      return 58 * Math.sin(0.1 * this.time)
    },
    matrixA () {
      console.info(this.matrix)
      return Array.from(this.matrix)
    }
  },
  created () {

  },
  mounted () {
    this.fly()
  },
  methods: {
    fly () {
      this.time += 1
      window.requestAnimationFrame(this.fly)
    }
  }
}
</script>

<style type="text/css">
.container{
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
    transform-origin: 50% 70%;
    background-image: url("../../assets/butterfly-body.png");
    background-size: 100% 100%;
    left: -10px;
    top: 8px;
    width: 20px;
    height: 60px;
}
.wing{
    position: absolute;
    transform-origin: right;
    background-image: url("../../assets/butterfly-wing.png");
    background-size: 100% 100%;
    left: -60px;
    width: 60px;
    height: 100px;
}
.control{
    width: 180px;
    position: fixed;
    right: 100px;
    text-align: left;
}
.slider{
  width: 120px;
}
.input{
  width: 60px;
}
</style>
