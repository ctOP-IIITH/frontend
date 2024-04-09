/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { RingLoader } from 'react-spinners';
import { Box } from '@mui/system';

import { useAuth } from './contexts/AuthContext';
import { isAxiosReady } from './services/axiosConfig';

import Home from './homepage/Home';
import PrivateComponent from './components/PrivateComponent';
import NotFound from './components/NotFound';
import TopBar from './components/TopBar';

// Lazy load other components
const Add = lazy(() => import('./components/Add'));
const Vertical = lazy(() => import('./components/Vertical'));
const Details = lazy(() => import('./components/Details'));
const Nodedata = lazy(() => import('./components/Nodedata'));
const Addnode = lazy(() => import('./components/Addnode'));
const Addvertical = lazy(() => import('./components/Addvertical'));
const Addsensor = lazy(() => import('./components/Addsensor'));
const Login = lazy(() => import('./components/Login'));
const UserProfile = lazy(() => import('./components/UserProfile'));
const CreateUser = lazy(() => import('./components/CreateUser'));
const AddAdvanced = lazy(() => import('./components/AddAdvanced'));

function PrivateRoute() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
}

function PublicRoute() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/" /> : <Outlet />;
}

function CenteredLoading() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <RingLoader color="#123462" loading />
    </Box>
  );
}


function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAxiosReady = async () => {
      isAxiosReady.then(() => {
        setIsLoading(false);
      });
    };

    checkAxiosReady();
  }, [isAxiosReady]);

  if (isLoading) {
    return <CenteredLoading />;
  }

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Suspense fallback={<CenteredLoading />}>
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
      </Suspense>
    </Router>
  );
}

export default App;
