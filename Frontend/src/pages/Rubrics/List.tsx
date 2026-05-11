import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import AcademicHeader from "../../components/academic/AcademicHeader";
import EntityTable, { TableColumn } from "../../components/academic/EntityTable";

import { Rubric } from "../../models/Rubric";
import { Subject } from "../../models/Subject";

import { rubricService } from "../../services/rubricService";
import { subjectService } from "../../services/subjectService";
import { rubricBusiness } from "../../business/rubricBusiness";

const RubricsList: React.FC = () => {
  const navigate = useNavigate();

  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rubricsResponse, subjectsResponse] = await Promise.all([
        rubricService.getRubrics(),
        subjectService.getSubjects(),
      ]);

      setRubrics(rubricsResponse);
      setSubjects(subjectsResponse);
    } catch {
      await Swal.fire("Error", "No se pudieron cargar las rúbricas.", "error");
    }
  };

  const getSubjectName = (subjectId?: string) => {
    const subject = subjects.find((item) => item.id === subjectId);
    return subject ? `${subject.name} (${subject.code})` : "Sin asignatura";
  };

  const handleArchive = async (rubric: Rubric) => {
    if (!rubric.id) return;

    try {
      const result = await Swal.fire({
        title: "¿Archivar rúbrica?",
        text: "La rúbrica quedará archivada y no estará disponible para nuevas evaluaciones.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, archivar",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) return;

      await rubricBusiness.archiveRubric(rubric.id);

      await Swal.fire(
        "Archivada",
        "La rúbrica fue archivada correctamente.",
        "success"
      );

      await loadData();
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo archivar la rúbrica.",
        "error"
      );
    }
  };

  const handleDeleteDraft = async (rubric: Rubric) => {
    try {
      const result = await Swal.fire({
        title: "¿Eliminar borrador?",
        text: "Esta acción solo debe usarse con rúbricas no publicadas.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) return;

      const deleted = await rubricBusiness.deleteDraftRubric(rubric);

      if (deleted) {
        await Swal.fire(
          "Eliminada",
          "La rúbrica borrador fue eliminada.",
          "success"
        );

        await loadData();
      }
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la rúbrica.",
        "error"
      );
    }
  };

  const columns: TableColumn<Rubric>[] = [
    {
      header: "Título",
      render: (rubric) => rubric.title ?? "Sin título",
    },
    {
      header: "Asignatura",
      render: (rubric) => getSubjectName(rubric.subject_id),
    },
    {
      header: "Estado",
      render: (rubric) => {
        if (rubric.is_archived) return "Archivada";
        return rubric.is_public ? "Publicada" : "Borrador";
      },
    },
    {
      header: "Acciones",
      render: (rubric) => (
        <div className="flex flex-wrap gap-2">
          {!rubric.is_archived && !rubric.is_public && (
            <button
              type="button"
              onClick={() => navigate(`/rubrics/update/${rubric.id}`)}
              className="rounded border border-stroke px-3 py-1 text-sm"
            >
              Editar
            </button>
          )}

          {!rubric.is_archived && rubric.is_public && (
            <button
              type="button"
              onClick={() => handleArchive(rubric)}
              className="rounded bg-primary px-3 py-1 text-sm text-white"
            >
              Archivar
            </button>
          )}

          {!rubric.is_public && !rubric.is_archived && (
            <button
              type="button"
              onClick={() => handleDeleteDraft(rubric)}
              className="rounded border border-red-500 px-3 py-1 text-sm text-red-500"
            >
              Eliminar borrador
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <AcademicHeader
        title="Lista de rúbricas"
        description="Gestiona rúbricas publicadas, borradores y archivadas."
        buttonText="Crear rúbrica"
        onButtonClick={() => navigate("/rubrics/create")}
      />

      <EntityTable
        columns={columns}
        data={rubrics}
        emptyMessage="No hay rúbricas registradas."
      />
    </>
  );
};

export default RubricsList;