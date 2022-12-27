import { GameState } from "./game/context"
import { CardType, ObtainData, SwapData, UpgradeData } from "./game/types"
import { discardFromHand, gemsObjectToArray, getCardFromPlayer, getPlayer, modifyPlayer, nextPlayerId, shiftStack, wrapCardIntoSlot } from "./game/utils"

export type ReducerPayload = {
  action: 'merge' | 'play' | 'acquire' | 'rest' | 'claim' | 'next' | 'message'
  value: any
}

const rootReducer = (state: GameState, payload: ReducerPayload): GameState => {

  const reducers = {
    'merge': mergeReducer,
    'play': playReducer,
    'acquire': acquireReducer,
    'rest': restReducer,
    'claim': claimReducer,
    'next': nextReducer,
    'message': messageReducer
  }

  return reducers[payload.action](state, payload);
}

const mergeReducer = (state: GameState, { value }: ReducerPayload): GameState => {
  return {
    ...state,
    ...value
  }
}

const messageReducer = (state: GameState, { value }: ReducerPayload): GameState => {
  const { playerId, action } = value;
  const { playerTurn, players } = state;

  const activePlayer = getPlayer(playerId, state);
  let message = playerId === state.playerId ? 'You ' : `${activePlayer.name} `;

  switch (action) {
    case 'play':
      message += `played a card and gained/swapped/upgraded ...`;
      break;

    case 'acquire':
      message += 'acquired a card /and gained x extra gems.';
      break;

    case 'rest':
      message += `rested and regained ${activePlayer.discard.length} cards.`
      break;

    case 'claim':
      const golem = state.golemStack[value.index];
      message += `claimed a golem and gained ${golem.value} points and x extra coins.`
      break;
  }


  if (nextPlayerId(playerTurn, players) === playerId)
    message += ` It's your turn!`;

  return {
    ...state,
    message
  }
}

const swapReducer = (state: GameState, { value }: ReducerPayload): GameState => {
  const { playerId, cardId } = value;
  const activePlayer = getPlayer(playerId, state);
  const card = getCardFromPlayer(cardId, activePlayer);  

  const gems = [...activePlayer.gems];

  for (let gem of gemsObjectToArray((card.data as SwapData).from)) {
    gems.splice(gems.indexOf(gem), 1);
  }

  for (let gem of gemsObjectToArray((card.data as SwapData).to)) {
    gems.push(gem);
  }

  return {
    ...state,
    players: modifyPlayer(state.players, {
      ...discardFromHand(cardId, activePlayer),
      gems
    })
  }
}

const upgradeReducer = (state: GameState, { value }: ReducerPayload): GameState => {
  const { playerId, cardId } = value;
  const activePlayer = getPlayer(playerId, state);
  const card = getCardFromPlayer(cardId, activePlayer);  

  const upgradeIndices = [...Array((card.data as UpgradeData).value)]
    .map(_ => Math.floor(Math.random() * activePlayer.gems.length));

  const gems = upgradeIndices.reduce((gems, index) => [
    ...gems.slice(0, index),
    gems[index] + 1,
    ...gems.slice(index + 1)
  ], activePlayer.gems);

  return {
    ...state,
    players: modifyPlayer(state.players, {
      ...discardFromHand(cardId, activePlayer),
      gems
    })
  }
}

const obtainReducer = (state: GameState, { value }: ReducerPayload): GameState => {
  const { playerId, cardId } = value;
  const activePlayer = getPlayer(playerId, state);
  const card = getCardFromPlayer(cardId, activePlayer);  

  return {
    ...state,
    players: modifyPlayer(state.players, {
      ...discardFromHand(cardId, activePlayer),
      gems: [
        ...activePlayer.gems,
        ...gemsObjectToArray(card.data as ObtainData)
      ]
    })
  }
}

const playReducer = (state: GameState, payload: ReducerPayload): GameState => {
  
  const reducers: { [key in CardType]: Function } = {
    'obtain': obtainReducer,
    'upgrade': upgradeReducer,
    'swap': swapReducer
  }

  return reducers[payload.value.action as CardType](state, payload);
}

const acquireReducer = (state: GameState, { value }: ReducerPayload): GameState => {
  const { playerId, index } = value;

  const activePlayer = getPlayer(playerId, state);
  const { item, stack, deck } = shiftStack(index, state.cardStack, state.cardDeck, wrapCardIntoSlot);

  return {
    ...state,
    players: modifyPlayer(state.players, {
      ...activePlayer,
      hand: [
        ...activePlayer.hand,
        item.card
      ],
    }),
    cardStack: stack,
    cardDeck: deck
  }
}

const restReducer = (state: GameState, { value }: ReducerPayload): GameState => {
  const activePlayer = getPlayer(value.playerId, state);

  return {
    ...state,
    players: modifyPlayer(state.players, {
      ...activePlayer,
      hand: [ ...activePlayer.discard, ...activePlayer.hand ],
      discard: []
    })
  }
}

const claimReducer = (state: GameState, { value }: ReducerPayload): GameState => {
  const { playerId, index } = value;

  const activePlayer = getPlayer(playerId, state);
  const gems = [...activePlayer.gems];
  const { item, stack, deck } = shiftStack(index, state.golemStack, state.golemDeck);

  for (let gem of gemsObjectToArray(item.cost)) {
    gems.splice(gems.indexOf(gem), 1);
  }

  return {
    ...state,
    players: modifyPlayer(state.players, {
      ...activePlayer,
      golems: [
        ...activePlayer.golems,
        item
      ],
      gems
    }),
    golemStack: stack,
    golemDeck: deck
  }
}

const nextReducer = (state: GameState, { value }: ReducerPayload): GameState => {
  const { playerTurn, players } = state;

  return {
    ...state,
    playerTurn: value ?? nextPlayerId(playerTurn, players)
  }
}

export default rootReducer;
