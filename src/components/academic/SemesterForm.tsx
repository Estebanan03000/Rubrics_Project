import React, { useState } from "react";
import { Semester } from "../../models/Semester";
import { Career } from "../../models/Career";

interface SemesterFormProps {
  initialData?: Semester;
  careers: Career[];
  submitText: string;
  onSubmit: (semester: Semester) => void;
  onCancel: () => void;
}

const SemesterForm: React.FC<SemesterFormProps> = ({
  initialData,
  careers,
  submitText,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Semester>({
    career_id: initialData?.career_id ?? "",
    name: initialData?.name ?? "",
    code: initialData?.code ?? "",
    start_date: initialData?.start_date ?? "",
    end_date: initialData?.end_date ?? "",
    is_active: initialData?.is_active ?? false,
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = event.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : value,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (formData.start_date >= formData.end_date) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <div className="mb-4">
        <label className="mb-2 block font-medium text-black dark:text-white">
          Carrera
        </label>
        <select
          name="career_id"
          value={formData.career_id}
          onChange={handleChange}
          className="w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
        >
          <option value="">Seleccione una carrera</option>
          {careers.map((career) => (
            <option key={career.id} value={career.id}>
              {career.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="mb-2 block font-medium text-black dark:text-white">
          Nombre del semestre
        </label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
        />
      </div>

      <div className="mb-4">
        <label className="mb-2 block font-medium text-black dark:text-white">
          Código
        </label>
        <input
          name="code"
          value={formData.code}
          onChange={handleChange}
          className="w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          className="rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
        />

        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          className="rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
        />
      </div>

      <label className="mb-6 flex items-center gap-2">
        <input
          type="checkbox"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
        />
        Semestre activo
      </label>

      <div className="flex gap-3">
        <button type="submit" className="rounded bg-primary px-4 py-2 text-white">
          {submitText}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-stroke px-4 py-2"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default SemesterForm;