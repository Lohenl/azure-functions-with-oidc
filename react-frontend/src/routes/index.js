import { Navigate } from 'react-router-dom';

// Testing Components
import TestPage from '../pages/Test/TestPage';

const authProtectedRoutes = [

  { path: '/test-page', component: TestPage },

  { path: '/', exact: true, component: () => <Navigate to='/test-page' /> },
  // this route should be at the end of all other routes for default redirection
  { path: '*', component: () => <Navigate to='/test-page' /> },
];

const publicRoutes = [
  { path: '/pages-faqs', component: TestPage },
];

export { authProtectedRoutes, publicRoutes };
