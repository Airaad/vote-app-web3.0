import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FaUserAlt, FaPhoneAlt, FaIdBadge } from 'react-icons/fa';

const MyAccount = () => {
  const user = useSelector((state) => state.user.userData); // Assuming user data is in Redux
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.votingId) {
        try {
          const userDocRef = doc(db, 'users', user.votingId);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUserDetails(userDoc.data());
          } else {
            console.error('User not found in the database');
          }
        } catch (error) {
          console.error('Error fetching user data: ', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  if (!userDetails) {
    return <div className="text-center text-lg text-gray-500">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-500 to-yellow-400 p-6">
      {/* Circular User Image
      <div className="mb-6">
        <img
          src="https://via.placeholder.com/150"
          alt="User"
          className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg"
        />
      </div> */}

      {/* Title */}
      <h1 className="mb-5 font-bold text-3xl md:text-5xl text-white">My Info</h1>

      {/* User Details in Table */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <table className="w-full table-fixed">
          <tbody>
            <tr className="border-b">
              <td className="py-4 pr-4 text-gray-600 flex items-center">
                <FaUserAlt className="mr-2 text-green-500" /> Name
              </td>
              <td className="py-4 pl-4 text-gray-800 font-semibold">
                {userDetails.name || 'Not available'}
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-4 pr-4 text-gray-600 flex items-center">
                <FaPhoneAlt className="mr-2 text-green-500" /> Phone Number
              </td>
              <td className="py-4 pl-4 text-gray-800 font-semibold">
                {userDetails.phoneNumber || 'Not available'}
              </td>
            </tr>
            <tr>
              <td className="py-4 pr-4 text-gray-600 flex items-center">
                <FaIdBadge className="mr-2 text-green-500" /> Voting ID
              </td>
              <td className="py-4 pl-4 text-gray-800 font-semibold">
                {userDetails.votingId || 'Not available'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAccount;
