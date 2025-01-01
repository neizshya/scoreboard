import { auth, currentUser } from "@clerk/nextjs/server";
import MyScoresComponent from "./clientComponent";
import { Scores } from "../type/type";
import { baseAPI } from "../api/baseAPI";

async function fetchScoresByEmail(email: string): Promise<Scores[]> {
  try {
    const url = new URL(baseAPI);
    url.searchParams.append("email", email);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.warn(`Failed to fetch scores: ${res.status} ${res.statusText}`);
      return [];
    }

    const data: Scores[] = await res.json();
    return data;
  } catch (error) {
    console.error("Error in fetchScoresByName:", error);
    return [];
  }
}
export default async function MyScoresPage() {
  try {
    const authObj = await auth();
    if (!authObj || !authObj.sessionClaims) {
      console.error("Authentication failed:", authObj);
      throw new Error("Authentication failed. Please log in.");
    }

    const expirationTime = authObj.sessionClaims?.exp;
    if (expirationTime && Math.floor(Date.now() / 1000) >= expirationTime) {
      console.error("Session expired:", expirationTime);
      throw new Error("Your session has expired. Please log in again.");
    }

    const user = await currentUser();
    if (!user) {
      console.error("No user found.");
      throw new Error("You must be logged in to view this page.");
    }

    const email = user.emailAddresses[0]?.emailAddress || "";
    if (!email) {
      console.error("User email is missing:", user);
      throw new Error("Unable to determine user email.");
    }

    const scores = await fetchScoresByEmail(email);
    if (!Array.isArray(scores)) {
      console.error("Invalid scores data:", scores);
      throw new Error("Failed to fetch scores.");
    }

    const simplifiedUserObj = {
      id: user.id,
      username: user.username || "Unknown User",
      imageUrl: user.imageUrl || "",
      email,
    };

    return <MyScoresComponent userObj={simplifiedUserObj} scores={scores} />;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in MyScoresPage:", error.message);
      return <p className="text-red-500">Error: {error.message}</p>;
    } else {
      console.error("Unknown error in MyScoresPage:", error);
      return <p className="text-red-500">An unknown error occurred.</p>;
    }
  }
}
