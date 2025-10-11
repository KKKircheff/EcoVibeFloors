/**
 * Convert hyphenated string to camelCase
 * Example: "walvisgraat-click" => "walvisgraatClick"
 */
export function toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}
