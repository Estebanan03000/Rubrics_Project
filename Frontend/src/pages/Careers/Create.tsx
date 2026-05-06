import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Career } from "../../models/Career";
import { careerService } from "../../services/careerService";
import AcademicHeader from "../../components/academic/AcademicHeader";
import CareerForm from "../../components/academic/CareerForm";

const CareerCreate: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (career: Career) => {
    const created = await careerService.createCareer({
      ...career,
      is_active: true,
    });

    if (created) {
      await Swal.fire("Correcto", "Carrera creada correctamente.", "success");
      navigate("/careers");
    }
  };

  return (
    <>
      <AcademicHeader title="Crear carrera" />
      <CareerForm
        submitText="Guardar"
        onSubmit={handleSubmit}
        onCancel={() => navigate("/careers")}
      />
    </>
  );
};

export default CareerCreate;