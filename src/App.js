/* eslint-disable react/jsx-props-no-spreading */
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
// import Home from './components/Home';
import Home from './homepage/Home';
import Add from './components/Add';
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
import AllNodes from './components/Allnodes';
import UserProfile from './components/UserProfile';
import CreateUser from './components/CreateUser';
import AddAdvanced from './components/AddAdvanced';

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
          {/* Open Routes */}
          <Route path="/" element={<Home />} />

          {/* Public Only Routes */}
          <Route path="login" element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Private Only Routes */}
          <Route path="private" element={<PrivateRoute />}>
            <Route path="/private" element={<PrivateComponent />} />
          </Route>
          <Route path="profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<UserProfile />} />
          </Route>
          <Route path="create-user" element={<PrivateRoute />}>
            <Route path="/create-user" element={<CreateUser />} />
          </Route>
          <Route path="verticals" element={<PrivateRoute />}>
            <Route path="/verticals" element={<Vertical />} />
            <Route path="/verticals/:id" element={<Details />} />
          </Route>
          <Route path="details" element={<PrivateRoute />}>
            <Route path="/details" element={<Details />} />
          </Route>
          <Route path="allnodes" element={<PrivateRoute />}>
            <Route path="/allnodes" element={<AllNodes />} />
          </Route>
          <Route path="nodedata" element={<PrivateRoute />}>
            <Route path="/nodedata" element={<Nodedata />} />
            <Route path="/nodedata/:id" element={<Nodedata />} />
          </Route>
          <Route path="addnode" element={<PrivateRoute />}>
            <Route path="/addnode" element={<Addnode />} />
          </Route>
          <Route path="addvertical" element={<PrivateRoute />}>
            <Route path="/addvertical" element={<Addvertical />} />
          </Route>
          <Route path="addsensor" element={<PrivateRoute />}>
            <Route path="/addsensor" element={<Addsensor />} />
          </Route>
          <Route path="add" element={<PrivateRoute />}>
            <Route path="/add" element={<Add />} />
          </Route>
          <Route path="add-advanced" element={<PrivateRoute />}>
            <Route path="/add-advanced" element={<AddAdvanced />} />
          </Route>

          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TopBar>
    </Router>
  );
}

export default App;
