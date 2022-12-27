import { useMemo } from "react";
import { useCommandProcessor } from "../../game/commands";
import { useGamestate } from "../../game/context";
import { canPlayerBuyGolem, getPlayer } from "../../game/utils";
import Golem from "./GolemCard";
import { CardStackFrame } from "./shared.styles";

const GolemStack = () => {
  const { state } = useGamestate();
  const { process } = useCommandProcessor();
  const { golemStack, playerId, playerTurn } = state;

  const activePlayer = useMemo(() => {
    return getPlayer(playerTurn, state);
  }, [playerTurn]);

  return (
    <>
      <h3>Golems</h3>
      <CardStackFrame>
        { golemStack.map((golem, index) => (
          <Golem
            golem={golem}
            onClick={() => process({ action: 'claim', value: { playerId, index } })}
            key={golem.id}
            disabled={playerId !== playerTurn || !canPlayerBuyGolem(golem, activePlayer) }
          />
        ))}
      </CardStackFrame>
    </>
  )
}

export default GolemStack;
