# Fit Planet - Product Features Documentation

## Overview

**Fit Planet** is a gym service broker platform that connects fitness seekers with gyms in their area. Similar to how insurance brokers connect customers with insurance providers, Fit Planet eliminates the friction of finding and joining gyms by providing a centralized platform where:

- **Customers** can discover gyms, compare plans, book passes instantly, and stay engaged with workout routines and social features
- **Gym Owners** can manage their business operations, control capacity, create promotional offers, and reach more customers without building their own technology infrastructure

The platform addresses the core problem that most gyms don't have online presence, making it hard for potential members to discover them and understand their offerings. It also tackles the engagement problem where members lose interest after the first month by providing continuous interaction through workout routine sharing and social coordination.

---

## User Types

### 1. End Users (Gym Members/Seekers)

People looking for gyms, wanting to maintain fitness routines, and seeking social accountability.

### 2. Gym Owners

Business owners who manage gyms and want a simple platform to handle operations, capacity, and promotions.

### 3. Platform Admin (Future)

System administrators who manage the overall platform, handle disputes, and oversee operations.

---

## Feature Modules

## 🏋️ End User Features

### Module 1: Gym Discovery & Search

**Problem Solved:** Users don't know what gyms exist in their area or what they offer.

**Features:**

- **Location-Based Search** - Find gyms near current location or by entering address
- **Interactive Map View** - See all gyms on a map with markers showing availability
- **Advanced Filters:**
  - Distance radius (0.5km, 1km, 5km, 10km)
  - Price range (day pass, weekly, monthly)
  - Amenities (pool, sauna, personal training, group classes, parking, showers, lockers)
  - Equipment types (cardio, strength, functional, martial arts)
  - Operating hours (24/7, morning only, evening only)
  - Rating and reviews
  - Real-time availability
- **Gym Listings** - Card-based grid view with photos, ratings, pricing, distance
- **Search History** - Save favorite searches and set up notifications for matching gyms

**User Journey:**

1. User opens website/app → enters location or allows GPS
2. Sees nearby gyms on map/list with availability indicators
3. Applies filters to narrow down options
4. Clicks on gym card to view full profile

---

### Module 2: Gym Profile Pages

**Problem Solved:** Users can't get detailed information about a gym before visiting.

**Features:**

- **Photo Gallery** - Multiple images of equipment, facilities, trainers
- **Video Tours** - Virtual walkthrough of the gym
- **Facility Information:**
  - Operating hours (with daily/weekly variations)
  - Available equipment list with quantities
  - Amenities and services
  - Locker and parking availability
  - Safety protocols and cleanliness standards
- **Pricing Plans:**
  - Day pass pricing
  - Week pass pricing
  - Monthly subscriptions
  - Annual memberships
  - Special packages (off-peak hours, student discounts)
- **Additional Services:**
  - Personal training (with trainer profiles)
  - Group classes schedule
  - Nutrition counseling
  - Workshops and events
- **Reviews & Ratings:**
  - Overall rating (out of 5)
  - Breakdown by categories (cleanliness, equipment, staff, value)
  - Verified member reviews with photos
  - Response from gym owners
- **Real-Time Capacity:**
  - Current occupancy (e.g., "25 of 50 spots filled")
  - Predicted busy hours
  - Historical crowd patterns
- **Location & Directions:**
  - Google Maps integration
  - Transit options
  - Parking information

---

### Module 3: Pass Booking System

**Problem Solved:** Complicated sign-up processes and paperwork prevent people from trying gyms.

**Features:**

- **Instant Booking:**
  - Select pass type (day/week/month)
  - Choose start date and time slot (if applicable)
  - Real-time availability check
  - Add-ons (guest pass, locker rental, personal training session)
- **Payment Processing:**
  - Multiple payment methods (card, mobile wallets, bank transfer)
  - Secure payment gateway integration
  - Save payment methods for future bookings
  - Split payment options for groups
- **Digital Pass Generation:**
  - QR code generated immediately after payment
  - Pass stored in app (acts as digital identity)
  - Email confirmation with pass details
  - Push notification reminder before pass expiry
- **Booking Management:**
  - View all active passes in "My Passes" section
  - Upcoming bookings calendar view
  - Past bookings history
  - Cancel/reschedule options (based on gym policy)
- **Group Bookings:**
  - Book multiple passes in one transaction
  - Split payment among friends
  - Group discount notifications
- **Promotional Codes:**
  - Apply discount codes at checkout
  - First-time user offers
  - Referral discounts

**User Journey:**

1. User browses gym profile → selects "Book Pass"
2. Chooses pass type and date → sees real-time availability
3. Proceeds to payment → completes transaction
4. Receives digital pass with QR code instantly
5. Shows QR code at gym entry → gets scanned in

---

### Module 4: Digital Identity & Check-In

**Problem Solved:** Users need physical membership cards and identity verification slows down entry.

**Features:**

- **Phone-Based Identity:**
  - Phone number verified via OTP during registration
  - No physical cards needed
  - One profile across all gyms
- **QR Code Check-In:**
  - Each booking generates unique QR code
  - Gym scans code at entry
  - Instant verification of valid pass
  - Prevents pass sharing (one-time scan or time-limited)
- **Entry History:**
  - Track all gym visits
  - Check-in timestamps
  - Duration tracking (optional)
- **Multi-Gym Access:**
  - Single account works across all partner gyms
  - Seamless experience switching between gyms

---

### Module 5: Workout Routine Management

**Problem Solved:** Users lose motivation and don't know what exercises to do.

**Features:**

- **Routine Builder:**
  - Create custom workout routines
  - Add exercises from library (searchable database)
  - Specify sets, reps, weight, rest time
  - Add notes and technique tips
  - Upload videos/images for reference
- **Exercise Library:**
  - Categorized by muscle groups
  - Video demonstrations
  - Difficulty levels
  - Equipment requirements
- **Routine Templates:**
  - Pre-made routines by fitness experts
  - Beginner, intermediate, advanced levels
  - Goal-based (weight loss, muscle gain, endurance)
  - Import and customize templates
- **Workout Tracking:**
  - Log completed workouts
  - Track progress over time (weight lifted, reps completed)
  - Rest day tracking
  - Streak counters for consistency
- **Personal Routine Library:**
  - Save multiple routines (leg day, push day, cardio, etc.)
  - Edit and update routines
  - Archive old routines
  - Star favorite routines

---

### Module 6: Social Features & Routine Sharing

**Problem Solved:** Users lack accountability and social motivation to maintain gym consistency.

**Features:**

- **Routine Sharing:**
  - Make routines public or share with specific friends
  - Add descriptions and goals
  - Tag fitness level and duration
  - Share to social feed
- **Social Feed:**
  - See friends' shared routines
  - Like and comment on routines
  - Save others' routines to your library
  - Filter by workout type or friend
- **Workout Buddies:**
  - Coordinate gym visits with friends
  - "Going to the gym" posts with gym location and time
  - "Join me" invitations
  - See which friends are at the same gym
- **Challenges & Competitions:**
  - Join fitness challenges (30-day plank, step challenges)
  - Create private challenges with friends
  - Leaderboards and achievements
  - Badges for milestones
- **Progress Sharing:**
  - Share transformation photos (with privacy controls)
  - Celebrate milestones (100 workouts, 1-year streak)
  - Progress graphs and stats
- **Community:**
  - Follow other users for motivation
  - Join interest-based groups (powerlifting, yoga, CrossFit)
  - Event coordination (group classes, running clubs)

---

### Module 7: Personal Dashboard (/app)

**Problem Solved:** Users need a centralized place to manage all fitness activities.

**Features:**

- **Dashboard Overview:**
  - Active gym passes with expiry dates
  - Upcoming bookings
  - Workout streak counter
  - Quick stats (total workouts, favorite gym, total spent)
- **My Passes:**
  - All active passes with QR codes
  - Past bookings history
  - Download receipts/invoices
- **My Routines:**
  - All saved workout routines
  - Recently used routines
  - Shared routines
- **Progress Tracking:**
  - Workout calendar heat map
  - Stats dashboard (workouts per week, consistency)
  - Personal records (PR tracking)
  - Body measurements tracking (optional)
- **Saved Gyms:**
  - Favorite gyms for quick booking
  - Bookmark gyms to try later
  - Get notified of special offers
- **Notifications Center:**
  - Booking confirmations
  - Pass expiry reminders
  - Friend activity
  - Promotional offers from gyms
- **Profile Settings:**
  - Update personal information
  - Payment methods management
  - Privacy settings
  - Notification preferences
  - Account security

---

## 🏢 Gym Owner Features (Studio Portal)

### Module 8: Studio Authentication

**Features:**

- **Registration:**
  - Gym owner signs up with business email
  - Provide gym details (name, address, contact)
  - Verify business documentation (optional)
  - Create studio account
- **Login:**
  - Email/password authentication
  - Two-factor authentication (optional)
  - Password recovery
- **Multi-User Access:**
  - Add staff members (manager, receptionist roles)
  - Role-based permissions
  - Activity logs

---

### Module 9: Studio Dashboard

**Problem Solved:** Gym owners need a simple overview of daily operations.

**Features:**

- **Today's Overview:**
  - Current occupancy vs. capacity
  - Today's check-ins count
  - Active passes expiring today
  - Today's revenue
- **Quick Stats:**
  - Total active members
  - This month's bookings
  - Revenue trends (daily, weekly, monthly)
  - Average rating
- **Recent Activity:**
  - Latest bookings
  - Recent check-ins
  - New reviews
  - Pending actions
- **Analytics Dashboard:**
  - Visitor trends graph
  - Peak hours analysis
  - Popular pass types
  - Revenue breakdown
  - Member retention rates
- **Calendar View:**
  - Upcoming workshops/classes
  - Maintenance schedules
  - Special events

---

### Module 10: Gym Profile Management

**Features:**

- **Basic Information:**
  - Gym name, description, logo
  - Contact details (phone, email, website)
  - Location (address with map pin)
  - Operating hours (with exceptions)
- **Photo & Video Gallery:**
  - Upload facility photos
  - Add video tours
  - Reorder gallery images
  - Set cover photo
- **Amenities Configuration:**
  - Select available amenities from checklist
  - Add custom amenities
  - Equipment inventory list
- **Services Management:**
  - List additional services (personal training, classes)
  - Add trainer profiles with photos and bios
  - Class schedules
  - Workshop/event creation

---

### Module 11: Pass & Pricing Configuration

**Problem Solved:** Gyms need flexible pricing options without complex software.

**Features:**

- **Pass Types:**
  - Create day passes with hourly/full-day options
  - Week passes (7-day validity)
  - Monthly subscriptions
  - Custom duration passes
- **Pricing Management:**
  - Set base prices for each pass type
  - Peak/off-peak pricing
  - Weekend vs. weekday pricing
  - Dynamic pricing based on demand (optional)
- **Discounts & Offers:**
  - Create percentage or fixed-amount discounts
  - Set validity periods
  - Limit redemptions
  - First-time user offers
  - Bulk purchase discounts
  - Student/senior discounts
- **Add-On Services:**
  - Locker rental pricing
  - Guest pass pricing
  - Personal training session rates
  - Equipment rental (yoga mat, towel)

---

### Module 12: Capacity Management

**Problem Solved:** Gyms get overcrowded, affecting member experience.

**Features:**

- **Capacity Settings:**
  - Set maximum occupancy (total slots)
  - Configure hourly slots (if time-based access)
  - Set daily limits for day passes
  - Reserve slots for members vs. day pass users
- **Real-Time Monitoring:**
  - Current occupancy dashboard
  - Live check-ins feed
  - Capacity utilization percentage
  - Waitlist management
- **Slot Allocation:**
  - Automatic booking limits based on capacity
  - Prevent overbooking
  - Buffer slots for walk-ins
  - Priority access for premium members
- **Historical Analysis:**
  - Peak hours identification
  - Crowd patterns by day of week
  - Capacity utilization reports
  - Recommendations for capacity adjustments

---

### Module 13: Member & Booking Management

**Features:**

- **Check-In System:**
  - QR code scanner (mobile or tablet)
  - Manual check-in option (search by phone/name)
  - Valid pass verification
  - Expired pass notifications
- **Active Members View:**
  - Currently checked-in members
  - Active pass holders
  - Check-out tracking (optional)
- **Booking History:**
  - All bookings list with filters
  - Search by customer name, phone, date
  - Booking details (pass type, duration, amount paid)
  - Export data to CSV/Excel
- **Member Insights:**
  - Frequent visitors
  - Inactive members (for re-engagement)
  - Average visits per member
  - Member feedback scores
- **Walk-In Management:**
  - Register walk-in customers
  - Issue day passes on the spot
  - Cash/card payment tracking

---

### Module 14: Promotions & Marketing

**Problem Solved:** Gyms need tools to attract and retain customers.

**Features:**

- **Promotional Campaigns:**
  - Create limited-time offers
  - Seasonal discounts (New Year, summer)
  - Flash sales
  - Set visibility dates
- **Referral Programs:**
  - Generate referral codes for existing members
  - Track referral conversions
  - Automated rewards
- **Notifications:**
  - Send push notifications to app users nearby
  - Email campaigns for special offers
  - SMS reminders (optional)
- **Featured Listings:**
  - Boost gym visibility in search results
  - Appear in "Top Rated" or "Near You" sections
  - Promotional badges on gym card
- **Social Media Integration:**
  - Share offers on social media
  - Instagram/Facebook post templates
  - Track campaign performance

---

### Module 15: Reviews & Reputation Management

**Features:**

- **Review Monitoring:**
  - View all reviews and ratings
  - Filter by rating stars
  - Sort by date
- **Response System:**
  - Reply to reviews publicly
  - Thank positive reviewers
  - Address concerns in negative reviews
- **Rating Analytics:**
  - Overall rating trends
  - Category breakdown (cleanliness, equipment, staff)
  - Comparison with nearby gyms (optional)
- **Feedback Collection:**
  - Prompt members to leave reviews after visits
  - In-app rating prompts

---

### Module 16: Financial Reports & Revenue Tracking

**Features:**

- **Revenue Dashboard:**
  - Total revenue (daily, weekly, monthly, yearly)
  - Revenue by pass type
  - Revenue trends graph
- **Transaction History:**
  - All payments received
  - Refunds and cancellations
  - Payment method breakdown
- **Payout Management:**
  - View pending payouts from platform
  - Payout history
  - Download financial statements
- **Reports:**
  - Export financial data
  - Tax reports (if applicable)
  - Custom date range reports

---

## 🔧 Platform Features (Shared)

### Module 17: Authentication & Security

**Features:**

- **User Authentication:**
  - Phone number OTP for end users
  - Email/password for gym owners
  - Social login (Google, Facebook) - optional
- **Session Management:**
  - Secure JWT tokens
  - Auto-logout on inactivity
  - Multi-device support
- **Password Security:**
  - Strong password requirements
  - Password reset via email/SMS
  - Account recovery options
- **Privacy & Data Protection:**
  - GDPR compliance (if applicable)
  - Data export requests
  - Account deletion

---

### Module 18: Notifications System

**Features:**

- **Push Notifications:**
  - Booking confirmations
  - Check-in reminders
  - Pass expiry alerts
  - Friend activity updates
  - Promotional offers
- **Email Notifications:**
  - Booking receipts
  - Monthly activity summary
  - Marketing emails (with opt-out)
- **SMS Notifications (Optional):**
  - OTP verification
  - Critical alerts
- **In-App Notifications:**
  - Notification center
  - Unread badge counts
  - Notification preferences

---

### Module 19: Payment & Billing

**Features:**

- **Payment Gateway Integration:**
  - Stripe/local payment processor
  - Support multiple currencies
  - Secure card storage (PCI compliant)
- **Payment Methods:**
  - Credit/debit cards
  - Mobile wallets (Apple Pay, Google Pay)
  - Bank transfers (optional)
  - Cash on arrival (tracked separately)
- **Transaction Management:**
  - Payment confirmations
  - Refund processing
  - Failed payment handling
  - Dispute resolution
- **Platform Revenue:**
  - Commission-based model (future)
  - Subscription fees for gym owners (future)
  - Transaction fees

---

### Module 20: Geolocation & Maps

**Features:**

- **Location Services:**
  - GPS-based gym discovery
  - Address autocomplete
  - Distance calculation
- **Map Integration:**
  - Google Maps/Mapbox
  - Gym markers on map
  - Directions to gym
  - Nearby gyms visualization

---

### Module 21: Media Management

**Features:**

- **Image Upload:**
  - Cloudflare R2 integration
  - Image compression and optimization
  - Multiple file upload
  - Drag-and-drop interface
- **File Validation:**
  - Supported formats (JPEG, PNG, WebP, GIF)
  - Size limits (1MB default, configurable)
  - Aspect ratio recommendations
- **Gallery Management:**
  - Reorder images
  - Set primary image
  - Delete images
  - Image CDN delivery

---

## 🎯 Key User Flows

### Flow 1: First-Time User Finding & Booking a Gym

1. User lands on homepage → allows location access
2. Sees nearby gyms on map → browses listings
3. Clicks gym card → views detailed profile with photos, pricing, reviews
4. Checks real-time availability → selects "Day Pass"
5. Creates account with phone OTP → enters payment details
6. Completes booking → receives digital pass with QR code
7. Goes to gym → shows QR code → gets checked in
8. Returns to app → logs workout routine → shares with friends

### Flow 2: Gym Owner Setting Up Profile

1. Owner signs up with business email → verifies email
2. Completes gym profile (name, address, photos, amenities)
3. Configures pass types and pricing (day/week/month passes)
4. Sets capacity limits (max 50 members at a time)
5. Creates first promotional offer (20% off for first-time users)
6. Profile goes live → appears in user searches
7. Receives first booking → checks in member with QR scanner
8. Views dashboard analytics → tracks daily revenue

### Flow 3: User Maintaining Consistency with Social Features

1. User creates workout routine → adds exercises
2. Shares routine on social feed → friends see it
3. Friend comments "Let's do this together!"
4. User posts "Going to [Gym Name] at 6 PM today"
5. Friend clicks "Join" → books pass for same gym
6. Both check in → complete workout → log it in app
7. System awards "Workout Buddy" badge
8. Streak counter increases → motivation maintained

---

## 📊 Success Metrics

### User Engagement

- Monthly active users
- Average bookings per user
- Repeat booking rate
- Social feature usage (routine shares, check-ins)
- Workout routine creation rate

### Gym Owner Success

- Gyms onboarded per month
- Average bookings per gym
- Capacity utilization rate
- Gym profile completion rate
- Response rate to reviews

### Platform Health

- Total bookings processed
- Average transaction value
- User retention rate (30, 60, 90 days)
- Gym retention rate
- Customer satisfaction score (CSAT)

---

## 🚀 Future Enhancements (Phase 2+)

### Advanced Features

- **AI Workout Recommendations** - Personalized routines based on goals and progress
- **Nutrition Tracking** - Meal logging and calorie tracking integration
- **Wearable Integration** - Sync with fitness trackers (Fitbit, Apple Watch)
- **Virtual Classes** - Live streaming and on-demand workout videos
- **Corporate Wellness** - B2B packages for companies
- **Multi-City Expansion** - Scale to multiple cities/countries
- **Gamification** - Levels, achievements, rewards system
- **AI Chatbot** - Instant support for users and gym owners
- **Marketplace** - Buy fitness gear, supplements, apparel
- **Trainer Matching** - Connect users with certified personal trainers

### Platform Improvements

- **Mobile Native Apps** - iOS and Android apps (beyond PWA)
- **Offline Mode** - Access passes without internet
- **Multi-Language Support** - Localization for different regions
- **Accessibility Features** - Screen reader support, high contrast mode

---

## Conclusion

Fit Planet bridges the gap between fitness seekers and gyms by providing a seamless, technology-driven platform that benefits both parties. By eliminating barriers to entry (no physical cards, instant booking) and maintaining engagement through social features, the platform addresses the core problems in the fitness industry while giving gym owners powerful tools to manage and grow their business.
