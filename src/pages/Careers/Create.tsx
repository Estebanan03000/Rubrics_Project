import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { Career } from "../../models/Career";
import { academicBusiness } from "../../business/academicBusiness";
import AcademicHeader from "../../components/academic/AcademicHeader";
import CareerForm from "../../components/academic/CareerForm";

const CareerCreate: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (career: Career) => {
    try {
      const created = await academicBusiness.createCareer(career);

      if (created) {
        await Swal.fire(
          "Correcto",
          "Carrera creada correctamente.",
          "success"
        );

        navigate("/careers/list");
      }
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo crear la carrera.",
        "error"
      );
    }
  };

  return (
    <>
      <AcademicHeader title="Crear carrera" />

      <CareerForm
        submitText="Guardar"
        onSubmit={handleSubmit}
        onCancel={() => navigate("/careers/list")}
      />
    </>
  );
};

export default CareerCreate;