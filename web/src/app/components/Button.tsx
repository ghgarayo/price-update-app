interface ButtonProps {
  title: string;
  className: string;
}

export function Button(props: ButtonProps) {
  return (
    <button>
      <span
      className={props.className}
      >
        {props.title}
      </span>
    </button>
  );
}
