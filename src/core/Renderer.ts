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

    // depth of field
    let dof = 8
    // first we set the ray angle to the player angle
    // all angles are in radians
    let rayAngle = player.angle
    let ry, rx, yo, xo

    for (let ray=0; ray < 1; ray++){

      // check the horizontal grid lines
      // get the negative inverse of the ray angle
      const aTan = -1 / Math.tan(rayAngle)
      // is ray looking up or down
      let facing = rayAngle > Math.PI ? 'DOWN' : 'UP'
      if (facing === 'UP') {
        ry = (player.pos.y >> 6 << 6) - 0.0001
        rx = (player.pos.y - ry) * aTan + player.pos.x
        yo = -cellSize
        xo = -yo * aTan
      } else if (facing === 'DOWN') {
        ry = (player.pos.y >> 6 << 6) + cellSize
        rx = (player.pos.y - ry) * aTan + player.pos.x
        yo = cellSize
        xo = -yo * aTan
      } else if (ra === 0 || ra === Math.PI) {
        // looking straight left or right
        rx = player.pos.x
        ry = player.pos.y
        dof = 8
      }
      while(dof<8){
        const mx = (rx >> 6)
        const my = (ry >> 6)
        if(data[my][mx] === 1){
          dof = 8
        } else {
          rx += xo
          ry += yo
          dof += 1
        }
      }

      // check the vertical grid lines
      const nTan = -Math.tan(rayAngle)
      if (rayAngle > Math.PI / 2 && rayAngle < Math.PI * 3 / 2) {
        // looking left
        rx = (player.pos.x >> 6 << 6) - 0.0001
        ry = (player.pos.x - rx) * aTan + player.pos.y
        xo = -cellSize
        yo = -xo * aTan
      }
      if (rayAngle < Math.PI / 2 || rayAngle > Math.PI * 3 / 2) {
        // looking right
        rx = (player.pos.y >> 6 << 6) + cellSize
        ry = (player.pos.y - ry) * aTan + player.pos.x
        xo = cellSize
        yo = -yo * aTan
      }
      if (rayAngle === 0 || rayAngle === Math.PI) {
        rx = player.pos.x
        ry = player.pos.y
        dof = 8
      }
      while(dof<8){
        const mx = (rx >> 6)
        const my = (ry >> 6)
        if(data[my][mx] === 1){
          dof = 8
        } else {
          rx += xo
          ry += yo
          dof += 1
        }
      }
      // draw the ray
      drawLine(player.pos, vec2(rx, ry), 1, new Color(255, 0, 0))


    }






//    const fov = 90
//    const numRays = fov
//    const rayStep = fov / numRays
//
//    for (let ray = 0; ray < numRays; ray++) {
//
//      const angle = player.direction - fov / 2 + ray
//      const direction = vec2(Math.cos(angle), Math.sin(angle))
//      const result = Utils.castRay(player.pos, direction, data, cellSize)
//
//      if (result.hit && result.hitPosition) {
//        const wallHeight = mainCanvas.height / result.distance
//        const wallColor = new Color(255 / result.distance, 255 / result.distance, 255 / result.distance)
//        // draw the rays that hit
//        drawLine(player.pos, player.pos.add(direction.scale(32)), 1, new Color(255, 0, 0))
//        // drawLine(
//        //   vec2(ray, mainCanvas.height / 2 - wallHeight / 2),
//        //   vec2(ray, mainCanvas.height / 2 + wallHeight / 2),
//        //   1,
//        //   wallColor
//        // )
//      }
//    }
//  }
  }

}
