export class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setX(value: number): void {
    this.x = value;
  }

  setY(value: number): void {
    this.y = value;
  }
}

export class Polygonator {
  points: Point[];
  constructor(points: Point[] = []) {
    this.points = points;
  }

  static radsToDegrees(rad: number): number {
    return (rad * 180.0) / Math.PI;
  }

  findCentroid(): Point {
    let x = 0;
    let y = 0;

    for (const point of this.points) {
      x += point.x;
      y += point.y;
    }

    const center = new Point(0, 0);
    center.setX(x / this.points.length);
    center.setY(y / this.points.length);
    return center;
  }

  sortVerticies(): Point[] {
    const center = this.findCentroid();

    return this.points.sort((a: Point, b: Point) => {
      const a1 =
        (Polygonator.radsToDegrees(Math.atan2(a.y - center.y, a.x - center.x)) +
          360) %
        360;
      const a2 =
        (Polygonator.radsToDegrees(Math.atan2(b.y - center.y, b.x - center.x)) +
          360) %
        360;
      return a1 - a2;
    });
  }
}
