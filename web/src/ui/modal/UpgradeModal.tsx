import styled from "styled-components";
import { useGamestate } from "../../game/context";
import { getCardFromPlayer, getPlayer } from "../../game/utils";
import GemStash from "../game/players/GemStash";
import arrowIcon from '../../assets/img/arrow.png'
import yellow from '../../assets/img/gem-yellow.png'
import green from '../../assets/img/gem-green.png'
import blue from '../../assets/img/gem-blue.png'
import magenta from '../../assets/img/gem-magenta.png'
import grey from '../../assets/img/gem-grey.png'
import { UpgradeData } from "../../game/types";
import { useState } from "react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
`

const ButtonFlex = styled.div`
  display: flex;
  justify-content: space-around;
`

const UpgradesFlex = styled.div`
  display: flex;
`

const Header = styled.h2`
  text-align: center;
`

const Button = styled.button`
  border: 2px solid grey;
  border-radius: 4px;
  padding: 8px;
  margin: 0 8px;
  flex: 1;
  background: lightgrey;
`

const Icon = styled.img`
  width: 50px;
  rotate: -90deg;
`

const Gem = styled.img`
  width: 50px;
`

const imgMap: { [key: string]: string } = { yellow, green, blue, magenta }

type UpgradeModalProps = {
  playerId: number
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ playerId }: UpgradeModalProps) => {

  const cardId = 1;

  const { state } = useGamestate();
  const activePlayer = getPlayer(playerId, state);
  const card = getCardFromPlayer(cardId, activePlayer);

  const [remainingUpgrades, setRemainingUpgrades] = useState(((card.data) as UpgradeData).value);

  const onCancel = () => {

  }

  const onReset = () => {

  }

  const onConfirm = () => {

  }

  return (
    <Container>
      <Header>Upgrade Gems</Header>
      <UpgradesFlex>
        {/* <Icon src={arrowIcon} /> */}
          Remaining: { [...Array(remainingUpgrades)].map((_, index) => <Gem key={index} src={grey} />) }
      </UpgradesFlex>
      <GemStash gems={activePlayer.gems} />
      <ButtonFlex>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onReset}>Reset</Button>
        <Button onClick={onConfirm}>Confirm</Button>
      </ButtonFlex>
    </Container>
  )
}

export default UpgradeModal;
