import { type Vector2, EngineObject, keyWasPressed, keyWasReleased, keyIsDown, vec2, mousePos, drawCanvas2D, Color, drawRect } from "littlejsengine"
import { Renderer } from "./Renderer"
import { MAP00 } from "../assets/maps/map00"

const RUNNING_ACCELERATION_MODIFIER = 3.5

export class Player extends EngineObject {

  accelerationRate: number
  decelerationRate: number
  acceleration: Vector2
  maxVelocity: number
  radius: number
  lastPosition: Vector2
  direction: number
  isRunning: boolean

  constructor() {
    super();
    this.velocity = vec2(0,0)
    this.acceleration = vec2(0, 0)
    this.accelerationRate = 0.9
    this.decelerationRate = 0.20
    this.maxVelocity = 32
    this.radius = 8
    this.size = vec2(16, 16)
    this.lastPosition = vec2(0, 0)
    this.direction = 0 // in radians
    this.isRunning = false
  }

  applyAcceleration(acceleration: Vector2) {
    this.velocity = this.velocity.add(acceleration)
    // cap to max velocity
    if (this.velocity.length() > this.maxVelocity) {
      this.velocity.scale(this.maxVelocity / this.velocity.length())
    }
  }

  applyDeceleration() {
    this.velocity = this.velocity.scale(this.decelerationRate)
    // prevent jitter when velocity is small
    if (this.velocity.length() < 0.01) {
      this.velocity.set(0, 0)
    }
  }

  castRays(map: number[][]) {
    let rayStep = (60 / 8) * (Math.PI / 180)
    let fov = 60
    let maxRayLength = 1024
    let angleStart = this.angle - (fov / 2) * (Math.PI / 180)
    let angleEnd = this.angle + (fov / 2) * (Math.PI / 180)

    let raysCasted = []
    for (let rayAngle = angleStart; rayAngle < angleEnd; rayAngle += rayStep) {
      let direction = vec2(Math.cos(rayAngle), Math.sin(rayAngle))
      let rayStart = this.pos
      let rayEnd = this.pos.add(direction.scale(maxRayLength))
      raysCasted.push({ rayStart, rayEnd })
      // Renderer.drawLine(rayStart, rayEnd, 3, new Color(0, 255, 0))
    }

    // for each ray, check if it collides with the map. If the map cell is nonzero, it is solid.
    // the cell size is 64.
    let raysHit = []
    for (const { rayStart, rayEnd } of raysCasted) {
      let rayHit = false
      let rayDistance = maxRayLength
      for (let i = 0; i < maxRayLength; i += 1) {
        let currentPos = rayStart.add(rayEnd.subtract(rayStart).scale(i / maxRayLength))
        let mapX = Math.floor(currentPos.x / 64)
        let mapY = Math.floor(currentPos.y / 64)
        if (map[mapY] && map[mapY][mapX] === 1) {
          rayHit = true
          rayDistance = currentPos.distance(rayStart)
          break
        }
      }
      if (rayHit) {
        raysHit.push({ rayStart, rayEnd, rayDistance })
        Renderer.drawLine(rayStart, rayStart.add(rayEnd.subtract(rayStart).scale(rayDistance / maxRayLength)), 3, new Color(255, 0, 0))
      }
    }

    return { raysCasted, raysHit}

  }

  handleInput() {
    let moveAccel = vec2(0, 0)

    // if nothing is pressed apply deceleration so that player will eventually stop
    if (!keyIsDown('KeyW') && !keyIsDown('KeyS') && !keyIsDown('KeyA') && !keyIsDown('KeyD')) {
      this.applyDeceleration()
    }

    // if (keyWasReleased('KeyE')) {
    //   this.castRays()
    // }

    if (keyIsDown('KeyW')) moveAccel = this.isRunning ? moveAccel.add(vec2(0, this.accelerationRate * RUNNING_ACCELERATION_MODIFIER)) : moveAccel.add(vec2(0, this.accelerationRate))
    if (keyIsDown('KeyA')) moveAccel = this.isRunning ? moveAccel.add(vec2(-this.accelerationRate * RUNNING_ACCELERATION_MODIFIER, 0)) : moveAccel.add(vec2(-this.accelerationRate, 0))
    if (keyIsDown('KeyS')) moveAccel = this.isRunning ? moveAccel.add(vec2(0, -this.accelerationRate * RUNNING_ACCELERATION_MODIFIER)) : moveAccel.add(vec2(0, -this.accelerationRate))
    if (keyIsDown('KeyD')) moveAccel = this.isRunning ? moveAccel.add(vec2(this.accelerationRate * RUNNING_ACCELERATION_MODIFIER, 0)) : moveAccel.add(vec2(this.accelerationRate, 0))

    if (keyIsDown('ShiftLeft')) {
      this.isRunning = true
      this.maxVelocity = 64
    } else {
      this.isRunning = false
      this.maxVelocity = 32
    }

    // set the angle to player position to the mouse position
    this.angle = Math.atan2(mousePos.y - this.pos.y, mousePos.x - this.pos.x);

    this.applyAcceleration(moveAccel)
  }

  update() {
    this.castRays(MAP00.data)
    this.handleInput()
    this.applyDeceleration()
    this.lastPosition = this.pos
    if (this.velocity.length() > 0) {
      this.pos = this.pos.add(this.velocity)
      // this.direction = Math.atan2(this.velocity.y, this.velocity.x);
    }
    super.update()
  }

  render() {
    // super.render()
    drawCanvas2D(this.pos, vec2(this.radius / 8, this.radius / 8), 0, false, (context: CanvasRenderingContext2D) => {
      context.fillStyle = 'grey';
      context.beginPath();
      context.arc(0, 0, this.radius, 0, Math.PI * 2);
      context.fill();
    });
  }

}
