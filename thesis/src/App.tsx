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
    return isAuthenticated() ? element : <Navigate to='/auth/login' replace />;
  };

  const PublicRoute = ({ element }: { element: React.ReactElement }) => {
    return !isAuthenticated() ? element : <Navigate to='/main' replace />;
  };

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<RouteLayout />}>
            <Route index element={<Navigate to={isAuthenticated() ? '/main' : '/auth/login'} replace />} />
            <Route path='/auth/login' element={<PublicRoute element={<AuthPage />} />} />
            <Route path='/auth/registration' element={<PublicRoute element={<AuthPage />} />} />
            <Route path='/auth/*' element={<Navigate to='/auth/login' replace />} />
            <Route path='/main' element={<ProtectedRoute element={<MainPage />} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
