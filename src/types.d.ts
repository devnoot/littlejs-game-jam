import { Vector2 } from "littlejsengine"

export type RENDER_MODE = 'firstperson' | 'map'

export type Linedef = {
  start: Vector2
  end: Vector2
}