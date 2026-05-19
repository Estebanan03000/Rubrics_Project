import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AcademicHeader from '../../components/academic/AcademicHeader';
import { FinalGradeConsolidated, FinalGradeStudentRow } from '../../models/FinalGrade';
import { finalGradeBusiness } from '../../business/finalGradeBusiness';

const FinalRegister: React.FC = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();

  const [data, setData] = useState<FinalGradeConsolidated | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [groupId]);

  const loadData = async () => {
    if (!groupId) {
      setError('No se recibió el grupo en la ruta.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const consolidated =
        await finalGradeBusiness.getFinalGradeConsolidated(groupId);

      setData(consolidated);
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar el consolidado de notas finales.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return 'Sin fecha';

    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  const getGradeByEvaluation = (
    student: FinalGradeStudentRow,
    evaluationId: string,
  ) => {
    return student.grades.find((grade) => grade.evaluationId === evaluationId);
  };

  const handleConfirmOfficialRegister = async () => {
    if (!groupId) return;
    
    if (!data?.groupInfo.semesterIsActive) {
        alert(
        'No se puede confirmar el registro oficial porque el semestre está inactivo.',
        );
        return;
    }

    const confirmRegister = window.confirm(
      '¿Está segura de confirmar el registro oficial? Las notas quedarán registradas oficialmente.',
    );

    if (!confirmRegister) return;

    try {
      setConfirming(true);
      await finalGradeBusiness.confirmOfficialRegister(groupId);
      alert('Registro oficial confirmado correctamente.');
      await loadData();
    } catch (err) {
      console.error(err);
      alert('No se pudo confirmar el registro oficial.');
    } finally {
      setConfirming(false);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <>
        <AcademicHeader
          title="Registrar nota final"
          description="Cargando consolidado de notas finales..."
        />

        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          Cargando información del grupo...
        </div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <AcademicHeader
          title="Registrar nota final"
          description="No se pudo cargar el consolidado."
        />

        <div className="rounded-sm border border-danger bg-danger bg-opacity-10 p-6 text-danger">
          {error || 'No hay información disponible.'}
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={() => navigate('/grades/list')}
            className="rounded bg-primary px-5 py-3 text-sm font-medium text-white hover:bg-opacity-90"
          >
            Volver a calificaciones
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <AcademicHeader
        title="Registrar nota final"
        description="Consolida y registra oficialmente la nota final de cada estudiante."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark md:col-span-2">
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div>
              <p className="mb-2">
                <span className="font-semibold text-black dark:text-white">
                  Grupo:
                </span>{' '}
                {data.groupInfo.groupCode
                  ? `${data.groupInfo.groupCode} - ${data.groupInfo.groupName}`
                  : data.groupInfo.groupName}
              </p>

              <p className="mb-2">
                <span className="font-semibold text-black dark:text-white">
                  Asignatura:
                </span>{' '}
                {data.groupInfo.subjectCode
                  ? `${data.groupInfo.subjectName} (${data.groupInfo.subjectCode})`
                  : data.groupInfo.subjectName}
              </p>

              <p className="mb-2">
                <span className="font-semibold text-black dark:text-white">
                  Semestre:
                </span>{' '}
                {data.groupInfo.semesterName}{' '}
                {data.groupInfo.semesterIsActive ? (
                  <span className="ml-2 rounded-full bg-success bg-opacity-10 px-3 py-1 text-xs font-medium text-success">
                    Activo
                  </span>
                ) : (
                  <span className="ml-2 rounded-full bg-danger bg-opacity-10 px-3 py-1 text-xs font-medium text-danger">
                    Inactivo
                  </span>
                )}
              </p>

              <p>
                <span className="font-semibold text-black dark:text-white">
                  Docente:
                </span>{' '}
                {data.groupInfo.teacherName}
              </p>
            </div>

            <div>
              <p className="mb-2">
                <span className="font-semibold text-black dark:text-white">
                  Total de estudiantes inscritos:
                </span>{' '}
                {data.summary.totalStudents}
              </p>

              <p className="mb-2">
                <span className="font-semibold text-black dark:text-white">
                  Evaluaciones del grupo:
                </span>{' '}
                {data.evaluations.length}
              </p>

              <p>
                <span className="font-semibold text-black dark:text-white">
                  Ponderación total:
                </span>{' '}
                {data.summary.totalWeight}%
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 rounded-sm border border-warning bg-warning bg-opacity-10 p-4 text-sm text-black dark:text-white md:flex-row md:items-center md:justify-between">
            <p>
              Revise el consolidado de notas finales. Antes de confirmar, puede
              corregir calificaciones desde la opción de evaluaciones.
            </p>

            <button
              type="button"
              onClick={() => navigate('/grades/list')}
              className="rounded border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white"
            >
              Ir a evaluaciones
            </button>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="mb-4 font-semibold text-black dark:text-white">
            Resumen del consolidado
          </h3>

          <div className="space-y-3 text-sm">
            <p className="flex justify-between">
              <span>Estudiantes con nota completa:</span>
              <span className="font-semibold text-success">
                {data.summary.completeStudents}
              </span>
            </p>

            <p className="flex justify-between">
              <span>Estudiantes con nota parcial:</span>
              <span className="font-semibold text-danger">
                {data.summary.partialStudents}
              </span>
            </p>

            <p className="flex justify-between">
              <span>Total de estudiantes:</span>
              <span className="font-semibold">{data.summary.totalStudents}</span>
            </p>

            <div className="my-4 border-t border-stroke dark:border-strokedark" />

            <p className="flex justify-between">
              <span>Promedio del grupo:</span>
              <span className="font-semibold">
                {data.summary.groupAverage.toFixed(2)}
              </span>
            </p>

            <p className="flex justify-between">
              <span>Nota más alta:</span>
              <span className="font-semibold">
                {data.summary.highestScore.toFixed(2)}
              </span>
            </p>

            <p className="flex justify-between">
              <span>Nota más baja:</span>
              <span className="font-semibold">
                {data.summary.lowestScore.toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {data.evaluations.length === 0 && (
        <div className="mb-5 rounded-sm border border-warning bg-warning bg-opacity-10 p-4 text-sm text-warning">
          No hay evaluaciones registradas para este grupo.
        </div>
      )}

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-5 py-4 dark:border-strokedark">
          <h3 className="font-semibold text-black dark:text-white">
            Consolidado de nota final por estudiante
          </h3>

          <p className="mt-1 text-sm">
            La nota final es la suma ponderada de todas las evaluaciones del
            grupo.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="px-4 py-4 text-sm font-semibold text-black dark:text-white">
                  #
                </th>

                <th className="px-4 py-4 text-sm font-semibold text-black dark:text-white">
                  Estudiante
                </th>

                <th className="px-4 py-4 text-sm font-semibold text-black dark:text-white">
                  Inscripción
                </th>

                {data.evaluations.map((evaluation) => (
                  <th
                    key={evaluation.id}
                    className="px-4 py-4 text-center text-sm font-semibold text-black dark:text-white"
                  >
                    {evaluation.name}
                    <br />
                    <span className="text-xs font-normal">
                      {evaluation.weight}%
                    </span>
                  </th>
                ))}

                <th className="px-4 py-4 text-center text-sm font-semibold text-black dark:text-white">
                  Nota final
                </th>

                <th className="px-4 py-4 text-center text-sm font-semibold text-black dark:text-white">
                  Estado
                </th>

                <th className="px-4 py-4 text-center text-sm font-semibold text-black dark:text-white">
                  Observaciones
                </th>
              </tr>
            </thead>

            <tbody>
              {data.students.length === 0 && (
                <tr>
                  <td
                    colSpan={data.evaluations.length + 6}
                    className="px-4 py-8 text-center text-sm"
                  >
                    No hay estudiantes inscritos o notas relacionadas para este grupo.
                  </td>
                </tr>
              )}

              {data.students.map((student, index) => (
                <tr
                  key={student.enrollmentId}
                  className="border-b border-stroke dark:border-strokedark"
                >
                  <td className="px-4 py-4 text-sm">{index + 1}</td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary bg-opacity-10 font-semibold text-primary">
                        {getInitials(student.studentName)}
                      </div>

                      <div>
                        <p className="font-medium text-black dark:text-white">
                          {student.studentName}
                        </p>
                        <p className="text-sm">
                          {student.studentIdentification || 'Sin identificación'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm">
                    <p>{student.enrollmentId}</p>
                    <p className="text-xs">
                      {formatDate(student.enrollmentDate)}
                    </p>
                  </td>

                  {data.evaluations.map((evaluation) => {
                    const grade = getGradeByEvaluation(student, evaluation.id);

                    return (
                      <td
                        key={evaluation.id}
                        className="px-4 py-4 text-center text-sm"
                      >
                        {grade?.score !== null &&
                        grade?.score !== undefined ? (
                          <>
                            <p className="font-medium text-black dark:text-white">
                              {grade.score.toFixed(2)}
                            </p>
                            <p className="text-xs">
                              {grade.weightedScore.toFixed(2)}
                            </p>
                          </>
                        ) : (
                          <span className="text-danger">Pendiente</span>
                        )}
                      </td>
                    );
                  })}

                  <td className="px-4 py-4 text-center">
                    <span
                      className={`font-bold ${
                        student.status === 'complete'
                          ? 'text-success'
                          : 'text-warning'
                      }`}
                    >
                      {student.finalScore.toFixed(2)}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center">
                    {student.status === 'complete' ? (
                      <span className="rounded-full bg-success bg-opacity-10 px-3 py-1 text-xs font-medium text-success">
                        Completa
                      </span>
                    ) : (
                      <span className="rounded-full bg-warning bg-opacity-10 px-3 py-1 text-xs font-medium text-warning">
                        Parcial
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4 text-center text-sm">
                    {student.observations || '—'}
                  </td>
                </tr>
              ))}

              {data.students.length > 0 && (
                <tr className="bg-gray-2 font-semibold dark:bg-meta-4">
                  <td className="px-4 py-4 text-sm" colSpan={3}>
                    Promedio del grupo
                  </td>

                  {data.evaluations.map((evaluation) => {
                    const scores = data.students
                      .map((student) =>
                        getGradeByEvaluation(student, evaluation.id),
                      )
                      .filter(
                        (grade) =>
                          grade?.score !== null &&
                          grade?.score !== undefined,
                      )
                      .map((grade) => Number(grade?.score));

                    const average =
                      scores.length > 0
                        ? scores.reduce((sum, score) => sum + score, 0) /
                          scores.length
                        : 0;

                    return (
                      <td
                        key={evaluation.id}
                        className="px-4 py-4 text-center text-sm"
                      >
                        {average.toFixed(2)}
                      </td>
                    );
                  })}

                  <td className="px-4 py-4 text-center text-sm text-primary">
                    {data.summary.groupAverage.toFixed(2)}
                  </td>

                  <td className="px-4 py-4" colSpan={2}></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-5 rounded-sm border border-primary bg-primary bg-opacity-10 p-4 text-sm text-primary">
        <strong>Nota:</strong> La nota final se calcula como la suma ponderada
        de las evaluaciones del grupo.
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:justify-end">
        <button
          type="button"
          onClick={() => navigate('/grades/list')}
          className="rounded border border-stroke px-5 py-3 text-sm font-medium hover:bg-gray-2 dark:border-strokedark"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={handlePrintReport}
          className="rounded border border-primary px-5 py-3 text-sm font-medium text-primary hover:bg-primary hover:text-white"
        >
          Vista previa / imprimir reporte
        </button>

        <button
        type="button"
        onClick={handleConfirmOfficialRegister}
        disabled={
            confirming ||
            data.students.length === 0 ||
            !data.groupInfo.semesterIsActive
        }
        className="rounded bg-primary px-5 py-3 text-sm font-medium text-white hover:bg-opacity-90 disabled:cursor-not-allowed disabled:bg-opacity-50"
        >
        {confirming ? 'Confirmando...' : 'Confirmar registro oficial'}
        </button>
      </div>

        {!data.groupInfo.semesterIsActive && (
        <div className="mt-6 rounded-sm border border-danger bg-danger bg-opacity-10 p-4 text-sm text-danger">
            <strong>Semestre inactivo:</strong> No se permite registrar oficialmente
            la nota final porque el semestre asociado al grupo está inactivo. Contacte
            al administrador para activar el semestre o revisar la configuración.
        </div>
        )}

      {data.summary.partialStudents > 0 && (
        <div className="mt-6 rounded-sm border border-danger bg-danger bg-opacity-10 p-4 text-sm text-danger">
          <strong>Notas incompletas detectadas:</strong>{' '}
          {data.summary.partialStudents} estudiante(s) no tienen todas las
          evaluaciones calificadas.
        </div>
      )}

      {data.summary.totalWeight !== 100 && data.evaluations.length > 0 && (
        <div className="mt-6 rounded-sm border border-warning bg-warning bg-opacity-10 p-4 text-sm text-warning">
          <strong>Advertencia:</strong> La ponderación total del grupo es{' '}
          {data.summary.totalWeight}%. Para que la nota final sea completa,
          normalmente debe sumar 100%.
        </div>
      )}
    </>
  );
};

export default FinalRegister;