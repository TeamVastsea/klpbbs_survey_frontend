export interface Score {
  id: number;
  survey: number;
  user: string;
  update_time: string;
  completed: boolean;
  answer: string;
  judge?: string;
  judge_time?: string;
  scores?: string;
  user_scores?: number;
  full_scores?: number;
  passed?: boolean;
}
