// 中间背景雨
function rainBg() {
  var c = document.querySelector(".rain");
  var ctx = c.getContext("2d"); //获取canvas上下文
  var w = (c.width = document.querySelector(".total").clientWidth);
  var h = (c.height = document.querySelector(".total").clientHeight);

  //设置canvas宽、高

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function RainDrop() {}

  //雨滴对象 这是绘制雨滴动画的关键
  RainDrop.prototype = {
    init: function () {
      this.x = random(0, w); //雨滴的位置x
      this.y = h; //雨滴的位置y
      this.color = "hsl(180, 100%, 50%)"; //雨滴颜色 长方形的填充色
      this.vy = random(4, 5); //雨滴下落速度
      this.hit = 0; //下落的最大值
      this.size = 2; //长方形宽度
    },
    draw: function () {
      if (this.y > this.hit) {
        var linearGradient = ctx.createLinearGradient(
          this.x,
          this.y,
          this.x,
          this.y + this.size * 30
        );
        // 设置起始颜色
        linearGradient.addColorStop(0, "#14789c");
        // 设置终止颜色
        linearGradient.addColorStop(1, "#090723");
        // 设置填充样式
        ctx.fillStyle = linearGradient;
        ctx.fillRect(this.x, this.y, this.size, this.size * 50); //绘制长方形，通过多次叠加长方形，形成雨滴下落效果
      }
      this.update(); //更新位置
    },
    update: function () {
      if (this.y > this.hit) {
        this.y -= this.vy; //未达到底部，增加雨滴y坐标
      } else {
        this.init();
      }
    },
  };

  function resize() {
    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;
  }

  //初始化一个雨滴

  var rs = [];
  for (var i = 0; i < 10; i++) {
    setTimeout(function () {
      var r = new RainDrop();
      r.init();
      rs.push(r);
    }, i * 300);
  }

  function anim() {
    ctx.clearRect(0, 0, w, h); //填充背景色，注意不要用clearRect，否则会清空前面的雨滴，导致不能产生叠加的效果
    for (var i = 0; i < rs.length; i++) {
      rs[i].draw(); //绘制雨滴
    }
    requestAnimationFrame(anim); //控制动画帧
  }

  window.addEventListener("resize", resize);
  //启动动画
  anim();
}

// 中间虚线
function dashed() {
  var canvas = document.querySelector(".dashed");
  var ctx = canvas.getContext("2d");
  var w = (canvas.width = document.querySelector(".total").clientWidth);
  var h = (canvas.height =
    (document.querySelector(".total").clientHeight / 3) * 2);
  ctx.lineWidth = 3;
  ctx.setLineDash([3, 3]);
  ctx.fillStyle = "#93f8fb";
  ctx.shadowOffsetX = 0;
  // 阴影的y偏移
  ctx.shadowOffsetY = 0;
  // 阴影颜色
  ctx.shadowColor = "#93f8fb";
  // 阴影的模糊半径
  ctx.shadowBlur = 15;
  ctx.save(); //缓存初始状态
  // 绘制第一条曲线
  ctx.beginPath();
  var grd = ctx.createLinearGradient((w / 11) * 2, h / 3, (w / 5) * 2, h);
  grd.addColorStop(0, "#54e2e6");
  grd.addColorStop(1, "#065261");
  ctx.strokeStyle = grd;
  ctx.moveTo((w / 5) * 2, h);
  ctx.quadraticCurveTo(w / 5, (h / 6) * 5, (w / 11) * 2 - 30, h / 3 + 45);
  ctx.stroke();
  // 绘制第一条曲线上的圆光效果
  ctx.beginPath();
  ctx.moveTo((w / 11) * 2 - 30, h / 3 + 45);
  ctx.arc((w / 11) * 2 - 30, h / 3 + 45, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.save();
  // 绘制第二条线
  ctx.beginPath();
  var grd = ctx.createLinearGradient(
    (w / 11) * 3.3,
    h / 2,
    (w / 3) * 1.1,
    (h / 6) * 5
  );
  grd.addColorStop(0, "#e08d03");
  grd.addColorStop(1, "#2e6a5c");
  ctx.strokeStyle = grd;
  ctx.moveTo((w / 3) * 1.1, (h / 6) * 5);
  ctx.quadraticCurveTo(
    (w / 5) * 1.5,
    (h / 6) * 4.2,
    (w / 11) * 3.3,
    h / 2 + 45
  );
  ctx.stroke();
  // 绘制第二条曲线上的圆光效果
  ctx.beginPath();
  ctx.moveTo((w / 11) * 3.3, h / 2 + 45);
  ctx.arc((w / 11) * 3.3, h / 2 + 45, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.save();
  // 绘制第三条线
  ctx.beginPath();
  var grd = ctx.createLinearGradient((w / 3) * 1.4, h / 5, (w / 5) * 2, h / 2);
  grd.addColorStop(0, "#e08d03");
  grd.addColorStop(1, "#2e6a5c");
  ctx.strokeStyle = grd;
  ctx.moveTo((w / 5) * 2, h / 2);
  ctx.quadraticCurveTo(
    (w / 3) * 1.2,
    (h / 4) * 1.4,
    (w / 3) * 1.4 - 20,
    h / 5 + 10
  );
  ctx.stroke();
  // 绘制第三条曲线上的圆光效果
  ctx.beginPath();
  ctx.moveTo((w / 3) * 1.4 - 20, h / 5 + 10);
  ctx.arc((w / 3) * 1.4 - 20, h / 5 + 10, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.save();
  // 绘制第四条线
  ctx.beginPath();
  var grd = ctx.createLinearGradient(
    (w / 5) * 3.1,
    (h / 3) * 1.2,
    (w / 5) * 3.2,
    (h / 2) * 1.5
  );
  grd.addColorStop(0, "#e08d03");
  grd.addColorStop(1, "#2e6a5c");
  ctx.strokeStyle = grd;
  ctx.moveTo((w / 5) * 3.2, (h / 2) * 1.5);
  ctx.quadraticCurveTo(
    (w / 5) * 3.35,
    (h / 2) * 1.2,
    (w / 5) * 3.1,
    (h / 3) * 1.2
  );
  ctx.stroke();
  // 绘制第四条曲线上的圆光效果
  ctx.beginPath();
  ctx.moveTo((w / 5) * 3.1, (h / 3) * 1.2);
  ctx.arc((w / 5) * 3.1, (h / 3) * 1.2, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.save();
  // 绘制第五条线
  ctx.beginPath();
  var grd = ctx.createLinearGradient(
    (w / 5) * 3.3,
    h / 4,
    (w / 5) * 3.2,
    (h / 2) * 1.9
  );
  grd.addColorStop(0, "#e08d03");
  grd.addColorStop(1, "#2e6a5c");
  ctx.strokeStyle = grd;
  ctx.moveTo((w / 5) * 3.03, (h / 2) * 1.9);
  ctx.quadraticCurveTo((w / 5) * 3.8, (h / 2) * 1.2, (w / 5) * 3.3, h / 4);
  ctx.stroke();
  // 绘制第五条曲线上的圆光效果
  ctx.beginPath();
  ctx.moveTo((w / 5) * 3.3, h / 4);
  ctx.arc((w / 5) * 3.3, h / 4, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.save();
  // 绘制第六条线
  ctx.beginPath();
  var grd = ctx.createLinearGradient(
    (w / 5) * 3.8,
    (h / 2) * 1.2,
    (w / 5) * 2.9,
    h
  );
  grd.addColorStop(0, "#e08d03");
  grd.addColorStop(1, "#2e6a5c");
  ctx.strokeStyle = grd;
  ctx.moveTo((w / 5) * 2.9, h);
  ctx.quadraticCurveTo(
    (w / 5) * 3.7,
    (h / 2) * 1.6,
    (w / 5) * 3.8,
    (h / 2) * 1.2 + 20
  );
  ctx.stroke();
  // 绘制第六条曲线上的圆光效果
  ctx.beginPath();
  ctx.moveTo((w / 5) * 3.8, (h / 2) * 1.2 + 20);
  ctx.arc((w / 5) * 3.8, (h / 2) * 1.2 + 20, 5, 0, Math.PI * 2);
  ctx.fill();
}

$(function () {
  // dashed();
  rainBg();
});
