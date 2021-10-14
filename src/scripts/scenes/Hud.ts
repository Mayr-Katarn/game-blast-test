import ProgressLine from "../components/ProgressLine"
import config from "../config"
import langs from "../langs"
import Game from "./Game"

export default class Hud extends Phaser.Scene {
  constructor() {
    super('Hud')
  }

  public lang: any
  public gameScene: Game
  public camera: Phaser.Cameras.Scene2D.BaseCamera
  private config: Iconfig

  private progressBarTitle: Phaser.GameObjects.Text
  private progressBarBg: Phaser.GameObjects.Sprite
  private progressBarLine: Phaser.GameObjects.Sprite
  private progressLine: ProgressLine
  
  private scoreBarBg: Phaser.GameObjects.Sprite
  private scoreBarBall: Phaser.GameObjects.Sprite
  private turnsText: Phaser.GameObjects.Text
  private scoreTitle: Phaser.GameObjects.Text
  private scoreText: Phaser.GameObjects.Text

  public init(): void {
    this.lang = langs.ru
    this.gameScene = this.game.scene.keys['Game'] as Game
    this.camera = this.cameras.main
    this.config = config
  }


  public create(): void {
    this.createTopBar()
    this.createScoreAndTurnsBar()
  }

  private createTopBar(): void {
    this.progressBarBg = this.add.sprite(this.camera.centerX, 30, 'progress-bar-bg').setScale(0.9)
    this.progressBarTitle = this.add.text(this.camera.centerX, 4, this.lang.progress, { font: '22px Marvin', color: 'white' }).setOrigin(0.5, 0)
    this.progressBarLine = this.add.sprite(this.camera.centerX, this.progressBarBg.getCenter().y + 10, 'progress-bar-line').setOrigin(0.5, 0).setScale(0.9)
    this.progressLine = new ProgressLine(this, this.progressBarLine.getLeftCenter().x + 3, this.progressBarLine.getLeftCenter().y - 2).setScale(0.9)
  }

  private createScoreAndTurnsBar(): void {
    this.scoreBarBg = this.add.sprite(this.camera.centerX, this.progressBarBg.getBottomCenter().y - 6, 'score-bar').setOrigin(0.5, 0).setScale(0.95)
    this.scoreBarBall = this.add.sprite(this.camera.centerX, this.scoreBarBg.getTopCenter().y, 'ball-bar').setOrigin(0.5, 0).setScale(0.95)
    this.turnsText = this.add.text(this.scoreBarBall.getCenter().x, this.scoreBarBall.getCenter().y - 6, `${this.config.turns}`, { font: '56px Marvin', color: 'white' }).setOrigin(0.5)
    this.scoreTitle = this.add.text(this.scoreBarBg.getCenter().x, this.scoreBarBg.getCenter().y + 26, this.lang.points, { font: '18px Marvin', color: 'white' }).setOrigin(0.5, 0)
    this.scoreText = this.add.text(this.scoreTitle.getBottomCenter().x, this.scoreTitle.getBottomCenter().y, `${this.gameScene.score}`, { font: '30px Marvin', color: 'white' }).setOrigin(0.5, 0)
  }
}