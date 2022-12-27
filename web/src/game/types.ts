export type CardType = 'obtain' | 'upgrade' | 'swap';

export enum GEMS {
  'yellow',
  'green',
  'blue',
  'magenta',
  'grey'
}

export type GemsObj = { [key in GEMS]?: number }

export type CardSlot = {
  card: Card
  gems: GemsObj
}

export type Resource = Card | CardSlot | Golem;

export type Card = {
  id: number
  type: CardType
  data: CardData
}

export type CardData = ObtainData | UpgradeData | SwapData;

export type ObtainData = GemsObj;

export type UpgradeData = {
  value: number
}

export type SwapData = {
  from: GemsObj
  to: GemsObj
}

export type Golem = {
  id: number
  value: number
  cost: GemsObj
}

export type Player = {
  id: number
  name?: string
  gems: GEMS[]
  hand: Card[]
  discard: Card[]
  golems: Golem[]
  connectionId: string
  // coins: 
}

export type SerialisedGameState = {
  golemDeck: number[]
  golemStack: number[]
  cardDeck: number[]
  cardStack: number[]
  playerTurn: number
}