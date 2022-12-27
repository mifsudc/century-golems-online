import { CardFrame } from "./shared.styles"

type RestCardProps = {
  onClick: () => void
  disabled: boolean
  n: number
}

const RestCard: React.FC<RestCardProps> = ({ onClick, disabled, n }: RestCardProps) => {
  return (
    <CardFrame onClick={disabled ? undefined : onClick} disabled={disabled}>
      Rest (+{n})
    </CardFrame>
  )
}

export default RestCard;
