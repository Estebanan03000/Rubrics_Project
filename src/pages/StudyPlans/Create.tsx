import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import AcademicHeader from "../../components/academic/AcademicHeader";
import { Career } from "../../models/Career";
import { StudyPlan } from "../../models/StudyPlan";
import { careerService } from "../../services/careerService";
import { studyPlanBusiness } from "../../business/studyPlanBusiness";

const CreateStudyPlan: React.FC = () => {
  const navigate = useNavigate();

  const [careers, setCareers] = useState<Career[]>([]);

  const [formData, setFormData] = useState<StudyPlan>({
    career_id: "",
    name: "",
    year: new Date().getFullYear(),
    suggested_semester: 1,
    is_published: false,
  });
  useEffect(() => {
    loadCareers();
  }, []);

  const loadCareers = async () => {
    const response = await careerService.getCareers();
    setCareers(response.filter((career) => career.is_active));
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
          : name === "year" || name === "suggested_semester"
          ? Number(value)
          : value,
    }));
  };

  const handleCreateStudyPlan = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const createdStudyPlan = await studyPlanBusiness.createStudyPlan(formData);

      if (createdStudyPlan?.id) {
        await Swal.fire(
          "Completado",
          "Se ha creado correctamente el plan de estudio.",
          "success"
        );

        navigate(`/studyplans/update/${createdStudyPlan.id}`);
      } else {
        await Swal.fire(
          "Error",
          "No se pudo crear el plan de estudios.",
          "error"
        );
      }
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo crear el plan de estudios.",
        "error"
      );
    }
  };

  return (
    <>
      <AcademicHeader title="Crear plan de estudio" />

      <form
        onSubmit={handleCreateStudyPlan}
        className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div className="mb-4">
          <label className="mb-2 block font-medium text-black dark:text-white">
            Carrera
          </label>

          <select
            name="career_id"
            value={formData.career_id}
            onChange={handleChange}
            className="w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
          >
            <option value="">Seleccione una carrera</option>

            {careers.map((career) => (
              <option key={career.id} value={career.id}>
                {career.name} ({career.code})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium text-black dark:text-white">
            Nombre del plan
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
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
            value={formData.year}
            onChange={handleChange}
            className="w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium text-black dark:text-white">
            Semestre sugerido
          </label>

          <input
            type="number"
            name="suggested_semester"
            value={formData.suggested_semester}
            onChange={handleChange}
            className="w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
          />
        </div>


        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded bg-primary px-4 py-2 text-white"
          >
            Crear
          </button>

          <button
            type="button"
            onClick={() => navigate("/studyplans/list")}
            className="rounded border border-stroke px-4 py-2"
          >
            Cancelar
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateStudyPlan;