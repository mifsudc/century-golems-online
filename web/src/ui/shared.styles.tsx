import styled from "styled-components";

export const CardFrame = styled.div`
  border: 2px solid #aaa;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  background: #3c3c3c;

  min-width: 200px;
  max-width: 200px;
  min-height: 300px;
  max-height: 300px;
`

type CardStackFrameProps = {
  children: any
}

export const CardStackFrame: React.FC<CardStackFrameProps> = ({ children }: CardStackFrameProps) => {
  return (
    <CardStackFrameOuter>
      <CardStackFrameInner>
        { children }
      </CardStackFrameInner>
    </CardStackFrameOuter>
  )
}

const CardStackFrameInner = styled.div`
  display: flex;
  margin: 16px;
  column-gap: 16px;
`

const CardStackFrameOuter = styled.div`
  display: flex;
  width: calc(100% - 16px);
  overflow: auto;
  margin: 0 16px;
`