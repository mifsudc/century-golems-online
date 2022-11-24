import { GameState } from "../context";
import actionCards from "./actionCards";
import golems from "./golems";
import { GEMS, Player, Resource } from "./types";

const initialActionCards = actionCards.slice(0, 2);
const merchantActionCards = actionCards.slice(2);

const initialiseStackState = (deck: any[]): any[][] => {
  return [
    deck.slice(0, 5),
    deck.slice(5)
  ]
}

const emptyPlayer: Player = {
  id: 0,
  gems: [0,1,2,3,1,2,0],
  golems: [],
  hand: [...initialActionCards],
  discard: []
};

const initialisePlayers = (nPlayers: number): Player[] => {
  return new Array<Player>(nPlayers).fill(emptyPlayer).map((player, index) => ({
    ...player,
    id: index
  }))
}

export const initialiseGamestate = (nPlayers: number): GameState => {
  const [golemStack, golemDeck] = initialiseStackState(shuffleDeck(golems));
  const [cardStack, cardDeck] = initialiseStackState(shuffleDeck(merchantActionCards));

  return {
    golemDeck,
    golemStack,
    cardStack,
    cardDeck,
    players: initialisePlayers(nPlayers),
    playerTurn: 0,
    playerId: 0
  }
}

export const gemsObjectToArray = (gems: any): GEMS[] => {
  return Object.keys(gems).reduce((acc, gem) => [
    ...acc,
    ...(Array(gems[gem]).fill(parseInt(gem)))
  ], [] as GEMS[]);
}

export const shuffleDeck = <T extends Resource>(deck: T[]): T[] => {
  const presort = deck.sort(() => Math.random() - 0.5);
  return [
    ...presort.slice(Math.round(presort.length / 2)),
    ...presort.slice(0, Math.round(presort.length / 2))
  ].sort(() => Math.random() - 0.5);
}

export const shiftStack = <T extends Resource>(index: number, stack: T[], deck: T[]): { stack: T[], deck: T[] } => {
  console.log('shifting stack', stack, deck)
  console.log([
    ...stack.slice(0, index),
    ...stack.slice(index + 1),
    deck[0]
  ])
  console.log(deck.slice(1))
  return {
    stack: [
      ...stack.slice(0, index),
      ...stack.slice(index + 1),
      deck[0]
    ] as T[],
    deck: deck.slice(1)
  }
}