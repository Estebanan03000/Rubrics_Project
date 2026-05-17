import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import AcademicHeader from "../../components/academic/AcademicHeader";
import EntityTable, { TableColumn } from "../../components/academic/EntityTable";
import {
  EvaluationStudentRow,
  gradingBusiness,
} from "../../business/gradingBusiness";

const EvaluationStudents: React.FC = () => {
  const { evaluationId } = useParams();
  const navigate = useNavigate();

  const [rows, setRows] = useState<EvaluationStudentRow[]>([]);

  useEffect(() => {
    loadStudents();
  }, [evaluationId]);

  const loadStudents = async () => {
    if (!evaluationId) return;

    try {
      const response = await gradingBusiness.getEvaluationStudents(evaluationId);
      setRows(response);
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los estudiantes.",
        "error"
      );
    }
  };

  const columns: TableColumn<EvaluationStudentRow>[] = [
    {
      header: "Estudiante",
      render: (row) =>
        `${row.student.first_name ?? ""} ${row.student.last_name ?? ""}`.trim(),
    },
    {
      header: "Identificación",
      render: (row) => row.student.identification ?? "-",
    },
    {
      header: "Estado",
      render: (row) => {
        if (!row.grade) return "Sin calificar";
        return row.grade.status === "submitted" ? "Enviada" : "Borrador";
      },
    },
    {
      header: "Nota",
      render: (row) =>
        row.grade ? row.grade.final_score.toFixed(2) : "Pendiente",
    },
    {
      header: "Acciones",
      render: (row) => (
        <button
          type="button"
          onClick={() =>
            navigate(
              `/grades/evaluation/${evaluationId}/student/${row.enrollment.id}`
            )
          }
          className="rounded bg-primary px-3 py-1 text-sm text-white"
        >
          Calificar
        </button>
      ),
    },
  ];

  return (
    <>
      <AcademicHeader
        title="Seleccionar estudiante"
        description="Elige el estudiante que será calificado con la rúbrica asociada a la evaluación."
      />

      <EntityTable
        columns={columns}
        data={rows}
        emptyMessage="No hay estudiantes inscritos en este grupo."
      />
    </>
  );
};

export default EvaluationStudents;