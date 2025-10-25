import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider,QueryClient } from '@tanstack/react-query'
import { CookiesProvider } from "react-cookie"; // ✅ import

const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
      <Router>
        <CookiesProvider>
          <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
        </CookiesProvider>
      </Router>
   
)
