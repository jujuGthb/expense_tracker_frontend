## Frontend README


# Expense Tracker Frontend

A modern, responsive React application for personal expense tracking with real-time charts, budget management, and an intuitive user interface.

## 🚀 Features

- **Dashboard** - Overview of expenses, budgets, and financial health
- **Expense Tracking** - Add, edit, and categorize expenses
- **Budget Management** - Set spending limits and track progress
- **Visual Analytics** - Interactive charts and graphs using Chart.js
- **Profile Management** - User profile with avatar upload
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Real-time Updates** - Live data synchronization
- **Voice Input** - Speech-to-text expense entry
- **Export Data** - Download reports and analytics

## 🛠️ Tech Stack

- **Framework**: React 19.1.0
- **Routing**: React Router DOM 7.5.3
- **HTTP Client**: Axios 1.9.0
- **Charts**: Chart.js 4.4.9 with React Chart.js 2
- **Icons**: React Icons, Lucide React, FontAwesome
- **Animations**: Lottie React 2.4.1
- **Notifications**: React Toastify, SweetAlert2
- **Styling**: CSS3 with responsive design
- **Date Handling**: date-fns 4.1.0
- **Testing**: React Testing Library

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Backend API running (see [Backend Repository](link-to-backend-repo))

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-frontend-repo-url>
   cd expense-tracker-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Development
   REACT_APP_API_URL=http://localhost:5000/api
   
   # Production
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🌐 Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## 📱 Features Overview

### 🏠 Dashboard
- Financial overview with key metrics
- Recent transactions display
- Budget progress indicators
- Interactive charts showing spending trends
- Quick action buttons for common tasks

### 💰 Expense Management
- Add new expenses with categories
- Edit and delete existing expenses
- Search and filter functionality
- Bulk operations support
- Voice input for quick entry
- Receipt photo upload

### 📊 Budget Tracking
- Create monthly/yearly budgets
- Real-time spending tracking
- Budget alerts and notifications
- Visual progress indicators
- Category-wise budget breakdown

### 👤 Profile Management
- User profile customization
- Avatar upload functionality
- Account settings management
- Security preferences
- Data export options

### 📈 Analytics
- Spending trends over time
- Category-wise expense breakdown
- Monthly/yearly comparisons
- Interactive charts and graphs
- Export functionality (PDF, CSV)

## 📁 Project Structure

```
expense-tracker-frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.js
│   │   │   ├── DashboardCard.js
│   │   │   └── RecentTransactions.js
│   │   ├── Expenses/
│   │   │   ├── ExpenseList.js
│   │   │   ├── ExpenseForm.js
│   │   │   └── ExpenseItem.js
│   │   ├── Budgets/
│   │   │   ├── BudgetList.js
│   │   │   ├── BudgetForm.js
│   │   │   └── BudgetProgress.js
│   │   ├── Profile/
│   │   │   ├── Profile.js
│   │   │   ├── ProfileForm.js
│   │   │   └── AvatarUpload.js
│   │   ├── Charts/
│   │   │   ├── ExpenseChart.js
│   │   │   ├── BudgetChart.js
│   │   │   └── TrendChart.js
│   │   └── common/
│   │       ├── Header.js
│   │       ├── Sidebar.js
│   │       ├── Loading.js
│   │       └── ErrorBoundary.js
│   ├── services/
│   │   └── api.js              # Axios configuration
│   ├── utils/
│   │   ├── helpers.js          # Utility functions
│   │   ├── formatters.js       # Data formatting
│   │   └── validators.js       # Input validation
│   ├── hooks/
│   │   ├── useAuth.js          # Authentication hook
│   │   ├── useExpenses.js      # Expenses management
│   │   └── useBudgets.js       # Budget management
│   ├── context/
│   │   └── AuthContext.js      # Authentication context
│   ├── styles/
│   │   ├── global.css          # Global styles
│   │   ├── components.css      # Component styles
│   │   └── responsive.css      # Responsive design
│   ├── App.js                  # Main App component
│   ├── App.css                 # App styles
│   └── index.js                # Entry point
├── .env.local                  # Environment variables
├── .gitignore
└── package.json
```

## 🔌 API Integration

The frontend communicates with the backend API through Axios:

```javascript
// services/api.js
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer \${token}`;
  }
  return config;
});

export default instance;
```

### API Endpoints Used

- `POST /auth/login` - User authentication
- `GET /transactions` - Fetch expenses
- `POST /transactions` - Create new expense
- `GET /budgets` - Fetch budgets
- `POST /budgets` - Create new budget
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile

## 🚀 Deployment

### Deploy to Vercel

1. **Connect your repository** to Vercel
2. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `build`
3. **Set environment variables**:
   - `REACT_APP_API_URL=https://your-backend-url.onrender.com/api`
4. **Deploy** automatically on push to main branch

### Deploy to Netlify

1. **Connect your repository** to Netlify
2. **Configure build settings**:
   - Build Command: `npm run build`
   - Publish Directory: `build`
3. **Set environment variables** in Netlify dashboard
4. **Deploy**

### Deploy to Render

1. **Create a new Static Site** on Render
2. **Configure build settings**:
   - Build Command: `npm install; npm run build`
   - Publish Directory: `build`
3. **Set environment variables**
4. **Deploy**

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_API_URL` | Backend API base URL | Yes |

### API Configuration

Update the API base URL in `src/services/api.js` based on your environment:

```javascript
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
```

### Image URLs

For production, update hardcoded image URLs:

```javascript
// Replace localhost URLs with your backend URL
const imageUrl = `https://your-backend-url.onrender.com\${imagePath}`;
```

## 🎨 UI/UX Features

- **Responsive Design** - Mobile-first approach
- **Modern Interface** - Clean, intuitive design
- **Smooth Animations** - Lottie animations for better UX
- **Interactive Charts** - Real-time data visualization
- **Toast Notifications** - User feedback system
- **Loading States** - Skeleton screens and spinners
- **Error Handling** - Graceful error messages
- **Accessibility** - WCAG compliant components

## 🧪 Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Structure
```
src/
├── __tests__/
│   ├── components/
│   ├── services/
│   └── utils/
└── setupTests.js
```

## 🔒 Security

- **JWT Token Management** - Secure token storage and handling
- **Input Validation** - Client-side validation for all forms
- **XSS Protection** - Sanitized user inputs
- **HTTPS Communication** - Secure API communication
- **Error Handling** - No sensitive data in error messages

## 📱 Browser Support

- **Chrome** (latest)
- **Firefox** (latest)
- **Safari** (latest)
- **Edge** (latest)
- **Mobile browsers** (iOS Safari, Chrome Mobile)

## 🎯 Performance

- **Code Splitting** - Lazy loading of components
- **Image Optimization** - Compressed and responsive images
- **Bundle Analysis** - Optimized bundle size
- **Caching** - Efficient API response caching
- **Minification** - Production build optimization

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Error**
   - Check `REACT_APP_API_URL` is correct
   - Verify backend is running
   - Check CORS configuration in backend

2. **Authentication Issues**
   - Clear localStorage and login again
   - Check JWT token expiration
   - Verify API endpoints

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check for dependency conflicts
   - Verify Node.js version

4. **Chart Display Issues**
   - Check Chart.js version compatibility
   - Verify data format for charts
   - Check console for errors

5. **Image Loading Issues**
   - Verify backend URL is correct
   - Check image paths
   - Ensure backend serves static files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow React best practices
- Write tests for new components
- Use meaningful commit messages
- Update documentation for new features
- Ensure responsive design
