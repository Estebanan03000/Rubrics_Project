import { ScaleInput } from "./ScaleInput";

export interface RubricCriterionInput {
  id?: string;
  name: string;
  description: string;
  weight: number;
  scales: ScaleInput[];
}