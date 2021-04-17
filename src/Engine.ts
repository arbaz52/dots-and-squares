import Box from "./Box";
import Line from "./Line";
import Point from "./Point";

export default class Engine {
  private mouse?: Point;
  private closest?: Point;

  public startingPoint?: Point;
  public lines: Line[] = [];
  public boxes: Box[] = [];

  constructor(
    public canvas: HTMLCanvasElement,
    public ctx: CanvasRenderingContext2D,
    public cells: number = 10,
    public padding: number = 48
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

  getClosestPointTo(coordX: number, coordY: number) {
    const cellSize = this.getCellSize();
    const col = (coordX - this.padding) / cellSize;
    const row = (coordY - this.padding) / cellSize;
    return new Point(Math.round(col), Math.round(row));
  }

  _drawCells() {
    const { ctx } = this;

    for (let row = 0; row <= this.cells; row++) {
      for (let col = 0; col <= this.cells; col++) {
        const { x, y } = this.getCoord(col, row);

        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        if (this.closest && this.closest.x === col && this.closest.y === row) {
          ctx.beginPath();
          ctx.fillStyle = "red";
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  _drawLines() {
    const { ctx } = this;

    for (let { p1, p2 } of this.lines) {
      const _p1 = this.getCoord(p1.x, p1.y);
      const _p2 = this.getCoord(p2.x, p2.y);

      ctx.beginPath();
      ctx.strokeStyle = "white";
      ctx.moveTo(_p1.x, _p1.y);
      ctx.lineTo(_p2.x, _p2.y);
      ctx.stroke();
    }

    if (this.startingPoint && this.mouse) {
      const _start = this.getCoord(this.startingPoint.x, this.startingPoint.y);
      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.moveTo(_start.x, _start.y);
      ctx.lineTo(this.mouse.x, this.mouse.y);
      ctx.stroke();
    }
  }

  _drawMouse() {
    if (!this.mouse) return;

    const {
      ctx,
      mouse: { x, y },
    } = this;
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  _clear() {
    const { canvas, ctx } = this;

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();
  }

  _drawBoxes() {
    const { ctx } = this;

    for (let { northWest } of this.boxes) {
      const _northWest = this.getCoord(northWest.x, northWest.y);

      const cellSize = this.getCellSize();

      ctx.beginPath();
      ctx.fillStyle = "rgba(255,255,255,0.25)";

      ctx.rect(_northWest.x, _northWest.y, cellSize, cellSize);
      ctx.fill();
    }
  }

  draw() {
    requestAnimationFrame(this.draw.bind(this));

    this._clear();

    this._drawCells();
    this._drawLines();

    this._drawMouse();
    this._drawBoxes();
  }

  handleMouseDown(ev: MouseEvent) {
    const { clientX, clientY } = ev;
    this.startingPoint = this.getClosestPointTo(clientX, clientY);
  }

  getBoxes(line: Line) {
    const direction = line.getDirection();

    console.debug(direction);
    switch (direction) {
      case "north":
        {
          const {
            p1: { x: startX, y: startY },
            p1: start,
            p2: { x: endX, y: endY },
            p2: end,
          } = line;

          const eastSide = new Line(
            new Point(startX + 1, startY),
            new Point(endX + 1, endY)
          );
          const westSide = new Line(
            new Point(startX - 1, startY),
            new Point(endX - 1, endY)
          );
          const northEastSide = new Line(
            new Point(startX + 1, startY - 1),
            end
          );
          const southEastSide = new Line(start, new Point(endX + 1, endY + 1));

          const northWestSide = new Line(
            new Point(startX - 1, startY - 1),
            end
          );
          const southWestSide = new Line(start, new Point(endX - 1, endY + 1));

          if (
            [westSide, northWestSide, southWestSide].every(
              (_line) =>
                this.lines.filter((__line) => __line.isEqual(_line)).length > 0
            )
          ) {
            console.debug("west side");

            const box = new Box(new Point(endX - 1, endY));
            this.boxes.push(box);
          }

          if (
            [eastSide, northEastSide, southEastSide].every(
              (_line) =>
                this.lines.filter((__line) => __line.isEqual(_line)).length > 0
            )
          ) {
            console.debug("east side");

            const box = new Box(end);
            this.boxes.push(box);
          }
        }
        break;

      case "south":
        {
          const {
            p2: { x: startX, y: startY },
            p2: start,
            p1: { x: endX, y: endY },
            p1: end,
          } = line;

          const eastSide = new Line(
            new Point(startX + 1, startY),
            new Point(endX + 1, endY)
          );
          const westSide = new Line(
            new Point(startX - 1, startY),
            new Point(endX - 1, endY)
          );
          const northEastSide = new Line(
            new Point(startX + 1, startY - 1),
            end
          );
          const southEastSide = new Line(start, new Point(endX + 1, endY + 1));

          const northWestSide = new Line(
            new Point(startX - 1, startY - 1),
            end
          );
          const southWestSide = new Line(start, new Point(endX - 1, endY + 1));

          if (
            [westSide, northWestSide, southWestSide].every(
              (_line) =>
                this.lines.filter((__line) => __line.isEqual(_line)).length > 0
            )
          ) {
            console.debug("west side");
            const box = new Box(new Point(endX - 1, endY));
            this.boxes.push(box);
          }

          if (
            [eastSide, northEastSide, southEastSide].every(
              (_line) =>
                this.lines.filter((__line) => __line.isEqual(_line)).length > 0
            )
          ) {
            console.debug("east side");
            const box = new Box(end);
            this.boxes.push(box);
          }
        }
        break;

      case "east":
        {
          const {
            p1: { x: startX, y: startY },
            p1: start,
            p2: { x: endX, y: endY },
            p2: end,
          } = line;

          const northSide = new Line(
            new Point(startX, startY - 1),
            new Point(endX, endY - 1)
          );
          const southSide = new Line(
            new Point(startX, startY + 1),
            new Point(endX, endY + 1)
          );
          const northEastSide = new Line(
            new Point(startX + 1, startY - 1),
            end
          );
          const southEastSide = new Line(
            new Point(startX + 1, startY + 1),
            end
          );

          const northWestSide = new Line(start, new Point(endX - 1, endY - 1));
          const southWestSide = new Line(start, new Point(endX - 1, endY + 1));

          if (
            [northSide, northEastSide, northWestSide].every(
              (_line) =>
                this.lines.filter((__line) => __line.isEqual(_line)).length > 0
            )
          ) {
            console.debug("north side");
            const box = new Box(new Point(startX, startY - 1));
            this.boxes.push(box);
          }

          if (
            [southSide, southEastSide, southWestSide].every(
              (_line) =>
                this.lines.filter((__line) => __line.isEqual(_line)).length > 0
            )
          ) {
            console.debug("south side");
            const box = new Box(new Point(startX, startY));
            this.boxes.push(box);
          }
        }
        break;

      case "west":
        {
          const {
            p2: { x: startX, y: startY },
            p2: start,
            p1: { x: endX, y: endY },
            p1: end,
          } = line;

          const northSide = new Line(
            new Point(startX, startY - 1),
            new Point(endX, endY - 1)
          );
          const southSide = new Line(
            new Point(startX, startY + 1),
            new Point(endX, endY + 1)
          );
          const northEastSide = new Line(
            new Point(startX + 1, startY - 1),
            end
          );
          const southEastSide = new Line(
            new Point(startX + 1, startY + 1),
            end
          );

          const northWestSide = new Line(start, new Point(endX - 1, endY - 1));
          const southWestSide = new Line(start, new Point(endX - 1, endY + 1));

          if (
            [northSide, northEastSide, northWestSide].every(
              (_line) =>
                this.lines.filter((__line) => __line.isEqual(_line)).length > 0
            )
          ) {
            console.debug("north side");
            const box = new Box(new Point(startX, startY - 1));
            this.boxes.push(box);
          }

          if (
            [southSide, southEastSide, southWestSide].every(
              (_line) =>
                this.lines.filter((__line) => __line.isEqual(_line)).length > 0
            )
          ) {
            console.debug("south side");
            const box = new Box(new Point(startX, startY));
            this.boxes.push(box);
          }
        }
        break;

      default:
        console.error("direction undefined");
    }
  }

  handleMouseUp(ev: MouseEvent) {
    const { clientX, clientY } = ev;
    if (this.startingPoint) {
      const endingPoint = this.getClosestPointTo(clientX, clientY);
      const line = new Line(this.startingPoint, endingPoint);
      if (line.isValid() && !this.lines.some((_line) => _line.isEqual(line))) {
        console.debug("adding");
        this.getBoxes(line);
        this.lines.push(line);
      }
    }
    this.startingPoint = undefined;
  }

  handleMouseMove(ev: MouseEvent) {
    const { clientX, clientY } = ev;
    if (!this.mouse) this.mouse = new Point(0, 0);
    this.mouse.x = clientX;
    this.mouse.y = clientY;

    this.closest = this.getClosestPointTo(clientX, clientY);
  }

  handleTouchStart(ev: TouchEvent) {
    const { touches } = ev;
    const { clientX, clientY } = touches[0];

    this.startingPoint = this.getClosestPointTo(clientX, clientY);
  }
  handleTouchEnd(ev: TouchEvent) {
    const { changedTouches: touches } = ev;
    const { clientX, clientY } = touches[0];
    if (this.startingPoint) {
      const endingPoint = this.getClosestPointTo(clientX, clientY);
      const line = new Line(this.startingPoint, endingPoint);
      if (line.isValid() && !this.lines.some((_line) => _line.isEqual(line))) {
        console.debug("adding");
        this.getBoxes(line);
        this.lines.push(line);
      }
    }
    this.startingPoint = undefined;
    this.closest = undefined;
    this.mouse = undefined;
  }

  handleTouchMove(ev: TouchEvent) {
    const { touches } = ev;
    const { clientX, clientY } = touches[0];
    if (!this.mouse) this.mouse = new Point(0, 0);
    this.mouse.x = clientX;
    this.mouse.y = clientY;

    this.closest = this.getClosestPointTo(clientX, clientY);
  }

  setup() {
    this.resize();
    window.onresize = this.resize.bind(this);

    this.canvas.onmousedown = this.handleMouseDown.bind(this);
    this.canvas.onmouseup = this.handleMouseUp.bind(this);

    this.canvas.ontouchstart = this.handleTouchStart.bind(this);
    this.canvas.ontouchend = this.handleTouchEnd.bind(this);
    this.canvas.ontouchmove = this.handleTouchMove.bind(this);

    this.canvas.onmousemove = this.handleMouseMove.bind(this);

    this.draw();
  }
}
