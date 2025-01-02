"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Scores, User } from "../type/type";
import { ShareButton } from "../components/shareButton";
import { baseAPI } from "../api/baseAPI";
import Loading from "./loading";
import { useUser } from "@clerk/nextjs";
import Modal from "../components/modal";

function ScoreModal({
  title,
  placeholder,
  initialValue,
  onClose,
  onSubmit,
}: {
  title: string;
  placeholder: string;
  initialValue: number | "";
  onClose: () => void;
  onSubmit: (score: number) => Promise<void>;
}) {
  const [score, setScore] = useState<number | "">(initialValue);
  const [warning, setWarning] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) {
      setWarning("Please enter a valid number.");
    } else {
      setWarning("");
      setScore(value === "" ? "" : Number(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof score === "number") {
      setIsSubmitting(true);
      try {
        await onSubmit(score);
        setScore("");
        onClose();
      } catch (error) {
        console.error("Submission failed:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-black">{title}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={score}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 mb-2 border rounded bg-gray-400 text-white dark:bg-white dark:text-black"
        />
        {warning && <p className="text-red-500 text-sm mb-4">{warning}</p>}
        <div className="flex justify-end space-x-2">
          <button
            type="submit"
            className={`py-2 px-4 ${
              isSubmitting ? "bg-gray-400" : "bg-blue-500"
            } text-white rounded`}
            disabled={isSubmitting || !!warning || score === ""}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ChangeProfileImageModal({
  onClose,
  onImageChange,
}: {
  onClose: () => void;
  onImageChange: () => void;
}) {
  const { user } = useUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage(
          "File size exceeds 5MB. Please upload a smaller image."
        );
        return;
      }

      setErrorMessage("");
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a file.");
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setErrorMessage("Invalid file type. Please upload an image.");
      return;
    }

    try {
      setIsUploading(true);

      if (user) {
        await user.setProfileImage({ file: selectedFile });
        console.log("Upload successful!");
        onImageChange();
        onClose();
      }
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage("An error occurred while uploading the image.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-black">
        Change Profile Image
      </h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full mb-4 text-black"
      />
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      <div className="flex justify-end space-x-2">
        <button
          onClick={handleSubmit}
          className={`py-2 px-4 ${
            isUploading ? "bg-gray-400" : "bg-blue-500"
          } text-white rounded`}
          disabled={isUploading}>
          {isUploading ? "Uploading..." : "Submit"}
        </button>
      </div>
    </Modal>
  );
}

function DeleteConfirmationModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Error deleting score:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-black">
        Are you sure you want to delete this score?
      </h2>
      <div className="flex justify-end space-x-2">
        <button
          onClick={handleConfirm}
          className={`py-2 px-4 ${
            isDeleting ? "bg-gray-400" : "bg-red-500"
          } text-white rounded`}
          disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Confirm"}
        </button>
      </div>
    </Modal>
  );
}

export default function MyScoresComponent({
  userObj,
  scores,
}: {
  userObj: User;
  scores: Scores[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updatedScores, setUpdatedScores] = useState(scores);
  const [scoreToEdit, setScoreToEdit] = useState<Scores | null>(null);
  const [isChangeImageModalOpen, setIsChangeImageModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [scoreToDelete, setScoreToDelete] = useState<Scores | null>(null);

  const handleImageChange = async () => {
    setIsLoading(true);
    try {
      await location.reload();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddScore = useCallback(
    async (newScore: number) => {
      try {
        setIsLoading(true);
        const res = await fetch(baseAPI, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: userObj.username,
            score: newScore,
            photo_url: userObj.imageUrl,
            email: userObj.email,
            createdAt: new Date().toISOString(),
          }),
        });

        if (res.ok) {
          const addedScore = await res.json();
          setUpdatedScores((prevScores) => [...prevScores, addedScore]);
          console.log("====================================");
          console.log("successfully added score");
          console.log("====================================");
        }
      } catch (error) {
        console.error("Failed to add score:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [userObj]
  );

  const handleDeleteScore = useCallback(async (scoreId: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${baseAPI}/${scoreId.toString()}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUpdatedScores((prevScores) =>
          prevScores.filter((score) => score.id !== scoreId)
        );
        console.log("Score deleted successfully");
      } else {
        console.error("Failed to delete score");
      }
    } catch (error) {
      console.error("Error deleting score:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleEditScore = useCallback(
    async (updatedScore: number) => {
      setIsLoading(true);
      try {
        if (!scoreToEdit) return;

        const res = await fetch(`${baseAPI}/${scoreToEdit.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            score: updatedScore,
          }),
        });

        if (res.ok) {
          const updatedScoreObj = await res.json();
          setUpdatedScores((prevScores) =>
            prevScores.map((score) =>
              score.id === updatedScoreObj.id ? updatedScoreObj : score
            )
          );
          setScoreToEdit(null);
          console.log("====================================");
          console.log("successfully edited score");
          console.log("====================================");
        }
      } catch (error) {
        console.error("Failed to edit score:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [scoreToEdit]
  );

  return (
    <div className="container min-h-screen pt-10 mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 mb-14">
      {isLoading && <Loading />}

      <div className="grid grid-cols-1 gap-y-5">
        <div className="w-full grid grid-cols-1 gap-y-5">
          <Image
            width={100}
            height={100}
            src={userObj.imageUrl}
            alt={`${userObj.username} picture`}
            className="items-center mx-auto rounded-full"
          />
          <button
            onClick={() => setIsChangeImageModalOpen(true)}
            className="mx-auto border py-1 px-3 rounded-md text-white bg-blue-500 hover:bg-gray-700 hover:text-white block text-base font-medium ">
            Change Profile Image
          </button>
        </div>
        <div className="text-start text-2xl font-normal ">
          Username: {userObj.username}
        </div>
        <div className="text-start text-2xl font-normal ">
          Email: {userObj.email}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-start mb-4">Your Scores</h2>
        <div className="my-4 w-full">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded">
            Add Score
          </button>
        </div>

        {updatedScores.length === 0 ? (
          <p className="text-center text-lg text-red-500">
            No scores found for {userObj.username}.
          </p>
        ) : (
          <table className="table-auto min-w-full bg-black dark:bg-white text-white dark:text-black rounded-md">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">#</th>
                <th className="py-2 px-4 border-b">Score</th>
                <th className="py-2 px-4 border-b">Submitted At</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {updatedScores.map((score, index) => (
                <tr key={score.id} className="text-center">
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{score.score}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(score.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b flex flex-row gap-x-4 justify-center items-center">
                    <button
                      onClick={() => {
                        setScoreToEdit(score);
                        setIsEditModalOpen(true);
                      }}
                      className="py-1 px-3 bg-green-500 text-white rounded ">
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setScoreToDelete(score);
                        setIsDeleteModalOpen(true);
                      }}
                      className="py-1 px-3 bg-red-500 text-white rounded">
                      Delete
                    </button>
                    <ShareButton
                      score={score.score}
                      username={`${userObj.username}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {isModalOpen && (
        <ScoreModal
          title="Add Score"
          placeholder="Enter your score"
          initialValue=""
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddScore}
        />
      )}
      {isEditModalOpen && scoreToEdit && (
        <ScoreModal
          title="Edit Score"
          placeholder="Edit your score"
          initialValue={scoreToEdit.score}
          onClose={() => {
            setIsEditModalOpen(false);
            setScoreToEdit(null);
          }}
          onSubmit={handleEditScore}
        />
      )}
      {isChangeImageModalOpen && (
        <ChangeProfileImageModal
          onClose={() => setIsChangeImageModalOpen(false)}
          onImageChange={handleImageChange}
        />
      )}
      {isDeleteModalOpen && scoreToDelete && (
        <DeleteConfirmationModal
          onClose={() => {
            setIsDeleteModalOpen(false);
            setScoreToDelete(null);
          }}
          onConfirm={async () => {
            if (scoreToDelete) {
              await handleDeleteScore(scoreToDelete.id);
            }
          }}
        />
      )}
    </div>
  );
}
