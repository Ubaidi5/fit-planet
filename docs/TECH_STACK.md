# Fit Planet - Technical Stack Documentation

## Project Overview

**Fit Planet** is a Next.js 16 full-stack application serving as a gym service broker platform. The application has three distinct areas:

- **Public Website** (`(website)` route) - Marketing pages, gym discovery, and public content
- **User Dashboard** (`/app` route) - Authenticated user area for bookings, routines, and personal data
- **Studio Portal** (`/studio` route) - Gym owner management dashboard

---

## Core Technologies

### Framework & Runtime

| Technology     | Version | Purpose                                        |
| -------------- | ------- | ---------------------------------------------- |
| **Next.js**    | 16.1.4  | App Router, Server Components, API Routes      |
| **React**      | 19.2.3  | UI library with new React Compiler             |
| **React DOM**  | 19.2.3  | React rendering                                |
| **TypeScript** | ^5.x    | Type safety and developer experience           |
| **Bun**        | Latest  | Package manager and runtime (bun.lock present) |

**Key Features Enabled:**

- ✅ React Compiler via `babel-plugin-react-compiler@1.0.0`
- ✅ App Router (Next.js 13+ architecture)
- ✅ Server Actions and Server Components
- ✅ Turbopack for faster builds

### Styling

| Technology              | Version | Purpose                              |
| ----------------------- | ------- | ------------------------------------ |
| **Tailwind CSS**        | v4      | Utility-first CSS framework          |
| **PostCSS**             | Latest  | CSS processing with Tailwind         |
| **tailwindcss-animate** | -       | Animation utilities                  |
| **clsx**                | -       | Conditional class names              |
| **tailwind-merge**      | -       | Merge Tailwind classes intelligently |

**Styling Approach:**

- Tailwind v4 with new `@import "tailwindcss"` syntax in `globals.css`
- CSS custom properties for theming (`--background`, `--foreground`)
- Dark mode support via `prefers-color-scheme`
- Component-scoped styles via CSS modules (when needed)

### Database

| Technology           | Version | Purpose                         |
| -------------------- | ------- | ------------------------------- |
| **MongoDB**          | Latest  | Primary database (NoSQL)        |
| **mongodb** (driver) | Latest  | Official Node.js MongoDB driver |

**Why MongoDB:**

- Flexible schema for evolving features
- Excellent for nested documents (gyms with amenities, routines with exercises)
- Horizontal scalability
- Native JSON support
- Geospatial queries for location-based gym discovery

### File Storage

| Technology             | Purpose                              |
| ---------------------- | ------------------------------------ |
| **Cloudflare R2**      | Object storage for images and videos |
| **AWS SDK (S3Client)** | R2 is S3-compatible, using AWS SDK   |

**Why Cloudflare R2:**

- Zero egress fees (unlike AWS S3)
- S3-compatible API
- Global CDN distribution
- Cost-effective for media-heavy app

---

## Project Structure

```
fit-planet/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout (Inter font, metadata)
│   │   ├── page.tsx              # Homepage
│   │   │
│   │   ├── (website)/            # Route group for public pages
│   │   │   ├── layout.tsx        # Website-specific layout
│   │   │   ├── page.tsx          # Landing page (/)
│   │   │   ├── gyms/             # Gym listing and details
│   │   │   │   ├── page.tsx      # All gyms listing
│   │   │   │   └── [id]/         # Dynamic gym profile
│   │   │   ├── about/            # About page
│   │   │   └── contact/          # Contact page
│   │   │
│   │   ├── app/                  # Route group for authenticated users
│   │   │   ├── layout.tsx        # User dashboard layout
│   │   │   ├── dashboard/        # User personal dashboard
│   │   │   ├── passes/           # My passes (active, history)
│   │   │   ├── routines/         # Workout routines
│   │   │   ├── social/           # Social feed and friends
│   │   │   ├── bookings/         # Booking management
│   │   │   └── profile/          # User profile settings
│   │   │
│   │   └── studio/               # Route group for gym owners
│   │       ├── layout.tsx        # Studio layout
│   │       ├── login/            # Studio authentication
│   │       ├── register/         # Studio registration
│   │       ├── dashboard/        # Studio dashboard
│   │       ├── profile/          # Gym profile management
│   │       ├── passes/           # Pass configuration
│   │       ├── capacity/         # Capacity management
│   │       ├── bookings/         # Booking management
│   │       ├── members/          # Member management
│   │       ├── promotions/       # Promotions & offers
│   │       └── analytics/        # Analytics & reports
│   │
│   ├── components/               # React components
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── website/              # Website-specific components
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── gym-card.tsx
│   │   │   └── ...
│   │   ├── dashboard/            # User dashboard components
│   │   │   ├── pass-card.tsx
│   │   │   ├── routine-builder.tsx
│   │   │   └── ...
│   │   └── studio/               # Studio portal components
│   │       ├── stats-card.tsx
│   │       ├── check-in-scanner.tsx
│   │       └── ...
│   │
│   ├── lib/                      # Core utilities and configurations
│   │   ├── db/                   # Database layer
│   │   │   ├── models/           # MongoDB collections/models
│   │   │   │   ├── user.ts
│   │   │   │   ├── gym.ts
│   │   │   │   ├── booking.ts
│   │   │   │   ├── pass.ts
│   │   │   │   ├── routine.ts
│   │   │   │   └── ...
│   │   │   └── queries/          # Database query functions
│   │   │       ├── gyms.ts
│   │   │       ├── bookings.ts
│   │   │       └── ...
│   │   │
│   │   ├── utils/                # Utility functions
│   │   │   ├── index.ts          # General utilities (cn, etc.)
│   │   │   ├── mongodb.ts        # MongoDB connection singleton
│   │   │   ├── r2.ts             # Cloudflare R2 utilities
│   │   │   ├── auth.ts           # Authentication helpers
│   │   │   ├── validation.ts     # Input validation
│   │   │   └── ...
│   │   │
│   │   └── types/                # TypeScript type definitions
│   │       ├── index.ts          # Global types
│   │       ├── gym.ts
│   │       ├── user.ts
│   │       ├── booking.ts
│   │       └── ...
│   │
│   ├── services/                 # Business logic layer
│   │   ├── mongodb.ts            # High-level MongoDB services
│   │   ├── auth-service.ts       # Authentication service
│   │   ├── booking-service.ts    # Booking logic
│   │   ├── payment-service.ts    # Payment processing
│   │   ├── notification-service.ts # Notifications
│   │   └── ...
│   │
│   └── styles/
│       └── globals.css           # Global styles (Tailwind imports)
│
├── public/                       # Static assets
│   ├── assets/
│   │   └── images/
│   ├── favicon.ico
│   └── ...
│
├── docs/                         # Documentation
│   ├── PRODUCT_FEATURES.md       # Product features documentation
│   ├── TECH_STACK.md             # This file
│   └── API.md                    # API documentation (future)
│
├── .github/
│   └── copilot-instructions.md   # GitHub Copilot instructions
│
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── postcss.config.mjs            # PostCSS configuration
├── package.json                  # Dependencies
└── README.md                     # Project README
```

---

## Route Architecture

### Route Groups Explained

Next.js 13+ uses route groups (folders in parentheses) to organize routes without affecting the URL structure.

#### 1. `(website)` - Public Website Routes

**URL Pattern:** `/*` (no `/website` in URL)

**Purpose:** Public-facing pages for gym discovery and information

**Pages:**

- `/` - Landing page
- `/gyms` - Gym listing with search/filters
- `/gyms/[id]` - Individual gym profile page
- `/about` - About Fit Planet
- `/contact` - Contact page
- `/pricing` - Platform pricing info (future)

**Layout:** `src/app/(website)/layout.tsx`

- Public navbar with search
- Footer
- No authentication required

---

#### 2. `/app` - User Dashboard Routes

**URL Pattern:** `/app/*`

**Purpose:** Authenticated user area for managing bookings, routines, and profile

**Pages:**

- `/app/dashboard` - User dashboard overview
- `/app/passes` - Active and past gym passes
- `/app/bookings` - Booking management
- `/app/routines` - Workout routine builder and library
- `/app/social` - Social feed and friends
- `/app/profile` - User profile and settings

**Layout:** `src/app/app/layout.tsx`

- User dashboard sidebar/navigation
- Requires authentication
- Redirect to login if not authenticated

---

#### 3. `/studio` - Gym Owner Portal Routes

**URL Pattern:** `/studio/*`

**Purpose:** Gym owner management dashboard

**Pages:**

- `/studio/login` - Studio authentication
- `/studio/register` - Gym owner registration
- `/studio/dashboard` - Studio dashboard overview
- `/studio/profile` - Gym profile management
- `/studio/passes` - Pass type and pricing configuration
- `/studio/capacity` - Capacity and slot management
- `/studio/bookings` - View and manage bookings
- `/studio/members` - Member check-in and management
- `/studio/promotions` - Create promotional offers
- `/studio/analytics` - Revenue and analytics reports

**Layout:** `src/app/studio/layout.tsx`

- Studio sidebar navigation
- Requires gym owner authentication
- Redirect to studio login if not authenticated

---

## Database Architecture

### MongoDB Connection Pattern

**File:** `src/lib/utils/mongodb.ts`

**Pattern:** Singleton with global caching for development

```typescript
// Simplified pattern
let cachedClient: MongoClient | null = null;

export async function getDatabase(): Promise<Db> {
  if (process.env.NODE_ENV === "development") {
    // Use global variable to prevent multiple connections during hot reload
    if (!global._mongoClient) {
      global._mongoClient = new MongoClient(uri);
    }
    cachedClient = global._mongoClient;
  } else {
    // Production: fresh client
    cachedClient = new MongoClient(uri);
  }

  return cachedClient.db(dbName);
}
```

**Environment Variables Required:**

- `MONGODB_URI` or `MONGODB_CONNECTION_STRING` - Full MongoDB connection string
- `MONGODB_DB_NAME` - Database name (e.g., "fitplanet")

**Connection Configuration:**

- Server API Version: 1
- Strict mode: Enabled
- Deprecation errors: Enabled
- Max pool size: 10
- Min pool size: 2
- Max idle time: 30000ms

---

### Collections Schema

#### Users Collection (`users`)

```typescript
interface User {
  _id: ObjectId;
  phone: string; // Primary identifier (unique)
  name: string;
  email?: string;
  avatar?: string; // R2 URL
  createdAt: Date;
  updatedAt: Date;

  // Profile
  bio?: string;
  location?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };

  // Preferences
  favoriteGyms: ObjectId[]; // Array of gym IDs
  friends: ObjectId[]; // Array of user IDs
  notificationSettings: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };

  // Stats
  totalWorkouts: number;
  currentStreak: number;
  longestStreak: number;
}
```

#### Gyms Collection (`gyms`)

```typescript
interface Gym {
  _id: ObjectId;
  ownerId: ObjectId; // Reference to User (studio account)

  // Basic Info
  name: string;
  slug: string; // URL-friendly name
  description: string;
  logo?: string; // R2 URL

  // Location
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };

  // Contact
  phone: string;
  email: string;
  website?: string;

  // Media
  photos: string[]; // R2 URLs
  videoTourUrl?: string;

  // Operating Hours
  hours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    // ... other days
  };

  // Amenities
  amenities: string[]; // ['pool', 'sauna', 'parking', ...]
  equipmentTypes: string[]; // ['cardio', 'strength', 'functional', ...]

  // Capacity
  maxCapacity: number; // Max people at once
  currentOccupancy: number; // Real-time count

  // Pricing (base prices, can be overridden in Pass documents)
  dayPassPrice: number;
  weekPassPrice: number;
  monthPassPrice: number;

  // Stats
  totalBookings: number;
  averageRating: number;
  totalReviews: number;

  // Status
  isActive: boolean;
  isVerified: boolean;

  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**

- `location` (2dsphere) - Geospatial queries
- `slug` (unique) - Fast lookups by slug
- `ownerId` - Find gyms by owner
- `isActive` - Filter active gyms

#### Bookings Collection (`bookings`)

```typescript
interface Booking {
  _id: ObjectId;
  userId: ObjectId;
  gymId: ObjectId;

  // Pass Details
  passType: "day" | "week" | "month";
  startDate: Date;
  endDate: Date;

  // Pricing
  price: number;
  discount: number;
  finalPrice: number;
  currency: string;

  // Payment
  paymentId: string; // Stripe payment ID
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: string;

  // Pass
  qrCode: string; // Unique QR code for entry
  isActive: boolean;

  // Check-ins
  checkIns: {
    timestamp: Date;
    method: "qr" | "manual";
  }[];

  // Status
  status: "active" | "expired" | "cancelled" | "refunded";

  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**

- `userId` - Find user's bookings
- `gymId` - Find gym's bookings
- `status` - Filter active bookings
- `startDate, endDate` - Date range queries

#### Routines Collection (`routines`)

```typescript
interface Routine {
  _id: ObjectId;
  userId: ObjectId;

  // Routine Info
  name: string;
  description?: string;
  tags: string[]; // ['legs', 'strength', 'beginner']

  // Exercises
  exercises: {
    exerciseId: ObjectId; // Reference to Exercises collection
    order: number;
    sets: number;
    reps: number;
    weight?: number;
    restTime?: number; // Seconds
    notes?: string;
  }[];

  // Sharing
  isPublic: boolean;
  sharedWith: ObjectId[]; // Array of user IDs (private shares)

  // Stats
  timesCompleted: number;
  likes: ObjectId[]; // Array of user IDs who liked

  createdAt: Date;
  updatedAt: Date;
}
```

#### Exercises Collection (`exercises`)

```typescript
interface Exercise {
  _id: ObjectId;
  name: string;
  description: string;
  muscleGroups: string[]; // ['chest', 'triceps']
  difficulty: "beginner" | "intermediate" | "advanced";
  equipmentRequired: string[]; // ['barbell', 'bench']
  videoUrl?: string;
  thumbnailUrl?: string;
  instructions: string[];
}
```

#### Reviews Collection (`reviews`)

```typescript
interface Review {
  _id: ObjectId;
  userId: ObjectId;
  gymId: ObjectId;

  // Rating
  overallRating: number; // 1-5
  categoryRatings: {
    cleanliness: number;
    equipment: number;
    staff: number;
    value: number;
  };

  // Review Content
  title?: string;
  comment: string;
  photos: string[]; // R2 URLs

  // Interaction
  helpful: ObjectId[]; // Users who found helpful
  ownerResponse?: {
    text: string;
    timestamp: Date;
  };

  createdAt: Date;
  updatedAt: Date;
}
```

---

## Cloudflare R2 Storage

### Configuration

**File:** `src/lib/utils/r2.ts`

**Environment Variables Required:**

- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
- `CLOUDFLARE_ACCESS_KEY_ID` - R2 access key ID
- `CLOUDFLARE_SECRET_ACCESS_KEY` - R2 secret access key
- `CLOUDFLARE_BUCKET_NAME` - R2 bucket name (e.g., "fitplanet-media")
- `CLOUDFLARE_PUBLIC_URL` - Public URL for accessing files

**Setup Pattern:**

```typescript
import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: CLOUDFLARE_SECRET_ACCESS_KEY,
  },
});
```

### Available Functions

#### 1. `uploadFile(file: File, folder?: string)`

Uploads file to R2 with automatic timestamp prefix

**Usage:**

```typescript
import { uploadFile } from "@/lib/utils/r2";

const file = formData.get("file") as File;
const url = await uploadFile(file, "gym-photos");
// Returns: https://cdn.fitplanet.com/gym-photos/1234567890-image.jpg
```

#### 2. `deleteFile(url: string)`

Deletes file from R2 by extracting key from URL

**Usage:**

```typescript
import { deleteFile } from "@/lib/utils/r2";

await deleteFile("https://cdn.fitplanet.com/gym-photos/1234567890-image.jpg");
```

#### 3. `getPublicUrl(key: string)`

Constructs public URL for a given R2 key

**Usage:**

```typescript
import { getPublicUrl } from "@/lib/utils/r2";

const url = getPublicUrl("gym-photos/1234567890-image.jpg");
// Returns: https://cdn.fitplanet.com/gym-photos/1234567890-image.jpg
```

#### 4. `validateImageFile(file: File, maxSizeMB?: number)`

Validates image files before upload

**Usage:**

```typescript
import { validateImageFile } from "@/lib/utils/r2";

const file = formData.get("file") as File;
const validation = validateImageFile(file, 5); // 5MB max

if (!validation.valid) {
  return { error: validation.error };
}
```

**Supported Formats:** JPEG, PNG, GIF, SVG, WebP
**Default Max Size:** 1MB (configurable)

---

## Authentication Strategy

### User Authentication (End Users)

- **Method:** Phone number with OTP verification
- **Library:** NextAuth.js or custom implementation
- **Flow:**
  1. User enters phone number
  2. OTP sent via SMS (Twilio/similar)
  3. User enters OTP
  4. Session created with JWT
  5. Redirect to `/app/dashboard`

### Gym Owner Authentication (Studio)

- **Method:** Email/password with optional 2FA
- **Library:** NextAuth.js or custom implementation
- **Flow:**
  1. Owner enters email/password
  2. Credentials verified against database
  3. Session created with JWT (includes gym ownership data)
  4. Redirect to `/studio/dashboard`

### Session Management

- JWT tokens stored in HTTP-only cookies
- Refresh token rotation
- Multi-device support
- Auto-logout after inactivity (30 minutes)

---

## API Routes Structure

Next.js App Router uses route handlers in `route.ts` files.

### API Endpoints

```
src/app/api/
├── auth/
│   ├── login/route.ts            # POST - User login
│   ├── register/route.ts         # POST - User registration
│   ├── otp/route.ts              # POST - Send OTP
│   └── verify-otp/route.ts       # POST - Verify OTP
│
├── studio/
│   ├── auth/
│   │   ├── login/route.ts        # POST - Studio login
│   │   └── register/route.ts     # POST - Studio registration
│   │
│   ├── gyms/
│   │   ├── route.ts              # GET, POST - List/create gyms
│   │   └── [id]/route.ts         # GET, PUT, DELETE - Gym details
│   │
│   ├── bookings/
│   │   └── route.ts              # GET - Studio's bookings
│   │
│   └── check-in/route.ts         # POST - Check-in member
│
├── gyms/
│   ├── route.ts                  # GET - List gyms (with filters)
│   ├── [id]/route.ts             # GET - Gym details
│   └── search/route.ts           # GET - Search gyms (location-based)
│
├── bookings/
│   ├── route.ts                  # GET, POST - User's bookings
│   └── [id]/
│       ├── route.ts              # GET, PUT, DELETE - Booking details
│       └── cancel/route.ts       # POST - Cancel booking
│
├── routines/
│   ├── route.ts                  # GET, POST - List/create routines
│   └── [id]/route.ts             # GET, PUT, DELETE - Routine details
│
├── reviews/
│   ├── route.ts                  # POST - Create review
│   └── [id]/route.ts             # PUT, DELETE - Update/delete review
│
└── payments/
    ├── create-intent/route.ts    # POST - Create payment intent
    └── webhook/route.ts          # POST - Payment webhook
```

---

## Development Workflow

### Environment Setup

**Required Environment Variables:**

```env
# MongoDB
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=fitplanet

# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_ACCESS_KEY_ID=...
CLOUDFLARE_SECRET_ACCESS_KEY=...
CLOUDFLARE_BUCKET_NAME=fitplanet-media
CLOUDFLARE_PUBLIC_URL=https://cdn.fitplanet.com

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...

# Payment (Stripe)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SMS (Twilio)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
```

### Commands

```bash
# Development
bun dev                    # Start dev server (port 3000)

# Build
bun run build             # Production build
bun start                 # Start production server

# Linting & Formatting
bun run lint              # Run ESLint
bun run format            # Format with Prettier (if configured)

# Database
bun run db:seed           # Seed database with sample data (custom script)
```

---

## Coding Standards & Conventions

### File Naming

- **Components:** PascalCase (`GymCard.tsx`, `UserDashboard.tsx`)
- **Utilities:** camelCase (`mongodb.ts`, `auth-helpers.ts`)
- **Pages:** lowercase with hyphens (`gym-details`, `user-profile`)
- **Types:** PascalCase (`User.ts`, `Booking.ts`)

### Component Structure

```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface GymCardProps {
  gym: Gym;
  onBook: (gymId: string) => void;
}

// 3. Component
export function GymCard({ gym, onBook }: GymCardProps) {
  // Hooks
  const [isLiked, setIsLiked] = useState(false);

  // Handlers
  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  // Render
  return (
    <div className="rounded-lg border p-4">
      {/* Component JSX */}
    </div>
  );
}
```

### TypeScript Best Practices

- Use interfaces for object shapes
- Use type aliases for unions/primitives
- Avoid `any` - use `unknown` if type is truly unknown
- Use strict mode (enabled in `tsconfig.json`)
- Export types from centralized location (`src/lib/types/`)

### CSS/Tailwind Best Practices

- Use `cn()` utility for conditional classes

  ```typescript
  import { cn } from '@/lib/utils';

  className={cn(
    "base-class",
    isActive && "active-class",
    className // Allow prop overrides
  )}
  ```

- Extract repeated patterns into components
- Use CSS variables for theming (defined in `globals.css`)
- Prefer Tailwind utilities over custom CSS

### MongoDB Query Patterns

- Always use connection from `getDatabase()` function
- Create reusable query functions in `src/lib/db/queries/`
- Use TypeScript generics for type-safe queries
- Handle errors gracefully with try-catch
- Close cursors after reading data

**Example:**

```typescript
import { getDatabase } from "@/lib/utils/mongodb";
import type { Gym } from "@/lib/types";

export async function getGymById(id: string): Promise<Gym | null> {
  try {
    const db = await getDatabase();
    const gym = await db
      .collection<Gym>("gyms")
      .findOne({ _id: new ObjectId(id) });
    return gym;
  } catch (error) {
    console.error("Error fetching gym:", error);
    return null;
  }
}
```

### Server Component vs Client Component

- **Use Server Components (default) for:**
  - Data fetching from database
  - Accessing backend resources
  - Keeping sensitive information on server
  - Reducing client-side JavaScript

- **Use Client Components (`'use client'`) for:**
  - Interactivity (useState, useEffect, event handlers)
  - Browser-only APIs (localStorage, geolocation)
  - Custom hooks
  - Third-party libraries requiring browser environment

---

## Performance Optimization

### Image Optimization

- Use Next.js `<Image>` component for automatic optimization
- Upload images to R2 in multiple sizes (thumbnail, medium, full)
- Lazy load images below the fold
- Use WebP format with JPEG fallback

### Database Optimization

- Create indexes on frequently queried fields
- Use projection to return only needed fields
- Implement pagination for large result sets
- Cache frequently accessed data (Redis in future)

### Bundle Optimization

- Dynamic imports for large components
- Route-based code splitting (automatic with App Router)
- Tree-shake unused code
- Analyze bundle with `@next/bundle-analyzer`

---

## Security Best Practices

### Input Validation

- Validate all user inputs on server side
- Use Zod or similar for schema validation
- Sanitize inputs before database queries
- Rate limit API endpoints

### Authentication Security

- Hash passwords with bcrypt (min 12 rounds)
- Use HTTPS only (enforce in production)
- Implement CSRF protection
- Rotate JWT tokens
- Implement account lockout after failed attempts

### Database Security

- Use environment variables for credentials
- Never expose connection strings to client
- Implement role-based access control
- Sanitize inputs to prevent NoSQL injection
- Regular backups

### R2 Security

- Use signed URLs for private uploads
- Validate file types and sizes
- Scan uploads for malware (future)
- Set CORS policies correctly
- Use separate buckets for public/private files

---

## Testing Strategy

### Unit Tests

- Test utility functions in isolation
- Test database query functions with mock data
- Test validation functions

### Integration Tests

- Test API routes end-to-end
- Test authentication flows
- Test payment processing

### E2E Tests

- Test critical user journeys (booking a gym)
- Test studio dashboard functionality
- Test across different devices/browsers

**Testing Tools (to be implemented):**

- Jest for unit tests
- React Testing Library for component tests
- Playwright for E2E tests

---

## Deployment

### Production Checklist

- [ ] Set all environment variables
- [ ] Configure MongoDB Atlas production cluster
- [ ] Set up Cloudflare R2 production bucket
- [ ] Configure domain and SSL certificate
- [ ] Set up Stripe production keys
- [ ] Enable analytics (Vercel Analytics, Google Analytics)
- [ ] Set up error tracking (Sentry)
- [ ] Configure CDN caching rules
- [ ] Set up monitoring and alerts
- [ ] Database backup automation

### Recommended Hosting

- **Frontend/Backend:** Vercel (optimized for Next.js)
- **Database:** MongoDB Atlas (managed MongoDB)
- **Storage:** Cloudflare R2
- **CDN:** Cloudflare (integrated with R2)

---

## Monitoring & Analytics

### Application Monitoring

- **Error Tracking:** Sentry or similar
- **Performance Monitoring:** Vercel Analytics
- **Uptime Monitoring:** UptimeRobot or Pingdom

### User Analytics

- **User Behavior:** Google Analytics or Mixpanel
- **Conversion Tracking:** Track gym bookings, sign-ups
- **Heat Maps:** Hotjar (optional)

### Business Metrics

- Total bookings per day/week/month
- Revenue tracking
- User retention rates
- Gym owner adoption rate
- Average transaction value

---

## Future Technical Enhancements

### Phase 2

- **Redis Caching** - Cache frequently accessed data
- **Elasticsearch** - Advanced gym search with fuzzy matching
- **WebSockets** - Real-time capacity updates
- **Push Notifications** - FCM integration for mobile
- **Payment Splits** - Support for group bookings with split payments

### Phase 3

- **Mobile Apps** - React Native apps for iOS/Android
- **Offline Mode** - Service workers for offline pass access
- **Multi-Language** - i18n support for localization
- **Advanced Analytics** - Custom analytics dashboard for gym owners
- **AI Recommendations** - ML-based gym and routine recommendations

---

## Useful Resources

### Documentation

- [Next.js 15+ Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev/)
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)

### Tools

- [MongoDB Compass](https://www.mongodb.com/products/compass) - GUI for MongoDB
- [Postman](https://www.postman.com/) - API testing
- [React DevTools](https://react.dev/learn/react-developer-tools)

---

## Contributing Guidelines

### Git Workflow

- Create feature branches from `main`
- Use descriptive branch names (`feature/gym-search`, `fix/booking-bug`)
- Write clear commit messages
- Squash commits before merging
- Code review required before merging to `main`

### Commit Message Format

```
type(scope): description

[optional body]
[optional footer]
```

**Types:** feat, fix, docs, style, refactor, test, chore

**Example:**

```
feat(booking): add capacity check before booking

- Check real-time gym capacity
- Prevent overbooking
- Show waitlist option if full

Closes #123
```

---

## Support & Contact

For technical questions or issues, contact the development team.

**Last Updated:** January 26, 2026
