import langs from '../langs'
import ButtonMain from '../components/Buttons/ButtonMain'

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu')
  }

  public lang: any

  public init() {
    this.lang = langs.ru
  }
  
  public create() {
    this.cameras.main.setBackgroundColor('#50acc7')
    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 200, this.lang.title, { font: '60px Marvin', color: 'white' }).setOrigin(0.5)
    new ButtonMain(
      this,
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      (): void => { this.startGame() },
      this.lang.start,
    )
  }


  private startGame(): void {
    this.scene.stop()
    this.scene.start('Game')
    this.scene.start('Hud')
  }
}

