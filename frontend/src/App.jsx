import React from "react";
import { VotingPage, Home, Login } from "./pages/index";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { Provider } from "react-redux";
import NotFound from "./pages/NotFound";
import MyAccount from "./pages/MyAccount";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/votingPage"
                element={
                  <ProtectedRoute>
                    <VotingPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-account"
                element={
                  <ProtectedRoute>
                    <MyAccount />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}
