import React, { useEffect, useState } from 'react';
import './App.css';
import { CommandProcessorProvider } from './game/commands';

import { ContextProvider } from './game/context';
import Game from './ui/game/Game';
import Home from './ui/home/Home';
import Lobby from './ui/lobby/Lobby';
import PostGame from './ui/postgame/PostGame';
import useWebsocket from './useWebsocket';

export type AppStates = 'home' | 'lobby' | 'game' | 'postgame';

export type AppState = {
  status: AppStates
  players: PlayerStub[]
  isHost: boolean
  connectionId: string
  roomId: string
}

export const initialAppState: AppState = {
  status: 'home',
  players: [],
  isHost: false,
  connectionId: '',
  roomId: ''
}

export type PlayerStub = {
  name: string
  connectionId: string
}

const App = () => {
  const [state, setState] = useState<AppState>(initialAppState);

  const ws = useWebsocket();

  useEffect(() => {
    const preventAccidentalBack = () => {
      window.history.pushState(null, '', '');
    }

    window.addEventListener('popstate', preventAccidentalBack);
    preventAccidentalBack();

    return () => window.removeEventListener('popstate', preventAccidentalBack);
  }, [])

  return (
    <ContextProvider>
      <CommandProcessorProvider ws={ws}>
        { (() => {
          switch (state.status) {
            case 'home':
              return (
                <Home
                  setState={setState}
                  ws={ws}
                />)
            case 'lobby':
              return (
                <Lobby
                  setState={setState}
                  ws={ws}
                  {...state}
                />)
            case 'game':
              return <Game setState={setState} ws={ws} />
            case 'postgame':
              return <PostGame setState={setState} />
          }
        })() }
      </CommandProcessorProvider>
    </ContextProvider>
  );
}

export default App;
