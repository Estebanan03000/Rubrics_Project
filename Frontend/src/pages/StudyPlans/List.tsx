import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import AcademicHeader from "../../components/academic/AcademicHeader";
import EntityTable, { TableColumn } from "../../components/academic/EntityTable";
import { StudyPlan } from "../../models/StudyPlan";
import { Career } from "../../models/Career";
import { studyPlanService } from "../../services/studyPlanService";
import { careerService } from "../../services/careerService";

const StudyPlansList: React.FC = () => {
  const navigate = useNavigate();

  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [plansResponse, careersResponse] = await Promise.all([
      studyPlanService.getStudyPlans(),
      careerService.getCareers(),
    ]);

    setStudyPlans(plansResponse);
    setCareers(careersResponse);
  };

  const getCareerName = (careerId: string) => {
    const career = careers.find((item) => item.id === careerId);
    return career ? `${career.name} (${career.code})` : careerId;
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;

    const result = await Swal.fire({
      title: "¿Eliminar plan de estudios?",
      text: "Esta acción eliminará el plan si el backend lo permite.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    const deleted = await studyPlanService.deleteStudyPlan(id);

    if (deleted) {
      await Swal.fire(
        "Eliminado",
        "El plan de estudios fue eliminado.",
        "success"
      );

      await loadData();
    }
  };

  const columns: TableColumn<StudyPlan>[] = [
    {
      header: "Nombre",
      render: (studyPlan) => studyPlan.name,
    },
    {
      header: "Carrera",
      render: (studyPlan) => getCareerName(studyPlan.career_id),
    },
    {
      header: "Año",
      render: (studyPlan) => studyPlan.year,
    },
    {
      header: "Estado",
      render: (studyPlan) =>
        studyPlan.is_published ? "Publicado" : "Borrador",
    },
    {
      header: "Acciones",
      render: (studyPlan) => (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate(`/studyplans/update/${studyPlan.id}`)}
            className="rounded border border-stroke px-3 py-1 text-sm"
          >
            Editar / Asignaturas
          </button>

          <button
            type="button"
            onClick={() => handleDelete(studyPlan.id)}
            className="rounded border border-red-500 px-3 py-1 text-sm text-red-500"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AcademicHeader
        title="Planes de estudio"
        description="Gestiona versiones de planes y asignaturas vinculadas."
        buttonText="Crear plan"
        onButtonClick={() => navigate("/studyplans/create")}
      />

      <EntityTable
        columns={columns}
        data={studyPlans}
        emptyMessage="No hay planes de estudio registrados."
      />
    </>
  );
};

export default StudyPlansList;