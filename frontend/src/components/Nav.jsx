import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";

const dummyUserImage = "https://via.placeholder.com/40"; // Dummy user image URL

const NavLinks = ({ user, handleLogout, isMobile }) => {
  const navigate = useNavigate();

  return (
    <>
      <NavLink to="/home" className="text-white font-semibold">
        Home
      </NavLink>
      {isMobile && user && (
        <NavLink to="/my-account" className="text-white font-semibold">
          My Account
        </NavLink>
      )}
      {user && (
        <div className="flex items-center gap-3">
          {!isMobile && ( // Hide the profile image on mobile, but still show it on full screen
           <NavLink to="/my-account">
           <img
              src={dummyUserImage}
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
            </NavLink>
          )}
          <button
            onClick={handleLogout}
            className="w-20 h-9 bg-red-500 rounded-xl font-bold text-white"
          >
            Log Out
          </button>
        </div>
      )}
    </>
  );
};

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(false); // Set user to true for demonstration
  const userImage = ""; // Replace with user image URL if available

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
        await signOut(auth);
        navigate("/");
    } catch (error) {
        console.error("Error logging out: ", error);
    }
};
  useEffect(() => {
    // Monitor Firebase Authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set the authenticated user
      } else {
        setUser(null); // Reset user to null if not logged in
      }
    });

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, []);

  return (
    <>
      <nav className="w-1/3 flex justify-end">
        {/* Full screen (desktop view) */}
        <div className="hidden w-full justify-end gap-10 md:flex items-center">
          <NavLinks user={user} handleLogout={handleLogout} isMobile={false} />
        </div>

        {/* Mobile view (toggle) */}
        <div className="md:hidden">
          <button onClick={toggleNavbar}>
            {isOpen ? (
              <X color="#ffffff" />
            ) : user ? (
              <img
                src={userImage || dummyUserImage}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <Menu color="#ffffff" />
            )}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="flex basis-full flex-col gap-3 items-center mt-7">
          <NavLinks user={user} handleLogout={handleLogout} isMobile={true} />
        </div>
      )}
    </>
  );
}
