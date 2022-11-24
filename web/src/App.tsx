import React from 'react';
import './App.css';
import Game from './ui/Game';
import { ContextProvider } from './context';

function App() {
  return (
    <ContextProvider>
      <Game />
    </ContextProvider>
  );
}

export default App;
