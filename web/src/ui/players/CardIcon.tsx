import styled from "styled-components"

type CardIconProps = {
  text: string
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #aaa;
  border-radius: 4px;
  width: 35px;
`

const CardIcon: React.FC<CardIconProps> = ({ text }: CardIconProps) => {
  return (
    <Container>
      { text }
    </Container>
  )
}

export default CardIcon;
