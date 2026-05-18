import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import AcademicHeader from "../../components/academic/AcademicHeader";
import EntityTable, { TableColumn } from "../../components/academic/EntityTable";

import { StudyPlan } from "../../models/StudyPlan";
import { Subject } from "../../models/Subject";
import { StudyPlanSubject } from "../../models/StudyPlanSubject";

import { studyPlanService } from "../../services/studyPlanService";
import { subjectService } from "../../services/subjectService";
import { studyPlanBusiness } from "../../business/studyPlanBusiness";

const UpdateStudyPlan: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [formData, setFormData] = useState<Partial<StudyPlan>>({});
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [linkedSubjects, setLinkedSubjects] = useState<StudyPlanSubject[]>([]);

  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [suggestedSemester, setSuggestedSemester] = useState<number>(1);
  const [subjectSearch, setSubjectSearch] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    const [planResponse, subjectsResponse, linkedResponse] = await Promise.all([
      studyPlanService.getStudyPlanById(id),
      subjectService.getSubjects(),
      studyPlanBusiness.listSubjects(id),
    ]);

    setStudyPlan(planResponse);
    setFormData(planResponse ?? {});
    setSubjects(subjectsResponse.filter((subject) => subject.is_active));
    setLinkedSubjects(linkedResponse);
  };

  const getLinkedSubjectId = (item: any): string => {
    return item.subject_id ?? item.subject?.id ?? item.id ?? "";
  };

  const availableSubjects = useMemo(() => {
    const linkedIds = linkedSubjects.map((item) => getLinkedSubjectId(item));

    return subjects.filter((subject) => {
      const text = `${subject.name ?? ""} ${subject.code ?? ""}`.toLowerCase();

      return (
        !linkedIds.includes(subject.id ?? "") &&
        text.includes(subjectSearch.toLowerCase())
      );
    });
  }, [subjects, linkedSubjects, subjectSearch]);

  const getSubjectName = (item: any) => {
    if (item.subject) {
      return `${item.subject.name} (${item.subject.code})`;
    }

    const subjectId = getLinkedSubjectId(item);
    const directSubject = subjects.find((subject) => subject.id === subjectId);

    if (directSubject) {
      return `${directSubject.name} (${directSubject.code})`;
    }

    return "Asignatura no identificada";
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : name === "year"
          ? Number(value)
          : value,
    }));
  };

  const handleUpdateStudyPlan = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!id) return;

    if (formData.is_published && linkedSubjects.length === 0) {
      setFormData((prev) => ({
        ...prev,
        is_published: false,
      }));      
      
      await Swal.fire(
        "No se puede publicar",
        "Debe vincular al menos una asignatura antes de publicar el plan de estudios.",
        "warning"
      );
      return;
    }
    try {
      const updated = await studyPlanBusiness.updateStudyPlan(id, formData);

      if (updated) {
        await Swal.fire(
          "Completado",
          "Se ha actualizado correctamente el plan de estudio.",
          "success"
        );

        await loadData();
      }
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el plan de estudios.",
        "error"
      );
    }
  };

  const handleLinkSubject = async () => {
    if (!id) return;

    if (!selectedSubjectId) {
      await Swal.fire(
        "Campo requerido",
        "Debe seleccionar una asignatura para vincular.",
        "warning"
      );
      return;
    }

    const alreadyLinked = linkedSubjects.some(
      (item) => getLinkedSubjectId(item) === selectedSubjectId
    );

    if (alreadyLinked) {
      await Swal.fire(
        "Asignatura duplicada",
        "Esta asignatura ya está vinculada al plan de estudios.",
        "warning"
      );
      return;
    }

    try {
      const linked = await studyPlanBusiness.linkSubject(id, {
        subject_id: selectedSubjectId,
        suggested_semester: suggestedSemester,
      });

      if (linked) {
        await Swal.fire(
          "Asignatura vinculada",
          "La asignatura fue agregada al plan de estudios.",
          "success"
        );

        setSelectedSubjectId("");
        setSuggestedSemester(1);
        await loadData();
      }
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo vincular la asignatura.",
        "error"
      );
    }
  };

  const handleUnlinkSubject = async (subjectId: string) => {
    if (!id) return;

    const result = await Swal.fire({
      title: "¿Remover asignatura?",
      text: "La asignatura será desvinculada de este plan de estudios.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, remover",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      const success = await studyPlanBusiness.unlinkSubject(id, subjectId);

      if (success) {
        await Swal.fire(
          "Removida",
          "La asignatura fue removida del plan de estudios.",
          "success"
        );

        await loadData();
      }
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo remover la asignatura.",
        "error"
      );
    }
  };

  const linkedColumns: TableColumn<StudyPlanSubject>[] = [
    {
      header: "Asignatura",
      render: (item) => getSubjectName(item),
    },
    {
      header: "Semestre sugerido",
      render: (item: any) => item.suggested_semester ?? "-",
    },
    {
      header: "Acciones",
      render: (item) => {
        const subjectId = getLinkedSubjectId(item);

        return (
          <button
            type="button"
            onClick={() => handleUnlinkSubject(subjectId)}
            className="rounded border border-red-500 px-3 py-1 text-sm text-red-500"
          >
            Remover
          </button>
        );
      },
    },
  ];

  if (!studyPlan) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      <AcademicHeader
        title="Actualizar plan de estudio"
        description="Edita la información general del plan y administra sus asignaturas vinculadas."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <form
          onSubmit={handleUpdateStudyPlan}
          className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
        >
          <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
            Información del plan
          </h3>

          <div className="mb-4">
            <label className="mb-2 block font-medium text-black dark:text-white">
              Nombre
            </label>

            <input
              type="text"
              name="name"
              value={formData.name ?? ""}
              onChange={handleChange}
              className="w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block font-medium text-black dark:text-white">
              Año
            </label>

            <input
              type="number"
              name="year"
              value={formData.year ?? ""}
              onChange={handleChange}
              className="w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
            />
          </div>

          <label className="mb-6 flex items-center gap-2">
            <input
              type="checkbox"
              name="is_published"
              checked={Boolean(formData.is_published)}
              onChange={handleChange}
            />
            Publicado
          </label>

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded bg-primary px-4 py-2 text-white"
            >
              Actualizar
            </button>

            <button
              type="button"
              onClick={() => navigate("/studyplans/list")}
              className="rounded border border-stroke px-4 py-2"
            >
              Volver
            </button>
          </div>
        </form>

        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
            Vincular asignatura
          </h3>

          <input
            type="text"
            value={subjectSearch}
            onChange={(event) => setSubjectSearch(event.target.value)}
            placeholder="Buscar por nombre o código"
            className="mb-4 w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
          />

          <select
            value={selectedSubjectId}
            onChange={(event) => setSelectedSubjectId(event.target.value)}
            className="mb-4 w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
          >
            <option value="">Seleccione una asignatura</option>
            {availableSubjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name} ({subject.code})
              </option>
            ))}
          </select>
          <div className="mb-4">
            <label className="mb-2 block font-medium text-black dark:text-white">
              Semestre sugerido
            </label>

            <input
              type="number"
              min={1}
              value={suggestedSemester}
              onChange={(event) =>
                setSuggestedSemester(Number(event.target.value))
              }
              className="w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
              placeholder="Semestre sugerido"
            />
          </div>

          <button
            type="button"
            onClick={handleLinkSubject}
            className="rounded bg-primary px-4 py-2 text-white"
          >
            Vincular asignatura
          </button>
        </div>
      </div>

      <div className="mt-6">
        <EntityTable
          columns={linkedColumns}
          data={linkedSubjects}
          emptyMessage="Este plan aún no tiene asignaturas vinculadas."
        />
      </div>
    </>
  );
};

export default UpdateStudyPlan;