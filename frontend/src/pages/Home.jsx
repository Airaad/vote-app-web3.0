import React from "react";
import SlidingCarousal from "../components/SlidingCarousal";
import Features from "../components/Features";
import FAQ from "../components/FAQ";
import VotingAnalytics from "../components/VotingAnalytics";
import Logout from "../components/Logout";

export default function Home() {
  return (
    <div>
      <SlidingCarousal />
      <VotingAnalytics />
      <Features />
      <Logout/>
      <FAQ />
    </div>
  );
}

















































