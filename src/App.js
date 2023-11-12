/* eslint-disable react/jsx-props-no-spreading */
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
// import { useAuth } from './AuthContext';
import Home from './components/Home';
import PrivateComponent from './components/PrivateComponent';
import NotFound from './components/NotFound';

function PrivateRoute() {
  const isLoggedIn = false; // useAuth();

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="private" element={<PrivateRoute />}>
          <Route path="/private" element={<PrivateComponent />} />
        </Route>
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
