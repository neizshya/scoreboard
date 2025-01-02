"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Loading from "./loading";
import { baseAPI } from "../api/baseAPI";
import { Scores } from "../type/type";

async function fetchScores(): Promise<Scores[]> {
  const res = await fetch(baseAPI);
  const scores: Scores[] = await res.json();
  return scores;
}

const LeaderBoard = () => {
  const [scores, setScores] = useState<Scores[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [minScore, setMinScore] = useState<number | "">("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadScores = async () => {
      try {
        const fetchedScores = await fetchScores();
        setScores(fetchedScores);
      } catch (error) {
        console.error("Failed to fetch scores:", error);
      } finally {
        setLoading(false);
      }
    };
    loadScores();
  }, []);

  const sortedScores = useMemo(
    () => [...scores].sort((a, b) => b.score - a.score),
    [scores]
  );

  const filteredScores = useMemo(() => {
    return sortedScores
      .filter((score) =>
        score.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((score) => (minScore !== "" ? score.score >= minScore : true))
      .slice(0, 15);
  }, [sortedScores, searchTerm, minScore]);

  return (
    <div className="container min-h-screen pt-10 mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 mb-14">
      <h1 className="text-4xl font-bold text-center my-4">Leaderboard</h1>

      <div className="mb-4 flex justify-start gap-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 w-1/2 sm:w-1/3 md:w-1/4 border rounded-lg bg-white text-black"
        />

        <input
          type="number"
          placeholder="Filter by score"
          value={minScore}
          onChange={(e) =>
            setMinScore(e.target.value ? Number(e.target.value) : "")
          }
          className="px-4 py-2 w-1/4 sm:w-1/5 border rounded-lg bg-white text-black"
        />
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <Loading />
        ) : (
          <table className="table-auto min-w-full bg-black text-white dark:bg-white dark:text-black rounded-md">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Rank</th>
                <th className="py-2 px-4 border-b">User</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Score</th>
                <th className="py-2 px-4 border-b">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {filteredScores.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-4 text-lg text-red-500">
                    No users found matching the filter criteria
                  </td>
                </tr>
              ) : (
                filteredScores.map((score, index) => (
                  <tr key={score.id} className="text-center">
                    <td className="py-2 px-4 border-b">{index + 1}</td>
                    <td className="py-2 px-4 border-b flex items-center justify-start gap-x-4">
                      {score.photo_url ? (
                        <div className="flex justify-center items-center my-2">
                          <Image
                            src={`${score.photo_url}`}
                            alt={score.username}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-cover rounded-full"
                            priority
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full" />
                      )}
                      {score.username}
                    </td>
                    <td className="py-2 px-4 border-b">{score.email}</td>
                    <td className="py-2 px-4 border-b">{score.score}</td>
                    <td className="py-2 px-4 border-b">
                      {new Date(score.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LeaderBoard;
