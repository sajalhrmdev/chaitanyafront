import { Suspense, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/// Components
import Index from "./jsx";
import SuperAdminLogin from "./jsx/pages/SuperAdminLogin";
import AdminLogin from "./jsx/pages/AdminLogin";
/// Style
import "./vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
import "./css/style.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const publicRoutes = ['/museum-entry', '/booking'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const role = localStorage.getItem('userRole');
    
    if (authStatus === 'true' && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    } else if (!isPublicRoute) {
      if (location.pathname === '/admin-login') {
        // Stay on login
      } else {
        navigate('/admin-login');
      }
    }
  }, [navigate, location.pathname, isPublicRoute]);

  // Show login page if not authenticated
  if (!isAuthenticated && !isPublicRoute) {
    return <AdminLogin />;
  }

  return (
    <>
      <Suspense fallback={              
          <div id="preloader">                
              <div className="sk-three-bounce">
                  <div className="sk-child sk-bounce1"></div>
                  <div className="sk-child sk-bounce2"></div>
                  <div className="sk-child sk-bounce3"></div>
              </div>
          </div>  
        }
      >
        <Index /> 
      </Suspense>
    </>
  );
};

export default App; 
