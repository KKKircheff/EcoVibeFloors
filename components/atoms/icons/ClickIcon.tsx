interface ClickIconProps {
    size?: number;
    color?: string;
}

export function ClickIcon({ size = 60, color = 'currentColor' }: ClickIconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            width={size}
            height={size}
            viewBox="0 0 180.66 179.85"
            style={{ display: 'block' }}
        >
            <g>
                <path
                    className="fil0 str0"
                    stroke={color}
                    strokeWidth="7.24"
                    strokeMiterlimit="4"
                    fill="none"
                    fillRule="nonzero"
                    d="M29.77 3.62c-13.97,0 -25.33,11.36 -25.33,25.33l0 121.94c0,13.97 11.36,25.33 25.33,25.33l121.94 0c13.97,0 25.33,-11.36 25.33,-25.33l0 -121.94c0,-13.97 -11.36,-25.33 -25.33,-25.33l-121.94 0z"
                />
                <path
                    className="fil0 str1"
                    stroke={color}
                    strokeWidth="7.24"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    fill="none"
                    fillRule="nonzero"
                    d="M3.62 90.58l67.74 0 0 12.29 -7.94 7.73 0 6.34 35.86 0 4.59 -4.46 8.25 0 0 14.65 -108.49 0 56.33 0 119.05 0m-0.56 -74.49l-102.29 32.58 3.93 11.68 -5.08 9.75 2.03 6.03 34.08 -10.86 3.01 -5.65 7.76 -2.47 4.69 13.93 52.42 -16.7"
                />
            </g>
        </svg>
    );
}
