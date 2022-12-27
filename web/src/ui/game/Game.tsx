import CardStack from "./CardStack";
import GolemStack from "./GolemStack";
import PlayerHand from "./players/PlayerHand";
import PlayersPanel from "./players/PlayersPanel";
import styled from 'styled-components'
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { initialGameState, useGamestate } from "../../game/context";
import { initialiseGamestate } from "../../game/utils";
import Message from "./Message";
import { AppState } from "../../App";
import { WS } from "../../useWebsocket";
import { ensure, MAX_INT, randInt } from "../../utils";
import { useCommandProcessor } from "../../game/commands";
import Modal from "../modal/Modal";
import UpgradeModal from "../modal/UpgradeModal";
import SwapModal from "../modal/SwapModal";

type GameProps = {
  setState: Dispatch<SetStateAction<AppState>>
  ws: WS
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const GameFrameInner = styled.div`
  padding: 16px 0 16px 16px;

  @media (min-width: 501px) {
    width: 0;
    flex: 1;
  }
`

const GameFrameOuter = styled.div`
  display: flex;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`

const DebugContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  border: 1px solid grey;
  margin: 0 16px;
`

const Header = styled.h1`
  margin-left: 16px;
`

const Game = ({ setState, ws }: GameProps) => {

  const { state, dispatch } = useGamestate();
  const { playerId } = state;
  const { disconnect, subscribe, unsubscribe } = ws;
  const { process } = useCommandProcessor();

  useEffect(() => {
    const playId = randInt(MAX_INT);
    subscribe({ type: 'play', id: playId, onTrigger: (value: any) => process({ action: 'play', value }) });
    const acquireId = randInt(MAX_INT);
    subscribe({ type: 'acquire', id: acquireId, onTrigger: (value: any) => process({ action: 'acquire', value }) });    
    const restId = randInt(MAX_INT);
    subscribe({ type: 'rest', id: restId, onTrigger: (value: any) => process({ action: 'rest', value }) });
    const claimId = randInt(MAX_INT);
    subscribe({ type: 'claim', id: claimId, onTrigger: (value: any) => process({ action: 'claim', value }) });

    return () => {
      unsubscribe(playId);
      unsubscribe(acquireId);
      unsubscribe(restId);
      unsubscribe(claimId);
    }
  }, [])

  const disconnectWs = () => {
    const dc = disconnect();
    console.log('disconnect', dc)
  }

  // useEffect(() => {
  //   const gamestate = initialiseGamestate([{ name: 'asdf', connectionId: 'asdf' }, { name: 'asdf', connectionId: 'zcxv' } ], 'asdf');
  //   dispatch({ action: 'merge', value: gamestate });
  // }, []);

  useEffect(() => { 
    console.log('gamestate changed', state)
  }, [state]);

  if (state == initialGameState) return <></>

  const DebugPanel = () => (
    <DebugContainer>
      <div>
        <b>Debug:</b>
      </div>
      <div>
        { `playerId: ${state.playerId}, playerTurn: ${state.playerTurn}` }
      </div>
      <div>
        Change ID:
        { state.players.map((player, idx) => <button key={idx} onClick={()=> { dispatch({ action: 'merge', value: { playerId: player.id } }) }}>{ player.id }</button>) }
      </div>
      <div>
        Change Turn:
        { state.players.map((player, idx) => <button key={idx} onClick={()=> { dispatch({ action: 'next', value: player.id }) }}>{ player.id }</button>) }
      </div>
      <div>
        <button onClick={disconnectWs}>Disconnect</button>
      </div>
    </DebugContainer>
  )

  return (
    <Container>
      <Header>Century: Golems Online</Header>
      <DebugPanel />
      <GameFrameOuter>
        <PlayersPanel />
        <GameFrameInner>
          <GolemStack />
          <CardStack />
        </GameFrameInner>
      </GameFrameOuter>
      <Message />
      <PlayerHand />
      {/* { playerId !== undefined && playerId !== 0 && (
        <Modal open={true}>
          <UpgradeModal playerId={playerId} />
        </Modal>
      )} */}
      {/* { playerId !== undefined && playerId !== 0 && (
        <Modal open={true}>
          <SwapModal playerId={playerId} />
        </Modal>
      )} */}
    </Container>
  )
}

export default Game;
