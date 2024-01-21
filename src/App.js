/* eslint-disable react/jsx-props-no-spreading */
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
// import { useAuth } from './AuthContext';
import Home from './components/Home';
import Vertical from './components/Vertical';
import Details from './components/Details';
import Nodedata from './components/Nodedata';
import Addnode from './components/Addnode';
import Addvertical from './components/Addvertical';
import Addsensor from './components/Addsensor';
import PrivateComponent from './components/PrivateComponent';
import NotFound from './components/NotFound';
import TopBar from './components/TopBar';
import Login from './components/Login';
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

           <Route path="/vertical" element={<Vertical />} /> 
           <Route path="/details" element={<Details />} /> 
           <Route path="/nodedata/:id" element={<Nodedata />} /> 
           <Route path="/nodedata" element={<Nodedata />} /> 
           <Route path="/vertical/:id" element={<Details />} />
           <Route path="/addnode" element={<Addnode />} /> 
           <Route path="/addvertical" element={<Addvertical />} /> 
           <Route path="/addsensor" element={<Addsensor />} /> 
          
          <Route path="login" element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route path="private" element={<PrivateRoute />}>
            <Route path="/private" element={<PrivateComponent />} />
          </Route>
          
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TopBar>
    </Router>
  );
}

export default App;
