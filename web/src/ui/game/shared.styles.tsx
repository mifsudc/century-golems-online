import styled from "styled-components";

type CardFrameInnerProps = {
  disabled: boolean
}

export const CardFrameInner = styled.div<CardFrameInnerProps>`
  border: 2px solid #aaa;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  background: #3c3c3c;

  position: absolute;
  top: 0px; left: 0;
  min-width: 200px;
  max-width: 200px;
  min-height: 300px;
  max-height: 300px;
  user-select: none;
  z-index: 5;

  ${({ disabled }) => disabled ? '' : `
    cursor: pointer;

    &:hover {
      background: #2c2c2c;
    }
  `}
`

type CardFrameProps = CardFrameInnerProps & {
  children: any
  onClick?: () => void
}

const CardFrameOuter = styled.div`
  min-width: 200px;
  max-width: 200px;
  min-height: 300px;
  max-height: 300px;
  position: relative;
  overflow: visible;
`

export const CardFrame: React.FC<CardFrameProps> = ({ disabled, onClick, children }: CardFrameProps) => {
  return (
    <CardFrameOuter>
      <CardFrameInner disabled={disabled} onClick={onClick}>
        { children }
      </CardFrameInner>
    </CardFrameOuter>
  )
}

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
  column-gap: 16px;
  padding-bottom: 12px;
  padding-right: 16px;
`
  
  const CardStackFrameOuter = styled.div`
  display: flex;
  width: 100%;
  overflow-x: auto;
  height: max-content;
`