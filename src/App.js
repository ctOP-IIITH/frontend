/* eslint-disable react/jsx-props-no-spreading */
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
// import { useAuth } from './AuthContext';
import Home from './components/Home';
import PrivateComponent from './components/PrivateComponent';
import NotFound from './components/NotFound';
import TopBar from './components/TopBar';
import Login from './components/Login';
import Subscribe from './components/Subscribe';
import Getsub from './components/getsub';
import { useAuth } from './contexts/AuthContext';

function PrivateRoute() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
}

function PublicRoute() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/" /> : <Outlet />;
}

function App() {
  return (
    <Router>
      <TopBar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route path="private" element={<PrivateRoute />}>
            <Route path="/private" element={<PrivateComponent />} />
          </Route>
          <Route path="subscribe" element={<PublicRoute />}>
            <Route path="/subscribe" element={<Subscribe />} />
          </Route>
          <Route path="getsub" element={<PublicRoute />}>
            <Route path="/getsub" element={<Getsub />} />
          </Route>
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TopBar>
    </Router>
  );
}

export default App;
