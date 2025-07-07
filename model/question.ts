export interface Question {
  page: number;
  id: number;
  content: Value;
  type: string;
  values: Value[];
  condition: Condition[] | undefined;
  required: boolean | undefined;
  answer: Answer | undefined;
}

export interface Condition {
  type: 'and' | 'or' | 'not';
  conditions: ConditionInner[];
}

export interface ConditionInner {
  id: number;
  value: any;
}
export interface Answer {
  all_points?: number;
  sub_points?: number;
  answer: string;
}

export interface Value {
  content: string;
  title: string;
  options?: string[];
}
