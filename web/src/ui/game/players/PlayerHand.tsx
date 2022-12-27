import styled from "styled-components";
import { useCommandProcessor } from "../../../game/commands";
import { useGamestate } from "../../../game/context";
import { canPlayerPlayCard } from "../../../game/utils";
import ActionCard from "../ActionCard";
import RestCard from "../RestCard";
import { CardStackFrame } from "../shared.styles";

const Container = styled.div`
  padding: 0 16px 16px 16px;
`

const PlayerHand = () => {
  const { state } = useGamestate();
  const { process } = useCommandProcessor();
  const { players, playerId, playerTurn } = state;
  const activePlayer = players.find(({ id }) => id === playerId);

  return (
    <Container>
      <h3>Hand</h3>
      <CardStackFrame>
        <RestCard
          disabled={playerId !== playerTurn || !activePlayer?.discard.length}
          onClick={() => process({ action: 'rest', value: { playerId } })}
          n={activePlayer?.discard.length ?? 0}
        />
        { activePlayer?.hand.map(card => (
          <ActionCard
            card={card}
            key={card.id}
            disabled={playerId !== playerTurn || !canPlayerPlayCard(card, activePlayer)}
            onClick={() => process({
              action: 'play',
                value: {
                playerId,
                cardId: card.id,
                action: card.type
              }
            })}
          />
        ))}
      </CardStackFrame>
    </Container>
  )
}

export default PlayerHand;
