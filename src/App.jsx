import { createBrowserRouter, RouterProvider } from "react-router";
import MainLayout from "./layout/MainLayout";
import DashboardLayout from "./layout/DashboardLayout";
import PrivateRoute from "./routes/PrivateRoute";
import ApartmentDetails from "./pages/ApartmentDetails";
import Overview from "./pages/dashboard/Overview";

import Home from "./pages/Home";
import Apartments from "./pages/Apartments";
import Login from "./pages/Login";
import Register from "./pages/Register";

import UserProfile from "./pages/dashboard/UserProfile";
import MakePayment from "./pages/dashboard/member/MakePayment";
import PaymentHistory from "./pages/dashboard/member/PaymentHistory";
import Announcements from "./pages/dashboard/Announcements";
import AgreementRequests from "./pages/dashboard/admin/AgreementRequests";
import MakeAnnouncement from "./pages/dashboard/admin/MakeAnnouncement";
import ManageMembers from "./pages/dashboard/admin/ManageMembers";
import ManageCoupons from "./pages/dashboard/admin/ManageCoupons";
import AdminProfile from "./pages/dashboard/admin/AdminProfile";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> }, // default "/"
      { path: "apartments", element: <Apartments /> },
      { path: "apartments/:id", element: <ApartmentDetails /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "contact", element: <Contact /> },

      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // Default /dashboard → Overview
      {
        index: true,
        element: (
          <PrivateRoute requiredRole={["admin", "user", "member"]}>
            <Overview />
          </PrivateRoute>
        ),
      },
      {
        path: "my-profile",
        element: (
          <PrivateRoute requiredRole={["user", "member", "admin"]}>
            <UserProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "announcements",
        element: (
          <PrivateRoute requiredRole={["user", "member", "admin"]}>
            <Announcements />
          </PrivateRoute>
        ),
      },
      {
        path: "make-payment",
        element: (
          <PrivateRoute requiredRole={["member", "admin"]}>
            <MakePayment />
          </PrivateRoute>
        ),
      },
      {
        path: "payment-history",
        element: (
          <PrivateRoute requiredRole={["member", "admin"]}>
            <PaymentHistory />
          </PrivateRoute>
        ),
      },
      {
        path: "agreement-requests",
        element: (
          <PrivateRoute requiredRole="admin">
            <AgreementRequests />
          </PrivateRoute>
        ),
      },
      {
        path: "make-announcement",
        element: (
          <PrivateRoute requiredRole="admin">
            <MakeAnnouncement />
          </PrivateRoute>
        ),
      },
      {
        path: "manage-members",
        element: (
          <PrivateRoute requiredRole="admin">
            <ManageMembers />
          </PrivateRoute>
        ),
      },
      {
        path: "manage-coupons",
        element: (
          <PrivateRoute requiredRole="admin">
            <ManageCoupons />
          </PrivateRoute>
        ),
      },
      {
        path: "admin-profile",
        element: (
          <PrivateRoute requiredRole="admin">
            <AdminProfile />
          </PrivateRoute>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
