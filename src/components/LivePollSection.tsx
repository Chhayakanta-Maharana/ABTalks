"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Trophy, ArrowRight, Sparkles, Activity, Users } from "lucide-react";

interface PollOption {
  id: string;
  text: string;
  votes: number;
  color: string;
}

interface Poll {
  id: string;
  question: string;
  category: string;
  options: PollOption[];
  totalVotes: number;
  createdAt: string;
  expiresInMinutes: number;
  isClosed: boolean;
  userVotedOptionId?: string | null;
}

const DEFAULT_POLL: Poll = {
  id: "poll-active-main",
  question: "What is your primary AI coding model for rapid prototyping?",
  category: "AI & Engineering",
  options: [
    { id: "opt-1", text: "Gemini 3.6 Flash / Pro (High Speed)", votes: 12, color: "from-blue-500 to-indigo-600" },
    { id: "opt-2", text: "Claude 3.7 Sonnet (Thinking)", votes: 8, color: "from-[#3B82F6] to-cyan-400" },
    { id: "opt-3", text: "GPT-4o / O3-Mini", votes: 5, color: "from-violet-500 to-purple-600" },
    { id: "opt-4", text: "DeepSeek V3 / R1 Open Models", votes: 4, color: "from-emerald-400 to-teal-600" }
  ],
  totalVotes: 29,
  createdAt: "Just now",
  expiresInMinutes: 20,
  isClosed: false,
  userVotedOptionId: null
};

export default function LivePollSection() {
  const [currentPoll, setCurrentPoll] = useState<Poll>(DEFAULT_POLL);
  const [votedOptionId, setVotedOptionId] = useState<string | null>(null);

  // Sync poll from localStorage on load & when updated
  const syncPoll = () => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("abtalks_polls_v1");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCurrentPoll(parsed[0]);
            setVotedOptionId(parsed[0].userVotedOptionId || null);
          }
        }
      } catch (e) {
        console.error("Failed to sync poll in LivePollSection:", e);
      }
    }
  };

  useEffect(() => {
    syncPoll();

    // Listen for storage events across tabs or components
    const handleUpdate = () => syncPoll();
    window.addEventListener("abtalks_polls_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("abtalks_polls_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const totalVotes = currentPoll.options?.reduce((acc, opt) => acc + opt.votes, 0) || 0;
  const leadingOption = currentPoll.options ? [...currentPoll.options].sort((a, b) => b.votes - a.votes)[0] : null;

  const handleVote = async (optionId: string) => {
    if (votedOptionId === optionId || currentPoll.isClosed) return;

    const prevVoted = votedOptionId;
    const updatedOptions = (currentPoll.options || []).map((opt) => {
      if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
      if (prevVoted && opt.id === prevVoted) return { ...opt, votes: Math.max(0, opt.votes - 1) };
      return opt;
    });

    const newTotal = updatedOptions.reduce((acc, opt) => acc + opt.votes, 0);
    const updatedPoll: Poll = {
      ...currentPoll,
      options: updatedOptions,
      totalVotes: newTotal,
      userVotedOptionId: optionId
    };

    setCurrentPoll(updatedPoll);
    setVotedOptionId(optionId);

    // Save to localStorage
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("abtalks_polls_v1");
        let allPolls: Poll[] = saved ? JSON.parse(saved) : [];
        allPolls = allPolls.map((p) => (p.id === updatedPoll.id ? updatedPoll : p));
        if (!allPolls.find((p) => p.id === updatedPoll.id)) {
          allPolls.unshift(updatedPoll);
        }
        localStorage.setItem("abtalks_polls_v1", JSON.stringify(allPolls));
        window.dispatchEvent(new Event("abtalks_polls_updated"));
      } catch (e) {
        console.error("Storage error:", e);
      }
    }

    // Persist to API
    try {
      await fetch(`/api/polls/${currentPoll.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId, prevOptionId: prevVoted })
      });
    } catch (e) {
      console.warn("API vote sync error:", e);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 md:px-12 relative z-10 max-w-7xl mx-auto">
      <div className="navy-card p-6 sm:p-10 md:p-12 rounded-3xl border border-slate-800/80 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-slate-800/80 pb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#3B82F6]/15 border border-[#3B82F6]/30 text-[#3B82F6] uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5" /> LIVE COMMUNITY POLL
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-400" /> <strong>{totalVotes}</strong> votes cast
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
              {currentPoll.question}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Cast your vote below to watch the live animated percentage bar chart update in real-time.
            </p>
          </div>

          <Link
            href="/polls"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[linear-gradient(135deg,#2563EB,#1D4ED8)] hover:bg-[linear-gradient(135deg,#3B82F6,#2563EB)] text-white text-xs font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all whitespace-nowrap"
          >
            <span>Open Poll Creator Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Interactive Bar Chart Options */}
        <div className="space-y-4 relative z-10">
          {(currentPoll.options || []).map((option, idx) => {
            const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
            const isVoted = votedOptionId === option.id;
            const isLeading = leadingOption?.id === option.id && option.votes > 0;

            return (
              <div
                key={option.id}
                onClick={() => handleVote(option.id)}
                className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                  isVoted
                    ? "bg-blue-950/40 border-[#3B82F6] shadow-[0_0_25px_rgba(59,130,246,0.3)] ring-1 ring-[#3B82F6]"
                    : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90"
                }`}
              >
                {/* Background Fill Bar */}
                <div
                  className={`absolute top-0 bottom-0 left-0 bg-gradient-to-r ${option.color || "from-blue-500 to-indigo-600"} opacity-20 transition-all duration-700 ease-out`}
                  style={{ width: `${percentage}%` }}
                />

                {/* Content */}
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono font-bold flex items-center justify-center text-slate-300">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-semibold text-white truncate">{option.text}</span>
                    {isVoted && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        <Check className="w-3 h-3" /> Voted
                      </span>
                    )}
                    {isLeading && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <Trophy className="w-3 h-3" /> Leading
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                      {option.votes} votes
                    </span>
                    <span className="text-base font-black text-white font-mono w-14 text-right">
                      {percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="relative z-10 w-full h-1.5 bg-slate-950/80 rounded-full mt-3 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${option.color || "from-blue-500 to-indigo-600"} transition-all duration-1000 ease-out rounded-full`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between text-xs text-slate-400 relative z-10">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Click any option to vote or visit Polls page to create your own
          </span>
          <Link href="/polls" className="text-blue-400 font-bold hover:underline flex items-center gap-1">
            Create Custom Poll <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
