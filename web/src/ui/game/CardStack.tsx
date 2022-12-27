import { useMemo } from "react";
import { useCommandProcessor } from "../../game/commands";
import { useGamestate } from "../../game/context";
import { GemsObj } from "../../game/types";
import { canPlayerBuyCard, getPlayer } from "../../game/utils";
import Card from "./ActionCard";
import { CardStackFrame } from "./shared.styles";


const CardStack: React.FC = () => {
  const { state } = useGamestate();
  const { process } = useCommandProcessor();
  const { cardStack, playerId, playerTurn } = state;

  const activePlayer = useMemo(() => {
    return getPlayer(playerTurn, state);
  }, [playerTurn]);

  const getGemBalance = (gems: GemsObj, index: number) => {
    return {
      ...gems,
      4: index
    }
  }

  return (
    <>
      <h3>Trade Row</h3>
      <CardStackFrame>
        { cardStack.map(({ card, gems }, index) => (
          <Card
            card={card}
            disabled={playerId !== playerTurn || !canPlayerBuyCard(index, activePlayer)}
            key={card.id}
            gems={getGemBalance(gems, index)}
            onClick={() => process({ action: 'acquire', value: { playerId: state.playerId, index } })}
          />
        ))}
      </CardStackFrame>
    </>
  )
}

export default CardStack;
