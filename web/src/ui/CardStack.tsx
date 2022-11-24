import styled from "styled-components";
import { useGamestate } from "../context";
import Card from "./ActionCard";
import { CardStackFrame } from "./shared.styles";

const CardStackContainer = styled.div`

`

const CardStack: React.FC = () => {
  const { state } = useGamestate();
  const { cardStack } = state;

  return (
    <CardStackFrame>
      { cardStack.map(card => <Card card={card} />) }
    </CardStackFrame>
  )
}

export default CardStack;
