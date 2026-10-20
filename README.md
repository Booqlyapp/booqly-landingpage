# Booqly Website - Public Booking Platform

This is the public-facing Next.js website for Booqly that handles wildcard subdomain booking links for beauty professionals. When users visit a custom booking link like `elite-hair-studio.booqlyapp.com`, they can browse services and book appointments directly.

## Features

- **Wildcard Subdomain Routing**: Automatically handles any subdomain (except reserved ones like `api`, `admin`, `www`)
- **3-Step Booking Flow**:
  1. Service Selection with category filtering
  2. Date & Time Selection with calendar and available slots
  3. Customer Details with terms acceptance
- **Responsive Design**: Mobile-first design that works on all devices
- **External Appointments**: Bookings are saved to the `ExternalAppointments` table (no user account required)
- **Booqly Branding**: Consistent navbar and branding across all booking pages

## Prerequisites

- Node.js 18+ installed
- Booqly backend server running (for API endpoints)
- Database migration for `ExternalAppointments` table completed

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# For production, use your actual backend URL:
# NEXT_PUBLIC_API_URL=https://api.booqlyapp.com
```

## Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the homepage.

## Testing Subdomain Routing Locally

To test subdomain routing on your local machine, you need to modify your hosts file:

### Windows
Edit `C:\Windows\System32\drivers\etc\hosts` and add:
```
127.0.0.1 elite-hair-studio.localhost
127.0.0.1 test-salon.localhost
```

### Mac/Linux
Edit `/etc/hosts` and add:
```
127.0.0.1 elite-hair-studio.localhost
127.0.0.1 test-salon.localhost
```

Then visit `http://elite-hair-studio.localhost:3000` in your browser.

## Backend Requirements

The website requires the following backend API endpoints to be available:

### 1. Get Marketplace by Custom Link
```
GET /public/marketplace/:customLink
```
Returns marketplace details including services, schedule, and business information.

### 2. Get Available Time Slots
```
GET /public/available-slots?marketplaceId={id}&serviceId={id}&date={YYYY-MM-DD}
```
Returns available booking time slots for a specific service on a given date.

### 3. Create External Appointment
```
POST /public/book
```
Creates a new external appointment (public booking without user account).

**Request Body:**
```json
{
  "marketplaceId": "uuid",
  "serviceId": "uuid",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "dateTime": "ISO 8601 datetime",
  "price": "number",
  "depositAmount": "number (optional)",
  "remainingBalance": "number (optional)",
  "acceptedTerms": "boolean",
  "marketingConsent": "boolean",
  "notes": "string (optional)"
}
```

## Database Migration

Before using the booking system, run the migration to create the `ExternalAppointments` table:

```bash
# In the booqly-server directory
cd ../booqly-server
npm run migrate
```

The migration file is located at:
`booqly-server/src/migrations/20260422000001-create-external-appointments-table.js`

## Project Structure

```
booqly-website/
├── app/
│   ├── book/
│   │   └── [subdomain]/
│   │       ├── page.tsx          # Main booking flow
│   │       └── success/
│   │           └── page.tsx      # Success confirmation
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
├── components/
│   ├── navbar.tsx                # Booqly navbar
│   └── booking/
│       ├── service-selection.tsx
│       ├── datetime-selection.tsx
│       └── customer-details.tsx
├── lib/
│   ├── api.ts                    # API client functions
│   └── types.ts                  # TypeScript types
├── middleware.ts                 # Subdomain routing logic
└── next.config.ts
```

## How It Works

1. **Middleware**: Intercepts all requests and checks for subdomains
2. **Subdomain Detection**: Extracts subdomain from hostname (e.g., `elite-hair-studio` from `elite-hair-studio.booqlyapp.com`)
3. **Route Rewriting**: Rewrites the URL to `/book/[subdomain]` internally
4. **Data Fetching**: Fetches marketplace data using the custom link
5. **Booking Flow**: Guides user through service selection, date/time, and details
6. **Appointment Creation**: Saves to `ExternalAppointments` table via API

## Reserved Subdomains

The following subdomains are reserved and will not trigger booking flow:
- `www`
- `api`
- `admin`
- `app`
- `mail`
- `staging`
- `dev`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variable: `NEXT_PUBLIC_API_URL`
4. Configure custom domain: `booqlyapp.com`
5. Enable wildcard subdomain: `*.booqlyapp.com`

### Other Platforms

Ensure your hosting platform supports:
- Wildcard subdomain routing
- Next.js 14+ features
- Environment variables

## Development Tips

- Use `console.log` in middleware to debug subdomain detection
- Test with different custom links to ensure routing works
- Check browser network tab to verify API calls
- Use React DevTools to inspect component state

## Troubleshooting

**Issue**: Subdomain routing not working locally
- **Solution**: Update your hosts file and restart browser

**Issue**: API calls failing
- **Solution**: Check that backend server is running and `NEXT_PUBLIC_API_URL` is correct

**Issue**: TypeScript errors in components
- **Solution**: Restart TypeScript server in your IDE

**Issue**: Middleware not triggering
- **Solution**: Check the `matcher` config in `middleware.ts`

## Deployment

For production deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

**Quick Deploy:**
- GitHub Actions automatically deploys on push to `main` branch
- Requires VPS secrets configured in GitHub repository settings
- Nginx configuration provided in `nginx.conf`
- PM2 ecosystem config in `ecosystem.config.js`

## Related Documentation

- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Deployment Guide](./DEPLOYMENT.md)

## Support

For issues or questions, contact the Booqly development team.
