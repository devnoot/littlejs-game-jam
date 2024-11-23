import { Color, drawLine, mainCanvas, vec2, type Vector2 } from "littlejsengine"
import { Linedef } from "../types"
import { Player } from "./Player"
import { Utils } from "./Utils"

export class Renderer {

  static drawLinedefs(linedefs: Linedef[], thickness: number = 1, color: Color = new Color(255, 255, 255)) {
    for(const { start, end } of linedefs) {
      drawLine(start, end, thickness, color)
    }
  }

  static drawLine(start: Vector2, end: Vector2, thickness: number = 1, color: Color = new Color(255, 255, 255)) {
    drawLine(start, end, thickness, color)
  }

  static drawWalls(player: Player, data: number[][], cellSize: number) {
    const fov = 90
    const numRays = fov 
    const rayStep = fov / numRays

    for (let ray = 0; ray < numRays; ray++) {

      const angle = player.direction - fov / 2 + ray
      const direction = vec2(Math.cos(angle), Math.sin(angle))
      const result = Utils.castRay(player.pos, direction, data, cellSize)

      if (result.hit && result.hitPosition) {
        const wallHeight = mainCanvas.height / result.distance
        const wallColor = new Color(255 / result.distance, 255 / result.distance, 255 / result.distance)
        // draw the rays that hit
        drawLine(player.pos, player.pos.add(direction.scale(32)), 1, new Color(255, 0, 0))
        // drawLine(
        //   vec2(ray, mainCanvas.height / 2 - wallHeight / 2),
        //   vec2(ray, mainCanvas.height / 2 + wallHeight / 2),
        //   1,
        //   wallColor
        // )
      }
    }
  }

}