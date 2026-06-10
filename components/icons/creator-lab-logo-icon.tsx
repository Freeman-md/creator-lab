import * as React from "react";

type CreatorLabLogoIconProps = React.SVGProps<SVGSVGElement>;

export function CreatorLabLogoIcon({
  className,
  ...props
}: CreatorLabLogoIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M8 16h2.5l6.8-6.8a1.77 1.77 0 1 0-2.5-2.5L8 13.5V16Z"
        fill="currentColor"
      />
      <path
        d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75v14.5A1.75 1.75 0 0 1 16.25 21h-8.5A1.75 1.75 0 0 1 6 19.25V4.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
