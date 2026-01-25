# Fit Planet - GitHub Copilot Instructions

## Project Context

Fit Planet is a **gym service broker platform** built with Next.js 16, React 19, MongoDB, and Cloudflare R2. The platform connects fitness seekers with gyms, enabling instant bookings, workout routine sharing, and comprehensive gym management tools for owners.

**Think of it as:** An insurance broker, but for gyms. Users discover gyms, compare plans, and book passes instantly without traditional membership hassles.

---

## Core Architecture

### Three-Zone Application Structure

The application has three distinct route groups with different purposes:

#### 1. `(website)` - Public Website

- **URL Pattern:** `/*` (no `/website` prefix)
- **Purpose:** Marketing, gym discovery, and public information
- **Authentication:** Not required
- **Key Pages:** Landing page, gym listings, gym details, about, contact

#### 2. `/app` - User Dashboard

- **URL Pattern:** `/app/*`
- **Purpose:** Authenticated user area for managing bookings, passes, routines, and social features
- **Authentication:** Required (phone OTP)
- **Key Pages:** Dashboard, my passes, bookings, routines, social feed, profile

#### 3. `/studio` - Gym Owner Portal

- **URL Pattern:** `/studio/*`
- **Purpose:** Gym owner management dashboard and business tools
- **Authentication:** Required (email/password)
- **Key Pages:** Dashboard, gym profile, passes config, capacity management, bookings, analytics

---

## Technology Stack

### Core Framework

- **Next.js 16.1.4** with App Router (Server Components by default)
- **React 19.2.3** with React Compiler enabled
- **TypeScript 5.x** with strict mode
- **Bun** as package manager

### Styling

- **Tailwind CSS v4** with new `@import "tailwindcss"` syntax
- Use `cn()` utility from `@/lib/utils` for conditional classes
- CSS variables in `globals.css` for theming

### Database & Storage

- **MongoDB** (native Node.js driver) - Primary database
- **Cloudflare R2** (S3-compatible) - Media storage (images, videos)

---

## Critical Path Aliases

Use these path aliases (configured in `tsconfig.json`):

- `@/*` → `./src/*`

**Examples:**

```typescript
import { cn } from "@/lib/utils";
import { getDatabase } from "@/lib/utils/mongodb";
import { Button } from "@/components/ui/button";
```

---

## Database Patterns

### MongoDB Connection

**ALWAYS use the singleton pattern from `src/lib/utils/mongodb.ts`:**

```typescript
import { getDatabase } from "@/lib/utils/mongodb";

// In Server Components or API routes
const db = await getDatabase();
const gyms = await db.collection("gyms").find({}).toArray();
```

**Key Points:**

- Connection is cached in development to prevent hot-reload issues
- Fresh connection in production
- Use `Db` type from `mongodb` package for type safety
- Wrap in try-catch for error handling

### Collection Naming Convention

Use lowercase plural names:

- `users` - End users (gym members)
- `gyms` - Gym profiles
- `bookings` - Pass bookings
- `routines` - Workout routines
- `exercises` - Exercise library
- `reviews` - Gym reviews

### Required Environment Variables

```env
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=fitplanet
```

---

## Cloudflare R2 Storage

### Available Utilities (from `src/lib/utils/r2.ts`)

#### 1. Upload File

```typescript
import { uploadFile } from "@/lib/utils/r2";

const file = formData.get("file") as File;
const url = await uploadFile(file, "gym-photos");
// Returns: https://cdn.fitplanet.com/gym-photos/1234567890-image.jpg
```

#### 2. Delete File

```typescript
import { deleteFile } from "@/lib/utils/r2";

await deleteFile("https://cdn.fitplanet.com/gym-photos/old-image.jpg");
```

#### 3. Get Public URL

```typescript
import { getPublicUrl } from "@/lib/utils/r2";

const url = getPublicUrl("gym-photos/1234567890-image.jpg");
```

#### 4. Validate Image

```typescript
import { validateImageFile } from "@/lib/utils/r2";

const validation = validateImageFile(file, 5); // 5MB max
if (!validation.valid) {
  throw new Error(validation.error);
}
```

**Supported Image Formats:** JPEG, PNG, GIF, SVG, WebP  
**Default Max Size:** 1MB (configurable)

### Required Environment Variables

```env
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_ACCESS_KEY_ID=...
CLOUDFLARE_SECRET_ACCESS_KEY=...
CLOUDFLARE_BUCKET_NAME=fitplanet-media
CLOUDFLARE_PUBLIC_URL=https://cdn.fitplanet.com
```

---

## Component Guidelines

### Server vs Client Components

**Default to Server Components** (no `'use client'` directive)

Use Server Components for:

- Fetching data from MongoDB
- Accessing environment variables
- Calling backend services
- Rendering static content

**Only use Client Components when you need:**

- Interactive state (`useState`, `useReducer`)
- Lifecycle hooks (`useEffect`, `useLayoutEffect`)
- Event handlers (`onClick`, `onChange`)
- Browser-only APIs (`window`, `localStorage`)
- Custom hooks

```typescript
// Server Component (default)
export default async function GymDetailsPage({ params }: Props) {
  const db = await getDatabase();
  const gym = await db.collection('gyms').findOne({ _id: new ObjectId(params.id) });

  return <GymProfile gym={gym} />;
}

// Client Component
'use client';

export function BookingButton({ gymId }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBook = async () => {
    setIsLoading(true);
    // Booking logic...
  };

  return <button onClick={handleBook}>Book Now</button>;
}
```

---

## Routing Conventions

### File Structure Patterns

```
app/
├── (website)/              # Public pages (no /website in URL)
│   ├── layout.tsx          # Public layout (navbar, footer)
│   ├── page.tsx            # Landing page (/)
│   └── gyms/
│       ├── page.tsx        # Gym listing (/gyms)
│       └── [id]/
│           └── page.tsx    # Gym details (/gyms/:id)
│
├── app/                    # User dashboard (/app/*)
│   ├── layout.tsx          # Dashboard layout (requires auth)
│   ├── dashboard/
│   │   └── page.tsx        # User dashboard (/app/dashboard)
│   ├── passes/
│   │   └── page.tsx        # My passes (/app/passes)
│   └── routines/
│       └── page.tsx        # Workout routines (/app/routines)
│
└── studio/                 # Gym owner portal (/studio/*)
    ├── layout.tsx          # Studio layout (requires owner auth)
    ├── dashboard/
    │   └── page.tsx        # Studio dashboard (/studio/dashboard)
    └── profile/
        └── page.tsx        # Gym profile (/studio/profile)
```

### Dynamic Routes

- Use `[id]` for single dynamic segments: `/gyms/[id]/page.tsx`
- Use `[...slug]` for catch-all routes: `/docs/[...slug]/page.tsx`

### Route Handlers (API)

Create `route.ts` files for API endpoints:

```typescript
// app/api/gyms/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/utils/mongodb";

export async function GET(request: NextRequest) {
  const db = await getDatabase();
  const gyms = await db.collection("gyms").find({}).toArray();

  return NextResponse.json({ gyms });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // Create gym logic...

  return NextResponse.json({ success: true }, { status: 201 });
}
```

---

## Styling Patterns

### Tailwind Best Practices

```typescript
import { cn } from '@/lib/utils';

// Basic usage
<div className="rounded-lg border p-4 shadow-sm">

// Conditional classes
<div className={cn(
  "base-class",
  isActive && "bg-blue-500",
  isDisabled && "opacity-50 cursor-not-allowed"
)}>

// Allow prop overrides
interface Props {
  className?: string;
}

<div className={cn("default-styles", className)}>
```

### CSS Variables

Use theme variables from `globals.css`:

```css
background-color: var(--background);
color: var(--foreground);
```

---

## Data Fetching Patterns

### Server Component Data Fetching

```typescript
// Direct database queries in Server Components
export default async function GymsPage() {
  const db = await getDatabase();
  const gyms = await db.collection('gyms')
    .find({ isActive: true })
    .sort({ averageRating: -1 })
    .limit(20)
    .toArray();

  return <GymList gyms={gyms} />;
}
```

### Client Component Data Fetching

```typescript
// Use API routes for Client Components
'use client';

export function GymList() {
  const [gyms, setGyms] = useState([]);

  useEffect(() => {
    fetch('/api/gyms')
      .then(res => res.json())
      .then(data => setGyms(data.gyms));
  }, []);

  return <div>{/* Render gyms */}</div>;
}
```

### Server Actions (Preferred for Mutations)

```typescript
// Server Action in Server Component file
'use server';

export async function createGym(formData: FormData) {
  const db = await getDatabase();
  const gym = {
    name: formData.get('name'),
    // ... other fields
    createdAt: new Date(),
  };

  await db.collection('gyms').insertOne(gym);
  revalidatePath('/studio/dashboard');
}

// Use in Client Component
'use client';

export function GymForm() {
  return (
    <form action={createGym}>
      <input name="name" />
      <button type="submit">Create Gym</button>
    </form>
  );
}
```

---

## Type Safety

### MongoDB Type Annotations

```typescript
import { ObjectId } from "mongodb";

interface Gym {
  _id: ObjectId;
  name: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  // ... other fields
}

const db = await getDatabase();
const gym = await db.collection<Gym>("gyms").findOne({ _id: new ObjectId(id) });
// gym is typed as Gym | null
```

### Type Definitions Location

Store shared types in `src/lib/types/`:

- `src/lib/types/index.ts` - Global types
- `src/lib/types/gym.ts` - Gym-related types
- `src/lib/types/user.ts` - User-related types
- `src/lib/types/booking.ts` - Booking-related types

---

## Authentication Patterns

### User Authentication (Phone OTP)

- Verify phone via OTP (Twilio or similar)
- Store session with JWT in HTTP-only cookie
- Protect `/app/*` routes with multi-layer authentication

### Studio Authentication (Email/Password)

- Hash passwords with bcrypt (min 12 rounds)
- Store session with JWT in HTTP-only cookie
- Include gym ownership data in JWT claims
- Protect `/studio/*` routes with multi-layer authentication

### Multi-Layer Authentication Strategy

**IMPORTANT:** Next.js 16 uses `proxy.ts` instead of `middleware.ts` at the root level.

Authentication should be implemented in three layers for maximum security:

#### 1️⃣ Proxy (First Line of Defense - Early Redirects)

**File:** `src/app/proxy.ts` (Next.js 16 convention)

The proxy runs before any request processing and handles early redirects for unauthenticated users.

```typescript
// src/app/proxy.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("session");

  // Protect /app routes (user dashboard)
  if (request.nextUrl.pathname.startsWith("/app")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect /studio routes (gym owner portal)
  if (request.nextUrl.pathname.startsWith("/studio")) {
    if (!token) {
      return NextResponse.redirect(new URL("/studio/login", request.url));
    }
    // Additional check for studio token
    if (!isStudioToken(token)) {
      return NextResponse.redirect(new URL("/studio/login", request.url));
    }
  }

  return NextResponse.next();
}

// Helper function to verify studio token
function isStudioToken(token: string): boolean {
  // Decode JWT and check if it contains studio/gym owner claims
  // Implementation depends on your JWT library
  return true; // Placeholder
}

// Configure which routes to run proxy on
export const config = {
  matcher: ["/app/:path*", "/studio/:path*"],
};
```

#### 2️⃣ Route Handlers (Independent Token Validation)

Each API route should validate tokens independently. **Never rely solely on proxy.**

```typescript
// app/api/protected/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("session");

  // Validate token independently
  if (!token || !isValidToken(token.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract user data from token
  const userData = await decodeToken(token.value);

  // Safe to proceed with authenticated request
  const db = await getDatabase();
  const data = await db.collection("users").findOne({ _id: userData.userId });

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("session");

  if (!token || !isValidToken(token.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  // Process authenticated request...

  return NextResponse.json({ success: true });
}

// Helper functions
async function isValidToken(token: string): Promise<boolean> {
  // Verify JWT signature and expiration
  // Implementation depends on your JWT library (jose, jsonwebtoken, etc.)
  return true; // Placeholder
}

async function decodeToken(token: string): Promise<any> {
  // Decode and return JWT payload
  return {}; // Placeholder
}
```

#### 3️⃣ Server Actions (Independent Token Validation)

Server Actions must also validate authentication independently.

```typescript
// app/actions.ts
"use server";

import { cookies } from "next/headers";
import { getDatabase } from "@/lib/utils/mongodb";

export async function sensitiveAction(formData: FormData) {
  // Get token from cookies
  const cookieStore = cookies();
  const token = cookieStore.get("session");

  // Validate token independently
  if (!token || !isValidToken(token.value)) {
    throw new Error("Unauthorized");
  }

  // Extract user data
  const userData = await decodeToken(token.value);

  // Safe to proceed with authenticated action
  const db = await getDatabase();
  await db.collection("bookings").insertOne({
    userId: userData.userId,
    // ... other fields
  });

  revalidatePath("/app/dashboard");
  return { success: true };
}

export async function createGym(formData: FormData) {
  const cookieStore = cookies();
  const token = cookieStore.get("session");

  // Validate studio token
  if (!token || !isValidStudioToken(token.value)) {
    throw new Error("Unauthorized - Studio access required");
  }

  const studioData = await decodeToken(token.value);

  // Safe to proceed with gym creation
  const db = await getDatabase();
  await db.collection("gyms").insertOne({
    ownerId: studioData.userId,
    name: formData.get("name"),
    // ... other fields
  });

  revalidatePath("/studio/dashboard");
  return { success: true };
}

// Helper functions
async function isValidToken(token: string): Promise<boolean> {
  // Verify JWT signature and expiration
  return true; // Placeholder
}

async function isValidStudioToken(token: string): Promise<boolean> {
  // Verify JWT and check for studio role claim
  return true; // Placeholder
}

async function decodeToken(token: string): Promise<any> {
  // Decode JWT payload
  return {}; // Placeholder
}
```

### Why Multi-Layer Authentication?

**Security Principle:** Defense in depth - never trust that earlier layers succeeded.

1. **Proxy redirects** are great for UX (immediate redirects) but can be bypassed
2. **Route handlers** protect API endpoints from direct calls
3. **Server Actions** protect server-side mutations from client-side manipulation

**Each layer validates tokens independently** to ensure security even if one layer fails.

### Authentication Utilities Location

Create reusable auth utilities in `src/lib/utils/auth.ts`:

```typescript
// src/lib/utils/auth.ts
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose"; // Recommended JWT library for Next.js

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key",
);

export interface UserToken {
  userId: string;
  phone: string;
  role: "user";
}

export interface StudioToken {
  userId: string;
  email: string;
  gymId?: string;
  role: "studio";
}

// Verify any token
export async function verifyToken(
  token: string,
): Promise<UserToken | StudioToken | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as UserToken | StudioToken;
  } catch (error) {
    return null;
  }
}

// Get current user from cookies
export async function getCurrentUser(): Promise<UserToken | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("session");

  if (!token) return null;

  const payload = await verifyToken(token.value);
  if (payload && payload.role === "user") {
    return payload as UserToken;
  }

  return null;
}

// Get current studio user from cookies
export async function getCurrentStudio(): Promise<StudioToken | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("session");

  if (!token) return null;

  const payload = await verifyToken(token.value);
  if (payload && payload.role === "studio") {
    return payload as StudioToken;
  }

  return null;
}

// Create user token
export async function createUserToken(user: {
  userId: string;
  phone: string;
}): Promise<string> {
  const token = await new SignJWT({
    userId: user.userId,
    phone: user.phone,
    role: "user",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(JWT_SECRET);

  return token;
}

// Create studio token
export async function createStudioToken(studio: {
  userId: string;
  email: string;
  gymId?: string;
}): Promise<string> {
  const token = await new SignJWT({
    userId: studio.userId,
    email: studio.email,
    gymId: studio.gymId,
    role: "studio",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(JWT_SECRET);

  return token;
}
```

### Example: Protected Page

```typescript
// app/app/dashboard/page.tsx
import { getCurrentUser } from "@/lib/utils/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Verify authentication in the page component
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Safe to render authenticated content
  return (
    <div>
      <h1>Welcome, {user.phone}</h1>
      {/* Dashboard content */}
    </div>
  );
}
```

### Example: Protected API Route

```typescript
// app/api/bookings/route.ts
import { getCurrentUser } from "@/lib/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch user's bookings
  const db = await getDatabase();
  const bookings = await db
    .collection("bookings")
    .find({ userId: user.userId })
    .toArray();

  return NextResponse.json({ bookings });
}
```

---

## Common MongoDB Queries

### Geospatial Queries (Find Nearby Gyms)

```typescript
const userLocation = [longitude, latitude]; // [lng, lat]

const nearbyGyms = await db
  .collection("gyms")
  .find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: userLocation,
        },
        $maxDistance: 5000, // 5km in meters
      },
    },
    isActive: true,
  })
  .toArray();
```

**Note:** Requires 2dsphere index on `location` field:

```typescript
await db.collection("gyms").createIndex({ location: "2dsphere" });
```

### Aggregation Pipeline (Gym Stats)

```typescript
const gymStats = await db
  .collection("bookings")
  .aggregate([
    { $match: { gymId: new ObjectId(gymId) } },
    {
      $group: {
        _id: "$gymId",
        totalBookings: { $sum: 1 },
        totalRevenue: { $sum: "$finalPrice" },
        averagePrice: { $avg: "$finalPrice" },
      },
    },
  ])
  .toArray();
```

---

## Error Handling

### Database Operations

```typescript
try {
  const db = await getDatabase();
  const result = await db.collection("gyms").insertOne(gym);
  return { success: true, id: result.insertedId };
} catch (error) {
  console.error("Database error:", error);
  return { success: false, error: "Failed to create gym" };
}
```

### API Routes

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validate input
    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Process request...
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
```

---

## Performance Optimization

### Image Optimization

```typescript
import Image from 'next/image';

// Always use Next.js Image component
<Image
  src={gym.logo}
  alt={gym.name}
  width={200}
  height={200}
  className="rounded-full"
  priority={isAboveFold}
/>
```

### Database Query Optimization

```typescript
// Use projection to return only needed fields
const gyms = await db
  .collection("gyms")
  .find({ isActive: true })
  .project({ name: 1, location: 1, logo: 1 }) // Only these fields
  .toArray();

// Use limit for pagination
const gyms = await db
  .collection("gyms")
  .find({})
  .skip((page - 1) * pageSize)
  .limit(pageSize)
  .toArray();
```

### Dynamic Imports

```typescript
// Lazy load heavy components
const HeavyMap = dynamic(() => import('@/components/HeavyMap'), {
  ssr: false,
  loading: () => <MapSkeleton />
});
```

---

## Key Business Logic

### Capacity Management

Before booking, check gym capacity:

```typescript
const gym = await db.collection("gyms").findOne({ _id: gymId });
if (gym.currentOccupancy >= gym.maxCapacity) {
  throw new Error("Gym is at full capacity");
}

// Increment occupancy on check-in
await db
  .collection("gyms")
  .updateOne({ _id: gymId }, { $inc: { currentOccupancy: 1 } });
```

### QR Code Generation

Each booking gets a unique QR code:

```typescript
import { randomBytes } from "crypto";

const qrCode = randomBytes(16).toString("hex");

await db.collection("bookings").insertOne({
  userId,
  gymId,
  qrCode,
  // ... other fields
});
```

### Pass Expiry Logic

Calculate end date based on pass type:

```typescript
const calculateEndDate = (
  startDate: Date,
  passType: "day" | "week" | "month",
): Date => {
  const endDate = new Date(startDate);

  switch (passType) {
    case "day":
      endDate.setDate(endDate.getDate() + 1);
      break;
    case "week":
      endDate.setDate(endDate.getDate() + 7);
      break;
    case "month":
      endDate.setMonth(endDate.getMonth() + 1);
      break;
  }

  return endDate;
};
```

---

## Code Generation Guidelines

### When Creating Components

1. **Determine if Server or Client Component**
   - Default to Server Component
   - Only add `'use client'` if interactivity needed

2. **Follow Naming Convention**
   - Components: PascalCase (`GymCard.tsx`)
   - Use descriptive names (`GymCard` not `Card`)

3. **Include TypeScript Types**
   - Always define Props interface
   - Use proper MongoDB types (ObjectId, Date)

4. **Apply Styling Standards**
   - Use Tailwind classes
   - Use `cn()` for conditional styles
   - Make components responsive (sm:, md:, lg: breakpoints)

### When Creating Pages

1. **Choose Correct Route Group**
   - Public content → `(website)`
   - User dashboard → `app`
   - Gym owner → `studio`

2. **Implement Authentication**
   - Protected routes need auth checks
   - Redirect unauthorized users

3. **Fetch Data Appropriately**
   - Server Components: Direct DB queries
   - Client Components: API routes

### When Creating API Routes

1. **Handle HTTP Methods**
   - Export `GET`, `POST`, `PUT`, `DELETE` as needed
   - Return proper HTTP status codes

2. **Validate Input**
   - Check required fields
   - Validate data types
   - Return 400 for bad requests

3. **Use Type-Safe Responses**
   - Return consistent JSON structure
   - Include error messages

---

## Feature Implementation Checklist

When implementing new features, ensure:

- [ ] Types defined in `src/lib/types/`
- [ ] Database collection schema documented
- [ ] Server Component vs Client Component decision made
- [ ] Route placed in correct group (`(website)`, `app`, `studio`)
- [ ] Error handling implemented
- [ ] Loading states added for async operations
- [ ] Responsive design (mobile-first)
- [ ] Images optimized (Next.js Image component)
- [ ] Authentication checked (if required)
- [ ] MongoDB indexes created (if querying)

---

## Common Pitfalls to Avoid

❌ **Don't** import `@styles/globals.css` (use `@/styles/globals.css`)  
✅ **Do** use configured path aliases with `@/`

❌ **Don't** create multiple MongoDB connections  
✅ **Do** use `getDatabase()` singleton

❌ **Don't** use `'use client'` unnecessarily  
✅ **Do** default to Server Components

❌ **Don't** hardcode environment variables in code  
✅ **Do** use `process.env.VARIABLE_NAME`

❌ **Don't** store sensitive data in client-side state  
✅ **Do** keep sensitive operations on server

❌ **Don't** upload files without validation  
✅ **Do** use `validateImageFile()` before R2 upload

❌ **Don't** forget to handle MongoDB ObjectId conversion  
✅ **Do** use `new ObjectId(id)` when querying by \_id

---

## Project-Specific Business Rules

### Booking Rules

1. Users can't book if gym is at capacity
2. QR codes are single-use per check-in (for day passes)
3. Active passes prevent booking duplicate passes for same gym
4. Passes expire at midnight of end date

### Capacity Rules

1. Current occupancy decrements on checkout (if tracked)
2. Day passes count toward capacity
3. Monthly members have priority access
4. Capacity checks happen before payment

### Routine Sharing Rules

1. Private routines only visible to owner
2. Public routines appear in social feed
3. Users can copy others' routines to their library
4. Original creator always credited

### Review Rules

1. Users can only review gyms they've visited
2. One review per user per gym
3. Gym owners can respond to reviews
4. Rating affects gym's average rating immediately

---

## Development Workflow

### Before Starting New Feature

1. Check if similar pattern exists in codebase
2. Determine which route group it belongs to
3. Plan database schema (if new collection needed)
4. Identify if Server or Client Component

### Code Review Focus

- Type safety (no `any` types)
- Error handling (try-catch blocks)
- Performance (avoid N+1 queries)
- Security (input validation, auth checks)
- Accessibility (semantic HTML, ARIA labels)

---

## Quick Reference

### Import Patterns

```typescript
// Database
import { getDatabase } from "@/lib/utils/mongodb";
import { ObjectId } from "mongodb";

// Storage
import { uploadFile, deleteFile, validateImageFile } from "@/lib/utils/r2";

// Utilities
import { cn } from "@/lib/utils";

// Components
import { Button } from "@/components/ui/button";

// Next.js
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
```

### Environment Variables Reference

```env
# MongoDB
MONGODB_URI
MONGODB_DB_NAME

# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_ACCESS_KEY_ID
CLOUDFLARE_SECRET_ACCESS_KEY
CLOUDFLARE_BUCKET_NAME
CLOUDFLARE_PUBLIC_URL

# Add as features are implemented:
# NEXTAUTH_URL, STRIPE_SECRET_KEY, TWILIO_AUTH_TOKEN, etc.
```

---

## Remember

This is a **gym service broker platform** - the goal is to:

1. Make it easy for users to discover and book gyms
2. Keep users engaged with social features and routines
3. Give gym owners simple but powerful management tools
4. Use phone as digital identity (no physical cards)
5. Real-time capacity management to prevent overcrowding

Always prioritize user experience, performance, and type safety in your implementations.
