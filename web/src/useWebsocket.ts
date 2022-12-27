import { useEffect, useRef } from "react";
import { PlayerStub } from "./App";

const BASE_WEBSOCKET_URL = 'wss://3xr8kkccte.execute-api.ap-southeast-2.amazonaws.com/dev';

type WsEvents = 'connect' | 'disconnect' | 'init' | 'buy' | 'play' | 'info' | 'rest' | 'acquire' | 'claim'

type Subscription = {
  id: number
  type: WsEvents
  onTrigger: Function
}

export type InfoWsResponse = {
  roomId: string
  connectionId: string
  players: PlayerStub[]
}

export type WS = {
  connect: (name: string, roomId?: string) => Promise<InfoWsResponse>
  disconnect: () => void
  subscribe: (sub: Subscription) => void
  unsubscribe: (id: number) => void
  broadcast: (payload: { action: WsEvents, body: any }) => void
  log: () => void
}

// todo: add timeout ping
const useWebsocket = () => {
  const socket = useRef<WebSocket>();
  const subscribers = useRef<Subscription[]>([]);
  
  useEffect(() => {
    console.log('socket changed', socket.current)
  }, [socket.current])

  const connect = (name: string, roomId?: string) => new Promise<InfoWsResponse>((resolve, reject) => {
    const sock = new WebSocket(`${BASE_WEBSOCKET_URL}?name=${name}${ roomId ? `&roomId=${roomId}` : '' }`, []);
    socket.current = sock;
    sock.onerror = reject;
    sock.onmessage = (event: MessageEvent) => {
      const { action, body } = JSON.parse(event.data);
      if (action !== 'info') return;
      sock.onmessage = onEvent;
      resolve(body as InfoWsResponse);
    };
    sock.onopen = () => {
      sock.send('{"action":"info"}');
    }
  })

  const broadcast = (payload: { action: WsEvents, body: any }) => {
    if (!socket.current) throw new Error('Connect to a socket before broadcasting.');
    return socket.current.send(JSON.stringify({
      action: 'sendmessage',
      message: JSON.stringify(payload)
    }));
  }

  const subscribe = (sub: Subscription) => {
    subscribers.current = [
      ...subscribers.current,
      sub
    ]
  }

  const unsubscribe = (id: number) => {
    subscribers.current = subscribers.current.filter(s => s.id !== id);
  }

  const disconnect = () => {
    if (!socket.current) throw new Error('Connect to a socket before disconnecting.');
    const sock = socket.current;
    socket.current = undefined;
    return sock.close();
  }

  const log = () => console.log('socket', socket)

  const onEvent = ({ data }: MessageEvent) => {
    const event = JSON.parse(data);

    subscribers.current
      .filter(({ type }) => type === event.action)
      .forEach((sub) => {
        sub.onTrigger(event.body)
      });
  }

  return { connect, disconnect, subscribe, unsubscribe, broadcast, log }
}

export default useWebsocket;
