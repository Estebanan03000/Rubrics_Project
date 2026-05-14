import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { Career } from "../../models/Career";
import { careerService } from "../../services/careerService";
import { academicBusiness } from "../../business/academicBusiness";
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

  const handleArchive = async (careerId?: string) => {
    if (!careerId) return;

    try {
      const result = await Swal.fire({
        title: "¿Archivar carrera?",
        text: "La carrera quedará inactiva.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, archivar",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) return;

      await academicBusiness.archiveCareer(careerId);

      await Swal.fire(
        "Correcto",
        "Carrera archivada correctamente.",
        "success"
      );

      loadCareers();
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo archivar la carrera.",
        "error"
      );
    }
  };

  const columns: TableColumn<Career>[] = [
    {
      header: "Nombre",
      render: (career) => career.name,
    },
    {
      header: "Código",
      render: (career) => career.code,
    },
    {
      header: "Descripción",
      render: (career) => career.description ?? "Sin descripción",
    },
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

          <button
            onClick={() => navigate(`/semesters/list?careerId=${career.id}`)}
          >
            Semestres
          </button>

          {career.is_active && (
            <button onClick={() => handleArchive(career.id)}>
              Archivar
            </button>
          )}
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