import langs from '../langs'

export default class ButtonMain {
  public scene: Phaser.Scene
  public readonly x: number
  public readonly y: number
  public callback: any
  public text?: string

  private lang: any
  private lock: boolean
  private elements: Array<Phaser.GameObjects.Sprite | Phaser.GameObjects.TileSprite | Phaser.GameObjects.Text>

  private btn: Phaser.GameObjects.Sprite
  private btnShadow: Phaser.GameObjects.Sprite
  private btnText: Phaser.GameObjects.Text

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
    this.lock = true
    this.elements = []
    this.create()
  }

  private create(): void {
    const sprite = 'btn-main'

    this.btn = this.scene.add.sprite(this.x, this.y, sprite).setScale(2).setDepth(5).setAlpha(0).setInteractive()
    this.btnShadow = this.scene.add.sprite(this.btn.x, this.btn.y + 5, sprite).setTint(0x000000).setDepth(4).setScale(1.97).setAlpha(0)
    this.btnText = this.scene.add.text(this.x, this.y, this.text, { font: '58px Space-i', color: '#ffffff' }).setDepth(this.btn.depth + 1).setOrigin(0.5, 0.55).setAlpha(0)


    this.elements = [
      this.btn,
      this.btnShadow,
      this.btnText,
    ]

    // this.btn.on('pointerover', (): void => { if (!this.lock) this.over() })
    // this.btn.on('pointerout', (): void => { if (!this.lock) this.out() })
    // this.btn.on('pointerdown', (): void => { if (!this.lock) this.down() })
    // this.btn.on('pointerup', (): void => { if (!this.lock) this.up() })
  }






}
