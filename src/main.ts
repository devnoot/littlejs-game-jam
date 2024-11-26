import { drawLine, engineInit, vec2, setCameraPos, debugText, Color, Vector2, mainCanvas, setCameraScale, cameraScale, keyWasReleased } from "littlejsengine";
import { Player } from "./core/Player";
import { MAP00 } from "./assets/maps/map00";
import { Utils } from "./core/Utils";
import { Renderer } from "./core/Renderer";

// constants go here so I remember to move them to their own file!
const CELL_SIZE = MAP00.cellSize
const CELL_LINE_THICKNESS = 1
const COLOR_WHITE = new Color(255, 255, 255)

const image_sources: any[] = []
const $root = document.body

let currentGameMode : 'map' | 'firstperson' = 'map'

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
  setCameraScale(2)
  GameObjects.Player.pos = vec2(start)
}

function update() {
  // toggle between game modes when 'm' is pressed
  if (keyWasReleased('KeyM')) {
      currentGameMode = currentGameMode === 'map' ? 'firstperson' : 'map'
  }

  // check for collisions between player and maps
  for (const { start, end } of getMapLines(MAP00.data)) {
    if (Utils.checkLineCollision(GameObjects.Player.pos, GameObjects.Player.radius, start, end)) {
      GameObjects.Player.pos = GameObjects.Player.lastPosition
      return
    }
  }
  centerCameraOntoPlayer()
}

function post_update() {}

function render() {

  const { data } = MAP00

  const linedefs = getMapLines(data)

  if (currentGameMode === 'map') {

    Renderer.drawLinedefs(linedefs)

    // for (const { start, end } of mapLines) {
    //   customDrawLine(start, end)
    // }

    // draw the player direction
    const directionVector = vec2(
      Math.cos(GameObjects.Player.angle),
      Math.sin(GameObjects.Player.angle)
    ).scale(32)
    const endPos = GameObjects.Player.pos.add(directionVector)
    const lineColor = GameObjects.Player.velocity.length() > 0 ? new Color(0, 0, 255) : new Color(255, 255, 255)
    Renderer.drawLine(GameObjects.Player.pos, endPos, CELL_LINE_THICKNESS, lineColor)

    // Renderer.drawWalls(GameObjects.Player, data, CELL_SIZE)

  }

  if (currentGameMode === 'firstperson') {
    Renderer.drawWalls(GameObjects.Player, data, CELL_SIZE)
  }

  // do debug stuff last
  displayPlayerDebug()
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

// debug text stuff that will probably be deleted later
function displayPlayerDebug() {
  const text = `🪿X:${GameObjects.Player.pos.x.toFixed(2)} Y:${GameObjects.Player.pos.y.toFixed(2)} A:${GameObjects.Player.angle.toFixed(2)} V: ${GameObjects.Player.velocity} RUN: ${GameObjects.Player.isRunning}`
  const position = vec2(GameObjects.Player.pos.x, GameObjects.Player.pos.y + 16)
  debugText(text, position, 8, '#00ff00', 0, 0, 'monospace')
}

function displayCameraBounds() {
  const bounds = Utils.getScreenBoundary()
  const text = `🎥 Bounds: T:${bounds.top.toFixed(2)} R:${bounds.right.toFixed(2)} B:${bounds.bottom.toFixed(2)} L:${bounds.left.toFixed(2)}`
  const position = vec2(GameObjects.Player.pos.x, GameObjects.Player.pos.y + 32)
  debugText(text, position, 8, '#FFFFFF', 0, 0, 'monospace')
}

function centerCameraOntoPlayer() {
  setCameraPos(GameObjects.Player.pos)
}

engineInit(init, update, post_update, render, post_render, image_sources, $root)
