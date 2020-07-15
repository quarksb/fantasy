<template>
  <div id="container" >
    <div class="front">
      在
      <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Advanced_animations">canvas 动画教程</a>
      基础上加点碰撞(通过鼠标单击添加新的小球)
    </div>
    <canvas ref="canvas" class="full"/>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'Collision',
  data () {
    return {
      radius: 25,
      ballNum: 2,
      px: [500, 800],
      py: [430, 300],
      vx: [0, -5],
      vy: [-2.5, 0],
      angle: [0, 1],
      status: [false, false],
      dark: [0, 0],
      raf: null,
      isCollision: false
    }
  },
  mounted () {
    this.canvas = this.$refs.canvas
    this.canvas.width = window.innerWidth || document.body.clientWidth
    this.canvas.height = window.innerHeight || document.body.clientHeight
    this.ctx = this.canvas.getContext('2d')

    this.draw()

    // this.canvas.addEventListener('mouseout', function (e) {
    //   window.cancelAnimationFrame(this.raf)
    // })

    this.canvas.addEventListener('click', (e) => {
      console.info('sb')
      let offX = this.canvas.offsetLeft
      let offY = this.canvas.offsetTop
      this.addBall(e.clientX - offX, e.clientY - offY)
    })
  },
  methods: {
    draw () {
      const {canvas, px, py, vx, vy, dark} = this
      this.clear()
      const w = canvas.width
      const h = canvas.height
      // ctx.clearRect(0,0, w, h);

      // isCollision && this.slowDown()
      for (let i = 0; i < this.ballNum; i++) {
        px[i] += vx[i]
        py[i] += vy[i]

        if (px[i] > w - this.radius) {
          vx[i] = -vx[i]
          px[i] = 2 * (w - this.radius) - px[i]
        }
        if (px[i] < this.radius) {
          vx[i] = -vx[i]
          px[i] = 2 * (this.radius) - px[i]
        }

        if (py[i] > h - this.radius || py[i] < 0) {
          vy[i] = -vy[i]
          py[i] = 2 * (h - this.radius) - py[i]
        }
        if (py[i] < this.radius) {
          vy[i] = -vy[i]
          py[i] = 2 * (this.radius) - py[i]
        }

        this.drawCircle(px[i], py[i], status[i], dark[i])
      }
      for (let i = 0; i < this.ballNum; i++) {
        for (let j = i + 1; j < this.ballNum; j++) {
          let dx = px[i] - px[j]
          let dy = py[i] - py[j]
          let distance = Math.pow((Math.pow(dx, 2) + Math.pow(dy, 2)), 0.5)
          if (distance < 2 * this.radius) {
            this.isCollision = true
            // debugger;
            let vx1 = vx[i]
            let vy1 = vy[i]
            let vx2 = vx[j]
            let vy2 = vy[j]
            // 发生碰撞后的时间
            let t = (50 - distance) / Math.sqrt(Math.pow(vx1 - vx2, 2) + Math.pow(vy1 - vy2, 2))
            // 把球的位置还原到碰撞时
            px[i] = px[i] - vx1 * t
            py[i] = py[i] - vy1 * t
            px[j] = px[j] - vx2 * t
            py[j] = py[j] - vx2 * t
            dx = px[i] - px[j]
            dy = py[i] - py[j]
            let k = ((vx1 - vx2) * dx + (vy1 - vy2) * dy) / (Math.pow(dx, 2) + Math.pow(dy, 2))
            // 碰撞后的速度
            vx[i] = vx1 - k * dx
            vy[i] = vy1 - k * dy
            vx[j] = vx2 + k * dx
            vy[j] = vy2 + k * dy
            // 碰撞后t时间，球的位置
            px[i] = Math.floor(px[i] + vx[i] * t)
            py[i] = Math.floor(py[i] + vy[i] * t)
            px[j] = Math.floor(px[j] + vx[j] * t)
            py[j] = Math.floor(py[j] + vy[j] * t)

            // 状态处理
            // status[i] = status[i]||status[j];
            // status[j] = status[i]||status[j];

            // 越撞越黑
            // if(dark[i]>dark[j]){
            //     dark[j] = dark[i];
            // }else {
            //     dark[i] = dark[j];
            // }

            dark[i] = dark[i] < 100 ? dark[i] + 5 : 100
            dark[j] = dark[j] < 100 ? dark[j] + 5 : 100
          }
        }
      }
      this.raf = window.requestAnimationFrame(this.draw)
    },
    slowDown () {
      function rub (y) {
        let dv = 0.2
        if (y > dv) {
          y -= dv
        }
        if (y < -dv) {
          y += dv
        }
        if (Math.abs(y) <= dv) {
          y = 0
        }
        return y
      }
      for (let i of this.vx.keys()) {
        this.vx[i] = rub(this.vx[i])
      }
      for (let i of this.vy.keys()) {
        this.vy[i] = rub(this.vy[i])
      }
    },
    clear () {
      this.ctx.fillStyle = 'rgba(255,255,255,0.2)'
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    },
    addBall (x, y) {
      this.ballNum += 1
      this.px.push(x)
      this.py.push(y)
      this.vx.push(0)
      this.vy.push(0)
      this.angle.push(Math.random() * 10)
      this.dark.push(0)
      this.status.push(true)
    },
    drawCircle (x, y, f, a) {
      this.ctx.beginPath()
      this.ctx.arc(x, y, this.radius, 0, Math.PI * 2, true)
      this.ctx.closePath()
      this.ctx.fillStyle = `#12c2e9`
      this.ctx.fill()
    }
  }
}
</script>

<style type="text/css">
  #container {
    top: 0;
    left: 0;

  }
  .full{
    position: absolute;
    left: 0;
    top: 0;
  }
  .front{
    position: absolute;
    z-index: 1000;
    width: 300px;
    font-size: 20px;
    text-align: justify;
  }
</style>
