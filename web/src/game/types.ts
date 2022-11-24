export type CardType = 'obtain' | 'upgrade' | 'swap';

export enum GEMS {
  'yellow',
  'green',
  'blue',
  'magenta',
  'grey'
}

export type Resource = Card | Golem;

export type Card = {
  id: number
  type: CardType
  data: CardData
}

export type CardData = ObtainData | UpgradeData | SwapData ;

export type ObtainData = {
  [key in GEMS]: number
}

export type UpgradeData = {
  value: number
}

export type SwapData = {
  from: {
    [key in GEMS]?: number
  },
  to: {
    [key in GEMS]?: number
  }
}

export type Golem = {
  id: number
  value: number
  cost: {
    [key in GEMS]?: number
  }
}

export type Player = {
  id: number
  name?: string
  gems: GEMS[]
  hand: Card[]
  discard: Card[]
  golems: Golem[]
  // coins: 
}