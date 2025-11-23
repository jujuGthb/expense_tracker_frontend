## Frontend README


# Expense Tracker Frontend

A modern, responsive React application for personal expense tracking with real-time charts, budget management, and an intuitive user interface.

##  Features

- **Dashboard** - Overview of expenses, budgets, and financial health
- **Expense Tracking** - Add, edit, and categorize expenses
- **Budget Management** - Set spending limits and track progress
- **Visual Analytics** - Interactive charts and graphs using Chart.js
- **Profile Management** - User profile with avatar upload
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Real-time Updates** - Live data synchronization
- **Voice Input** - Speech-to-text expense entry
- **Export Data** - Download reports and analytics

##  Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- - Backend API running ([GitHub repository](https://github.com/jujuGthb/expense_tracker_backend))

##  Installation

1. **Clone the repository**
   ```bash
   git clone <your-frontend-repo-url>
   cd expense-tracker-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`


##  Features Overview

###  Dashboard
- Financial overview with key metrics
- Recent transactions display
- Budget progress indicators
- Interactive charts showing spending trends
- Quick action buttons for common tasks

###  Expense Management
- Add new expenses with categories
- Edit and delete existing expenses
- Search and filter functionality
- Bulk operations support
- Voice input for quick entry
- Receipt photo upload


##  API Integration

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

##  UI/UX Features

- **Responsive Design** - Mobile-first approach
- **Modern Interface** - Clean, intuitive design
- **Smooth Animations** - Lottie animations for better UX
- **Interactive Charts** - Real-time data visualization
- **Toast Notifications** - User feedback system
- **Loading States** - Skeleton screens and spinners
- **Error Handling** - Graceful error messages
- **Accessibility** - WCAG compliant components

##  Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

