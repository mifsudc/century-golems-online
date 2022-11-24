import CardStack from "./CardStack";
import GolemStack from "./GolemStack";
import PlayerHand from "./players/PlayerHand";
import PlayersPanel from "./players/PlayersPanel";
import styled from 'styled-components'
import { useEffect } from "react";
import { useGamestate } from "../context";
import { initialiseGamestate } from "../game/utils";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const GameFrameInner = styled.div`
  width: 0;
  flex: 1;
`

const GameFrameOuter = styled.div`
  display: flex;
`

const Game = () => {

  const { state, setState } = useGamestate();

  useEffect(() => {
    const gamestate = initialiseGamestate(2);
    setState(gamestate);
  }, [])

  useEffect(() => {
    console.log('gamestate changed', state)
  }, [state])

  return (
    <Container>
      <GameFrameOuter>
        <PlayersPanel />
        <GameFrameInner>
          <GolemStack />
          <CardStack />
        </GameFrameInner>
      </GameFrameOuter>
      <PlayerHand />
    </Container>
  )
}

export default Game;
