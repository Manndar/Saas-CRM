# SaaS CRM Frontend

Next.js frontend application with Material-UI (MUI) for the SaaS CRM & Ticketing System.

## Features

- ✅ Authentication (Login/Register)
- ✅ JWT token management with automatic refresh
- ✅ Protected routes
- ✅ Material-UI (MUI) styling
- ✅ React Query for data fetching
- ✅ Responsive design

## Setup

### 1. Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_BASE=http://localhost:3000/api
```

Update the URL if your backend runs on a different port.

### 2. Install Dependencies

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000` (or the next available port).

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── login/        # Login page
│   │   ├── register/     # Registration page
│   │   ├── dashboard/   # Protected dashboard
│   │   └── layout.tsx    # Root layout with providers
│   ├── components/        # React components
│   │   ├── providers.tsx      # MUI & React Query providers
│   │   └── protected-route.tsx # Route protection wrapper
│   ├── lib/              # Utilities
│   │   ├── api.ts        # API client with axios
│   │   └── auth-store.ts # Auth state management (jotai)
│   └── theme/            # MUI theme configuration
│       └── theme.ts
```

## Pages

### `/login`
- User login form
- Redirects to dashboard on success

### `/register`
- User registration form
- Creates account and organization
- Redirects to dashboard on success

### `/dashboard`
- Protected route (requires authentication)
- Shows user information
- Logout functionality
- Placeholder for future features

## API Integration

The frontend connects to the backend API at the URL specified in `NEXT_PUBLIC_API_BASE`.

### Authentication Flow

1. User logs in → receives `accessToken` and `refreshToken`
2. Tokens stored in `localStorage`
3. API client automatically adds `Authorization: Bearer <token>` header
4. On 401 error → automatically refreshes token
5. On refresh failure → redirects to login

### API Client

Located in `src/lib/api.ts`, provides:
- `login(email, password)`
- `register(fullName, email, password, organizationName?)`
- `refresh(refreshToken)`
- `logout(refreshToken)`
- `getMe()` - Get current user info

## Styling

Material-UI (MUI) is configured with a custom theme. The theme can be customized in `src/theme/theme.ts`.

## Next Steps

- [ ] Implement tickets management UI
- [ ] Implement customers management UI
- [ ] Add organization switching
- [ ] Add notifications UI
- [ ] Add file upload UI
- [ ] Implement real-time updates with Socket.io
