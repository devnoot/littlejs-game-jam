import { type Vector2, mainCanvas, cameraScale, cameraPos, vec2 } from 'littlejsengine'

export class Utils {

  static checkLineCollision(point: Vector2, pointRadius: number, lineStart: Vector2, lineEnd: Vector2) {
    const lineVec = lineEnd.subtract(lineStart);
    const pointVec = point.subtract(lineStart);
    const lineLength = lineVec.length();
    // Project the point onto the line
    const t = Math.max(0, Math.min(1, pointVec.dot(lineVec) / (lineLength ** 2)));
    const closestPoint = lineStart.add(lineVec.scale(t));
    // Check if the distance to the closest point is less than the player's radius
    return point.distance(closestPoint) <= pointRadius;
  }
  
  static getScreenBoundary() {
    const halfSize = vec2(
      mainCanvas.width / 2 / cameraScale,
      mainCanvas.height / 2 / cameraScale
    );
    return {
      left: cameraPos.x - halfSize.x,
      right: cameraPos.x + halfSize.x,
      top: cameraPos.y + halfSize.y,
      bottom: cameraPos.y - halfSize.y,
    }
  }

  static castRay(origin: Vector2, direction: Vector2, map: number[][], cellSize: number) {
    let currentPos = vec2(origin.x, origin.y);
    const rayStep = 0.1; // Increment for the ray's movement
    const maxRayLength = 1000; // Max distance a ray can travel

    for (let i = 0; i < maxRayLength; i += rayStep) {
      currentPos = currentPos.add(direction.scale(rayStep));

      // Check if the current position hits a wall
      const mapX = Math.floor(currentPos.x / cellSize);
      const mapY = Math.floor(currentPos.y / cellSize);

      if (map[mapY] && map[mapY][mapX] === 1) {
        return {
          hit: true,
          distance: currentPos.distance(origin),
          hitPosition: currentPos,
        };
      }
    }

    return { hit: false, distance: maxRayLength };
  }
}