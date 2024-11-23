import { type Vector2, EngineObject, keyWasPressed, keyWasReleased, keyIsDown, vec2 } from "littlejsengine"

export class Player extends EngineObject {

  acceleration_rate: number
  deceleration_rate: number
  acceleration: Vector2
  max_velocity: number
  radius: number
  last_position: Vector2
  direction: number

  constructor() {
    super();
    this.velocity = vec2(0,0) 
    this.acceleration = vec2(0, 0) 
    this.acceleration_rate= 0.25
    this.deceleration_rate = 0.6 
    this.max_velocity = 3
    this.radius = 1
    this.last_position = vec2(0, 0)
    this.direction = 0 // in radians
  }

  applyAcceleration(acceleration: Vector2) {
    this.velocity = this.velocity.add(acceleration)
    // cap to max velocity
    if (this.velocity.length() > this.max_velocity) {
      this.velocity.scale(this.max_velocity / this.velocity.length())
    }
  }

  applyDeceleration() {
    this.velocity = this.velocity.scale(this.deceleration_rate)
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
    
    if (keyIsDown('KeyW')) moveAccel = moveAccel.add(vec2(0, this.acceleration_rate))
    if (keyIsDown('KeyA')) moveAccel = moveAccel.add(vec2(-this.acceleration_rate, 0))
    if (keyIsDown('KeyS')) moveAccel = moveAccel.add(vec2(0, -this.acceleration_rate))
    if (keyIsDown('KeyD')) moveAccel = moveAccel.add(vec2(this.acceleration_rate, 0))

    this.applyAcceleration(moveAccel)
  }

  update() {
    this.handleInput()
    this.applyDeceleration()
    this.last_position = this.pos
    if (this.velocity.length() > 0) {
      this.pos = this.pos.add(this.velocity)
      this.direction = Math.atan2(this.velocity.y, this.velocity.x);
    }
    super.update()
  }

  render() {
    super.render()
  }

}
