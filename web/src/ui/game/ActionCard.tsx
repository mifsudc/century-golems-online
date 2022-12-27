import styled from "styled-components";
import { Card, CardSlot, GEMS, GemsObj, ObtainData, SwapData, UpgradeData } from "../../game/types";
import { gemsObjectToArray } from "../../game/utils";
import Gems from "./Gems";
import { CardFrame } from "./shared.styles";
import ArrowIcon from "../../assets/img/arrow.png"
import CardCache from "./CardCache";

type ActionCardProps = {
  card: Card
  onClick: () => void
  disabled: boolean
  gems?: GemsObj
}

const Icon = styled.img`
  width: 40px;
  filter: invert(45%) sepia(1%) saturate(1344%) hue-rotate(323deg) brightness(101%) contrast(75%);
`

const UpIcon = styled(Icon)`
  rotate: -90deg;
`

const DownIcon = styled(Icon)`
  rotate: 90deg;
`

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 160px;
  justify-content: center;
`

const ActionCard: React.FC<ActionCardProps> = ({ card, gems, onClick, disabled }: ActionCardProps) => {



  return (
    <CardFrame onClick={disabled ? undefined : onClick} disabled={disabled}>
      { card.type === 'obtain' && (
        <Flex>
          <Gems gems={ gemsObjectToArray(card.data as ObtainData) } />
        </Flex>
      )}
      { card.type === 'swap' && (
        <>
          <Flex>
            <Gems gems={ gemsObjectToArray((card.data as SwapData).from) } />
            <DownIcon src={ArrowIcon} />
            <Gems gems={ gemsObjectToArray((card.data as SwapData).to) } />
          </Flex>
        </>
      )}
      { card.type === 'upgrade' && (
        <Flex>
          <UpIcon src={ArrowIcon} />
          <Gems gems={ gemsObjectToArray({ [GEMS.grey]: (card.data as UpgradeData).value }) } />
        </Flex>
      )}
      { gems && <CardCache gems={gems} /> }
    </CardFrame>
  )
}

export default ActionCard;
