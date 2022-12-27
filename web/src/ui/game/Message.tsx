import styled from "styled-components";
import { useGamestate } from "../../game/context";

const Container = styled.div`
  border: 1px solid #aaa;
  margin: 0 16px;
  padding: 16px;
  border-radius: 8px;
  font-size: 18px;
`

const Message = () => {
  const { state } = useGamestate();

  return (
    <Container>
      { state.message }
    </Container>
  )
}

export default Message;
