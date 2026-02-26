import React from 'react'

interface Props {
  className?: string
}

export const Logo = ({ className }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 260 34"
      fill="none"
      className={className}
      aria-label="fetching.design"
      role="img"
    >
      <text
        x="0"
        y="26"
        fontFamily="Inter, sans-serif"
        fontSize="22"
        fontWeight="600"
        fill="var(--brand-platinum, #EBEBEB)"
      >
        <tspan>fetching</tspan>
        <tspan fill="var(--brand-clay, #D4A052)">.</tspan>
        <tspan fill="var(--brand-clay, #D4A052)">[)</tspan>
        <tspan>esign</tspan>
      </text>
      <rect data-cursor="" x="242" y="8" width="2" height="20" fill="var(--brand-clay, #D4A052)">
        <animate attributeName="opacity" values="1;0;1" dur="1.2s" repeatCount="indefinite" />
      </rect>
    </svg>
  )
}
