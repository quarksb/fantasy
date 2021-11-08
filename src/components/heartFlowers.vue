<template>
  <div id="container" >
    <canvas ref="canvas" class="full"/>
  </div>
</template>

<script type="text/javascript">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'heart',
  data () {
    return {

    }
  },
  mounted () {
    let moveStep = 0
    let spin = 0
    let step = 1
    let canvas = this.$refs.canvas
    canvas.width = window.innerWidth || document.body.clientWidth
    canvas.height = window.innerHeight || document.body.clientHeight
    let ctx = canvas.getContext('2d')
    let w = canvas.width
    let h = canvas.height
    let radius = h - w ? w : h
    // console.info(radius);
    ctx.translate(w / 2, h / 2)
    const draw = () => {
      ctx.clearRect(-w / 2, -h / 2, w, h)
      for (let i = 1; i < 6; i++) { // Loop through rings (from inside to out)
        ctx.save()
        ctx.fillStyle = `rgb(${51 * i},${255 - 51 * i},255)`
        ctx.rotate(Math.PI * 0.01 * i * (i % 2 ? step : -step))
        for (let j = 0; j < i * 6; j++) {
          // ctx.rotate(Math.PI*2/(i*6));
          ctx.transform(Math.cos(Math.PI * 2 / (i * 6)), Math.sin(Math.PI * 2 / (i * 6)), -Math.sin(Math.PI * 2 / (i * 6)), Math.cos(Math.PI * 2 / (i * 6)), 0, 0)
          this.drawHeart(ctx, ((i * radius / 20 + 10 * moveStep) * Math.sqrt(1 - spin * spin)) * spin, ((i * radius / 20 + 10 * moveStep) * spin), (20 + 10 * moveStep) * radius / 1200)
        }
        ctx.restore()
      }
      step += 0.2
      moveStep = Math.cos(Math.PI * step / 60)
      spin = Math.cos(Math.PI * step / 120)
      window.requestAnimationFrame(draw)
    }
    draw()
  },
  methods: {
    drawHeart (ctx, x, y, size) {
      const ratio = size == null ? 1 : size / 60
      ctx.fill(new Path2D(`M${x} ${y - 30 * ratio} c0 ${-3 * ratio} ${-10 * ratio} ${-15 * ratio} ${-25 * ratio} ${-15 * ratio} c ${-30 * ratio} 0 ${-30 * ratio} ${30 * ratio} ${-30 * ratio} ${30 * ratio} c0 ${25 * ratio} ${20 * ratio} ${47 * ratio} ${55 * ratio} ${65 * ratio} c ${35 * ratio} ${-18 * ratio} ${55 * ratio} ${-40 * ratio} ${55 * ratio} ${-65 * ratio} c0 0 0 ${-30 * ratio} ${-30 * ratio} ${-30 * ratio} c ${-15 * ratio} 0 ${-25 * ratio} ${12 * ratio} ${-25 * ratio} ${15 * ratio} Z`))
    }
  }
})
</script>

<style type="text/css">
  .full{
    position: absolute;
    left: 0;
    top: 0;
  }
</style>
