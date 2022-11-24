import styled from "styled-components";
import { useGamestate } from "../../context";
import PlayerPanel from "./PlayerPanel";

const Container = styled.div`
  min-width: 200px;
  padding: 16px 0 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const PlayersPanel = () => {
  const { state } = useGamestate();
  const { players, playerTurn } = state;

  return (
    <Container>
      { players.map(player => <PlayerPanel player={player} currentTurn={playerTurn === player.id} />) }
    </Container>
  )
}

export default PlayersPanel;
