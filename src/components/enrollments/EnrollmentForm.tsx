import { useState } from 'react';

import { Student } from '../../models/Student';
import { Group } from '../../models/Group';
import { EnrollmentRequest } from '../../models/Enrollment';

interface Props {
  students: Student[];
  groups: Group[];
  onSubmit: (data: EnrollmentRequest) => void;
}

export default function EnrollmentForm({
  students,
  groups,
  onSubmit,
}: Props) {
  const [studentId, setStudentId] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const handleGroupSelection = (groupId: string) => {
    setSelectedGroups((prev) => {
      if (prev.includes(groupId)) {
        return prev.filter((id) => id !== groupId);
      }

      return [...prev, groupId];
    });
  };

  return (
    <form
      className="mx-auto max-w-2xl space-y-4"
      onSubmit={(e) => {
        e.preventDefault();

        onSubmit({
          student_id: studentId,
          group_ids: selectedGroups,
        });
      }}
    >
      <div>
        <label className="mb-2 block text-sm font-medium">
          Estudiante
        </label>

        <select
          className="w-full rounded border px-3 py-2 text-sm"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        >
          <option value="">Seleccione un estudiante</option>

          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.first_name} {student.last_name} -{' '}
              {student.identification}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Grupos disponibles
        </label>

        <div className="max-h-72 space-y-2 overflow-y-auto rounded border p-3">
          {groups.map((group) => (
            <label
              key={group.id}
              className="flex items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                checked={
                  !!group.id &&
                  selectedGroups.includes(group.id)
                }
                onChange={() =>
                  group.id && handleGroupSelection(group.id)
                }
              />

              <span>
                {group.name} — {group.group_code}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="rounded bg-primary px-5 py-2 text-sm text-white"
      >
        Inscribir estudiante
      </button>
    </form>
  );
}