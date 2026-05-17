import { useState } from 'react';
import { Subject } from '../../models/Subject';

interface Props {
  initialData?: Subject;
  onSubmit: (data: Subject) => void;
}

export default function SubjectForm({
  initialData,
  onSubmit,
}: Props) {
  const [formData, setFormData] = useState<Subject>(
    initialData || {
      name: '',
      code: '',
      description: '',
      credits: 1,
      is_active: true,
    },
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'credits' ? Number(value) : value,
    }));
  };

  return (
    <form
      className="mx-auto max-w-xl space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
      <input
        name="name"
        value={formData.name || ''}
        onChange={handleChange}
        placeholder="Nombre"
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <input
        name="code"
        value={formData.code || ''}
        onChange={handleChange}
        placeholder="Código"
        disabled={!!initialData}
        className="w-full rounded border px-3 py-2 text-sm disabled:bg-gray-2"
      />

      <textarea
        name="description"
        value={formData.description || ''}
        onChange={handleChange}
        placeholder="Descripción"
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <input
        type="number"
        name="credits"
        value={formData.credits || 1}
        onChange={handleChange}
        placeholder="Créditos"
        min={1}
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <button
        type="submit"
        className="rounded bg-primary px-5 py-2 text-sm text-white"
      >
        Guardar
      </button>
    </form>
  );
}