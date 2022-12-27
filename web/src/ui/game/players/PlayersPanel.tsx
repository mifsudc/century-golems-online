import styled from "styled-components";
import { useGamestate } from "../../../game/context";
import PlayerPanel from "./PlayerPanel";

const Container = styled.div`
  min-width: 200px;
  padding: 16px 0 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 500px) {
    padding-right: 16px;
  }
`

const PlayersPanel = () => {
  const { state } = useGamestate();
  const { players, playerTurn } = state;

  return (
    <Container>
      <h3>Players</h3>
      { players.map(player => <PlayerPanel player={player} currentTurn={playerTurn === player.id} activePlayer={player.id === state.playerId} key={player.id} />) }
    </Container>
  )
}

export default PlayersPanel;
