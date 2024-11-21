import * as LittleJS from "littlejsengine";
import { Player } from "./core/Player";


class Game {

  constructor() {
    this.player = new Player()
  }

  start() {
    return LittleJS.engineInit(
      this.init,
      this.update,
      this.postUpdate,
      this.render,
      this.postRender
    )
  }

  init() {}

  update() {}

  postUpdate() {}

  render() {}

  postRender() {}

}

const game = new Game();
game.start();
