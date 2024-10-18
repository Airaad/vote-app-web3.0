import React from "react";
import { auth } from "../firebase"; // Firebase auth import
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    return (
        <button onClick={handleLogout} className="btn btn-primary">
            Logout
        </button>
    );
};

export default Logout;
