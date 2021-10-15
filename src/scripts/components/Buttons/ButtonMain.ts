import langs from '../../langs'

export default class ButtonMain {
  public scene: Phaser.Scene
  public readonly x: number
  public readonly y: number
  public callback: any
  public text?: string

  private lang: any
  private lock: boolean
  public elements: Array<Phaser.GameObjects.Sprite | Phaser.GameObjects.TileSprite | Phaser.GameObjects.Text>

  private btn: Phaser.GameObjects.Sprite
  private btnScale: number
  private btnShadow: Phaser.GameObjects.Sprite
  private btnShadowScale: number
  private btnText: Phaser.GameObjects.Text
  private btnTextScale: number

  private animation: Phaser.Tweens.Tween

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    callback: any,
    text: string = '',
  ) {
    this.scene = scene
    this.x = x
    this.y = y
    this.callback = callback
    this.text = text
    this.init()
  }

  private init(): void {
    this.lang = langs.ru
    this.lock = false
    this.btnScale = 1.5
    this.btnShadowScale = this.btnScale - 0.03
    this.btnTextScale = 1
    this.elements = []
    this.create()
  }

  private create(): void {
    const sprite = 'btn-pink'

    this.btn = this.scene.add.sprite(this.x, this.y, sprite).setScale(this.btnScale).setDepth(5).setAlpha(0).setInteractive()
    this.btnShadow = this.scene.add.sprite(this.btn.x, this.btn.y + 5, sprite).setTint(0x000000).setDepth(4).setScale(this.btnShadowScale).setAlpha(0)
    this.btnText = this.scene.add.text(this.x, this.y, this.text, { font: '18px Marvin', color: '#ffffff' }).setDepth(this.btn.depth + 1).setScale(this.btnTextScale).setOrigin(0.5, 0.55).setAlpha(0)

    this.elements = [
      this.btn,
      this.btnShadow,
      this.btnText,
    ]

    this.btn.on('pointerout', (): void => { this.out() })
    this.btn.on('pointerdown', (): void => { this.down() })
    this.btn.on('pointerup', (): void => { this.callback() })
  }

  private down(): void {
    this.animation?.remove()
    this.animation = this.scene.tweens.add({
      targets: this.elements,
      duration: 200,
      onStart: (): void => {
        this.btn.setScale(this.btnScale)
        this.btnShadow.setScale(this.btnShadowScale)
        this.btnText.setScale(this.btnTextScale)
      },
      scale: (target): number => target.scale - 0.1
    })
  }

  private out(): void {
    this.animation?.remove()
    this.animation = this.scene.tweens.add({
      targets: this.elements,
      duration: 200,
      scale: (target): number => {
        if (target === this.btn) return this.btnScale
        if (target === this.btnShadow) return this.btnShadowScale
        if (target === this.btnText) return this.btnTextScale
        return target.scale
      }
    })
  }
}
