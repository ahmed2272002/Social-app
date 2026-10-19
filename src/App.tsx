import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import AuthLayout from "./Layouts/AuthLayout";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import MainLayout from "./Layouts/MainLayout";
import NewsFeed from "./Pages/NewsFeed/NewsFeed";
import Profile from "./Pages/Profile/Profile"
import Notification from "./Pages/Notification/Notification";
import NotFound from "./Pages/NotFound/NotFound";
import { Toaster } from "react-hot-toast";
import AppProtectedRoutes from "./Components/ProtectedRoutes/AppProtectedRoutes";
import AuthProtectedRoutes from "./Components/ProtectedRoutes/AuthProtectedRoutes";
import PostDetails from "./Pages/PostDetails/PostDetails";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { Offline } from "react-detect-offline";
import ChangePassword from "./Pages/Settings/ChangePassword";



function App() {
  const routes = createBrowserRouter([
    {
      path: "/auth",
      element: <AuthProtectedRoutes><AuthLayout /></AuthProtectedRoutes>,
      children: [
        { index: true, element: <Navigate to="Login" /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
      ],
    },

    {
      path: "/",
      element: <AppProtectedRoutes><MainLayout /></AppProtectedRoutes>,
      children: [
        { index: true ,element: <Navigate to={'/feed'} /> },
        { path: "feed" , element: <NewsFeed/>},
        {path: 'profile' , element : <Profile/>},
        {path: 'notification' , element : <Notification/>},
        {path: 'postDetails/:id' , element : <PostDetails/>},
        {path : 'Setting' , element: <ChangePassword/> }
        
      ],
    },
    {path: '*' , element: <NotFound/>},
  ]);

  return (
    <>
      <RouterProvider router={routes} />
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
      <div>
    
    <Offline>Only shown offline (surprise!)</Offline>
  </div>
    </>
  );
}

export default App;
