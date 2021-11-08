<template>
  <div class="container" >
    <div class="basic">
      <butterfly :key="i" v-for="(matrix, i) in matrixs" class="basicImg" :style="{
        display: `${displayArray[i]?'block':'none'}`
      }"
      v-bind:matirx="matrix"
      />
    </div>
    <div class="control">
      <a-row>
        <h4>绕X轴旋转</h4>
        <a-col :span="12" class="slider">
          <a-slider  :default-value="0" :min="-180" :max="180" :disabled="false" v-model='rotateX' @change="rotate"/>
        </a-col>
        <a-col :span="1">
          <a-input-number  class="input" v-model="rotateX" :min="-180" :max="180" style="marginLeft: 16px" />
        </a-col>
      </a-row>
      <a-row>
        <h4>绕Y轴旋转</h4>
        <a-col :span="12" class="slider">
          <a-slider  :default-value="0" :min="-180" :max="180" :disabled="false" v-model='rotateY' @change="rotate" />
        </a-col>
        <a-col :span="1">
          <a-input-number  class="input" v-model="rotateY" :min="-180" :max="180" style="marginLeft: 16px" />
        </a-col>
      </a-row>
      <a-row>
        <h4>绕Z轴旋转</h4>
        <a-col :span="12" class="slider">
          <a-slider  :default-value="0" :min="-180" :max="180" :disabled="false" v-model='rotateZ' @change="rotate" />
        </a-col>
        <a-col :span="1">
          <a-input-number  class="input" v-model="rotateZ" :min="-180" :max="180" style="marginLeft: 16px" />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script type="text/javascript">
import butterfly from './butterfly.vue'
import { glMatrix, mat4 } from 'gl-matrix'
export default {
  name: 'MagicText',
  components: {
    butterfly
  },
  data () {
    const num = 1
    const matrixs = []
    for (let i = 0; i < num; i++) {
      matrixs[i] = mat4.create()
    }
    return {
      num,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      displayArray: [true],
      matrixs
    }
  },
  computed: {

  },
  created () {

  },
  mounted () {
    this.baseMatrix = mat4.create()
    this.rotate()
  },
  methods: {
    rotate () {
      for (let i = 0; i < this.num; i++) {
        // debugger
        mat4.rotateX(this.matrixs[i], this.baseMatrix, glMatrix.toRadian(this.rotateX))
        mat4.rotateY(this.matrixs[i], this.matrixs[i], glMatrix.toRadian(this.rotateY))
        mat4.rotateZ(this.matrixs[i], this.matrixs[i], glMatrix.toRadian(this.rotateZ))
      }
      this.matrixs.splice()
      console.info('sb', this.num)
      // window.requestAnimationFrame(this.rotate)
    }
  }
}
</script>

<style type="text/css">
</style>
