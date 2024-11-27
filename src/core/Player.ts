import { type Vector2, EngineObject, keyWasPressed, keyWasReleased, keyIsDown, vec2, mousePos, drawCanvas2D, Color, drawRect } from "littlejsengine"
import { Renderer } from "./Renderer"
import { MAP00 } from "../assets/maps/map00"
import { Utils } from "./Utils"
import { GameConfig } from "../GameConfig"

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
  fov: number
  gameConfig: GameConfig

  constructor({ gameConfig }: { gameConfig: GameConfig}) {
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
    this.fov = 60
    this.gameConfig = gameConfig
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

  moveForward() {
    let moveAccel = vec2(Math.cos(this.angle) * this.accelerationRate, Math.sin(this.angle) * this.accelerationRate)
    if (this.isRunning) {
      moveAccel = moveAccel.scale(RUNNING_ACCELERATION_MODIFIER)
    }
    this.applyAcceleration(moveAccel)
  }

  moveBackward() {
    let moveAccel = vec2(Math.cos(this.angle) * -this.accelerationRate, Math.sin(this.angle) * -this.accelerationRate)
    if (this.isRunning) {
      moveAccel = moveAccel.scale(RUNNING_ACCELERATION_MODIFIER)
    }
    this.applyAcceleration(moveAccel)
  }

  strafeRight() {
    let moveAccel = vec2(Math.cos(this.angle - Math.PI / 2) * this.accelerationRate, Math.sin(this.angle - Math.PI / 2) * this.accelerationRate)
    if (this.isRunning) {
      moveAccel = moveAccel.scale(RUNNING_ACCELERATION_MODIFIER)
    }
    this.applyAcceleration(moveAccel)
  }

  strafeLeft() {
    let moveAccel = vec2(Math.cos(this.angle + Math.PI / 2) * this.accelerationRate, Math.sin(this.angle + Math.PI / 2) * this.accelerationRate)
    if (this.isRunning) {
      moveAccel = moveAccel.scale(RUNNING_ACCELERATION_MODIFIER)
    }
    this.applyAcceleration(moveAccel)
  }

  castRays(map: number[][]) {
  const rayStep = (1) * (Math.PI / 180); // 1 degree in radians
  const fov = this.fov * (Math.PI / 180);
  const maxRayLength = 512; // Max ray length
  const angleStart = this.angle - fov / 2;
  const angleEnd = this.angle + fov / 2;

  const raysCasted = [];
  const raysHit = [];

  for (let rayAngle = angleStart; rayAngle < angleEnd; rayAngle += rayStep) {
    const direction = vec2(Math.cos(rayAngle), Math.sin(rayAngle));
    const rayStart = this.pos;
    const rayResult = Utils.castRay(rayStart, direction, map, 64);

    const rayEnd = rayResult.hit
      ? rayResult.hitPosition
      : rayStart.add(direction.scale(maxRayLength));

    raysCasted.push({ rayStart, rayEnd });

    if (rayResult.hit) {
      raysHit.push({
        rayStart,
        rayEnd,
        rayDistance: rayResult.distance,
      });
    }
  }

  return { raysCasted, raysHit };
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

    keyIsDown('KeyW') && this.moveForward() 
    keyIsDown('KeyA') && this.strafeLeft()
    keyIsDown('KeyS') && this.moveBackward()
    keyIsDown('KeyD') && this.strafeRight()

    if (keyIsDown('ShiftLeft')) {
      this.isRunning = true
      this.maxVelocity = 64
    } else {
      this.isRunning = false
      this.maxVelocity = 32
    }
    // Flip the y-axis for correct mouse-based angle calculation
    // Check the current game mode
    if (this.gameConfig.getViewMode() === 'first-person') {
      // Flip the y-axis for first-person mode
      this.angle = Math.atan2(-(mousePos.y - this.pos.y), mousePos.x - this.pos.x);
    } else {
      // Use normal angle calculation for map mode
      this.angle = Math.atan2(mousePos.y - this.pos.y, mousePos.x - this.pos.x);
    }
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
    // drawCanvas2D(this.pos, vec2(this.radius / 8, this.radius / 8), 0, false, (context: CanvasRenderingContext2D) => {
    //   context.fillStyle = 'grey';
    //   context.beginPath();
    //   context.arc(0, 0, this.radius, 0, Math.PI * 2);
    //   context.fill();
    // });

    drawRect(this.pos, this.size, new Color(255, 0, 0))
  }

}
