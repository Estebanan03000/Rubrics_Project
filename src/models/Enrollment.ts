export enum EnrollmentStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
}

export interface Enrollment {
  id?: string;
  student_id?: string;
  group_id?: string;
  enrollment_date?: string;
  status?: EnrollmentStatus | string;
  created_at?: string;
  updated_at?: string;
}

export interface EnrollmentRequest {
  student_id: string;
  group_ids: string[];
}