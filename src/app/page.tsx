"use client";

import { useGame } from "@/context/GameContext";
import Dashboard from "@/components/Dashboard";
import CaseView from "@/components/CaseView";

export default function Home() {
  const { currentCase, isLoading } = useGame();

  if (isLoading && !currentCase) {
    return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>Loading Academy Interface...</div>;
  }

  if (!currentCase) {
    return <Dashboard />;
  }

  return <CaseView caseData={currentCase} />;
}
