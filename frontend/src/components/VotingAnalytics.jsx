import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../contractJson/voting.json"; // Ensure your ABI file path is correct
import { Pie, Bar } from "react-chartjs-2";
import { Chart, ArcElement, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

Chart.register(ArcElement, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale); // Register Chart.js components

const VotingAnalytics = () => {
  const [candidates, setCandidates] = useState([]);

  // Blockchain contract details
  const contractAddress = "0x9196cEB7EfE589c1Ce46355807093a7BF2427f3E";
  const contractAbi = abi.abi;

  useEffect(() => {
    const fetchVotingData = async () => {
      try {
        const { ethereum } = window;
        if (!ethereum) {
          alert("MetaMask is not installed. Please install it to use this app.");
          return;
        }

        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractAbi, signer);

        // Fetch all candidates and their vote counts
        const candidatesList = await contract.getAllVotesOfCandiates();
        const formattedCandidates = candidatesList.map((candidate, index) => {
          return {
            index: index,
            name: candidate[0], // assuming candidate[0] is the name
            voteCount: Number(candidate[1]), // assuming candidate[1] is the vote count
          };
        });
        setCandidates(formattedCandidates);
      } catch (error) {
        console.error("Error fetching voting data:", error);
      }
    };

    fetchVotingData();
  }, []);

  // Prepare data for the pie chart
  const pieChartData = {
    labels: candidates.map((candidate) => candidate.name),
    datasets: [
      {
        data: candidates.map((candidate) => candidate.voteCount),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverOffset: 4,
      },
    ],
  };

  // Prepare data for the bar chart
  const barChartData = {
    labels: candidates.map((candidate) => candidate.name),
    datasets: [
      {
        label: "Vote Count",
        data: candidates.map((candidate) => candidate.voteCount),
        backgroundColor: "#4BC0C0",
      },
    ],
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Voting Analytics</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {candidates.length > 0 ? (
          <>
            <div className="flex justify-around mb-6">
              <div style={{ width: '40%', height: '300px' }}>
                <Pie data={pieChartData} />
              </div>
              <div style={{ width: '40%', height: '300px' }}>
                <Bar data={barChartData} />
              </div>
            </div>
            <div className="mt-6">
              {candidates.map((candidate, index) => (
                <div key={index} className="flex justify-between items-center bg-orange-400 rounded-lg p-4 mb-2">
                  <span className="text-lg font-bold">{candidate.name}</span>
                  <span className="text-lg">{candidate.voteCount} votes</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>No candidates available.</p>
        )}
      </div>
    </div>
  );
};

export default VotingAnalytics;
