import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

function HomePage() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default HomePage;
