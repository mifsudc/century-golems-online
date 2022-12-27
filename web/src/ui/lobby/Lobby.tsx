import { Dispatch, SetStateAction, useEffect } from "react";
import styled from "styled-components";
import { serialize } from "v8";
import { AppState, initialAppState, PlayerStub } from "../../App";
import { useGamestate } from "../../game/context";
import { SerialisedGameState } from "../../game/types";
import { deserialiseGamestate, initialiseGamestate, serialiseGamestate } from "../../game/utils";
import useWebsocket, { WS } from "../../useWebsocket";
import { MAX_INT, randInt } from "../../utils";

type LobbyProps = {
  players: PlayerStub[]
  setState: Dispatch<SetStateAction<AppState>>
  isHost: boolean
  roomId: string
  connectionId: string
  ws: WS
}

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: auto;
  height: calc(100% - 32px);
  padding: 16px;
  justify-content: space-around;
`

const Header = styled.h1`
  text-align: center;
`

const Button = styled.button`
  border-width: 2px;
  border-styled: solid;
  color: white;
  font-size: 20px;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  border-color: #0a6b15;
  background: #428249;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(5 * 55px + 4 * 8px);
  gap: 8px;
`

const ListItem = styled.div`
  border: 2px solid #aaa;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
`

const Lobby: React.FC<LobbyProps> = ({ players, setState, isHost, roomId, connectionId, ws }: LobbyProps ) => {

  const { dispatch } = useGamestate();
  const { subscribe, unsubscribe, disconnect, broadcast } = ws;

  useEffect(() => {
    const connectId = randInt(MAX_INT);
    subscribe({ type: 'connect', onTrigger: onPlayerJoin, id: connectId });
    
    const disconnectId = randInt(MAX_INT);
    subscribe({ type: 'disconnect', onTrigger: onPlayerLeave, id: disconnectId });

    const startId = randInt(MAX_INT);
    subscribe({ type: 'init', onTrigger: onGameStart, id: startId });

    return () => {
      unsubscribe(connectId);
      unsubscribe(disconnectId);
      unsubscribe(startId);
    }
  }, []);

  const onPlayerJoin = (player: PlayerStub) => {
    console.log('player joined', player)
    setState(s => ({ ...s, players: [ ...s.players, player ]}))
  }

  const onPlayerLeave = (player: PlayerStub) => {
    console.log('player left', player)
    setState(s => ({ ...s, players: s.players.filter(({ connectionId }) => player.connectionId !== connectionId) }));
  }

  const startGame = () => {
    const newGame = initialiseGamestate(players, connectionId);
    console.log('initialised game state', newGame);
    dispatch({ action: 'merge', value: newGame });
    broadcast({ action: 'init', body: serialiseGamestate(newGame) });
    setState(s => ({ ...s, status: 'game' }));
  }

  const onGameStart = (state: SerialisedGameState) => {
    console.log('received serialized state', state);
    const newGame = deserialiseGamestate(connectionId, players, state);
    console.log('deserialised state', newGame)
    dispatch({ action: 'merge', value: newGame });
    setState(s => ({ ...s, status: 'game' }));
  }

  const onBack = () => {
    disconnect();
    setState(initialAppState);
  }

  return (
    <Flex>
      <Header>Century Golems Online</Header>
      <Header>{roomId}</Header>
      <List>
        { players.map((player, index) => (
          <ListItem key={index}>
            <span>
              { player.name }
              { connectionId === player.connectionId && ' (You)' }
            </span>
            <span>
              { index === 0 && '(Host)' }
            </span>
          </ListItem>
        ))}
      </List>
      { isHost && <Button onClick={startGame} disabled={players.length < 2}>Start Game</Button> }
      <Button onClick={onBack}>Back</Button>
    </Flex>
  )
}

export default Lobby;
