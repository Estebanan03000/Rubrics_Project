import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Career } from "../../models/Career";
import { careerService } from "../../services/careerService";
import AcademicHeader from "../../components/academic/AcademicHeader";
import CareerForm from "../../components/academic/CareerForm";

const CareerUpdate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [career, setCareer] = useState<Career | null>(null);

  useEffect(() => {
    loadCareer();
  }, []);

  const loadCareer = async () => {
    if (!id) return;
    const response = await careerService.getCareerById(id);
    setCareer(response);
  };

  const handleSubmit = async (data: Career) => {
    if (!id) return;

    const updated = await careerService.updateCareer(id, data);

    if (updated) {
      await Swal.fire("Correcto", "Carrera actualizada correctamente.", "success");
      navigate("/careers");
    }
  };

  return (
    <>
      <AcademicHeader title="Editar carrera" />

      {career && (
        <CareerForm
          initialData={career}
          submitText="Actualizar"
          onSubmit={handleSubmit}
          onCancel={() => navigate("/careers")}
        />
      )}
    </>
  );
};

export default CareerUpdate;