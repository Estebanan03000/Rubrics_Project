import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Career } from "../../models/Career";
import { Semester } from "../../models/Semester";
import { careerService } from "../../services/careerService";
import { semesterService } from "../../services/semesterService";
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

    if (data.start_date >= data.end_date) {
      await Swal.fire("Error", "La fecha de inicio debe ser menor que la fecha final.", "error");
      return;
    }

    const updated = await semesterService.updateSemester(id, data);

    if (updated) {
      await Swal.fire("Correcto", "Semestre actualizado correctamente.", "success");
      navigate("/semesters");
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
          onCancel={() => navigate("/semesters")}
        />
      )}
    </>
  );
};

export default SemesterUpdate;