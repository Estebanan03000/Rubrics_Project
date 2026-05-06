import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Career } from "../../models/Career";
import { Semester } from "../../models/Semester";
import { careerService } from "../../services/careerService";
import { semesterService } from "../../services/semesterService";
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
    if (semester.start_date >= semester.end_date) {
      await Swal.fire("Error", "La fecha de inicio debe ser menor que la fecha final.", "error");
      return;
    }

    const created = await semesterService.createSemester({
      ...semester,
      career_id: careerId ?? semester.career_id,
    });

    if (created) {
      await Swal.fire("Correcto", "Semestre creado correctamente.", "success");
      navigate(careerId ? `/semesters?careerId=${careerId}` : "/semesters");
    }
  };

  return (
    <>
      <AcademicHeader title="Crear semestre" />

      <SemesterForm
        careers={careers}
        initialData={careerId ? { career_id: careerId } as Semester : undefined}
        submitText="Guardar"
        onSubmit={handleSubmit}
        onCancel={() => navigate(careerId ? `/semesters?careerId=${careerId}` : "/semesters")}
      />
    </>
  );
};

export default SemesterCreate;