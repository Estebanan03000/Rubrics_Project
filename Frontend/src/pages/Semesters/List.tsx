import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Semester } from "../../models/Semester";
import { semesterService } from "../../services/semesterService";
import AcademicHeader from "../../components/academic/AcademicHeader";
import EntityTable, { TableColumn } from "../../components/academic/EntityTable";

const SemestersList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const careerId = searchParams.get("careerId");

  const [semesters, setSemesters] = useState<Semester[]>([]);

  useEffect(() => {
    loadSemesters();
  }, []);

  const loadSemesters = async () => {
    const response = await semesterService.getSemesters();

    const filtered = careerId
      ? response.filter((semester: Semester) => semester.career_id === careerId)
      : response;

    setSemesters(filtered);
  };

  const columns: TableColumn<Semester>[] = [
    { header: "Nombre", render: (semester) => semester.name },
    { header: "Código", render: (semester) => semester.code },
    { header: "Inicio", render: (semester) => semester.start_date },
    { header: "Fin", render: (semester) => semester.end_date },
    {
      header: "Estado",
      render: (semester) => (semester.is_active ? "Activo" : "Inactivo"),
    },
    {
      header: "Acciones",
      render: (semester) => (
        <button onClick={() => navigate(`/semesters/update/${semester.id}`)}>
          Editar
        </button>
      ),
    },
  ];

  return (
    <>
      <AcademicHeader
        title="Gestión de semestres"
        description="Administra los semestres asociados a las carreras."
        buttonText="Crear semestre"
        onButtonClick={() =>
          navigate(careerId ? `/semesters/create?careerId=${careerId}` : "/semesters/create")
        }
      />

      <EntityTable columns={columns} data={semesters} />
    </>
  );
};

export default SemestersList;