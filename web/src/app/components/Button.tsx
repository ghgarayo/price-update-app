interface ButtonProps {
  title: string
  className: string
  onClick: () => void
}

export function Button(props: ButtonProps) {
  return (
    <button onClick={props.onClick}>
      <span className={props.className}>{props.title}</span>
    </button>
  )
}
