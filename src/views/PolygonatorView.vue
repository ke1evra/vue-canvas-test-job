<template>
  <div class="root" id="canvas">
    <div>
      <canvas ref="canvas" height="300" width="300"></canvas>
    </div>
    <input type="number" v-model="xPoint" @focus="$event.target.select()" />
    <input type="number" v-model="yPoint" @focus="$event.target.select()" />
    <button @click="addPoint">Добавить</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Point, Polygonator } from "@/model/Polygonator";

@Component({})
export default class PolygonatorView extends Vue {
  private xPoint = 0;
  private yPoint = 0;
  private pointList: Point[] = [
    new Point(100, 100),
    new Point(200, 200),
    new Point(200, 100),
    new Point(100, 200),
  ];

  addPoint(): void {
    this.pointList.push(
      new Point(
        Number.parseInt(this.xPoint.toString()),
        Number.parseInt(this.yPoint.toString())
      )
    );
    this.renderCanvas();
    this.xPoint = 0;
    this.yPoint = 0;
  }

  renderCanvas(): void {
    let cvn = this.$refs.canvas as HTMLCanvasElement;
    let ctx = cvn.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, cvn.width, cvn.height);
    ctx.strokeStyle = "green";

    const polygonator = new Polygonator(this.pointList);
    const sortedPoints = polygonator.sortVerticies();

    for (let i = 0; i < sortedPoints.length; i++) {
      if (!ctx) return;

      const start = sortedPoints[i];
      const finish = sortedPoints[i + 1] ?? sortedPoints[0];

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(finish.x, finish.y);
      ctx.stroke();
    }
  }

  mounted(): any {
    this.renderCanvas();
  }
}
</script>
<style lang="scss" scoped>
.root {
  input {
    padding: 5px;
    border: none;
    background: #eee;
    border-radius: 5px;
    margin: 0 10px;
  }

  button {
    color: white;
    padding: 5px 20px;
    border: none;
    background: #6caee8;
    border-radius: 5px;
    margin: 0 10px;
    cursor: pointer;

    &:hover {
      opacity: 0.7;
    }
  }
}
</style>
