<template>
  <div class="root">
    <div class="control">
      <input type="number" v-model="xPoint" @focus="$event.target.select()" />
      <input type="number" v-model="yPoint" @focus="$event.target.select()" />
      <button @click="addPoint">Добавить</button>
      <table class="table" v-if="pointList.length">
        <thead>
          <tr>
            <th>i</th>
            <th>x</th>
            <th>y</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(point, index) in pointList" :key="index">
            <td>{{ index }}</td>
            <td>{{ point.x }}</td>
            <td>{{ point.y }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="canvas-container">
      <canvas ref="canvas" height="500" width="500"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Point, Polygonator } from "@/model/Polygonator";

@Component({})
export default class PolygonatorView extends Vue {
  private xPoint = Math.random() * 100 * 4 + 50;
  private yPoint = Math.random() * 100 * 4 + 50;
  private pointList: Point[] = [];

  private cvn!: HTMLCanvasElement;
  private ctx!: any;

  addPoint(): void {
    this.pointList.push(
      new Point(
        Number.parseInt(this.xPoint.toString()),
        Number.parseInt(this.yPoint.toString())
      )
    );
    this.renderCanvas();
    this.xPoint = Math.random() * 100 * 4 + 50;
    this.yPoint = Math.random() * 100 * 4 + 50;
  }

  renderCanvas(): void {
    this.initCanvas();
    const polygonator = new Polygonator(this.pointList);
    const sortedPoints = polygonator.sortVerticies();

    for (let i = 0; i < sortedPoints.length; i++) {
      if (!this.ctx) return;

      const start = sortedPoints[i];
      const finish = sortedPoints[i + 1] ?? sortedPoints[0];

      this.ctx.beginPath();
      this.ctx.moveTo(start.x, start.y);
      this.ctx.lineTo(finish.x, finish.y);
      this.ctx.stroke();

      this.ctx.fillText(`${i} (${start.x};${start.y})`, start.x, start.y);
    }
  }

  initCanvas(): void {
    this.cvn = this.$refs.canvas as HTMLCanvasElement;
    this.ctx = this.cvn.getContext("2d");
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.cvn.width, this.cvn.height);
    this.ctx.strokeStyle = "green";
  }

  mounted(): void {
    this.renderCanvas();
  }
}
</script>
<style lang="scss" scoped>
.root {
  display: flex;
  padding-top: 50px;

  .control {
    padding: 0 20px;
  }

  .canvas-container {
    border: 1px solid #dddddd;
    max-height: 500px;
  }

  .table {
    width: 100%;
    margin: 20px 0;
    border: 1px solid #dddddd;
    border-collapse: collapse;
  }
  .table th {
    font-weight: bold;
    padding: 5px;
    background: #efefef;
    border: 1px solid #dddddd;
    text-align: left;
  }
  .table td {
    border: 1px solid #dddddd;
    padding: 5px;
  }

  input {
    margin-right: 20px;
    padding: 20px;
    border: none;
    background: #eee;
    border-radius: 5px;
  }

  button {
    color: white;
    padding: 20px;
    border: none;
    background: #6caee8;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      opacity: 0.7;
    }
  }

  canvas {
    overflow: visible;
  }
}
</style>
