import { Golem } from "../../game/types";
import { gemsObjectToArray } from "../../game/utils";
import Gems from "./Gems";
import { CardFrame } from "./shared.styles";
import styled from "styled-components";

type GolemProps = {
  golem: Golem
  onClick: () => void
  disabled: boolean
}

const Header = styled.div`
  font-size: 32px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 50%;
`

const Icon = styled.img`
  width: 40px;
  border-radius: 8px;
`

const GolemCard: React.FC<GolemProps> = ({ golem, onClick, disabled }: GolemProps) => {
  return (
    <CardFrame onClick={disabled ? undefined : onClick} disabled={disabled}>
      <Header>
        {/* <Icon src={golemIcon} /> */}
        { golem.value }
      </Header>
      <Gems gems={gemsObjectToArray(golem.cost)} />
    </CardFrame>
  )
}

export default GolemCard;
