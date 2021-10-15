import Hud from "../scenes/Hud";

export default class ProgressLine extends Phaser.GameObjects.Container {
  public scene: Hud
  public x: number
  public y: number

  private maxLineWidth: number
  public mask: Phaser.Display.Masks.BitmapMask
  private lineLeft: Phaser.GameObjects.Sprite
  private lineMid: Phaser.GameObjects.TileSprite
  private lineRight: Phaser.GameObjects.Sprite
  private setWidthAni: Phaser.Tweens.Tween

  constructor(scene: Hud, x: number, y: number) {
    super(scene, x, y)
    this.scene = scene
    this.x = x
    this.y = y
    this.init()
  }

  private init(): void {
    this.mask = this.scene.add.sprite(this.x, this.y, 'line-mask').setOrigin(0, 0.5).setVisible(false).createBitmapMask()
    this.scene.add.existing(this).setMask(this.mask)
    this.maxLineWidth = 444
    this.lineRight = this.scene.add.sprite(0, 0, 'line-side').setOrigin(0, 0.5).setFlipX(true)
    this.lineRight.setX(this.lineRight.x - this.lineRight.getBounds().width)
    this.lineMid = this.scene.add.tileSprite(0, 0, 1, this.lineRight.height,'line-mid').setOrigin(0, 0.5)
    this.add([
      this.lineMid,
      this.lineRight,
    ])
  }

  public setProgress(percent: number): this {
    if (percent > 100) percent = 100
    const width = this.maxLineWidth / 100 * percent
    this.setWidthAni = this.scene.add.tween({
      targets: this.lineMid,
      onUpdate: (): void => { this.lineRight.setX(this.lineMid.getRightCenter().x) },
      width,
      duration: 1000,
      ease: 'Power3'
    })
    return this
  }

  public setFullScale(x: number, y?: number): this {
    y = y ? y : x
    this.setScale(x, y).clearMask()
    this.mask = this.scene.add.sprite(this.x, this.y, 'line-mask').setTint(0x000000).setOrigin(0, 0.5).setScale(0.9).setVisible(false).createBitmapMask()
    this.setMask(this.mask)
    return this
  }
}