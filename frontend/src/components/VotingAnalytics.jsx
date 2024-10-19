import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../contractJson/voting.json"; // Ensure your ABI file path is correct
import { Pie, Bar } from "react-chartjs-2";
import { Chart, ArcElement, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { FaVoteYea } from 'react-icons/fa'; // Icon for votes
import { MdPerson } from 'react-icons/md';  // Icon for candidate name

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
    <div className="p-5 md:p-20">
      <h1 className="text-4xl font-medium mb-6">Voting Analytics</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {candidates.length > 0 ? (
          <>
            <div className="flex flex-col items-center gap-5 lg:flex-row lg:justify-around">
              <div className="w-[80%] lg:w-[60%] h-[300px]">
                <Pie data={pieChartData} />
              </div>
              <div className="w-full lg:w-[60%] ">
                <Bar data={barChartData} />
              </div>
            </div>
            <div className="mt-6">
      <table className="min-w-full bg-white shadow-lg rounded-lg">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="py-3 px-6 text-left">
              <MdPerson className="inline-block mr-2 text-lg" />
              Candidate
            </th>
            <th className="py-3 px-6 text-right">
              <FaVoteYea className="inline-block mr-2 text-lg" />
              Votes
            </th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate, index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-4 px-6 text-lg font-semibold text-gray-700">
                {candidate.name}
              </td>
              <td className="py-4 px-6 text-lg font-bold text-right text-green-600">
                {candidate.voteCount} votes
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
          </>
        ) : (
          <p className="text-red-500">Connect Your Metamask Account</p>
        )}
      </div>
    </div>
  );
};

export default VotingAnalytics;
