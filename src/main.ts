import { drawLine, engineInit, vec2, setCameraPos, debugText, Color, Vector2, mainCanvas, setCameraScale, cameraScale, keyWasReleased } from "littlejsengine";
import { Player } from "./core/Player";
import { MAP00 } from "./assets/maps/map00";
import { Utils } from "./core/Utils";
import { Renderer } from "./core/Renderer";
import { GameConfig } from "./GameConfig";

class Game {
  config: GameConfig;

  private static readonly CELL_SIZE = MAP00.cellSize;
  private static readonly CELL_LINE_THICKNESS = 1;
  private static readonly COLOR_WHITE = new Color(255, 255, 255);

  private image_sources: any[] = [];
  private $root = document.body;
  private GameObjects: { Player: Player };

  constructor() {
    this.config = new GameConfig();
    this.GameObjects = {
      Player: new Player({gameConfig: this.config})
    };
    engineInit(this.init.bind(this), this.update.bind(this), this.post_update.bind(this), this.render.bind(this), this.post_render.bind(this), this.image_sources, this.$root);
  }

  private init() {
    const start = vec2(4 * Game.CELL_SIZE, 3 * Game.CELL_SIZE);
    setCameraPos(start);
    setCameraScale(1);
    this.GameObjects.Player.pos = vec2(start);
  }

  private update() {
    if (keyWasReleased('KeyM')) {
      this.config.setViewMode(
        this.config.getViewMode()  === 'top-down' ? 'first-person' : 'top-down'
      )
    }

    for (const { start, end } of this.getMapLines(MAP00.data)) {
      if (Utils.checkLineCollision(this.GameObjects.Player.pos, this.GameObjects.Player.radius, start, end)) {
        this.GameObjects.Player.pos = this.GameObjects.Player.lastPosition;
        return;
      }
    }
    this.centerCameraOntoPlayer();
  }

  private post_update() {}

  private render() {
    const { data } = MAP00;
    const linedefs = this.getMapLines(data);

    if (this.config.getViewMode() === 'top-down') {
      Renderer.drawLinedefs(linedefs);

      const directionVector = vec2(
        Math.cos(this.GameObjects.Player.angle),
        Math.sin(this.GameObjects.Player.angle)
      ).scale(32);
      const endPos = this.GameObjects.Player.pos.add(directionVector);
      const lineColor = this.GameObjects.Player.velocity.length() > 0 ? new Color(0, 0, 255) : new Color(255, 255, 255);
      Renderer.drawLine(this.GameObjects.Player.pos, endPos, Game.CELL_LINE_THICKNESS, lineColor);
    }

    if (this.config.getViewMode() === 'first-person') {
      Renderer.drawWalls(this.GameObjects.Player, data);
    }

    this.displayPlayerDebug();
    this.displayCameraBounds();
  }

  private post_render() {}

  private getMapLines(map: number[][]) {
    const lines = [];
    const cellSize = Game.CELL_SIZE;

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === 1) {
          const topLeft = vec2(x * cellSize, y * cellSize);
          const topRight = vec2((x + 1) * cellSize, y * cellSize);
          const bottomLeft = vec2(x * cellSize, (y + 1) * cellSize);
          const bottomRight = vec2((x + 1) * cellSize, (y + 1) * cellSize);

          lines.push({ start: topLeft, end: topRight }); // Top
          lines.push({ start: topRight, end: bottomRight }); // Right
          lines.push({ start: bottomRight, end: bottomLeft }); // Bottom
          lines.push({ start: bottomLeft, end: topLeft }); // Left
        }
      }
    }

    return lines;
  }

  private displayPlayerDebug() {
    const text = `🪿X:${this.GameObjects.Player.pos.x.toFixed(2)} Y:${this.GameObjects.Player.pos.y.toFixed(2)} A:${this.GameObjects.Player.angle.toFixed(2)} V: ${this.GameObjects.Player.velocity} RUN: ${this.GameObjects.Player.isRunning}`;
    const position = vec2(this.GameObjects.Player.pos.x, this.GameObjects.Player.pos.y + 16);
    debugText(text, position, 8, '#00ff00', 0, 0, 'monospace');
  }

  private displayCameraBounds() {
    const bounds = Utils.getScreenBoundary();
    const text = `🎥 Bounds: T:${bounds.top.toFixed(2)} R:${bounds.right.toFixed(2)} B:${bounds.bottom.toFixed(2)} L:${bounds.left.toFixed(2)}`;
    const position = vec2(this.GameObjects.Player.pos.x, this.GameObjects.Player.pos.y + 32);
    debugText(text, position, 8, '#FFFFFF', 0, 0, 'monospace');
  }

  private centerCameraOntoPlayer() {
    setCameraPos(this.GameObjects.Player.pos);
  }
}

new Game();
