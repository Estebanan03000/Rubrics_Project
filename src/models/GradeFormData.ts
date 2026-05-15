import { GradeCriterionInput } from "./GradeCriterionInput";

export interface GradeFormData {
  student_id: string;
  enrollment_id: string;
  evaluation_id: string;
  rubric_id: string;
  observations?: string;
  criteria: GradeCriterionInput[];
}