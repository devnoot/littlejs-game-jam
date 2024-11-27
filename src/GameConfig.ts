export class GameConfig {
  viewMode: 'top-down' | 'first-person'

  constructor() {
    this.viewMode = 'top-down'
  }

  getViewMode() {
    return this.viewMode
  }

  setViewMode(viewMode: 'top-down' | 'first-person') {
    this.viewMode = viewMode
  }

}