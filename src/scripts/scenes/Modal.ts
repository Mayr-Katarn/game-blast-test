import ButtonMain from '../components/Buttons/ButtonMain'
import { colors } from '../config'
import langs from '../langs'

export default class Modal extends Phaser.Scene {
  constructor() {
    super('Modal')
  }

  public type: string
  public lang: any
  public info?: any

  public globalBg: Phaser.GameObjects.TileSprite
  public bg: Phaser.GameObjects.Sprite

  private x: number
  private y: number
  private bgAniDuration: number

  private yOffset: number


  public init(data: { type: string, info?: any }): void {
    this.type = data.type
    this.info = data.info
    this.lang = langs.ru

    this.x = this.cameras.main.centerX
    this.y = this.cameras.main.centerY
    this.bgAniDuration = 300
    this.yOffset = 40
  }


  public create(): void {
    this.globalBg = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'pixel').setTint(0x000000).setAlpha(0).setOrigin(0).setInteractive()
    this.tweens.add({
      targets: this.globalBg,
      alpha: 0.75,
      duration: this.bgAniDuration
    })

    switch (this.type) {
      case 'gameOver': {
        this.gameOverWindow()
        break
      }
    }
  }


  private gameOverWindow(): void {
    const titleText = this.info ? this.lang.win : this.lang.lose
    const subtitleText = this.info ? this.lang.targetReach : this.lang.outOfTurns
    const color = this.info ? colors.green.str : colors.red.str

    this.bg = this.add.sprite(this.x, this.y + this.yOffset, 'progress-bar-bg').setScale(0.7, 1.3).setAlpha(0)

    const title: Phaser.GameObjects.Text = this.add.text(this.bg.getTopCenter().x, this.bg.getTopCenter().y + 16, titleText, {
      font: '40px Marvin', color
    }).setOrigin(0.5, 0).setStroke('#000000', 3).setAlpha(0)

    const subtitle: Phaser.GameObjects.Text = this.add.text(title.getBottomCenter().x, title.getBottomCenter().y + 4, subtitleText, {
      font: '20px Marvin', color: 'white'
    }).setOrigin(0.5, 0).setStroke('#000000', 3).setAlpha(0)

    const btn = new ButtonMain(
      this,this.x, subtitle.getBottomCenter().y + 50,
      (): void => { this.close() },
      this.lang.continue
    )

    const targets = btn.elements.concat([this.bg, title, subtitle])
    this.fadeOut(targets)
  }


  private fadeOut(targets: any[]): void {
    this.tweens.add({
      targets,
      ease: 'Power2',
      y: `-=${this.yOffset}`,
      alpha: 1,
      duration: 400,
      delay: this.bgAniDuration
    })
  }


  private close(): void {
    this.scene.stop()
  }
}