import { RubricCriterionInput } from "./RubricCriterionInput";

export interface RubricFormData {
  subject_id: string;
  title: string;
  description: string;
  criteria: RubricCriterionInput[];
}