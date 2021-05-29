<template>
  <div class="root">
    <div class="control">
      <input
        type="number"
        v-model="xPoint"
        @focus="$event.target.select()"
        :class="{ invalid: !isValidParam(xPoint) }"
      />
      <input
        type="number"
        v-model="yPoint"
        @focus="$event.target.select()"
        :class="{ invalid: !isValidParam(yPoint) }"
      />
      <button @click="addPoint" :disabled="!isValid">Добавить</button>
      <div class="message" v-if="message">{{ message }}</div>
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

const rand50_450 = () => Math.trunc(Math.random() * 100 * 4 + 50);

@Component({})
export default class PolygonatorView extends Vue {
  private xPoint = rand50_450();
  private yPoint = rand50_450();
  private pointList: Point[] = [];

  private cvn!: HTMLCanvasElement;
  private ctx!: any;

  isValidParam(param: number): boolean {
    return Boolean(param) && param >= 0 && param <= 500;
  }

  get isValid(): boolean {
    return this.isValidParam(this.xPoint) && this.isValidParam(this.yPoint);
  }

  get message(): string {
    return this.isValid ? "" : "Введите значение в дапазоне 0 - 500";
  }

  addPoint(): void {
    this.pointList.push(
      new Point(
        Number.parseInt(this.xPoint.toString()),
        Number.parseInt(this.yPoint.toString())
      )
    );
    this.renderCanvas();
    this.ctx.fillStyle = "#FF0000";
    this.ctx.fillRect(this.xPoint - 2, this.yPoint - 2, 5, 5); // fill in the pixel at (10,10)
    this.xPoint = rand50_450();
    this.yPoint = rand50_450();
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

      this.ctx.fillStyle = `#333333`;
      this.ctx.fillText(
        `${i} (${start.x};${start.y})`,
        start.x + 10,
        start.y + 8
      );
    }
  }

  initCanvas(): void {
    this.cvn = this.$refs.canvas as HTMLCanvasElement;
    this.ctx = this.cvn.getContext("2d");
    if (!this.ctx) return;
    this.retinaFix();
    this.ctx.clearRect(0, 0, this.cvn.width, this.cvn.height);
    this.ctx.strokeStyle = "green";
  }

  retinaFix(): void {
    const width = 500;
    const height = 500;

    this.cvn.width = width;
    this.cvn.height = height;

    const devicePixelRatio = window.devicePixelRatio || 1,
      backingStoreRatio =
        this.ctx.webkitBackingStorePixelRatio ||
        this.ctx.mozBackingStorePixelRatio ||
        this.ctx.msBackingStorePixelRatio ||
        this.ctx.oBackingStorePixelRatio ||
        this.ctx.backingStorePixelRatio ||
        1,
      ratio = devicePixelRatio / backingStoreRatio;

    if (devicePixelRatio !== backingStoreRatio) {
      const oldWidth = this.cvn.width;
      const oldHeight = this.cvn.height;

      this.cvn.width = oldWidth * ratio;
      this.cvn.height = oldHeight * ratio;

      this.cvn.style.width = oldWidth + "px";
      this.cvn.style.height = oldHeight + "px";
      this.cvn.style.imageRendering = "pixelated";

      this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      this.ctx.mozImageSmoothingEnabled = false;
      this.ctx.webkitImageSmoothingEnabled = false;
      this.ctx.msImageSmoothingEnabled = false;
      this.ctx.imageSmoothingEnabled = false;
    }
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
    font-size: 14px;
    text-align: right;
  }
  .table th {
    font-weight: bold;
    padding: 5px;
    background: #efefef;
    border: 1px solid #dddddd;
  }
  table th:nth-child(1) {
    width: 10%;
  }
  .table td {
    border: 1px solid #dddddd;
    padding: 5px;
  }

  .message {
    margin: 5px 0;
    font-size: 14px;
    color: red;
    opacity: 0.7;
  }

  input {
    margin-right: 20px;
    padding: 20px;
    border: none;
    background: #eee;
    border-radius: 5px;

    &.invalid {
      background: #900;
      color: white;
      opacity: 0.7;
    }

    &:focus {
      outline: none;
    }
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
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

    &:disabled,
    &[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  canvas {
    overflow: visible;
  }
}
</style>
