import { GameState } from "./context";
import { ensure, randInt } from "../utils";
import actionCards from "./actionCards";
import golems from "./golems";
import { Card, CardSlot, GEMS, GemsObj, Golem, Player, Resource, SerialisedGameState, SwapData } from "./types";
import { PlayerStub } from "../App";

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
  gems: [],
  golems: [],
  hand: [...initialActionCards],
  discard: [],
  connectionId: ''
};

const initialisePlayers = (playerStubs: PlayerStub[]): Player[] => {
  return playerStubs.map((stub, index) => ({
    ...emptyPlayer,
    ...stub,
    id: index
  }))
}

export const wrapCardIntoSlot = (card: Card): CardSlot => ({ card, gems: {} })

const initialiseCardStack = (cards: Card[]): CardSlot[] => cards.map(wrapCardIntoSlot);

const initialiseMessage = (playerTurn: number, playerId: number) => {
  return playerId === playerTurn
    ? `It's your turn!`
    : `Player ${playerTurn + 1} is thinking...`
}

export const initialiseGamestate = (playerStubs: PlayerStub[], connectionId: string): GameState => {
  const [golemStack, golemDeck] = initialiseStackState(shuffleDeck(golems));
  const [cardStack, cardDeck] = initialiseStackState(shuffleDeck(merchantActionCards));
  const players = initialisePlayers(playerStubs);
  const playerTurn = randInt(playerStubs.length);
  const playerId = players.findIndex(p => p.connectionId === connectionId);

  return {
    golemDeck,
    golemStack,
    cardStack: initialiseCardStack(cardStack),
    cardDeck,
    players,
    playerTurn,
    playerId,
    message: initialiseMessage(playerTurn, playerId)
  }
}

// only for init
export const serialiseGamestate = ({
  golemDeck,
  golemStack,
  cardStack,
  cardDeck,
  playerTurn,
}: GameState): SerialisedGameState => {
  const mapId = (list: { id: number }[]) => list.map(({ id }) => id)

  return {
    golemDeck: mapId(golemDeck),
    golemStack: mapId(golemStack),
    cardStack: mapId(cardStack.map(({ card }) => card)),
    cardDeck: mapId(cardDeck),
    playerTurn
  }
}

// only for init
export const deserialiseGamestate = ( connectionId: string, players: PlayerStub[], {
  golemDeck,
  golemStack,
  cardStack,
  cardDeck,
  playerTurn
}: SerialisedGameState): GameState => {
    const playerId = players.findIndex(player => player.connectionId === connectionId);

  return {
    golemDeck: golemDeck.map(id => ensure(golems.find(g => g.id === id))),
    golemStack: golemStack.map(id => ensure(golems.find(g => g.id === id))),
    cardStack: cardStack.map(id => wrapCardIntoSlot(ensure(actionCards.find( c => c.id === id)))),
    cardDeck: cardDeck.map(id => ensure(actionCards.find(c => c.id === id))),
    players: initialisePlayers(players),
    playerTurn,
    playerId,
    message: initialiseMessage(playerTurn, playerId)
  }
}

export const gemsObjectToArray = (gems: GemsObj): GEMS[] => {
  return Object.keys(gems).reduce((acc, gem) => [
    ...acc,
    ...(Array(gems[parseInt(gem) as GEMS]).fill(parseInt(gem)))
  ], [] as GEMS[]);
}

export const gemsArrayToObject = (gems: GEMS[]): GemsObj => {
  return gems.reduce((acc, gem) => ({
    ...acc,
    [gem]: (acc[gem] ?? 0) + 1
  }), {} as GemsObj);
}

export const shuffleDeck = <T extends Resource>(deck: T[]): T[] => {
  const presort = deck.sort(() => Math.random() - 0.5);
  return [
    ...presort.slice(Math.round(presort.length / 2)),
    ...presort.slice(0, Math.round(presort.length / 2))
  ].sort(() => Math.random() - 0.5);
}

export const shiftStack = <
  S extends Resource,
  D extends Resource
>(
  index: number,
  stack: S[],
  deck: D[],
  wrapFunction = (a: D): S => a as unknown as S
): {
  item: S,
  stack: S[],
  deck: D[]
} => {
  return {
    item: stack[index],
    stack: [
      ...stack.slice(0, index),
      ...stack.slice(index + 1),
      ...(deck.length ? [wrapFunction(deck[0])] : [])
    ],
    deck: deck.slice(1)
  }
}

export const nextPlayerId = (playerTurn: number, players: Player[]): number => {
  return (playerTurn + 1) % players.length
}

export const modifyPlayer = (allPlayers: Player[], player: Player): Player[] => {
  const players = allPlayers.filter(({ id }) => player.id !== id);

  return [
    ...players,
    player
  ].sort((a, b) => a.id - b.id)
}

export const getCardFromPlayer = (cardId: number, player: Player) => {
  return ensure(player.hand.find(({ id }) => id === cardId));
}

export const getPlayer = (playerId: number, state: GameState) => {
  return ensure(state.players.find(({ id }) => id === playerId));
}

export const discardFromHand = (cardId: number, player: Player): Player => {
  const hand = player.hand.filter(({ id }) => id !== cardId);
  const card = getCardFromPlayer(cardId, player);

  return {
    ...player,
    hand,
    discard: [
      ...player.discard,
      card
    ]
  }
}

export const canPlayerBuyCard = (index: number, player: Player): boolean => {
  return index <= player.gems.length;
}

export const canPlayerBuyGolem = (golem: Golem, player: Player): boolean => {
  const playerGems = gemsArrayToObject(player.gems);
  return Object.keys(golem.cost)
    .reduce<boolean>((acc, gem) => {
      const gemVal = parseInt(gem) as GEMS;
      return acc && !!golem.cost[gemVal]
        && ((playerGems[gemVal] ?? 0) >= ensure(golem.cost[gemVal]));
    }, true);
}

export const canPlayerPlayCard = (card: Card, player: Player): boolean => {
  switch (card.type) {
    case 'obtain':
      return true;

    case 'swap':
      const playerGems = gemsArrayToObject(player.gems);
      const cardGems = (card.data as SwapData).from;
      return Object.keys(cardGems)
        .reduce<boolean>((acc, gem) => {
          const gemVal = parseInt(gem) as GEMS;    
          return acc && !!cardGems[gemVal]
            && ((playerGems[gemVal] ?? 0) >= ensure(cardGems[gemVal]));
        }, true);

    case 'upgrade':
      return player.gems.some(gem => gem < GEMS.magenta);
  }
}