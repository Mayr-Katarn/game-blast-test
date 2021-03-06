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

  private progressBarTitle: Phaser.GameObjects.Text
  private progressBarBg: Phaser.GameObjects.Sprite
  private progressBarLine: Phaser.GameObjects.Sprite
  private progressLine: ProgressLine
  
  private scoreBarBg: Phaser.GameObjects.Sprite
  private scoreBarBall: Phaser.GameObjects.Sprite
  private turnsText: Phaser.GameObjects.Text
  private turnsTextAni: Phaser.Tweens.Tween
  private scoreTitle: Phaser.GameObjects.Text
  private scoreText: Phaser.GameObjects.Text
  private scoreTextAni: Phaser.Time.TimerEvent

  private bombBtn: Phaser.GameObjects.Sprite
  private bombBtnText: Phaser.GameObjects.Text
  private shuffleBtn: Phaser.GameObjects.Sprite
  private shuffleBtnText: Phaser.GameObjects.Text

  private pauseBtn: Phaser.GameObjects.Sprite


  public init(): void {
    this.lang = langs.ru
    this.gameScene = this.game.scene.keys['Game'] as Game
    this.camera = this.cameras.main
  }


  public create(): void {
    this.createTopBar()
    this.createScoreAndTurnsBar()
    this.createBusters()
    this.createPauseButton()
  }

  private createTopBar(): void {
    this.progressBarBg = this.add.sprite(this.camera.centerX, 30, 'progress-bar-bg').setScale(0.9)
    this.progressBarTitle = this.add.text(this.camera.centerX, 4, this.lang.progress, { font: '22px Marvin', color: 'white' }).setOrigin(0.5, 0)
    this.progressBarLine = this.add.sprite(this.camera.centerX, this.progressBarBg.getCenter().y + 10, 'progress-bar-line').setOrigin(0.5, 0).setScale(0.9)
    this.progressLine = new ProgressLine(this, this.progressBarLine.getLeftCenter().x + 3, this.progressBarLine.getLeftCenter().y - 2).setFullScale(0.9)
  }

  private createScoreAndTurnsBar(): void {
    this.scoreBarBg = this.add.sprite(this.camera.centerX, this.progressBarBg.getBottomCenter().y - 6, 'score-bar').setOrigin(0.5, 0).setScale(0.95)
    this.scoreBarBall = this.add.sprite(this.camera.centerX, this.scoreBarBg.getTopCenter().y, 'ball-bar').setOrigin(0.5, 0).setScale(0.95)
    this.turnsText = this.add.text(this.scoreBarBall.getCenter().x, this.scoreBarBall.getCenter().y - 6, `${this.gameScene.turns}`, { font: '56px Marvin', color: 'white' }).setOrigin(0.5)
    this.scoreTitle = this.add.text(this.scoreBarBg.getCenter().x, this.scoreBarBg.getCenter().y + 26, this.lang.points, { font: '18px Marvin', color: 'white' }).setOrigin(0.5, 0)
    this.scoreText = this.add.text(this.scoreTitle.getBottomCenter().x, this.scoreTitle.getBottomCenter().y, `${this.gameScene.score}`, { font: '30px Marvin', color: 'white' }).setOrigin(0.5, 0)
  }

  private createBusters(): void {
    const offsetX = 100
    const offsetY = 500
    this.bombBtn = this.add.sprite(this.camera.centerX - offsetX, this.camera.centerY + offsetY, 'buster-btn').setScale(1.3).setInteractive()
    this.bombBtnText = this.add.text(this.bombBtn.getCenter().x, this.bombBtn.getCenter().y, this.lang.bomb, { font: '20px Marvin', color: 'white' }).setOrigin(0.5)
    this.shuffleBtn = this.add.sprite(this.camera.centerX + offsetX, this.camera.centerY + offsetY, 'buster-btn').setScale(1.3).setInteractive()
    this.shuffleBtnText = this.add.text(this.shuffleBtn.getCenter().x, this.shuffleBtn.getCenter().y, this.lang.shuffle, {
      font: '20px Marvin', align: 'center', color: 'white', wordWrap: { width: 90, useAdvancedWrap: true }
    }).setOrigin(0.5)

    this.bombBtn.on('pointerup', (): void => { this.gameScene.bombToggle() })
    this.shuffleBtn.on('pointerup', (): void => { this.gameScene.recreateField(true) })
  }

  private createPauseButton(): void {
    this.pauseBtn = this.add.sprite(this.camera.width, 0, 'pause-btn').setOrigin(1, 0).setInteractive()
    this.pauseBtn.on('pointerup', (): void => { this.stopGame() })
  }

  private stopGame(): void {
    this.scene.stop()
    this.scene.stop('Game')
    this.scene.start('MainMenu')
  }

  public updateTurns(): void {
    this.turnsText.setText(`${this.gameScene.turns}`)
    this.turnsTextAni = this.tweens.add({
      targets: this.turnsText,
      scale: 1.3,
      yoyo: true,
      duration: 50
    })
  }

  public updateScore(): void {
    const percent = this.gameScene.score / (this.gameScene.scoreTarget / 100)
    const currentScore = +this.scoreText.text
    const scores: number[] = []

    this.progressLine.setProgress(Math.round(percent))
    for (let i = 1; i <= 4; i++) scores.push(Math.round(currentScore + this.gameScene.blowScore * (0.2 * i)))
    scores.push(this.gameScene.score)

    this.scoreTextAni?.remove()
    for (let i = 0; i < scores.length; i++) {
      this.scoreTextAni = this.time.addEvent({
        delay: 50 * i,
        callback: (): void => {this.scoreText.setText(`${scores[i]}`)},
        loop: false
      })
    }
  }
}