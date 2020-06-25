<template>
  <div id="container" >
    <div class="basic">
      <img :key="i" v-for="(matrix, i) in matrixs" class="basicImg" :style="{
        transform: `matrix3d(${matrix.toString()})`,
      }"
      src="../assets/logo.png"
      />
      
    <img src="../assets/youyuxi.jpg" class="portrait" :style="{
      transform: `matrix3d(${viewMat.toString()})`
    }"/>
    </div>
    <div class="control">
      rotateX<a-slider id="test" :default-value="0" :min="-180" :max="180" :disabled="false" v-model='rotateX' @change="handleChangeX" />
      rotateY<a-slider id="test" :default-value="0" :min="-180" :max="180" :disabled="false" v-model='rotateY' @change="handleChangeY" />
      rotateZ<a-slider id="test" :default-value="0" :min="-180" :max="180" :disabled="false" v-model='rotateZ' @change="handleChangeZ" />
      Disabled: <a-switch size="large" :checked="disabled" @change="handleDisabledChange" />
      shuffle: <a-switch size="large" :checked="shuffle" @change="shuffleChange" />
    </div>
    
  </div>
</template>

<script type="text/javascript">
import {glMatrix, vec3, quat, mat4 } from 'gl-matrix';

export default {
  name: 'Lotus',
  data(){
    const num = 64;
    const matrixs = [];
    for(let i=0; i<num; i++){
      matrixs[i] = mat4.create();
    }
    return {
      up:[0,1,0], // 向上方向
      shuffle: true, //是否飘逸
      disabled: false,
      rotateX:0,
      rotateY:0,
      rotateZ:0,
      num,
      matrixs,
      containMatrix: mat4.create(),
      baseViewPoint: vec3.fromValues(0, 0, 600),
      baseUp: vec3.fromValues(0,1,0)
    }
  },
  computed:{
    viewMat(){
      const { eye, center = [0,0,0], up=[0,-1,0] } = this;
      const mat =  mat4.lookAt([], eye, center, up);
      return mat;
    },
    eye(){
      const { rotateX, rotateY, rotateZ, baseViewPoint } = this;
      const quatVec4 = quat.fromEuler([], this.rotateX,  this.rotateY,  this.rotateZ);
      this.up = vec3.transformQuat([], this.baseUp, quatVec4);
      const eyePos =  vec3.transformQuat([], baseViewPoint, quatVec4);
      return eyePos;
    },
  },
  created(){
    
  },
  mounted(){
    this.baseMatrix = mat4.create();
    this.perspMatrix = mat4.perspective([], 0.3/180*Math.PI, 1, 100, 10000);
    const k = 1;
    // this.perspMatrix = mat4.ortho([], -k, k, -k, k, 1, 10000);
    this.time = 1;
    this.render();
  },
  methods:{
    render(){
      // console.time('matrix cal')
      const r = 200;
      for(let i=0; i< this.num;i++){
        const theta = 0.5 * Math.PI;
        const angle = -0.02*this.time + 0.25 *(i % 8)* Math.PI;
        // const rotateX = ;
        const rotateY = 0;
        const rotateZ = angle;
        const angle1 = i/this.num * 2 * Math.PI;
        const translateVec = [1,3*Math.cos(angle)*Math.cos(angle),1];
        // mat4.fromTranslation(this.matrixs[i], translateVec);
        // mat4.rotate(this.matrixs[i], this.matrixs[i], 1 * Math.PI + gama, [1,0,0]);
        mat4.rotate(this.matrixs[i], this.baseMatrix, angle, [Math.cos(angle1),Math.sin(angle1),0]);
        mat4.rotateZ(this.matrixs[i], this.matrixs[i], angle1);
        mat4.translate(this.matrixs[i], this.matrixs[i], [0,r,0])
        mat4.scale(this.matrixs[i], this.matrixs[i], translateVec);
        
        // const quatVec4 = quat.fromEuler([], rotateX, rotateY, rotateZ);
        const quatVec4 = quat.fromEuler([], 0, 0, 0);
        // mat4.fromRotationTranslation(this.matrixs[i], quatVec4, translateVec)
        mat4.multiply(this.matrixs[i], this.viewMat, this.matrixs[i]);
        // mat4.multiply(this.matrixs[i], this.perspMatrix, this.matrixs[i]);
      }
      if(this.shuffle){
        this.time +=1;
      }
      // console.timeEnd('matrix cal')
      
      this.matrixs.splice()
      this.animation = requestAnimationFrame(this.render)
    },
    handleChangeX(val){
      this.rotateX = val;
    },
    handleChangeY(val){
      this.rotateY = val;
    },
    handleChangeZ(val){
      this.rotateZ = val;
    },
    handleDisabledChange(disabled){
      this.disabled = disabled;

      if(disabled){
        cancelAnimationFrame(this.animation);
      }
      else{
        this.render()
      }
    },
    shuffleChange(shuffle){
      this.shuffle = shuffle;
    }
  }
}
</script>

<style type="text/css">
  #container {
    width: 200px;
    height: 200px;
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .portrait{
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    left: 50px;
    top: -50px;
    z-index: 1000;
  }
  .control{
    width: 150px;
    position: fixed;
    right: 100px;
  }
  .basic{
    position: relative;
  }
  .basicImg{
    width: 100px;
    height: 200p;
    position: absolute;
    backface-visibility: hidden;
  }
</style>