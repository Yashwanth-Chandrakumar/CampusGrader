import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LandingPage } from "./sections/LandingPage";
import { LoginFormDemo } from "./sections/Login";
import { SignupFormDemo } from "./sections/Signup";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupFormDemo />} />
          <Route path="/login" element={<LoginFormDemo />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
