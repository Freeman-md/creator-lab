import * as React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: DivProps) {
  return (
    <div
      className={[
        "rounded-xl border border-border bg-card shadow-[0_4px_6px_-1px_rgb(0,0,0,0.05),0_2px_4px_-2px_rgb(0,0,0,0.05)]",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }: DivProps) {
  return <div className={["space-y-2 p-6 pb-0", className].join(" ")} {...props} />;
}

export function CardContent({ className = "", ...props }: DivProps) {
  return <div className={["p-6", className].join(" ")} {...props} />;
}
