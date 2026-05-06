import React, { useState } from "react";
import { Career } from "../../models/Career";

interface CareerFormProps {
  initialData?: Career;
  submitText: string;
  onSubmit: (career: Career) => void;
  onCancel: () => void;
}

const CareerForm: React.FC<CareerFormProps> = ({
  initialData,
  submitText,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Career>({
    name: initialData?.name ?? "",
    code: initialData?.code ?? "",
    description: initialData?.description ?? "",
    is_active: initialData?.is_active ?? true,
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.name || !formData.code) {
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
          Nombre de la carrera
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded border border-stroke px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input"
        />
      </div>

      <div className="mb-4">
        <label className="mb-2 block font-medium text-black dark:text-white">
          Código
        </label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          className="w-full rounded border border-stroke px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input"
        />
      </div>

      <div className="mb-6">
        <label className="mb-2 block font-medium text-black dark:text-white">
          Descripción
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded border border-stroke px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input"
        />
      </div>

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

export default CareerForm;