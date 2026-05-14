import { RubricCriterionInput } from "./RubricCriterionInput";

export interface RubricFormData {
  title: string;
  description: string;
  criteria: RubricCriterionInput[];
}