import styled from "styled-components"
import { useGamestate } from "../../game/context"
import { getPlayer } from "../../game/utils"

const Container = styled.div`

`

const Header = styled.h2`
  text-align: center;
`

type SwapModalProps = {
  playerId: number
}

const SwapModal: React.FC<SwapModalProps> = ({ playerId }: SwapModalProps) => {
  const { state } = useGamestate();
  const activePlayer = getPlayer(playerId, state);

  return (
    <Container>

    </Container>
  )
}

export default SwapModal;
