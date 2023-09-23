import React from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { HomePage } from './pages/HomePage';
import { MainMenu } from './pages/layouts/MainMenu';
import { CharacterPage } from './pages/CharacterPage';
import { AuthenticatedLayout } from './pages/layouts/AuthenticatedLayout';
import { AuthPage } from './pages/AuthPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainMenu />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "auth", element: <AuthPage /> },
      {
        path: "user",
        element: <AuthenticatedLayout />,
        children : [
          {index: true, element: <CharacterPage />}
        ]
      }
    ],
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
