import React, { createContext, useContext } from "react"
import useWebsocket, { WS } from "../useWebsocket"
import { useGamestate } from "./context"

type Command = {
  action: 'play' | 'acquire' | 'rest' | 'claim' | 'start'
  value?: any
}

const CommandProcessorContext = createContext({ process: (cmd: Command) => {} });

interface CommandProcessorProviderProps {
  children: any
  ws: WS
}

export const CommandProcessorProvider = ({ children, ws }: CommandProcessorProviderProps) => {
  const { state, dispatch } = useGamestate();
  const { playerId } = state;
  const { broadcast } = ws;

  const process = ({ action, value }: Command) => {
    switch (action) {
      case 'start':
        return;  

      case 'play':
        dispatch({ action: 'message', value: { ...value, action: 'play' } });
        dispatch({ action: 'play', value });
        break;

      case 'acquire':
        dispatch({ action: 'message', value: { ...value, action: 'acquire' } });
        dispatch({ action: 'acquire', value });
        break;

      case 'rest':
        dispatch({ action: 'message', value: { ...value, action: 'rest' } });
        dispatch({ action: 'rest', value });
        break;

      case 'claim':
        dispatch({ action: 'message', value: { ...value, action: 'claim' } });
        dispatch({ action: 'claim', value });
        break;
    }

    if (playerId === value.playerId)
      broadcast({ action, body: value });
    dispatch({ action: 'next', value: null });
  }

  return (
    <CommandProcessorContext.Provider value={{ process }}>
      { children }
    </CommandProcessorContext.Provider>
  )
}

export const useCommandProcessor = () => useContext(CommandProcessorContext);