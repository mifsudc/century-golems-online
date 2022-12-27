import { createContext, Dispatch, useContext, useReducer } from "react";
import { Card, CardSlot, Golem, Player } from "./types";
import reducer, { ReducerPayload } from "../reducers";

export type GameState = {
  golemDeck: Golem[]
  golemStack: Golem[]
  cardDeck: Card[]
  cardStack: CardSlot[]
  players: Player[]
  message: string
  playerTurn: number
  playerId?: number
}

type ContextState = {
  state: GameState
  dispatch: Dispatch<ReducerPayload>
}

export const initialGameState: GameState = {
  golemDeck: [],
  golemStack: [],
  cardDeck: [],
  cardStack: [],
  players: [],
  playerTurn: 0,
  message: ''
} 

const GameStateContext = createContext<ContextState>({ state: initialGameState, dispatch: () => {} });

interface ContextProviderProps {
  children: any
}

export const ContextProvider: React.FC<ContextProviderProps> = ({ children }: ContextProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialGameState);

  return (
    <GameStateContext.Provider value={{ state, dispatch }}>
      { children }
    </GameStateContext.Provider>
  )
}

export const useGamestate = () => useContext(GameStateContext);