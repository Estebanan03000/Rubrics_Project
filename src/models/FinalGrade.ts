import { Evaluation } from './Evaluation';

export type FinalGradeStatus = 'complete' | 'partial';

export interface OfficialFinalGrade {
  id?: string;
  enrollment_id: string;
  student_id?: string;
  group_id?: string;
  final_grade: number;
  observations?: string;
  is_finalized: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FinalGradeEvaluationColumn {
  id: string;
  name: string;
  weight: number;
  rubric_id?: string;
}

export interface FinalGradeCell {
  evaluationId: string;
  rubricId?: string;
  score: number | null;
  weightedScore: number;
  gradeId?: string;
  isLocked?: boolean;
  status?: string;
}

export interface FinalGradeStudentRow {
  enrollmentId: string;
  enrollmentDate?: string;
  studentId?: string;
  studentName: string;
  studentIdentification?: string;
  grades: FinalGradeCell[];
  finalScore: number;
  status: FinalGradeStatus;
  observations?: string;
}

export interface FinalGradeGroupInfo {
  groupId: string;
  groupName: string;
  groupCode?: string;
  subjectName: string;
  subjectCode?: string;
  semesterName: string;
  semesterIsActive: boolean;
  teacherName: string;
}

export interface FinalGradeSummary {
  totalStudents: number;
  completeStudents: number;
  partialStudents: number;
  groupAverage: number;
  highestScore: number;
  lowestScore: number;
  totalWeight: number;
}

export interface FinalGradeConsolidated {
  groupInfo: FinalGradeGroupInfo;
  evaluations: FinalGradeEvaluationColumn[];
  students: FinalGradeStudentRow[];
  summary: FinalGradeSummary;
  rawEvaluations: Evaluation[];
}