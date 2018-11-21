<template>
  <div>
    <!-- <button @click="additem">添加</button> -->
    <!-- <div class="cart" style="">{{count}}</div> -->
    <div class="ball-container">
      <!--小球-->
      <div v-for="(ball, index) in balls" :key="index">
        <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
      balls: [
        //小球 设为3个
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: []
    };
  },
  methods: {
    additem(event) {
      this.drop(event.target);
      this.count++;
    },
    drop(el) {
      //抛物
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball);
          return;
        }
      }
    },
    beforeDrop(el) {
      /* 购物车小球动画实现 */
      let count = this.balls.length;
      while (count--) {
        let ball = this.balls[count];
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect(); //元素相对于视口的位置
          let x = rect.left - 500; // 32
          let y = -(window.innerHeight - rect.top + 200); //获取y
          el.style.display = "";
          el.style.webkitTransform = "translateY(" + y + "px)"; //translateY
          el.style.transform = "translateY(" + y + "px)";
          let inner = el.getElementsByClassName("inner-hook")[0];
          inner.style.webkitTransform = "translateX(" + x + "px)";
          inner.style.transform = "translateX(" + x + "px)";
        }
      }
    },
    dropping(el, done) {
      /*重置小球数量  样式重置*/
      let rf = el.offsetHeight;
      el.style.webkitTransform = "translate3d(0,0,0)";
      el.style.transform = "translate3d(0,0,0)";
      let inner = el.getElementsByClassName("inner-hook")[0];
      inner.style.webkitTransform = "translate3d(0,0,0)";
      inner.style.transform = "translate3d(0,0,0)";
      el.addEventListener("transitionend", done);
    },
    afterDrop(el) {
      /*初始化小球*/
      let ball = this.dropBalls.shift();
      if (ball) {
        ball.show = false;
        el.style.display = "none";
      }
    }
  }
};
</script>

<style>
.shop {
  position: fixed;
  right: 50px;
  top: 400px;
}
.ball {
  position: fixed;
  left: 500px;
  bottom: 200px;
  z-index: 200;
  transition: all 0.4s cubic-bezier(0.49, -1.29, 0.75, 0.41); /*贝塞尔曲线*/
}
.inner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: rgb(0, 160, 220);
  transition: all 0.4s linear;
}
.cart {
  position: fixed;
  right: 0;
  top: calc(50% - 220px);
  width: 30px;
  height: 450px;
  background-color: #f00;
  color: rgb(255, 255, 255);
}
</style>
