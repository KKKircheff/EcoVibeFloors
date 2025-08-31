# TypeScript Style Guide

**TypeScript-First Development**: All code must be written in TypeScript. JavaScript files are not permitted in new development.

## Core TypeScript Guidelines

### Type Definitions
- Use explicit type annotations for function parameters and return types
- Prefer interfaces over type aliases for object shapes
- Use union types instead of any when possible
- Define strict types for API responses and database models

### Import/Export Patterns
- Use ES6 import/export syntax exclusively
- Group imports: external libraries → internal modules → relative imports
- Use named exports over default exports for better tree-shaking

### Modern JavaScript Features
- Use async/await over Promises.then()
- Prefer arrow functions for callbacks and short functions
- Use destructuring for object and array assignments
- Leverage template literals for string interpolation

### Next.js Specific
- Use 'use client' directive only when necessary for client components
- Prefer server components by default
- Use Next.js built-in TypeScript support and strict mode
