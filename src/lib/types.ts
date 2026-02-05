export type PlayerRank = 'Cadet' | 'Investigator' | 'Senior Detective';

export interface PlayerState {
    rank: PlayerRank;
    completedCases: number;
    accuracyScore: number; // 0-100
    currentCaseId: string | null;
    history: CaseHistory[];
}

export interface CaseHistory {
    caseId: string;
    score: number;
    date: string;
}

export interface Case {
    id: string;
    title: string;
    difficulty: number; // 1-5
    description: string;
    scenes: Scene[];
    suspects: Suspect[];
    correctHypothesisVector: string; // The "truth" used for validation
}

export interface Scene {
    id: string;
    title: string;
    description: string;
    imageUrl: string; // Placeholder or generated
    clues: Clue[];
}

export interface Clue {
    id: string;
    description: string;
    type: 'physical' | 'testimony' | 'digital';
    coordinates?: { x: number; y: number }; // For visual inspection
    isHidden: boolean; // Requires investigation to find
}

export interface Suspect {
    id: string;
    name: string;
    profile: string;
    alibi: string;
    isGuilty: boolean;
}

export interface Evidence {
    id: string;
    description: string;
    source: string; // "Photo of knife", "Witness statement"
    timestamp: string;
}

export interface Hypothesis {
    statement: string;
    supportingEvidenceIds: string[];
}

export interface EngineResponse {
    score: number;
    feedback: string;
    reasoningTrace: string[]; // For transparency mode
    nextHint?: string;
    isCorrect: boolean;
}
