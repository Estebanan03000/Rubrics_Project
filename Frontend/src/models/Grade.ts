export interface Grade {
    id?: string;
    enrollment_id?: string;
    rubric_id?: string;
    final_score?: number;
    status?: string;
    observations?: string;
    is_locked?: boolean;
}