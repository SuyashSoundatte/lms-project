# Academy Learning Management System

> A comprehensive LMS built specifically for managing 11th-12th grade academy operations with role-based access control

[![Live Demo](https://img.shields.io/badge/Live%20Demo-lms.nullpointers.me-blue)](https://lms.nullpointers.me)
[![API](https://img.shields.io/badge/API-api.nullpointers.me-green)](https://api.nullpointers.me)
[![Students](https://img.shields.io/badge/Students-828-orange)]()
[![Teachers](https://img.shields.io/badge/Teachers-23-purple)]()

## What This System Actually Does

This is a real-world LMS we built from the ground up to handle our academy's daily operations. It manages everything from student registrations and class allocations to attendance tracking and parent communication - specifically designed for 11th and 12th grade students.

### Real Numbers (Live Data)
- **828 Active Students** we're currently managing
- **23 Teaching Staff** using the system daily
- **11 Class Teachers** with restricted access
- **Real-time Attendance** tracking that actually works

## What Makes It Useful

### For Our Office Team
- Complete student registration with parent contact details (because we need to reach parents quickly)
- Teacher onboarding with specific role assignments
- Smart class allocation that prevents over-crowding
- Dashboard that shows everything at a glance

### For Teachers
- **No confusion**: They only see their assigned classes
- Simple attendance marking that takes seconds
- Student progress tracking without digging through paperwork
- Direct messaging to parents when needed

### For Parents
- Real-time access to their child's attendance (no more "I didn't know" excuses)
- Academic performance reports without waiting for PTMs
- Notifications when attendance drops below threshold

## Security We Actually Implemented
- JWT authentication that doesn't break when users refresh pages
- Role-based access that actually prevents teachers from seeing other classes
- Input validation that stops SQL injection attempts
- Secure file uploads that check both type and size

## How We Built It

### Frontend Choices
```javascript
React.js          // Because components make sense for this
TanStack Table    // Handles our large student datasets smoothly
Tailwind CSS      // Lets us style quickly without context switching
ShadCN UI         // Provides consistent components we can rely on
Vite              // Because waiting for Webpack gets old fast
```

### Backend Setup
```javascript
Node.js          // JavaScript everywhere keeps things simple
Express.js       // Tried and tested framework that just works
JWT              // Stateless auth that scales without sessions
Multer           // Handles file uploads securely
MS SQL Server    // Enterprise-grade database we already had
```

### Where It Runs
```yaml
Frontend:    Vercel (Zero-config deployments)
Backend:     AWS EC2 (Ubuntu 24.04 - stable LTS)
Database:    MS SQL Server (Existing infrastructure)
Containers:  Docker (Ensures consistency across environments)
Proxy:       Nginx (SSL termination and load balancing)
SSL:         Let's Encrypt (Free and automatic renewals)
Domains:     Custom domains for clear separation
```

## How Everything Fits Together

### MVC Pattern We Actually Use
```
Database Layer (MS SQL Server)
├── Users (Students, Teachers, Office staff - all separate)
├── Classes & Divisions (11th/12th with sections)
├── Allocations (Which student in which class, which teacher teaches what)
└── Attendance (Daily records with timestamps)

Frontend (React.js)
├── Different dashboards based on who's logged in
├── Forms that validate as you type
├── Tables that handle filtering and sorting
└── Notifications that appear where needed

Backend (Express.js)
├── Auth middleware that checks roles on every request
├── Route protection that actually works
├── Business logic that handles our specific academy rules
└── Database operations that are optimized
```

## How We Deployed It

[Infrastructure diagram would go here]

### Production Setup That Works
- **Frontend**: Pushes to Git automatically deploy to Vercel
- **Backend**: Docker containers on AWS EC2 that we can scale if needed
- **Database**: MS SQL Server with proper connection management
- **SSL**: Certificates that renew themselves so we don't get calls at 3 AM

## Technical Decisions We're Happy With

### 1. Authentication That Works
- **JWT** because sessions would complicate our distributed setup
- **Role middleware** that actually restricts access properly
- **Refresh tokens** that keep users logged in without compromising security

### 2. Database Design That Makes Sense
- **Normalized schema** because duplicate data causes headaches
- **Smart indexing** that keeps queries fast even with 800+ students
- **Foreign keys** that prevent orphaned records

### 3. Infrastructure That Doesn't Break
- **Separate domains** so frontend/backend can scale independently
- **Docker** because "works on my machine" isn't acceptable
- **Nginx** that handles SSL and proxies requests efficiently

## Performance We Actually Measure
- **API Response**: Usually under 200ms - feels instant to users
- **Page Load**: Under 2 seconds even with slow connections
- **Database**: Handles concurrent requests without locking up
- **Concurrent Users**: Tested with entire staff using simultaneously

## Problems We Solved Along the Way

### Complex Role Permissions
- Middleware that ensures teachers only see their assigned classes
- Dynamic menus that change based on what you're allowed to see
- API endpoints that verify roles before returning data

### Cross-Origin Headaches
- Solved CORS between Vercel and our EC2 instance
- Got authentication headers working properly across domains
- Managed cookies securely despite different domains

### File Upload Security
- Implemented proper validation with Multer
- Set realistic file size limits to prevent abuse
- Ensured uploaded files are stored securely with access controls

## What We Want to Build Next
- [ ] Redis caching for even better performance
- [ ] Real-time notifications using WebSockets
- [ ] Mobile app for parents who prefer phones
- [ ] Better analytics with charts and insights
- [ ] Automated report generation for exam time

## How to Set Up Locally (Actual Steps)

```bash
# Clone the actual repository
git clone https://github.com/SuyashSoundatte/lms-project.git

# Backend setup (runs on port 5000)
cd backend
npm install
cp .env.example .env  # Fill in your actual database credentials
npm run dev

# Frontend setup (runs on port 3000)
cd frontend
npm install
npm run dev
```

## Where to Find Everything
- **Live System**: https://lms.nullpointers.me
- **API Endpoint**: https://api.nullpointers.me
- **Source Code**: [GitHub Repository](https://github.com/SuyashSoundatte/lms-project.git)
