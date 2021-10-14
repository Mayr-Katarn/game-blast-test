import ProgressLine from "../components/ProgressLine"
import langs from "../langs"
import Game from "./Game"

export default class Hud extends Phaser.Scene {
  constructor() {
    super('Hud')
  }

  public lang: any
  public gameScene: Game
  public camera: Phaser.Cameras.Scene2D.BaseCamera

  private topBarBg: Phaser.GameObjects.Sprite
  private topBarLine: Phaser.GameObjects.Sprite
  private progressLine: ProgressLine

  
  public init(): void {
    this.lang = langs.ru
    this.gameScene = this.game.scene.keys['Game'] as Game
    this.camera = this.cameras.main
  }


  public create(): void {
    this.createTopBar()
  }

  private createTopBar(): void {
    this.topBarBg = this.add.sprite(this.camera.centerX, 40, 'progress-bar-bg')
    this.topBarLine = this.add.sprite(this.camera.centerX, this.topBarBg.getCenter().y + 6, 'progress-bar-line').setOrigin(0.5, 0)
    this.progressLine = new ProgressLine(this, this.topBarLine.getLeftCenter().x + 3, this.topBarLine.getLeftCenter().y - 2)
  }

}