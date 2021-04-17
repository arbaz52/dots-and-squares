import Point from "./Point";

export default class Engine {
  constructor(
    public canvas: HTMLCanvasElement,
    public ctx: CanvasRenderingContext2D,
    public cells: number = 10,
    public padding: number = 24
  ) {}

  resize() {
    const { canvas, ctx } = this;

    canvas.width = window.innerWidth;
    canvas.height = window.innerWidth;

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();

  }

  getCellSize() {
    return (this.canvas.width - this.padding * 2) / this.cells;
  }

  getCoord(col: number, row: number): Point {
    const cellSize = this.getCellSize();
    const x = col * cellSize + this.padding;
    const y = row * cellSize + this.padding;
    return new Point(x, y);
  }

  draw() {
    requestAnimationFrame(this.draw.bind(this));

    const { ctx } = this;

    for (let row = 0; row <= this.cells; row++) {
      for (let col = 0; col <= this.cells; col++) {
        const { x, y } = this.getCoord(col, row);

        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  setup() {
    this.resize();
    window.onresize = this.resize.bind(this);

    this.draw();
  }
}
