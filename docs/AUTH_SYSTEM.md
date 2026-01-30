# Fit Planet - Authentication System

## Overview

Complete phone-based authentication system using NextAuth v5 with MongoDB.

## Features

- ✅ Phone number authentication with OTP
- ✅ User registration with profile data
- ✅ MongoDB integration
- ✅ Protected routes with middleware
- ✅ Session management (30 days)
- ✅ Hardcoded OTP for development: **123456**

## Setup

### 1. Environment Variables

Create `.env.local` file with:

```env
# Authentication
AUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# MongoDB
DB_URI=mongodb+srv://your-connection-string
DB_NAME=fitplanet
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Run Development Server

```bash
bun dev
```

## Database Schema

### Users Collection

```typescript
{
  _id: ObjectId,
  fullName: string,
  email: string,
  phone: string,         // Format: +923001234567
  gender?: string,       // "male" | "female" | "other"
  dateOfBirth?: string,
  createdAt: Date,
  updatedAt: Date
}
```

## Usage

### Registration Flow

1. Go to `/app/register`
2. Enter: Full Name, Email, Gender (optional), DOB (optional)
3. Accept terms & click "Continue"
4. Enter phone number (Pakistani format)
5. Click "Send Verification Code"
6. Enter OTP: **123456**
7. Click "Complete Registration"
8. Auto-login → Redirect to `/app/dashboard`

### Login Flow

1. Go to `/app/login`
2. Enter phone number
3. Click "Get OTP"
4. Console shows: `"OTP sent successfully. Use: 123456"`
5. Enter OTP: **123456**
6. Click "Verify & Login"
7. Redirect to `/app/dashboard`

## API Endpoints

### POST `/api/auth/register`

Register new user

**Request:**

```json
{
  "fullName": "Muhammad Ali",
  "email": "ali@example.com",
  "phone": "03001234567",
  "gender": "male",
  "dateOfBirth": "1990-01-01"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": "507f1f77bcf86cd799439011"
}
```

### POST `/api/auth/send-otp`

Send OTP to phone (hardcoded: 123456)

**Request:**

```json
{
  "phone": "+923001234567"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "otp": "123456"
}
```

## Protected Routes

All `/app/*` routes are protected except:

- `/app/login`
- `/app/register`

Unauthorized users are redirected to `/app/login`.

## File Structure

```
src/
├── lib/
│   ├── auth.ts                      # NextAuth configuration
│   └── utils/
│       └── mongodb.ts               # MongoDB connection
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/       # NextAuth handler
│   │       ├── register/            # User registration
│   │       └── send-otp/            # OTP generation
│   └── app/
│       ├── login/                   # Login page
│       ├── register/                # Registration page
│       └── dashboard/               # Protected dashboard
├── types/
│   └── next-auth.d.ts              # NextAuth TypeScript types
└── middleware.ts                    # Route protection
```

## Development Notes

### Hardcoded OTP

- Current OTP: **123456**
- Shown in console during development
- Located in: `src/lib/auth.ts` (line 26)

### Phone Number Format

- Accepts: `03001234567` or `+923001234567`
- Auto-formats to: `+923001234567`
- Regex: `/^(\+92|0)?3[0-9]{9}$/`

### Session

- Strategy: JWT
- Duration: 30 days
- Storage: HTTP-only cookies

## Production Checklist

Before deploying:

1. **Replace hardcoded OTP**
   - Integrate SMS service (Twilio, etc.)
   - Update `src/lib/auth.ts` line 26
   - Update `src/app/api/auth/send-otp/route.ts`

2. **Secure AUTH_SECRET**
   - Generate: `openssl rand -base64 32`
   - Set in production environment

3. **Enable HTTPS**
   - Required for secure cookies
   - Configure in hosting platform

4. **Add rate limiting**
   - Limit OTP requests per phone
   - Prevent spam/abuse

5. **Add phone verification**
   - Verify user owns the number
   - Prevent fake registrations

## Troubleshooting

### "Invalid OTP"

- Make sure you're entering: **123456**
- Check console for OTP confirmation

### "User already exists"

- Phone or email already registered
- Try logging in instead

### "Invalid phone number"

- Use Pakistani format: 03001234567
- Or international: +923001234567

### Session not persisting

- Check AUTH_SECRET in .env.local
- Clear cookies and try again

## Support

For issues or questions:

- Check MongoDB connection (DB_URI, DB_NAME)
- Verify all environment variables are set
- Check browser console for errors

---

**Status:** ✅ Production Ready (after OTP integration)
