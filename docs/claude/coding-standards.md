# Coding Standards

## MUI Component Rules

### Stack over Box for flexbox
```tsx
// ❌ Avoid
<Box display="flex" gap={2}><Item /></Box>

// ✅ Prefer
<Stack direction="row" spacing={2}><Item /></Stack>
```

### Grid (MUI 7.x)
Use `size` prop, never `xs`/`md` as direct props. Never import Grid2.

```tsx
// ❌ Avoid
import Grid2 from '@mui/material/Grid2';
import { Grid2 as Grid } from '@mui/material';

// ✅ Correct import
import { Grid } from '@mui/material';

// ✅ Correct usage
<Grid container spacing={2}>
  <Grid size={{ xs: 12, md: 8 }}>content</Grid>
  <Grid size={{ xs: 12, md: 4 }}>sidebar</Grid>
</Grid>
```

### Button Navigation
Never use `component={Link}` on MUI buttons. Use `PrimaryActionButton` or `HeroButton` with `useRouter`.

```tsx
// ❌ Avoid
<Button component={Link} href="/path">Click</Button>

// ✅ Correct
const router = useRouter(); // from @/i18n/navigation
<PrimaryActionButton onClick={() => router.push('/path')}>Click</PrimaryActionButton>
```

## Functional Programming

Export standalone functions, not static utility classes.

```tsx
// ❌ Avoid
export class AuthService { static signIn() {} }

// ✅ Prefer
export async function signIn() {}
```

See `lib/firebase/auth.ts` for reference.

## Code Comments Policy

Comments describe concepts, architecture, or non-obvious business logic — NOT individual functions.

```tsx
// ❌ Avoid — redundant, restates what the code says
// This function calculates the total price
function calculateTotalPrice(items: Item[]) {}

// ❌ Avoid — obvious
const isLoggedIn = user !== null; // Check if user is logged in

// ✅ Good — explains WHY (architecture/non-obvious reason)
// Firebase Auth state is managed globally via context to avoid
// re-authentication on every page navigation
export const AuthProvider = ({ children }: Props) => {}
```

## Import Aliases

- Always use `@/` alias: `import { Component } from '@/components/...'`
- **Exception**: Images from `public/` folder use relative paths from page directories:
  `import img from '../../../public/images/path/image.webp'`
