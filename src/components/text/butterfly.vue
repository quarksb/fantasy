<template>
  <div id="container" >
    <h2>This is a butterFly</h2>
    <div class="basic" >
        <div class="body" :style="{
            transform: `matrix3d(${matrix.toString()})`
        }"
        ></div>
        <div class="wing" :style="{
            transform: `matrix3d(${matrix.toString()}) rotateY(${30+angle}deg)`,
        }"></div>
        <div class="wing right"  :style="{
            transform: `matrix3d(${matrix.toString()}) rotateY(${150-angle}deg)`,
        }"></div>
    </div>
    <div class="control">
      <a-row>
        <h4>绕X轴旋转</h4>
        <a-col :span="12" class="slider">
          <a-slider  :default-value="0" :min="-180" :max="180" :disabled="false" v-model='rotateX' />
        </a-col>
        <a-col :span="1">
          <a-input-number  class="input" v-model="rotateX" :min="-180" :max="180" style="marginLeft: 16px" />
        </a-col>
      </a-row>
      <a-row>
        <h4>绕Y轴旋转</h4>
        <a-col :span="12" class="slider">
          <a-slider  :default-value="0" :min="-180" :max="180" :disabled="false" v-model='rotateY' />
        </a-col>
        <a-col :span="1">
          <a-input-number  class="input" v-model="rotateY" :min="-180" :max="180" style="marginLeft: 16px" />
        </a-col>
      </a-row>
      <a-row>
        <h4>绕Z轴旋转</h4>
        <a-col :span="12" class="slider">
          <a-slider  :default-value="0" :min="-180" :max="180" :disabled="false" v-model='rotateZ' />
        </a-col>
        <a-col :span="1">
          <a-input-number  class="input" v-model="rotateZ" :min="-180" :max="180" style="marginLeft: 16px" />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script type="text/javascript">
import { glMatrix, mat4 } from 'gl-matrix'
export default {
  name: 'butterfly',
  data () {
    return {
      time: 0,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      num: 1,
      matrix: mat4.create()
    }
  },
  computed: {
    angle () {
      return 58 * Math.sin(0.1 * this.time)
    }
  },
  created () {

  },
  mounted () {
    this.baseMatrix = mat4.create()
    mat4.rotateX(this.matrix, this.matrix, Math.PI / 3)
    this.fly()
  },
  methods: {
    fly () {
      mat4.rotateX(this.matrix, this.baseMatrix, glMatrix.toRadian(this.rotateX))
      mat4.rotateY(this.matrix, this.matrix, glMatrix.toRadian(this.rotateY))
      mat4.rotateZ(this.matrix, this.matrix, glMatrix.toRadian(this.rotateZ))
      this.time += 1
      window.requestAnimationFrame(this.fly)
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
