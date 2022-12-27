import { useEffect } from "react"
import styled from "styled-components"

type ModalProps = { 
  children: any
  open: boolean
}

type ContainerProps = {
  open: boolean
}

const Container = styled.div<ContainerProps>`
  z-index: 100;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  display: ${({ open }) => open ? 'flex' : 'none' };
`

const Overlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  z-index: 1;
  opacity: 0.6;
  background: black;
`

const Content = styled.div`
  z-index: 2;
  border: 2px solid #888;
  border-radius: 8px;
  width: 400px;
  height: 400px;
  background: #333;
  padding: 16px;
`

const Modal: React.FC<ModalProps> = ({ children, open }: ModalProps) => {

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto';
  }, [open]);

  return (
    <Container open={open}>
      <Overlay />
      <Content>
        { children }
      </Content>
    </Container>
  )
}

export default Modal;
