import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";

import { Career } from "../../models/Career";
import { Semester } from "../../models/Semester";
import { careerService } from "../../services/careerService";
import { academicBusiness } from "../../business/academicBusiness";
import AcademicHeader from "../../components/academic/AcademicHeader";
import SemesterForm from "../../components/academic/SemesterForm";

const SemesterCreate: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const careerId = searchParams.get("careerId");

  const [careers, setCareers] = useState<Career[]>([]);

  useEffect(() => {
    loadCareers();
  }, []);

  const loadCareers = async () => {
    const response = await careerService.getCareers();
    setCareers(response.filter((career: Career) => career.is_active));
  };

  const handleSubmit = async (semester: Semester) => {
    try {
      const created = await academicBusiness.createSemester({
        ...semester,
        career_id: careerId ?? semester.career_id,
      });

      if (created) {
        await Swal.fire(
          "Correcto",
          "Semestre creado correctamente.",
          "success"
        );

        navigate(
          careerId
            ? `/semesters/list?careerId=${careerId}`
            : "/semesters/list"
        );
      }
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo crear el semestre.",
        "error"
      );
    }
  };

  return (
    <>
      <AcademicHeader title="Crear semestre" />

      <SemesterForm
        careers={careers}
        initialData={
          careerId
            ? ({
                career_id: careerId,
                name: "",
                code: "",
                start_date: "",
                end_date: "",
                is_active: false,
              } as Semester)
            : undefined
        }
        submitText="Guardar"
        onSubmit={handleSubmit}
        onCancel={() =>
          navigate(
            careerId
              ? `/semesters/list?careerId=${careerId}`
              : "/semesters/list"
          )
        }
      />
    </>
  );
};

export default SemesterCreate;