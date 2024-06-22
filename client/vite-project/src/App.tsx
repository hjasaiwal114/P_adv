import "./App.css";
import { BrowswerRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Dashboard } from ",/pages/dashboard";
import { Auth } from "./pages/auth";
import { FinacialRecordsProvider } from "./contexts/financial-record-context";
import { SignedIn, UserButton } from "@clerk/clerk-react";
// import { dark } from "@clerk/themes";

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="navbar">
          <Link to="/">Dashboard</Link>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
        <Routes 
          path="/"
          element={
            <FinacialRecordsProvider>
              <Dashboard />
            </FinacialRecordsProvider>
          }
          />
          <Route path="/auth" element={<Auth />} />
      </div>
    </Router>
  );
}

export default App;