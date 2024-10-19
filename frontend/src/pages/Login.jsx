import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  const navigate = useNavigate();
  const [votingId, setVotingId] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Initialize reCAPTCHA
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible", // Invisible recaptcha
          callback: () => {
            console.log("Recaptcha verified");
          },
          "expired-callback": () => {
            setError("Recaptcha expired. Please try again.");
          },
        },
      );
    }
  };

  const handleSendOtp = async () => {
    if (!votingId) {
      setError("Please enter your voter ID");
      return;
    }

    try {
      const userDocRef = doc(db, "users", votingId); // Assume voting ID is the document ID
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const phoneNumber = userData.phoneNumber;
        setModalMessage(
          `Valid user found: ${userData.name}. Sending OTP to ${phoneNumber}`,
        );
        setShowModal(true); // Show modal with message

        // Set up reCAPTCHA
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;

        // Send OTP
        const confirmation = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          appVerifier,
        );
        setConfirmationResult(confirmation);
        setOtpSent(true);
        setError(""); // Clear any previous errors
        setModalMessage("OTP sent to your phone");
        setShowModal(true); // Show modal with message
      } else {
        setError("Invalid voting ID. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP: ", error);
      setError("Error sending OTP. Please try again later.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    try {
      await confirmationResult.confirm(otp);
      setModalMessage("User signed in successfully");
      setShowModal(true); // Show modal with message
      navigate("/home"); // Redirect to Home page
    } catch (error) {
      console.error("Error verifying OTP: ", error);
      setError("Invalid OTP. Please try again.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-top bg-no-repeat"
      style={{
        backgroundImage: `url('https://a.travel-assets.com/findyours-php/viewfinder/images/res40/67000/67991-New-Delhi.jpg')`,
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 p-12 pb-16 bg-white rounded-lg shadow-lg max-w-sm w-full text-center">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Enter your voter ID number
        </h1>

        <input
          type="text"
          placeholder="Enter your Voter ID"
          value={votingId}
          onChange={(e) => setVotingId(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          onClick={handleSendOtp}
          className={`w-full p-3 rounded-lg transition duration-300 ${
            otpSent
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-400 hover:bg-green-600 text-white"
          }`}
          disabled={otpSent}
        >
          {otpSent ? "OTP Sent" : "Send OTP"}
        </button>

        {/* Error Message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Recaptcha Container */}
        <div id="recaptcha-container"></div>

        {otpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 my-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-400 text-white p-3 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold mb-4">Notification</h2>
            <p>{modalMessage}</p>
            <button
              onClick={closeModal}
              className="mt-6 bg-green-400 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
