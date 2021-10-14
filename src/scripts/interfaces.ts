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