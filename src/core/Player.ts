import * as LittleJS from 'littlejsengine'

export class Player extends LittleJS.EngineObject {

  constructor(pos, size, tileInfo, angle) {
    super(pos, size, tileInfo, angle)
  }

  update() {
    if (LittleJS.keyIsDown('KeyW')) {
      this.pos.set(this.pos.x, this.pos.y - 1)
    }
    super.update()
  }

  render() {
    super.render()
  }

}
