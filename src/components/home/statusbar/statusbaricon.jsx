const iconProps = {
  className: "status-icon",
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

function IconDepth({ id }) {
  return (
    <defs>
      <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#d4b996" />
        <stop offset="48%" stopColor="#8b6246" />
        <stop offset="100%" stopColor="#563b2a" />
      </linearGradient>

      <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f3dfc5" />
        <stop offset="55%" stopColor="#a77b59" />
        <stop offset="100%" stopColor="#6b4f3b" />
      </linearGradient>

      <filter
        id={`${id}-shadow`}
        x="-40%"
        y="-40%"
        width="180%"
        height="190%"
      >
        <feDropShadow
          dx="0"
          dy="1"
          stdDeviation="0.7"
          floodColor="#392719"
          floodOpacity="0.38"
        />
      </filter>
    </defs>
  );
}

export function StarIcon() {
  return (
    <svg {...iconProps}>
      <IconDepth id="star" />
      <path
        d="m12 2.8 2.8 5.7 6.3.9-4.55 4.42 1.08 6.25L12 17.1 6.37 20.1l1.08-6.25L2.9 9.4l6.3-.9L12 2.8Z"
        fill="url(#star-fill)"
        stroke="url(#star-metal)"
        strokeWidth="0.7"
        strokeLinejoin="round"
        filter="url(#star-shadow)"
      />
      <path
        d="m12 5 2 4.1 4.5.65-3.25 3.15"
        fill="none"
        stroke="#fff1dc"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.65"
      />
    </svg>
  );
}

export function DeliveryTruckIcon() {
  return (
    <svg {...iconProps}>
      <IconDepth id="truck" />
      <g
        stroke="url(#truck-metal)"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#truck-shadow)"
      >
        <path
          d="M2.5 6.5h11.8v10H2.5z"
          fill="url(#truck-fill)"
        />
        <path
          d="M14.3 10h4l3.2 3.2v3.3h-7.2z"
          fill="url(#truck-fill)"
        />
        <path d="M16.2 10.2v3h4.6" fill="none" stroke="#f7e8d4" />
        <path d="M4.2 8.1h8.4" fill="none" stroke="#f7e8d4" opacity="0.75" />
        <circle cx="7" cy="18" r="2" fill="#563b2a" />
        <circle cx="18" cy="18" r="2" fill="#563b2a" />
        <circle cx="7" cy="18" r="0.75" fill="#d4b996" stroke="none" />
        <circle cx="18" cy="18" r="0.75" fill="#d4b996" stroke="none" />
      </g>
    </svg>
  );
}

export function SofaIcon() {
  return (
    <svg {...iconProps}>
      <IconDepth id="sofa" />
      <g
        stroke="url(#sofa-metal)"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#sofa-shadow)"
      >
        <path
          d="M5 11V8.5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2V11"
          fill="url(#sofa-fill)"
        />
        <path
          d="M5 11a3 3 0 0 0-3 3v3h20v-3a3 3 0 0 0-3-3H5Z"
          fill="url(#sofa-fill)"
        />
        <path d="M5.2 11.6v3.2m6.8-3.2v3.2m6.8-3.2v3.2" fill="none" />
        <path d="M4.2 17v2m15.6-2v2" fill="none" />
        <path d="M6 8.5h12" fill="none" stroke="#fff1dc" opacity="0.7" />
      </g>
    </svg>
  );
}

export function GroupIcon() {
  return (
    <svg {...iconProps}>
      <IconDepth id="group" />
      <g
        stroke="url(#group-metal)"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#group-shadow)"
      >
        <circle cx="12" cy="7.5" r="2.8" fill="url(#group-fill)" />
        <circle cx="5.2" cy="9" r="1.9" fill="url(#group-fill)" />
        <circle cx="18.8" cy="9" r="1.9" fill="url(#group-fill)" />
        <path d="M6.3 19.5a5.7 5.7 0 0 1 11.4 0" fill="url(#group-fill)" />
        <path d="M2.2 19a3.4 3.4 0 0 1 4.7-3.2M21.8 19a3.4 3.4 0 0 0-4.7-3.2" fill="none" />
        <path d="M10.1 7a2 2 0 0 1 3.8 0" fill="none" stroke="#fff1dc" opacity="0.7" />
      </g>
    </svg>
  );
}