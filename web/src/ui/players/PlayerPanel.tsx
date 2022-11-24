import styled from "styled-components"
import { Player } from "../../game/types"
import CardIcon from "./CardIcon"
import GemStash from "./GemStash"

type PlayerPanelProps = {
  player: Player
  currentTurn: boolean
}

interface PlayerFrameProps {
  currentTurn: boolean
}

const PlayerFrame = styled.div<PlayerFrameProps>`
  border: 2px solid ${ ({ currentTurn }) => currentTurn ? 'green' : '#aaa' };
  border-radius: 4px;
  min-height: 100px;
  display: grid;
  // grid-template-rows: 1fr 1fr;
  grid-template-columns: auto auto auto;
`

const PlayerPanel: React.FC<PlayerPanelProps> = ({ currentTurn, player }: PlayerPanelProps) => {
  return (
    <PlayerFrame currentTurn={currentTurn}>
      <span>{ player.id }</span>
      <CardIcon text={player.golems.length.toString()} />
      <CardIcon text={player.discard.length.toString()} />
      <GemStash gems={player.gems} />
    </PlayerFrame>
  )
}

export default PlayerPanel;
