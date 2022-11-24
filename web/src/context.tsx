import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import { Card, Golem, Player } from "./game/types";

export type GameState = {
  golemDeck: Golem[]
  golemStack: Golem[]
  cardDeck: Card[]
  cardStack: Card[]
  players: Player[]
  playerTurn: number
  playerId?: number
}

type ContextState = {
  state: GameState
  setState: Dispatch<SetStateAction<GameState>>
}

const initialGameState: GameState = {
  golemDeck: [],
  golemStack: [],
  cardDeck: [],
  cardStack: [],
  players: [],
  playerTurn: 0
}

const GameStateContext = createContext<ContextState>({ state: initialGameState, setState: () => {} });

interface ContextProviderProps {
  children: any
}

export const ContextProvider: React.FC<ContextProviderProps> = ({ children }: ContextProviderProps) => {
  const [state, setState] = useState<GameState>(initialGameState);

  return (
    <GameStateContext.Provider value={{ state, setState }}>
      { children }
    </GameStateContext.Provider>
  )
}

export const useGamestate = () => useContext(GameStateContext);