import styled from "styled-components"
import { GEMS } from "../../../game/types"
import yellow from '../../../assets/img/gem-yellow.png'
import green from '../../../assets/img/gem-green.png'
import blue from '../../../assets/img/gem-blue.png'
import magenta from '../../../assets/img/gem-magenta.png'

const Container = styled.div`
  display: flex;
  gap: 4px;
  width: 220px;
  flex-wrap: wrap;
`

const Gem = styled.img`
  width: 40px;
  height: 40px;
`

const Slot = styled.div`
  border: 1px solid #777;
  border-radius: 4px;
  width: 40px;
  height: 40px;
  box-sizing: border-box;
`

type GemStashProps = {
  gems: GEMS[]
}

const imgMap: { [key: string]: string } = { yellow, green, blue, magenta }

const GemStash = ({ gems }: GemStashProps) => {
  return (
    <Container>
      { gems.map((gem, idx) => <Gem src={imgMap[GEMS[gem]]} key={idx} />) }
      { [...Array(Math.max(10 - gems.length, 0))].map((_, idx) => <Slot key={idx} />) }
    </Container>
  )
}

export default GemStash;
