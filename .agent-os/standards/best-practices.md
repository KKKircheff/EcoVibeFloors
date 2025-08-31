# Development Best Practices

## Context

Global development guidelines for Agent OS projects.

<conditional-block context-check="core-principles">
IF this Core Principles section already read in current context:
  SKIP: Re-reading this section
  NOTE: "Using Core Principles already in context"
ELSE:
  READ: The following principles

## Core Principles

### Keep It Simple
- Implement code in the fewest lines possible
- Avoid over-engineering solutions
- Choose straightforward approaches over clever ones

### Optimize for Readability
- Prioritize code clarity over micro-optimizations
- Write self-documenting code with clear variable names
- Add comments for "why" not "what"

### DRY (Don't Repeat Yourself)
- Extract repeated business logic to private methods
- Extract repeated UI markup to reusable components
- Create utility functions for common operations

### File Structure
- Keep files focused on a single responsibility
- Group related functionality together
- Use consistent naming conventions
</conditional-block>

<conditional-block context-check="dependencies" task-condition="choosing-external-library">
IF current task involves choosing an external library:
  IF Dependencies section already read in current context:
    SKIP: Re-reading this section
    NOTE: "Using Dependencies guidelines already in context"
  ELSE:
    READ: The following guidelines
ELSE:
  SKIP: Dependencies section not relevant to current task

## Dependencies

### Choose Libraries Wisely
When adding third-party dependencies:
- Select the most popular and actively maintained option
- Check the library's GitHub repository for:
  - Recent commits (within last 6 months)
  - Active issue resolution
  - Number of stars/downloads
  - Clear documentation
</conditional-block>

<conditional-block context-check="firebase-patterns" task-condition="working-with-firebase">
IF current task involves Firebase database operations:
  IF Firebase patterns already read in current context:
    SKIP: Re-reading this section
    NOTE: "Using Firebase patterns already in context"
  ELSE:
    READ: The following Firebase guidelines
ELSE:
  SKIP: Firebase section not relevant to current task

## Firebase Development Patterns

### Firebase SDK Usage
- Use Admin SDK for server-side operations (Node.js/Cloud Functions)
- Use Client SDK for client-side operations (React components)
- Initialize Firebase config properly in both environments
- Type Firestore documents with TypeScript interfaces

### Authentication Patterns
- Use Firebase Auth for user management
- Implement proper auth state listening in React
- Store user preferences in Firestore user documents
- Handle auth state changes with onAuthStateChanged
- Use Firebase Auth middleware for protected routes

### Firestore Best Practices
- Use camelCase for document fields (JavaScript convention)
- Include createdAt and updatedAt timestamps using serverTimestamp()
- Structure data for efficient queries (denormalization when needed)
- Use subcollections for one-to-many relationships

### Query Optimization
- Use where() clauses to limit query results
- Implement pagination with startAfter() and limit()
- Create composite indexes for complex queries
- Cache frequently accessed data with React Query or SWR

### Security Guidelines
- Write Firestore Security Rules for all collections
- Validate data structure in security rules
- Use Firebase Auth context in security rules
- Test security rules thoroughly before deployment
- Never expose Firebase Admin SDK credentials client-side
</conditional-block>
