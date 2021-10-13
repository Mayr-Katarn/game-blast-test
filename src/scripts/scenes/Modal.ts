import langs from '../langs'

export default class Modal extends Phaser.Scene {
  constructor() {
    super('Modal')
  }

  public type: string
  public lang: any
  public info?: any

  public globalBg: Phaser.GameObjects.TileSprite
  public bg: any
  public topSide: any
  public botSide: any

  private x: number
  private y: number
  private bgAniDuration: number

  private mid: Phaser.GameObjects.Sprite
  private top: Phaser.GameObjects.Sprite
  private bot: Phaser.GameObjects.Sprite


  public init(data: { type: string, info?: any }): void {
    this.type = data.type
    this.info = data.info
    this.lang = langs.ru

    this.x = this.cameras.main.centerX
    this.y = this.cameras.main.centerY
    this.bgAniDuration = 300
  }


  public create(): void {
    this.globalBg = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'pixel').setTint(0x000000).setAlpha(0).setOrigin(0).setInteractive()
    this.tweens.add({
      targets: this.globalBg,
      alpha: 0.75,
      duration: this.bgAniDuration
    })

    switch (this.type) {
      case 'win': {
        this.win()
        break
      }

      case 'lose': {
        this.lose()
        break
      }
    }
  }


  private win(): void {
    this.mid = this.add.sprite(this.x, this.y + 40, 'mid').setSize(400, 600).setAlpha(0)
    this.top = this.add.sprite(this.mid.getTopCenter().x, this.mid.getTopCenter().y, 'side').setOrigin(0.5, 1).setAlpha(0).setTint(0xfefef4)
    this.bot = this.add.sprite(this.mid.getBottomCenter().x, this.mid.getBottomCenter().y, 'side').setOrigin(0.5, 0).setAlpha(0).setTint(0xf8ffbe).setFlipY(true)
    const title: Phaser.GameObjects.Text = this.add.text(this.top.getTopCenter().x, this.top.getTopCenter().y + 4, this.lang.stageClear, {
      font: '60px Space', color: 'white'
    }).setOrigin(0.5, 0).setStroke('#000000', 3).setAlpha(0)
    this.fadeOut([ this.top, this.mid, this.bot, title ])

  }

  private lose(): void {
    this.mid = this.add.sprite(this.x, this.y + 40, 'mid').setSize(400, 500).setAlpha(0)
    this.top = this.add.sprite(this.mid.getTopCenter().x, this.mid.getTopCenter().y, 'side').setOrigin(0.5, 1).setAlpha(0).setTint(0xfefef4)
    this.bot = this.add.sprite(this.mid.getBottomCenter().x, this.mid.getBottomCenter().y, 'side').setOrigin(0.5, 0).setAlpha(0).setTint(0xf8ffbe).setFlipY(true)
    this.fadeOut([ this.top, this.mid, this.bot ])

  }


  private fadeOut(targets: any[]): void {
    this.tweens.add({
      targets,
      ease: 'Power2',
      y: '-=40',
      alpha: 1,
      duration: 400,
      delay: this.bgAniDuration
    })
  }


  // Анимация закрытия
  private close(): void {
    this.scene.stop()
  }
}