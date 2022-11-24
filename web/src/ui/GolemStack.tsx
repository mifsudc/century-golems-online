import styled from "styled-components";
import { useGamestate } from "../context";
import Golem from "./GolemCard";
import { CardStackFrame } from "./shared.styles";

const GolemStackContainer = styled.div`

`

const GolemStack = () => {
  const { state } = useGamestate();
  const { golemStack } = state;

  return (
    <CardStackFrame>
      { golemStack.map(golem => <Golem golem={golem} />) }
    </CardStackFrame>
  )
}

export default GolemStack;
