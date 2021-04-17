import Engine from "./Engine";
import "./style.css";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const engine = new Engine(canvas, ctx);

engine.setup();
