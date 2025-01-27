export interface Survey {
  id: number;
  title: string;
  badge: string;
  description: string;
  image: string;
  start_date: string;
  end_date: string;
  allow_submit: boolean;
  allow_view: boolean;
  allow_judge: boolean;
  allow_re_submit: boolean;
}
