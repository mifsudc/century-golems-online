import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";
import { AppState } from "../../App";
import { WS } from "../../useWebsocket";

type HomeProps = {
  setState: Dispatch<SetStateAction<AppState>>
  ws: WS
}

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: auto;
  height: calc(100% - 32px);
  padding: 16px;
`

const Header = styled.h1`
  margin-top: 20%;
  margin-bottom: 60%;
  text-align: center;
`

const Button = styled.button`
  border-width: 2px;
  border-styled: solid;
  color: white;
  font-size: 20px;
  border-radius: 8px;
  margin: 8px 0;
  padding: 16px;
  cursor: pointer;
`

const CreateButton = styled(Button)`
  border-color: #0a27fc;
  background: #344cfa;
  margin-top: 32px;
`

const Input = styled.input`
  font-size: 20px;
  border-radius: 8px;
  margin: 32px 0 8px 0;
  padding: 16px;
  background: #aaa;
`

const JoinButton = styled(Button)`
  border-color: #0a6b15;
  background: #428249;
`

const Error = styled.div`
  color: #db1d1d;
  font-size: 20px;
`

const Home: React.FC<HomeProps> = ({ setState, ws }: HomeProps) => {
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string>();
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { connect } = ws;

  const onCodeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value.replace(/[^0-9a-zA-Z]+/ig, '').substring(0, 4).toUpperCase());
  }

  const onNameInput = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }

  const onCreateGame = async () => {
    if (!name?.length) {
      setError('Enter a name.');
      return;
    }

    try {
      setLoading(true);
      const { roomId, connectionId, players } = await connect(name);
      setState({ players, status: 'lobby', isHost: true, roomId, connectionId });
    }
    catch {
      setError('An unexpected error occurred, try again in a bit.');
      setLoading(false);
    }
  }

  const onJoinGame = async () => {
    const errors = [];
    if (!code || code.length < 4) {
      errors.push('Enter a valid room code.');
    }

    if (!name?.length) {
      errors.push('Enter a name.');
    }

    if (errors.length) {
      setError(errors.join(' '));
      return;
    }

    try {
      setLoading(true);
      const { players, roomId, connectionId } = await connect(name, code);
      setState({ players, status: 'lobby', isHost: false, roomId, connectionId });
    }
    catch (e) {
      console.log(e);
      setError('Enter an existing room code, and/or try a different name.');
      setLoading(false);
    }
  }

  return (
    <Flex>
      <Header>Century Golems Online</Header>
      <Input placeholder="Name" onChange={onNameInput} value={name} />
      { loading }
      <CreateButton onClick={onCreateGame} disabled={loading}>Create Game</CreateButton>
      <Input placeholder="Room code" onChange={onCodeInput} value={code} />
      <JoinButton onClick={onJoinGame} disabled={loading}>Join Game</JoinButton>
      { error &&
        <Error>{ error }</Error>
      }
    </Flex>
  )
}

export default Home;
