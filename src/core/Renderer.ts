import { Color, drawLine, drawRect, mainCanvas, vec2, worldToScreen, type Vector2 } from "littlejsengine";
import { Linedef } from "../types";
import { Player } from "./Player";
import { Utils } from "./Utils";

const rayLogs = []

export class Renderer {
  static drawLinedefs(linedefs: Linedef[], thickness: number = 1, color: Color = new Color(255, 255, 255)) {
    for (const { start, end } of linedefs) {
      drawLine(start, end, thickness, color);
    }
  }

  static drawLine(start: Vector2, end: Vector2, thickness: number = 1, color: Color = new Color(255, 255, 255)) {
    drawLine(start, end, thickness, color);
  }

  static drawWalls(player: Player, data: number[][]) {
    const cellSize = 64;
    const wallHeight = 64;
    const fov = player.fov * (Math.PI / 180);
    const halfCanvasHeight = mainCanvas.height / 2;

    const { raysCasted, raysHit } = player.castRays(data);

    raysHit.forEach(({ rayStart, rayEnd, rayDistance }, rayIndex) => {
      const rayDirection = rayEnd!.subtract(rayStart);
      const rayAngle = rayDirection.angle();
      let angleDelta = ((rayAngle - player.angle + Math.PI * 2) % (Math.PI * 2));
      if (angleDelta > Math.PI) angleDelta -= Math.PI * 2;

      if (Math.abs(angleDelta) > fov / 2) return;

      const perpendicularDistance = rayDistance * Math.cos(angleDelta);
      const clampedDistance = Math.max(1, perpendicularDistance);
      const projectedWallHeight = (wallHeight / clampedDistance) * halfCanvasHeight;

      const normalizedDelta = (angleDelta + fov / 2) / fov;
      const screenX = normalizedDelta * mainCanvas.width;
      const wallSliceWidth = mainCanvas.width / raysCasted.length;

      const wallTop = halfCanvasHeight - projectedWallHeight / 2;
      const wallBottom = halfCanvasHeight + projectedWallHeight / 2;

      const shadeFactor = Math.min(rayDistance / (8 * cellSize), 1);
      const wallColor = new Color(255 * (1 - shadeFactor), 255 * (1 - shadeFactor), 255 * (1 - shadeFactor));

      if (screenX >= 0 && screenX <= mainCanvas.width) {
        drawRect(
          vec2(screenX - wallSliceWidth / 2, mainCanvas.height - wallBottom),
          vec2(wallSliceWidth, projectedWallHeight),
          wallColor
        );
      }
    });
  }

}
