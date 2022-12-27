import styled from "styled-components";
import { GEMS } from "../../game/types";

import yellow from '../../assets/img/gem-yellow.png'
import green from '../../assets/img/gem-green.png'
import blue from '../../assets/img/gem-blue.png'
import magenta from '../../assets/img/gem-magenta.png'
import grey from '../../assets/img/gem-grey.png'


type GemsProps = {
  gems: GEMS[]
}

type ContainerProps = {
  total: number
}

const imageSize = 40;

const Container = styled.div<ContainerProps>`
  display: flex;
  gap: 4px;
  width: ${({ total }) => total === 4 ? imageSize * 2 + 4 : (imageSize) * 3 + 8}px;
  justify-content: center;
  flex-wrap: wrap;
`

const Gem = styled.img`
  width: ${imageSize}px;
  user-select: none;
  user-drag: none;
`

const imgMap: { [key: string]: string } = { yellow, green, blue, magenta, grey }

const Gems: React.FC<GemsProps> = ({ gems }: GemsProps) => {
  return (
    <Container total={gems.length}>
      { gems.map((gem, idx) => <Gem src={imgMap[GEMS[gem]]} key={idx} />) }
    </Container>
  )
}

export default Gems;
