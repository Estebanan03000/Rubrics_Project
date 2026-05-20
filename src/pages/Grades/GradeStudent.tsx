import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import AcademicHeader from "../../components/academic/AcademicHeader";
import StepIndicator from "../../components/workflow/StepIndicator";
import RubricGradingTable from "../../components/grades/RubricGradingTable";
import GradeSummaryPanel from "../../components/grades/GradeSummaryPanel";

import { Evaluation } from "../../models/Evaluation";
import { GradeFormData } from "../../models/GradeFormData";
import { Student } from "../../models/Student";
import { gradingBusiness } from "../../business/gradingBusiness";
import { finalGradeService } from '../../services/finalGradeService';

const GradeStudent: React.FC = () => {
  const { evaluationId, enrollmentId } = useParams();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(2);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<GradeFormData | null>(null);
  const [isFinalized, setIsFinalized] = useState(false);

  useEffect(() => {
    loadContext();
  }, [evaluationId, enrollmentId]);

  const loadContext = async () => {
    if (!evaluationId || !enrollmentId) return;

    try {
      const context = await gradingBusiness.getGradeContext(
        evaluationId,
        enrollmentId
      );

      setEvaluation(context.evaluation);
      setStudent(context.student);
      setFormData(gradingBusiness.buildInitialFormData(context));
      setIsFinalized(finalGradeService.isEnrollmentFinalized(enrollmentId));
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo cargar la información de calificación.",
        "error"
      );
    }
  };

  const handleSaveDraft = async () => {
    if (!formData) return;

    if (isFinalized) {
      await Swal.fire(
        'Nota bloqueada',
        'La nota final ya fue registrada oficialmente y no puede editarse.',
        'warning',
      );
      return;
    }

    try {
      await gradingBusiness.saveGrade(formData, false);

      await Swal.fire(
        "Borrador guardado",
        "La calificación fue guardada sin notificar al estudiante.",
        "success"
      );

      navigate(`/grades/evaluation/${evaluationId}`);
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo guardar el borrador.",
        "error"
      );
    }
  };

  const handleSubmitGrade = async () => {
    if (!formData) return;

    if (isFinalized) {
      await Swal.fire(
        'Nota bloqueada',
        'La nota final ya fue registrada oficialmente y no puede editarse.',
        'warning',
      );
      return;
    }

    try {
      await gradingBusiness.saveGrade(formData, true);

      await Swal.fire(
        "Calificación enviada",
        "La nota final fue calculada y enviada al estudiante.",
        "success"
      );

      navigate(`/grades/evaluation/${evaluationId}`);
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo enviar la calificación.",
        "error"
      );
    }
  };

  if (!evaluation || !student || !formData) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      <AcademicHeader
        title="Calificar estudiante con rúbrica"
        description="Registra el desempeño del estudiante por criterio y calcula la nota final."
      />

      <StepIndicator
        currentStep={currentStep}
        steps={[
          { number: 1, label: "Seleccionar estudiante" },
          { number: 2, label: "Evaluar criterios" },
          { number: 3, label: "Revisar y enviar" },
        ]}
      />

      {isFinalized && (
        <div className="mb-6 rounded-sm border border-warning bg-warning bg-opacity-10 p-4 text-sm text-warning">
          Esta inscripción ya tiene nota final oficial registrada. La edición está bloqueada visualmente.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RubricGradingTable formData={formData} onChange={setFormData} />

          <div className="mt-6 flex flex-wrap justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate(`/grades/evaluation/${evaluationId}`)}
              className="rounded border border-stroke px-4 py-2"
            >
              Cancelar
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isFinalized}
                className="rounded border border-stroke px-4 py-2"
              >
                Guardar borrador
              </button>

              <button
                type="button"
                onClick={handleSubmitGrade}
                disabled={isFinalized}
                className="rounded bg-primary px-4 py-2 text-white"
              >
                Enviar calificación
              </button>
            </div>
          </div>
        </div>

        <GradeSummaryPanel
          evaluation={evaluation}
          student={student}
          formData={formData}
        />
      </div>
    </>
  );
};

export default GradeStudent;