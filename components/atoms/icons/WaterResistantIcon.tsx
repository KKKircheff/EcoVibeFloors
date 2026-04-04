interface WaterResistantIconProps {
    size?: number;
    color?: string;
}

export function WaterResistantIcon({ size = 60, color = 'currentColor' }: WaterResistantIconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 45.5 48.95"
            style={{ display: 'block' }}
        >
            <g>
                {/* First wave line */}
                <path
                    stroke={color}
                    strokeWidth="3.09"
                    strokeMiterlimit="10"
                    fill="none"
                    fillRule="nonzero"
                    d="M0 36.3c2.08,0 7.57,2.86 7.57,2.86 2.36,1.23 5.35,1.23 7.7,0l3.72 -1.94c2.36,-1.23 5.34,-1.23 7.7,0l3.69 1.92c2.38,1.24 5.39,1.23 7.75,-0.03 0,0 5.34,-2.82 7.36,-2.82"
                />
                {/* Second wave line */}
                <path
                    stroke={color}
                    strokeWidth="3.09"
                    strokeMiterlimit="10"
                    fill="none"
                    fillRule="nonzero"
                    d="M0 43.62c2.08,0 7.57,2.86 7.57,2.86 2.36,1.23 5.35,1.23 7.7,0l3.72 -1.94c2.36,-1.23 5.34,-1.23 7.7,0l3.69 1.92c2.38,1.24 5.39,1.23 7.75,-0.03 0,0 5.34,-2.82 7.36,-2.82"
                />
                {/* Water droplet */}
                <path
                    stroke={color}
                    strokeWidth="3.09"
                    strokeMiterlimit="10"
                    fill="none"
                    fillRule="nonzero"
                    d="M26.7 29.08c10.93,-3.6 2.2,-19.59 -3.03,-27.02 -0.48,-0.68 -1.55,-0.68 -2.03,0 -5.32,7.56 -13.58,22.82 -2.92,26.84 2.54,0.96 5.39,1.03 7.99,0.18z"
                />
            </g>
        </svg>
    );
}
