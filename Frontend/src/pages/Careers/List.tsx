import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Career } from "../../models/Career";
import { careerService } from "../../services/careerService";
import AcademicHeader from "../../components/academic/AcademicHeader";
import EntityTable, { TableColumn } from "../../components/academic/EntityTable";

const CareersList: React.FC = () => {
  const navigate = useNavigate();
  const [careers, setCareers] = useState<Career[]>([]);

  useEffect(() => {
    loadCareers();
  }, []);

  const loadCareers = async () => {
    const response = await careerService.getCareers();
    setCareers(response);
  };

  const columns: TableColumn<Career>[] = [
    { header: "Nombre", render: (career) => career.name },
    { header: "Código", render: (career) => career.code },
    { header: "Descripción", render: (career) => career.description ?? "Sin descripción" },
    {
      header: "Estado",
      render: (career) => (career.is_active ? "Activa" : "Archivada"),
    },
    {
      header: "Acciones",
      render: (career) => (
        <div className="flex gap-2">
          <button onClick={() => navigate(`/careers/update/${career.id}`)}>
            Editar
          </button>
          <button onClick={() => navigate(`/semesters?careerId=${career.id}`)}>
            Semestres
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AcademicHeader
        title="Gestión de carreras"
        description="Administra carreras y accede a sus semestres."
        buttonText="Crear carrera"
        onButtonClick={() => navigate("/careers/create")}
      />

      <EntityTable columns={columns} data={careers} />
    </>
  );
};

export default CareersList;