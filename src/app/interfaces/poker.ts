export interface Poker {
  story: string;
  users: User[];
  showVotes: boolean;
}

export interface User {
  name: string;
  hasVoted: boolean;
  point: number;
  isManager: boolean;
}
