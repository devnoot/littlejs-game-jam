import { Color, drawLine, drawRect, mainCanvas, vec2, worldToScreen, type Vector2 } from "littlejsengine"
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

  static drawWalls(player: Player, data: number[][]) {
    let cellSize = 64
    const { raysCasted, raysHit } = player.castRays(data)

    // for (const { rayStart, rayEnd } of raysCasted) {
    //   Renderer.drawLine(rayStart, rayEnd, 3, new Color(0, 255, 0))
    // }

    // for (const { rayStart, rayEnd,rayDistance } of raysHit) {
    //   drawLine(rayStart, rayStart.add(rayEnd.subtract(rayStart).scale(rayDistance / 1000)), 3, new Color(255, 0, 0))
    // }


    // render the wall projections in black and white for now
    for (const { rayStart, rayEnd, rayDistance } of raysHit) {
      const wallHeight = 32 
      const wallWidth = 32 
      const shade = Math.max(0, 255 - (rayDistance / 2))
      const wallColor = new Color(shade, shade, shade)
      const wallDistance = rayDistance * Math.cos(rayEnd.angle() - player.angle)
      const wallHeightProjected = wallHeight / wallDistance * 256
      const wallTop = mainCanvas.height / 2 - wallHeightProjected / 2
      const wallBottom = mainCanvas.height / 2 + wallHeightProjected / 2
      const wallLeft = rayEnd.angle() - player.angle
      const wallRight = wallLeft + wallWidth

      // draw the wall
      const wallRect = vec2(wallRight - wallLeft, wallBottom - wallTop)
      drawRect(
        worldToScreen(vec2(wallLeft, wallTop)),
        worldToScreen(wallRect),
        wallColor)
    }

  }

}
