import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../contractJson/voting.json";
import { FaVoteYea, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import VotingAnalytics from "../components/VotingAnalytics";

const VotingPage = () => {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [account, setAccount] = useState(null); // Changed to 'null' initially
  const [candidates, setCandidates] = useState([]);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [votedCandidate, setVotedCandidate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const candidateImages = [
    "https://img.freepik.com/free-vector/smiling-cartoon-character-face_1308-173528.jpg",
    "https://img.freepik.com/premium-vector/smiling-boy-tuxedo_1639-59735.jpg",
    "https://img.freepik.com/free-vector/handsome-boy-with-brown-eyes-black-hair_1308-160536.jpg",
    // Add more image URLs here for each candidate
  ];

  useEffect(() => {
    const initialize = async () => {
      const contractAddress = "0x9196cEB7EfE589c1Ce46355807093a7BF2427f3E";
      const contractAbi = abi.abi;

      try {
        const { ethereum } = window;

        if (!ethereum) {
          alert("MetaMask is not installed. Please install it to use this app.");
          return;
        }

        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length === 0) {
          // User is not connected to MetaMask
          setAccount(null);
        } else {
          setAccount(accounts[0]); // Set the connected account

          const provider = new ethers.BrowserProvider(ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(contractAddress, contractAbi, signer);
          setState({ provider, signer, contract });

          const candidatesData = await contract.getAllVotesOfCandiates();
          const formattedCandidates = candidatesData.map((candidate) => ({
            name: candidate.name,
          }));
          setCandidates(formattedCandidates);
        }
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    };

    initialize();
  }, []);

  const voteForCandidate = async (index) => {
    try {
      const { contract } = state;
      if (contract) {
        const transaction = await contract.vote(index);
        await transaction.wait();
        setVotedCandidate(candidates[index].name);
        setVoteSuccess(true);
      }
    } catch (error) {
      console.error("Error while voting:", error);
      if (error.message.includes("already voted")) {
        setErrorMessage("You have already voted and cannot vote again.");
      } else {
        setErrorMessage(error.message || "Failed to cast vote.");
      }
    }
  };

  const closeDialog = () => {
    setVoteSuccess(false);
    setErrorMessage("");
  };

  return (
    <div className="p-5 flex flex-col gap-6 justify-center bg-green-800">
      {!account ? (
        <div className="text-center flex justify-center items-center text-xl font-semibold text-red-500">
          Connect your MetaMask to proceed further
        </div>
      ) : (
        <>
          <h1 className="text-center text-5xl font-semibold my-8 text-white">Vote for Your Candidate</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate, index) => (
              <div
                key={index}
                className="bg-orange-300 p-4 rounded-lg shadow-md flex flex-col items-center text-center"
              >
                <img
                  src={candidateImages[index]} // Each candidate has a different image
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-4"
                  alt={candidate.name}
                />
                <h3 className="text-lg md:text-xl font-bold mb-2">{candidate.name}</h3>
                <button
                  onClick={() => voteForCandidate(index)}
                  className="flex items-center gap-2 py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm md:text-base"
                >
                  <FaVoteYea /> Vote
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Success Dialog */}
      {voteSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <FaCheckCircle className="text-green-500 text-4xl mb-4" />
            <h2 className="text-2xl font-bold mb-4">Vote Successful!</h2>
            <p className="text-lg">
              You have successfully voted for <strong>{votedCandidate}</strong>.
            </p>
            <button
              onClick={closeDialog}
              className="mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Error Dialog */}
      {errorMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <FaTimesCircle className="text-red-500 text-4xl mb-4" />
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="text-lg">You Have already Voted</p>
            <button
              onClick={closeDialog}
              className="mt-4 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <VotingAnalytics/>
    </div>
  );
};

export default VotingPage;
