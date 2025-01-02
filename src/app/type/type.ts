export interface User {
  id: number;
  username: string | null;
  email: string;
  imageUrl: string;
}

export interface MyScoresProps {
  userObj: User | null;
}

export type Scores = {
  id: number;
  username: string;
  score: number;
  photo_url: string;
  createdAt: string;
  email: string;
};

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: "options" | "editUsername" | "editPassword";
  setCurrentView: (view: "options" | "editUsername" | "editPassword") => void;
}
