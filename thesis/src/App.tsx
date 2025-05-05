import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { ToastProvider } from 'ui-kit/toast/ToastProvider';

import { AuthPage } from 'pages/AuthPage';
import { MainPage } from 'pages/MainPage';

import { RouteLayout } from 'common/RouteLayout/RouteLayout';

const App = () => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token !== null && token !== 'undefined';
  };

  const ProtectedRoute = ({ element }: { element: React.ReactElement }) => {
    return isAuthenticated() ? element : <Navigate to='/auth' replace />;
  };

  const PublicRoute = ({ element }: { element: React.ReactElement }) => {
    return !isAuthenticated() ? element : <Navigate to='/main' replace />;
  };

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<RouteLayout />}>
            <Route index element={<Navigate to={isAuthenticated() ? '/main' : '/auth'} replace />} />
            <Route path='/auth' element={<PublicRoute element={<AuthPage />} />} />
            <Route path='/main' element={<ProtectedRoute element={<MainPage />} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
