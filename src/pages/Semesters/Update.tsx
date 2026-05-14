import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { Career } from "../../models/Career";
import { Semester } from "../../models/Semester";
import { careerService } from "../../services/careerService";
import { semesterService } from "../../services/semesterService";
import { academicBusiness } from "../../business/academicBusiness";
import AcademicHeader from "../../components/academic/AcademicHeader";
import SemesterForm from "../../components/academic/SemesterForm";

const SemesterUpdate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [semester, setSemester] = useState<Semester | null>(null);
  const [careers, setCareers] = useState<Career[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!id) return;

    const semesterResponse = await semesterService.getSemesterById(id);
    const careersResponse = await careerService.getCareers();

    setSemester(semesterResponse);
    setCareers(careersResponse);
  };

  const handleSubmit = async (data: Semester) => {
    if (!id) return;

    try {
      const updated = await academicBusiness.updateSemester(id, data);

      if (updated) {
        await Swal.fire(
          "Correcto",
          "Semestre actualizado correctamente.",
          "success"
        );

        navigate(
          data.career_id
            ? `/semesters/list?careerId=${data.career_id}`
            : "/semesters/list"
        );
      }
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el semestre.",
        "error"
      );
    }
  };

  return (
    <>
      <AcademicHeader title="Editar semestre" />

      {semester && (
        <SemesterForm
          initialData={semester}
          careers={careers}
          submitText="Actualizar"
          onSubmit={handleSubmit}
          onCancel={() =>
            navigate(
              semester.career_id
                ? `/semesters/list?careerId=${semester.career_id}`
                : "/semesters/list"
            )
          }
        />
      )}
    </>
  );
};

export default SemesterUpdate;