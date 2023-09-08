interface ButtonProps {
  title: string
  className: string
  onClick: () => void
}

export function Button(props: ButtonProps) {
  return (
    <button onClick={props.onClick} className="w-fit my-4">
      <span className={props.className}>{props.title}</span>
    </button>
  )
}
