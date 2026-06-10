import * as React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={[
        "flex h-11 w-full rounded-xl border border-stone-300 bg-white px-4",
        "text-sm text-stone-950 placeholder:text-stone-400",
        "outline-none transition-colors focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
