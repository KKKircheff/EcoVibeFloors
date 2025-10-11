interface HeatingIconProps {
    size?: number;
    color?: string;
}

export function HeatingIcon({ size = 60, color = 'currentColor' }: HeatingIconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 296.17 259.51"
            style={{ display: 'block' }}
        >
            <g>
                <path
                    stroke={color}
                    strokeWidth="19.41"
                    strokeMiterlimit="10"
                    fill="none"
                    fillRule="nonzero"
                    d="M9.7 84.2l248.65 0c8.87,0 17.22,4.11 22.52,11.09 7.44,9.8 7.44,23.24 0,33.03 -5.3,6.98 -13.65,11.09 -22.52,11.09l-220.55 0c-8.86,0 -17.21,4.11 -22.51,11.09 -7.45,9.8 -7.45,23.24 0,33.03 5.3,6.98 13.65,11.09 22.51,11.09l220.55 0c8.87,0 17.22,4.11 22.52,11.09 7.44,9.8 7.44,23.24 0,33.04 -5.3,6.97 -13.65,11.09 -22.52,11.09l-248.65 0m1.2 -210.26l26.38 -26.89c3.87,-3.94 10.15,-3.94 14.02,0l26.62 27.13m34.91 -0.24l26.38 -26.89c3.87,-3.94 10.14,-3.94 14.02,0l26.62 27.13m39.58 -0.24l26.4 -26.89c3.87,-3.94 10.14,-3.94 14.01,0l26.62 27.13"
                />
            </g>
        </svg>
    );
}
