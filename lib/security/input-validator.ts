/**
 * Input validation and sanitization utilities for chat and other user inputs
 * Protects against prompt injection attacks and input abuse
 */

export interface ValidationResult {
    isValid: boolean;
    sanitizedInput?: string;
    errorCode?: 'TOO_LONG' | 'INVALID_CONTENT' | 'TOO_MANY_SPECIAL_CHARS' | 'SUSPICIOUS_PATTERN';
    errorDetails?: string;
}

// Prompt injection patterns to detect (case-insensitive)
const INJECTION_PATTERNS = [
    // Role manipulation
    /ignore\s+(previous|above|prior)\s+(instructions|prompts?|commands?)/i,
    /disregard\s+(previous|above|all)\s+(instructions|prompts?|commands?)/i,
    /you\s+are\s+now\s+(a|an|the)?/i,
    /act\s+as\s+(a|an|the)?/i,
    /pretend\s+(you|to)\s+(are|be)/i,
    /forget\s+(everything|all|previous)/i,
    /new\s+(instructions|prompt|role|task)/i,

    // System prompt leakage attempts
    /show\s+(me\s+)?(your|the)\s+(system\s+)?(prompt|instructions|rules)/i,
    /what\s+(is|are)\s+your\s+(system\s+)?(prompt|instructions|rules)/i,
    /reveal\s+your\s+(system\s+)?(prompt|instructions)/i,
    /print\s+(your|the)\s+(system\s+)?(prompt|instructions)/i,

    // Command injection attempts
    /```\s*(system|admin|root|sudo)/i,
    /\[SYSTEM\]/i,
    /\[ADMIN\]/i,
    /\[OVERRIDE\]/i,

    // Delimiter manipulation
    /#{5,}/,
    /-{3,}\s*(system|admin|override|instruction)/i,
    /={10,}/,
    /_{10,}/,
];

/**
 * Validates and sanitizes user input for chat messages
 * @param input - Raw user input string
 * @param maxLength - Maximum allowed character length (default: 800)
 * @returns ValidationResult with sanitized input or error details
 */
export function validateChatInput(input: string, maxLength: number = 800): ValidationResult {
    // Basic checks
    if (!input || typeof input !== 'string') {
        return {
            isValid: false,
            errorCode: 'INVALID_CONTENT',
            errorDetails: 'Input must be a non-empty string',
        };
    }

    // Trim and normalize whitespace
    let sanitized = input.trim();

    // Check length before sanitization (to catch padding attacks)
    if (input.length > maxLength) {
        return {
            isValid: false,
            errorCode: 'TOO_LONG',
            errorDetails: `Input exceeds ${maxLength} characters`,
        };
    }

    // Remove control characters (except newlines and tabs)
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');

    // Normalize unicode (NFC normalization)
    sanitized = sanitized.normalize('NFC');

    // Collapse multiple whitespace/newlines
    sanitized = sanitized.replace(/\s+/g, ' ');
    sanitized = sanitized.replace(/\n{3,}/g, '\n\n');

    // Check for excessive repeated characters (more than 5 consecutive)
    const repeatedCharsPattern = /(.)\1{5,}/g;
    if (repeatedCharsPattern.test(sanitized)) {
        return {
            isValid: false,
            errorCode: 'SUSPICIOUS_PATTERN',
            errorDetails: 'Excessive repeated characters detected',
        };
    }

    // Check ratio of special characters to alphanumeric
    const specialChars = sanitized.match(/[^a-zA-Z0-9\s\u0400-\u04FF]/g) || [];
    const alphanumeric = sanitized.match(/[a-zA-Z0-9\u0400-\u04FF]/g) || [];

    if (alphanumeric.length > 0) {
        const specialCharRatio = specialChars.length / (alphanumeric.length + specialChars.length);

        // Flag if more than 30% special characters
        if (specialCharRatio > 0.3) {
            return {
                isValid: false,
                errorCode: 'TOO_MANY_SPECIAL_CHARS',
                errorDetails: 'Too many special characters in input',
            };
        }
    }

    // Check for prompt injection patterns
    for (const pattern of INJECTION_PATTERNS) {
        if (pattern.test(sanitized)) {
            return {
                isValid: false,
                errorCode: 'SUSPICIOUS_PATTERN',
                errorDetails: 'Suspicious pattern detected in input',
            };
        }
    }

    // Check length after sanitization
    if (sanitized.length > maxLength) {
        return {
            isValid: false,
            errorCode: 'TOO_LONG',
            errorDetails: `Sanitized input exceeds ${maxLength} characters`,
        };
    }

    // All checks passed
    return {
        isValid: true,
        sanitizedInput: sanitized,
    };
}

/**
 * Validates a single message string with default chat settings
 * Convenience wrapper around validateChatInput
 */
export function validateMessage(message: string): ValidationResult {
    return validateChatInput(message, 800);
}
