import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import AcademicHeader from "../../components/academic/AcademicHeader";
import EntityTable, { TableColumn } from "../../components/academic/EntityTable";
import {
  StudentGradeRow,
  studentGradesBusiness,
} from "../../business/studentGradesBusiness";

const MyGradesList: React.FC = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState<StudentGradeRow[]>([]);
  const [studentId, setStudentId] = useState("");

  const loadGrades = async () => {
    if (!studentId.trim()) {
      await Swal.fire(
        "Dato requerido",
        "Ingrese el ID del estudiante para consultar sus calificaciones.",
        "warning"
      );

      return;
    }

    try {
      const response = await studentGradesBusiness.getPublishedGradesByStudent(
        studentId.trim()
      );

      setRows(response);
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudieron cargar las calificaciones.",
        "error"
      );
    }
  };

  useEffect(() => {
    setRows([]);
  }, [studentId]);

  const columns: TableColumn<StudentGradeRow>[] = [
    {
      header: "Evaluación",
      render: (row) => row.evaluation?.name ?? row.grade.evaluation_id,
    },
    {
      header: "Ponderación",
      render: (row) => `${row.evaluation?.weight ?? "-"}%`,
    },
    {
      header: "Nota final",
      render: (row) => row.grade.final_score.toFixed(2),
    },
    {
      header: "Estado",
      render: (row) => "Enviada",
    },
    {
      header: "Acciones",
      render: (row) => (
        <button
          type="button"
          onClick={() => navigate(`/my-grades/detail/${row.grade.id}`)}
          className="rounded bg-primary px-3 py-1 text-sm text-white"
        >
          Ver detalle
        </button>
      ),
    },
  ];

  return (
    <>
      <AcademicHeader
        title="Mis calificaciones"
        description="Consulta las calificaciones enviadas por el docente."
      />

      <div className="mb-6 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <label className="mb-2 block font-medium text-black dark:text-white">
          ID del estudiante
        </label>

        <div className="flex gap-3">
          <input
            type="text"
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            className="w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
            placeholder="Ingrese student_id"
          />

          <button
            type="button"
            onClick={loadGrades}
            className="rounded bg-primary px-4 py-2 text-white"
          >
            Consultar
          </button>
        </div>
      </div>

      <EntityTable
        columns={columns}
        data={rows}
        emptyMessage="No hay calificaciones enviadas para este estudiante."
      />
    </>
  );
};

export default MyGradesList;