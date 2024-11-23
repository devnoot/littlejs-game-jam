import { drawLine, engineInit, vec2, setCameraPos, debugText, Color, Vector2, mainCanvas } from "littlejsengine";
import { Player } from "./core/Player";
import { MAP00 } from "./assets/maps/map00";
import { Utils } from "./core/Utils";

// constants go here so I remember to move them to their own file!
const CELL_SIZE = 8
const CELL_LINE_THICKNESS = 0.1 
const COLOR_WHITE = new Color(255, 255, 255)

const image_sources: any[] = []
const $root = document.body

const GameObjects = {
  // because player is extended from EngineObject, it will be updated and rendered automatically
  Player: new Player()
}

// these are in order of execution by the game engine
function init() {
  // the start is pretty arbitrary. it's just for testing atm.
  const start = vec2(
    4 * CELL_SIZE,
    3 * CELL_SIZE
  )
  setCameraPos(start)
  GameObjects.Player.pos = vec2(start)
}

function update() {
  // check for collisions between player and maps
  for (const { start, end } of getMapLines(MAP00.data)) {
    if (Utils.checkLineCollision(GameObjects.Player.pos, GameObjects.Player.radius, start, end)) {
      GameObjects.Player.pos = GameObjects.Player.last_position
      return
    }
  }
  centerCameraOntoPlayer()
}

function post_update() {}
function render() {
  const { data } = MAP00

  const mapLines = getMapLines(data)

  for (const { start, end } of mapLines) {
    customDrawLine(start, end)
  }

  // draw the player direction line if they are moving
  if (GameObjects.Player.velocity.length() > 0) {
    const directionVector = vec2(
      Math.cos(GameObjects.Player.direction),
      Math.sin(GameObjects.Player.direction)
    ).scale(16)
    const endPos = GameObjects.Player.pos.add(directionVector) 
    drawLine(GameObjects.Player.pos, endPos, CELL_LINE_THICKNESS, new Color(255, 0, 0))
  }


  // render walls
  const FOV = 90
  const numRays = mainCanvas.width
  const angleStep = FOV / numRays
  
  for (let ray = 0; ray < numRays; ray++) {
    // calculate the direction
    const angle = GameObjects.Player.direction - FOV / 2 + ray * angleStep
    const direction = vec2(Math.cos(angle), Math.sin(angle))
    // cast the ray
    const result = Utils.castRay(GameObjects.Player.pos, direction, data, CELL_SIZE)

    // draw the ray
    if (result.hit && result.hitPosition) {
      // drawLine(GameObjects.Player.pos, result.hitPosition, 0.1, new Color(255, 255, 255))
      const wallHeight = mainCanvas.height / result.distance
      const wallColor = new Color(255 / result.distance, 255 / result.distance, 255 / result.distance)
      drawLine(
        vec2(ray, mainCanvas.height / 2 - wallHeight / 2),
        vec2(ray, mainCanvas.height / 2 + wallHeight / 2),
        1,
        wallColor
      )
    }
  }

  
  // do debug stuff last
  displayPlayerPosition()
  displayCameraBounds()
}
function post_render() {}

function getMapLines(map: number[][]) {
  const lines = [];
  const cellSize = CELL_SIZE;

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

function customDrawLine(x: Vector2, y: Vector2) {
  drawLine(x, y, CELL_LINE_THICKNESS, COLOR_WHITE)
}

// debug text stuff that will probably be deleted later
function displayPlayerPosition() {
  const text = `Player position: X:${GameObjects.Player.pos.x.toFixed(2)} Y:${GameObjects.Player.pos.y.toFixed(2)} A:${GameObjects.Player.angle.toFixed(2)}`
  const position = vec2(GameObjects.Player.pos.x, GameObjects.Player.pos.y + 16)
  debugText(text, position, 1, '#FFFFFF', 0, 0, 'monospace')
}

function displayCameraBounds() {
  const bounds = Utils.getScreenBoundary()
  const text = `Camera Bounds: T:${bounds.top.toFixed(2)} R:${bounds.right.toFixed(2)} B:${bounds.bottom.toFixed(2)} L:${bounds.left.toFixed(2)}`
  const position = vec2(GameObjects.Player.pos.x, GameObjects.Player.pos.y + 14)
  debugText(text, position, 1, '#FFFFFF', 0, 0, 'monospace')
}

function centerCameraOntoPlayer() {
  setCameraPos(GameObjects.Player.pos)
}

engineInit(init, update, post_update, render, post_render, image_sources, $root)
