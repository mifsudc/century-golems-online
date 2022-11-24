import styled from "styled-components";
import { Card, GEMS, ObtainData, SwapData, UpgradeData } from "../game/types";
import { gemsObjectToArray } from "../game/utils";
import Gems from "./Gems";
import { CardFrame } from "./shared.styles";
import ArrowIcon from "../assets/img/arrow.png"

type ActionCardProps = {
  card: Card
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
`

const ActionCard: React.FC<ActionCardProps> = ({ card }: ActionCardProps) => {

  return (
    <CardFrame>
      { card.type === 'obtain' && (
        <>
          <Gems gems={ gemsObjectToArray(card.data as ObtainData) } />
        </>
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
    </CardFrame>
  )
}

export default ActionCard;
