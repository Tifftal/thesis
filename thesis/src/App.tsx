import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AuthPage } from 'pages/AuthPage';
import { MainPage } from 'pages/MainPage';

import { RouteLayout } from 'common/RouteLayout/RouteLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<RouteLayout />}>
          <Route path='/main' element={<MainPage />} />
          <Route path='/auth' element={<AuthPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
