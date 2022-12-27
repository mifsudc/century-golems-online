import { GemsObj } from "../../game/types"
import styled from "styled-components";
import { GEMS } from "../../game/types";

import yellow from '../../assets/img/gem-yellow.png'
import green from '../../assets/img/gem-green.png'
import blue from '../../assets/img/gem-blue.png'
import magenta from '../../assets/img/gem-magenta.png'
import grey from '../../assets/img/gem-grey.png'
import { useMemo } from "react";

type CardCacheProps = {
  gems: GemsObj
}

const imageSize = 40;

type ContainerProps = {
  total: number
}

const Container = styled.div<ContainerProps>`
  display: flex;
  gap: 4px;
  width: ${({ total }) => total === 4 ? (imageSize + 3) * 4: (imageSize) * 3 + 8}px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  min-height: 43px;
`

const Gem = styled.div`
  position: relative;
`

const Label = styled.div`
  position: absolute;
  z-index: 1;
  bottom: 4px;
  right: 4px;
  font-weight: 600;
`

const Img = styled.img`
  width: ${imageSize}px;
  user-select: none;
  user-drag: none;
  opacity: 0.6;
`

const imgMap: { [key: string]: string } = { yellow, green, blue, magenta, grey }

const CardCache: React.FC<CardCacheProps> = ({ gems }: CardCacheProps) => {

  const gemKeys = useMemo(() => {
    return Object.keys(gems)
    .map(gem => parseInt(gem) as GEMS)
    .filter(gem => gems[gem] !== 0)
  }, [gems])

  return (
    <Container total={gemKeys.length}>
      { gemKeys.map((gem, index) => (
        <Gem key={index}>
          <Label>{ gem === GEMS.grey ? '-' : '+' }{ gems[gem] }</Label>
          <Img src={imgMap[GEMS[gem]]} />
        </Gem>
      ))}
    </Container>
  )
}

export default CardCache;
