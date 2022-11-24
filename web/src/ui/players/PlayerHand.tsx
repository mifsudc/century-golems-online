import styled from "styled-components";
import { useGamestate } from "../../context";
import ActionCard from "../ActionCard";

const Container = styled.div`
  display: flex;
`

const PlayerHand = () => {
  const { state } = useGamestate();
  const { players, playerId } = state;
  const activePlayer = players.find(({ id }) => id === playerId);
  console.log('activePlayer', activePlayer)

  return (
    <Container>
      { activePlayer?.hand.map(card => <ActionCard card={card} /> )}
    </Container>
  )
}

export default PlayerHand;
