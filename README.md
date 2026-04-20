# Amethyst HR

![Amethyst HR Dashboard](public/amethyst-security.png)

> Elegant, futuristic HR management system built with Next.js 14, TypeScript, and MongoDB.

Amethyst HR is a comprehensive enterprise HR platform featuring an **interactive login experience with the Amethyst Lamp**, employee management, attendance tracking, payroll processing, leave management, and performance reviews — all wrapped in a premium dark theme with glassmorphism UI and smooth animations.

**⚠️ Best viewed on laptop/desktop** — the full interactive experience is optimized for larger screens.

---

## ✨ Featured Interactive Login

The **Amethyst Lamp** is not just decor — it's your gateway into the system:

1. **Land on a dimly lit room** — the lamp glows softly in the corner
2. **Click the lamp or pull the chain** — watch it brighten, casting a warm purple radiance
3. **The login card fades in smoothly** as illumination spreads
4. **Enter credentials** to access your dashboard
5. **Click again to dim** — the form gracefully fades out

This immersive Framer Motion animation sets the tone for the entire experience.

---

## Features

### 🔐 Authentication & Authorization
- NextAuth.js with Google OAuth support (optional)
- JWT-based encrypted sessions
- Role-based access: **Admin** (hradmin), **HR**, **Manager**, **Employee**
- Demo admin credentials:
  - **Email:** `hradmin@gmail.com`
  - **Password:** `hradmin@2026`
- Automatic role detection based on email patterns

### 👥 Employee Management (Admin/HR)
- Full employee profiles: name, email, phone, role, department, position, employee ID
- Add, edit, view, and manage all staff members
- Department organization: Engineering, Design, Marketing, HR, Finance, etc.
- User status tracking (active/inactive)

### ⏰ Attendance Tracking
- **Clock In / Clock Out** with one-click buttons
- Real-time attendance status (present, late, absent)
- **Monthly calendar view** with daily attendance breakdown
- Weekly attendance summary for employees
- Analytics: present/absent trends per day
- Automatic timestamp recording

### 📅 Leave Management
- **Leave balance tracking**: Annual, Sick, Personal, Work-From-Home days remaining
- **Leave request submission** (employee self-service)
- Approval workflow: Pending → Approved / Rejected
- Leave history with status, dates, and reasons
- Color-coded leave types
- Automatic balance deduction on approval

### 💰 Payroll Processing (Admin)
- Configure base salaries, allowances, deductions
- **Net salary calculation** per employee
- Payment status tracking: Pending → Processed → Paid
- **PDF payslip generation** (via @react-pdf/renderer)
- Monthly payroll summary with totals
- Per-employee breakdown view

### 📊 Performance Reviews (Admin/Manager)
- **Self-rating** and **manager rating** (1–5 scale)
- **KPI scoring** (0–100)
- Performance categories: Excellent (4.5+), Good (4.0+), Average (3.0+), Poor (<3.0)
- Color-coded badges with trend indicators
- Employee performance table with sortable columns
- Top performer highlights and improvement tracking

### 📈 Dashboard Analytics (Admin)
- **Stats cards**: Total employees, present today, leave requests, monthly payroll
- **Area chart**: Attendance trends over 6 months
- **Pie chart**: Department distribution
- **Bar chart**: Salary range distribution
- Quick-action buttons: Add employee, process payroll, approve leave, generate report

### 🏢 Employee Portal
Employees access their own dashboard with:
- Personalized welcome header with live clock
- Quick stats: weekly attendance, leave balance
- One-click **Clock In / Clock Out** with visual feedback
- Navigation sidebar: Dashboard, Attendance, Leave, Profile, Messages, Notifications, Performance, Settings
- Message and notification badges
- Profile management

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | TailwindCSS + custom CSS (glassmorphism, neon glows) |
| **State Management** | Zustand |
| **Forms** | React Hook Form + Zod (validation) |
| **Animation** | Framer Motion (smooth transitions, page animations) |
| **Charts** | Recharts (area, pie, bar charts) |
| **Icons** | Lucide React |
| **Database** | MongoDB + Mongoose (Mongoose ODM) |
| **Authentication** | NextAuth.js (Google OAuth, JWT sessions) |
| **PDF Generation** | @react-pdf/renderer (payslips) |
| **Code Quality** | ESLint, TypeScript strict mode |

---

## Project Structure

```
amethyst/
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Authentication pages (no sidebar)
│   │   │   ├── login/page.tsx         # Interactive lamp login page
│   │   │   ├── signup/page.tsx        # User registration
│   │   │   └── placeholder-dashboard/ # Post-login redirect
│   │   ├── (dashboard)/               # Protected pages (with sidebar)
│   │   │   ├── hradmin/page.tsx       # Admin dashboard with charts
│   │   │   ├── employee/page.tsx      # Employee dashboard & clock in/out
│   │   │   ├── employees/page.tsx     # Employee list management
│   │   │   ├── attendance/page.tsx    # Attendance calendar & stats
│   │   │   ├── leave/page.tsx         # Leave requests & balances
│   │   │   ├── payroll/page.tsx       # Payroll processing
│   │   │   ├── performance/page.tsx   # Performance reviews
│   │   │   ├── users/page.tsx         # User management
│   │   │   ├── layout.tsx             # Dashboard layout with sidebar
│   │   │   └── employee/layout.tsx    # Employee portal layout
│   │   ├── api/
│   │   │   └── auth/
│   │   │       ├── [...nextauth]/route.ts  # NextAuth configuration
│   │   │       ├── callback/route.ts        # OAuth callback & role redirect
│   │   │       ├── login/route.ts           # Email/password login API
│   │   │       ├── signup/route.ts          # User registration API
│   │   │       └── users/route.ts           # Get all users API
│   │   ├── about/page.tsx             # About page
│   │   ├── contact/page.tsx           # Contact page
│   │   ├── services/page.tsx          # Services page
│   │   ├── layout.tsx                 # Root layout (providers, fonts)
│   │   ├── page.tsx                   # Landing page (hero + features)
│   │   └── globals.css                # Global styles + CSS variables
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx            # Main admin sidebar (collapsible)
│   │   │   ├── Header.tsx             # Top header bar with user menu
│   │   │   └── EmployeeSidebar.tsx    # Employee portal sidebar
│   │   ├── ui/
│   │   │   ├── Button.tsx             # Reusable button with variants
│   │   │   ├── Card.tsx               # Glassmorphic card container
│   │   │   └── Input.tsx              # Styled input fields
│   │   ├── providers.tsx              # Auth & store providers
│   │   └── IntroAnimation.tsx         # Brand intro animation component
│   ├── hooks/                         # Custom React hooks
│   ├── lib/
│   │   ├── authOptions.ts             # NextAuth configuration (providers, callbacks)
│   │   ├── mongodb.ts                 # MongoDB connection utility
│   │   ├── store.ts                   # Zustand stores (auth + app state)
│   │   └── utils.ts                   # Helper functions (cn, formatCurrency, etc.)
│   ├── models/
│   │   └── User.ts                    # Mongoose User schema
│   └── types/                         # TypeScript type definitions
├── public/                            # Static assets (images, favicon)
├── .env.example                       # Environment variables template
├── .gitignore                         # Git ignore rules
├── next.config.js                     # Next.js configuration
├── tailwind.config.ts                 # TailwindCSS configuration
├── tsconfig.json                      # TypeScript configuration
├── postcss.config.js                  # PostCSS configuration
├── package.json                       # Dependencies & scripts
├── package-lock.json                  # Locked dependency versions
├── SPEC.md                            # Technical specification (design & features)
└── README.md                          # This file
```

---

## Environment Variables

Create a `.env.local` file (copied from `.env.example`) with:

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ | MongoDB connection string (Atlas or local) |
| `NEXTAUTH_URL` | ✅ | Your app's base URL (e.g., `http://localhost:3000` or Vercel URL) |
| `NEXTAUTH_SECRET` | ✅ | Secret for signing tokens (generate with `openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` | ⚠️ | Google OAuth client ID (optional) |
| `GOOGLE_CLIENT_SECRET` | ⚠️ | Google OAuth client secret (optional) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/amethyst-hr.git
   cd amethyst-hr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and fill in your `MONGODB_URI` and other credentials.

4. **Start MongoDB** (if using local)
   ```bash
   mongod
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

6. **Login with admin credentials:**
   - Email: `hradmin@gmail.com`
   - Password: `hradmin@2026`

---

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables (MONGODB_URI, NEXTAUTH_URL, NEXTAUTH_SECRET, etc.)
4. Deploy

### Other Platforms
- **Railway** or **Render**: Deploy Next.js app + MongoDB Atlas
- Ensure `NEXT_PUBLIC_` env vars are set for client-side config

---

## Usage

### For Admins
- Access `/hradmin` dashboard
- View organization-wide stats
- Manage employees (add/edit/delete)
- Process payroll and approve leave
- Review performance metrics

### For Employees
- Login via `/login` (lamp interaction!)
- Dashboard shows personal attendance, leave balance, quick clock in/out
- Navigate via sidebar: Attendance, Leave, Profile, Messages, Performance
- View payslips and performance history

---

## Design System

**Theme:** Dark mode only with amethyst purple (`#9966CC`) accent color

**Key styles:**
- Glassmorphism — translucent cards with backdrop blur
- Neon glow borders and text shadows
- Gradient fills (`gradient-amethyst`, `gradient-radial`)
- Custom typography: Sora (headings), DM Sans (body), JetBrains Mono (code)
- Spacing: 4px base unit, consistent padding scales

**Responsive:**
- Mobile-first approach
- Tablet breakpoints: `md:` (768px)
- Desktop: `lg:` (1024px), `xl:` (1280px)
- **Optimized for laptop/desktop viewing** — interactive features like the Amethyst Lamp are best on larger screens

---

## Security Notes

- Passwords hashed with bcrypt
- Sessions stored in HTTP-only cookies ( secure in production )
- Never commit `.env.local` or `NEXTAUTH_SECRET`
- Input validation on all API routes
- Role-based route protection

---

## Contributing

Contributions welcome! Please:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit (`git commit -am 'Add my feature'`)
4. Push (`git push origin feature/my-feature`)
5. Open a Pull Request

Follow the existing code style and ensure `npm run lint` passes.

---

## License

MIT License — free for personal and commercial use.

---

## Support

For issues or questions, open a GitHub issue or contact the maintainer.

**Experience the future of HR management — illuminated by Amethyst.**
