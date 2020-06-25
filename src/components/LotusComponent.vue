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
      <a-row>
        <a-radio-group v-model="type" @change="typeChange">
        <a-radio-button value="one">
          方案一
        </a-radio-button>
        <a-radio-button value="two">
          方案二
        </a-radio-button>
      </a-radio-group>
      </a-row>
      <a-row>
        <h4>基础图片数量</h4>
        <a-col :span="12" class="slider">
          <a-slider  :default-value="64" :min="8" :max="64" :disabled="false" v-model='num' @change="handleNumChange" />
        </a-col>
      </a-row>
      <a-row>
        <h4>绕X轴旋转</h4>
        <a-col :span="12" class="slider">
          <a-slider  :default-value="0" :min="-180" :max="180" :disabled="false" v-model='rotateX' @change="handleChangeX" />
        </a-col>
        <a-col :span="1">
          <a-input-number  class="input" v-model="rotateX" :min="-180" :max="180" style="marginLeft: 16px" />
        </a-col>
      </a-row>
      <a-row>
        <h4>绕Y轴旋转</h4>
        <a-col :span="12" class="slider">
          <a-slider  :default-value="0" :min="-180" :max="180" :disabled="false" v-model='rotateY' @change="handleChangeY" />
        </a-col>
        <a-col :span="4" >
          <a-input-number  class="input" v-model="rotateY"  :min="-180" :max="180" style="marginLeft: 16px" />
        </a-col>
      </a-row>
      <a-row>
        <h4>绕Z轴旋转</h4>
        <a-col :span="12"  class="slider">
           <a-slider  :default-value="0" :min="-180" :max="180" :disabled="false" v-model='rotateZ' @change="handleChangeZ" />
        </a-col>
        <a-col :span="4">
          <a-input-number  class="input" v-model="rotateZ"  :min="-180" :max="180" style="marginLeft: 16px" />
        </a-col>
      </a-row>
      <a-row>
        <h4>循环开关</h4>
        <a-switch size="large" :checked="disabled" @change="handleDisabledChange" />
      </a-row> 
      <a-row>
        <h4>动画开关</h4>
        <a-switch size="large" :checked="shuffle" @change="shuffleChange" />
      </a-row>
      <a-row>
        <h4>透视开关</h4>
        <a-switch size="large" v-model="isPerspective" />
      </a-row>      
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
      baseUp: vec3.fromValues(0,1,0),
      isPerspective: false,
      type: 'one',
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
    // 原始透视矩阵会将 x y 转化到 【0，1】 区间，为了显示正确的大小，需要进行放大
    const angle = Math.PI/6;
    const k1 = Math.hypot(...this.baseViewPoint)*Math.tan(angle/2);
    this.perspMatrix = mat4.multiply([], mat4.fromScaling([],[k1,k1,k1]),
    mat4.perspective([], angle, 1, 100, 10000));
    const k = 1;
    // 正交投影
    // this.perspMatrix = mat4.ortho([], -k, k, -k, k, 1, 10000);
    this.time = 1;
    this.render();
  },
  methods:{
    render(){
      const r = 200;
      
      for(let i=0; i< this.num;i++){
        if(this.type === 'one'){
          mat4.rotateZ(this.matrixs[i], this.baseMatrix, 2*(i+0.04*this.time)/this.num*Math.PI);
          // mat4.rotateY(this.matrixs[i], this.baseMatrix, 2*(i+0.04*this.time)/this.num*Math.PI);
          mat4.rotateX(this.matrixs[i], this.matrixs[i], ((i%8)*0.25 - 0.01 * this.time)*Math.PI);
          mat4.translate(this.matrixs[i], this.matrixs[i], vec3.scale([], this.eye, 0.5) );
        }
        if(this.type === 'two'){
          const theta = 0.5 * Math.PI;
          const angle = -0.02*this.time + 0.25 *(i % 8)* Math.PI;
          const rotateY = 0;
          const rotateZ = angle;
          const angle1 = i/this.num * 2 * Math.PI;
          const scaleVec = [1,3*Math.cos(angle)*Math.cos(angle),1];

          mat4.rotate(this.matrixs[i], this.baseMatrix, angle, [Math.cos(angle1),Math.sin(angle1),0]);
          mat4.rotateZ(this.matrixs[i], this.matrixs[i], angle1);
          mat4.translate(this.matrixs[i], this.matrixs[i], [0,r,0])
          mat4.scale(this.matrixs[i], this.matrixs[i], scaleVec);
          mat4.multiply(this.matrixs[i], this.viewMat, this.matrixs[i]);
        }
        if(this.isPerspective){
          mat4.multiply(this.matrixs[i], this.perspMatrix, this.matrixs[i])
        }
      }
      if(this.shuffle){
        this.time +=1;
      }
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
    },
    typeChange(val){
      this.type = val.target.value;
    },
    handleNumChange(val){
      this.num = Math.floor(val/8)*8;
      for(let i=0; i< this.num; i++){
        this.matrixs[i] = mat4.create();
      }
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
    text-align: left;
  }
  .slider{
    width: 120px;
  }
  .input{
    width: 50px;
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