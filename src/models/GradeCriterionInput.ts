import { Criterion } from "./Criterion";
import { Scale } from "./Scale";

export interface GradeCriterionInput {
  criterion: Criterion;
  scales: Scale[];
  selected_scale_id: string;
  score: number;
  comment: string;
}