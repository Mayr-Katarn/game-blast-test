import langs from "../langs"
import Game from "./Game"

export default class Hud extends Phaser.Scene {
  constructor() {
    super('Bars')
  }

  public lang: any
  public gameScene: Game

  
  public init(): void {
    this.lang = langs.ru
    this.gameScene = this.game.scene.keys['Game'] as Game
  }


  public create(): void {

  }

}