interface Icell {
  id: string
  x: number
  y: number
  col: number
  row: number
  empty: boolean
}

interface Iconfig {
  turns: number
  targetScore: number
}

interface Icolors {
  red: IcolorTypes
  blue: IcolorTypes
  yellow: IcolorTypes
  green: IcolorTypes
  pink: IcolorTypes
}

interface IcolorTypes {
  num: number
  str: string
}