import React from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { HomePage } from './pages/HomePage';
import { loader as homePageLoader } from './pages/HomePage';
import { MainMenu } from './pages/MainMenu';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainMenu />,
    children: [
      { index: true, element: <HomePage />, loader: homePageLoader },
    ],
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
