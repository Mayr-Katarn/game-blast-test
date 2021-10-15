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
    this.cameras.main.setBackgroundColor('#b4feff')

    const start: ButtonMain = new ButtonMain(
      this,
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      (): void => { this.startGame() },
      this.lang.startGame,
    )

    // this.input.keyboard.addKey('W').on('up', (): void => { this.scene.launch('Modal', { type: 'win', state: this.state }) })
  }


  private startGame(): void {
    this.scene.stop()
    this.scene.start('Game')
  }
}

