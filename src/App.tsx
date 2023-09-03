import React from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { HomePage } from './pages/HomePage';
import { loader as homePageLoader } from './pages/HomePage';

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, element: <HomePage />, loader: homePageLoader },
    ],
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
