import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AcademicHeader from "../../components/academic/AcademicHeader";
import EntityTable, { TableColumn } from "../../components/academic/EntityTable";
import { Evaluation } from "../../models/Evaluation";
import { evaluationService } from "../../services/evaluationService";

const GradesList: React.FC = () => {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = async () => {
    const response = await evaluationService.getEvaluations();
    setEvaluations(response.filter((evaluation) => Boolean(evaluation.rubric_id)));
  };

  const columns: TableColumn<Evaluation>[] = [
    {
      header: "Evaluación",
      render: (evaluation) => evaluation.name,
    },
    {
      header: "Grupo",
      render: (evaluation) => evaluation.group_id,
    },
    {
      header: "Rúbrica",
      render: (evaluation) =>
        evaluation.rubric_id ? "Rúbrica asociada" : "Sin rúbrica",
    },
    {
      header: "Ponderación",
      render: (evaluation) => `${evaluation.weight}%`,
    },
    {
      header: "Acciones",
      render: (evaluation) => (
        <button
          type="button"
          onClick={() => navigate(`/grades/evaluation/${evaluation.id}`)}
          className="rounded bg-primary px-3 py-1 text-sm text-white"
        >
          Calificar estudiantes
        </button>
      ),
    },
  ];

  return (
    <>
      <AcademicHeader
        title="Calificaciones"
        description="Selecciona una evaluación con rúbrica asociada para calificar estudiantes."
      />

      <EntityTable
        columns={columns}
        data={evaluations}
        emptyMessage="No hay evaluaciones con rúbrica asociada."
      />
    </>
  );
};

export default GradesList;