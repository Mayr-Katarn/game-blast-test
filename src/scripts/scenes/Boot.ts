import * as Webfont from '../libs/Webfonts.js';

const load: any = require("./../../assets/images/load.png");
const pixel: any = require("./../../assets/images/pixel.png");
 
export default class Boot extends Phaser.Scene {
  constructor() {
    super('Boot')
  }

  public fontsReady: boolean

  public init(): void {
    this.fontsReady = false
    const build = '0.1'
    let platform: string

    if (this.game.device.os.windows) platform = 'windows web'
    else if (this.game.device.os.android) platform = 'android'

    console.log(`Platform: ${platform} | Build: ${build}`)

    this.loadFonts()
  }

  public preload(): void {
    this.load.image('load', load)
    this.load.image('pixel', pixel)
  }


  public update(): void {
    if (this.fontsReady) {
      this.fontsReady = false
      this.start()
    }
  }

  private loadFonts(): void {
    let scene: Boot = this;
    Webfont.load({
      custom: { families: [ 'Marvin' ] },
      active() { scene.fontsReady = true }
    })
  }
  

  private start(): void {
    this.scene.stop()
    this.scene.start('Preload')
  }
}
