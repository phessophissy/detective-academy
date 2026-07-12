"use client";

import { useGame } from "@/context/GameContext";
import Dashboard from "@/components/Dashboard";
import CaseView from "@/components/CaseView";

export default function Home() {
  const { currentCase, isLoading } = useGame();

  if (isLoading && !currentCase) {
    return (
      <div className="bootScreen">
        <div className="bootLogo">🕵️</div>
        <div className="bootSpinner" />
        <p className="bootText">Booting Academy Interface…</p>
      </div>
    );
  }

  if (!currentCase) {
    return <Dashboard />;
  }

  return <CaseView caseData={currentCase} />;
}
