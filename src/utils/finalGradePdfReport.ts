import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FinalGradeConsolidated } from '../models/FinalGrade';

export const downloadFinalGradePdfReport = (
  data: FinalGradeConsolidated,
) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const groupTitle = data.groupInfo.groupCode
    ? `${data.groupInfo.groupCode} - ${data.groupInfo.groupName}`
    : data.groupInfo.groupName;

  const subjectTitle = data.groupInfo.subjectCode
    ? `${data.groupInfo.subjectName} (${data.groupInfo.subjectCode})`
    : data.groupInfo.subjectName;

  doc.setFontSize(16);
  doc.text('Reporte de notas finales', 14, 15);

  doc.setFontSize(10);
  doc.text(`Grupo: ${groupTitle}`, 14, 24);
  doc.text(`Asignatura: ${subjectTitle}`, 14, 30);
  doc.text(`Semestre: ${data.groupInfo.semesterName}`, 14, 36);
  doc.text(`Docente: ${data.groupInfo.teacherName}`, 14, 42);

  doc.text(`Total estudiantes: ${data.summary.totalStudents}`, 150, 24);
  doc.text(`Notas completas: ${data.summary.completeStudents}`, 150, 30);
  doc.text(`Notas parciales: ${data.summary.partialStudents}`, 150, 36);
  doc.text(`Promedio del grupo: ${data.summary.groupAverage.toFixed(2)}`, 150, 42);

  const headers = [
    '#',
    'Estudiante',
    'Identificación',
    'Inscripción',
    ...data.evaluations.map(
      (evaluation) => `${evaluation.name} (${evaluation.weight}%)`,
    ),
    'Nota final',
    'Estado',
    'Observaciones',
  ];

  const body = data.students.map((student, index) => [
    index + 1,
    student.studentName,
    student.studentIdentification || 'Sin identificación',
    student.enrollmentId,
    ...data.evaluations.map((evaluation) => {
      const grade = student.grades.find(
        (item) => item.evaluationId === evaluation.id,
      );

      if (!grade || grade.score === null || grade.score === undefined) {
        return 'Pendiente';
      }

      return `${grade.score.toFixed(2)} / ${grade.weightedScore.toFixed(2)}`;
    }),
    student.finalScore.toFixed(2),
    student.status === 'complete' ? 'Completa' : 'Parcial',
    student.observations || '-',
  ]);

  autoTable(doc, {
    head: [headers],
    body,
    startY: 50,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fontStyle: 'bold',
    },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 60;

  doc.setFontSize(9);
  doc.text(
    `Ponderación total: ${data.summary.totalWeight}%`,
    14,
    finalY + 10,
  );

  if (data.summary.totalWeight !== 100) {
    doc.text(
      `Advertencia: la ponderación total del grupo es ${data.summary.totalWeight}%.`,
      14,
      finalY + 16,
    );
  }

  if (!data.groupInfo.semesterIsActive) {
    doc.text(
      'Semestre inactivo: no se permite confirmar el registro oficial.',
      14,
      finalY + 22,
    );
  }

  const fileName = `reporte-notas-finales-${groupTitle}`
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  doc.save(`${fileName}.pdf`);
};