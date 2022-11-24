import { Golem } from "../game/types";
import { gemsObjectToArray } from "../game/utils";
import Gems from "./Gems";
import { CardFrame } from "./shared.styles";
import golemIcon from "../assets/img/golem.png"
import styled from "styled-components";

type GolemProps = {
  golem: Golem
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

const GolemCard: React.FC<GolemProps> = ({ golem }: GolemProps) => {
  return (
    <CardFrame>
      <Header>
        {/* <Icon src={golemIcon} /> */}
        { golem.value }
      </Header>
      <Gems gems={gemsObjectToArray(golem.cost)} />
    </CardFrame>
  )
}

export default GolemCard;
