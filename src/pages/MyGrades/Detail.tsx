import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

import AcademicHeader from "../../components/academic/AcademicHeader";
import StudentGradeDetailTable from "../../components/grades/StudentGradeDetailTable";
import {
  StudentGradeDetailView,
  studentGradesBusiness,
} from "../../business/studentGradesBusiness";

const MyGradeDetail: React.FC = () => {
  const { gradeId } = useParams();

  const [data, setData] = useState<StudentGradeDetailView | null>(null);

  useEffect(() => {
    loadDetail();
  }, [gradeId]);

  const loadDetail = async () => {
    if (!gradeId) return;

    try {
      const response = await studentGradesBusiness.getGradeDetailView(gradeId);
      setData(response);
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo cargar el detalle de la calificación.",
        "error"
      );
    }
  };

  const handleDownloadReport = async () => {
    if (!gradeId) return;

    try {
      await studentGradesBusiness.downloadReport(gradeId);
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo descargar el reporte.",
        "error"
      );
    }
  };

  if (!data) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      <AcademicHeader
        title="Ver calificaciones detalladas"
        description="Consulta el detalle de tu calificación por criterios y niveles de desempeño."
        buttonText="Descargar reporte"
        onButtonClick={handleDownloadReport}
      />

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-2">
          <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">
            {data.evaluation?.name ?? "Evaluación"}
          </h3>

          <p className="text-sm text-gray-500">
            Ponderación: {data.evaluation?.weight ?? "-"}%
          </p>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-6 text-center shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-sm text-gray-500">Tu nota final</p>
          <p className="text-3xl font-bold text-primary">
            {data.grade.final_score.toFixed(2)} / 100
          </p>
          <p className="mt-2 text-sm text-green-600">Enviada</p>
        </div>
      </div>

      <StudentGradeDetailTable
        details={data.details}
        criteria={data.criteria}
        scales={data.scales}
      />

      {data.grade.observations && (
        <div className="mt-6 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="mb-2 font-semibold text-black dark:text-white">
            Observaciones del docente
          </h3>

          <p className="text-sm text-gray-600">{data.grade.observations}</p>
        </div>
      )}
    </>
  );
};

export default MyGradeDetail;