import { Dispatch, SetStateAction } from "react";
import { AppState } from "../../App";

type PostGameProps = {
  setState: Dispatch<SetStateAction<AppState>>
}

const PostGame: React.FC<PostGameProps> = ({ setState }: PostGameProps) => {
  return (
    <div>Postgame</div>
  )
}

export default PostGame;
