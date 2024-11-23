import { type Vector2, EngineObject, keyWasPressed, keyWasReleased, keyIsDown, vec2, mousePos, drawCanvas2D } from "littlejsengine"

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

  handleInput() {
    let moveAccel = vec2(0, 0) 
    
    // if nothing is pressed apply deceleration so that player will eventually stop
    if (!keyIsDown('KeyW') && !keyIsDown('KeyS') && !keyIsDown('KeyA') && !keyIsDown('KeyD')) {
      this.applyDeceleration()
    }
    
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
