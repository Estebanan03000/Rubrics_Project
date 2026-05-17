import { useState } from 'react';

import { User, UserRole } from '../../models/User';

interface Props {
    initialData?: User;
    onSubmit: (data: User) => void;
}

export default function UserForm({
    initialData,
    onSubmit,
    }: Props) {
    const [formData, setFormData] = useState<User>(
        initialData || {
        email: '',
        password: '',
        code: '',
        role: UserRole.STUDENT,
        is_active: true,
        profile: {
            first_name: '',
            last_name: '',
            identification: '',
            phone: '',
            specialty: '',
        },
        },
    );

    const handleChange = (
        field: string,
        value: string | boolean,
    ) => {
        setFormData((prev) => ({
        ...prev,
        [field]: value,
        }));
    };

    const handleProfileChange = (
        field: string,
        value: string,
    ) => {
        setFormData((prev) => ({
        ...prev,
        profile: {
            ...prev.profile,
            [field]: value,
        },
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
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
            handleChange('email', e.target.value)
            }
        />

        {!initialData && (
            <input
            type="password"
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
                handleChange('password', e.target.value)
            }
            />
        )}

        <input
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="Código"
            value={formData.code}
            onChange={(e) =>
            handleChange('code', e.target.value)
            }
        />

        <select
            className="w-full rounded border px-3 py-2 text-sm"
            value={formData.role}
            onChange={(e) =>
            handleChange('role', e.target.value)
            }
        >
            <option value={UserRole.ADMIN}>ADMIN</option>

            <option value={UserRole.TEACHER}>
            TEACHER
            </option>

            <option value={UserRole.STUDENT}>
            STUDENT
            </option>
        </select>

        <input
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="Nombre"
            value={formData.profile?.first_name}
            onChange={(e) =>
            handleProfileChange(
                'first_name',
                e.target.value,
            )
            }
        />

        <input
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="Apellido"
            value={formData.profile?.last_name}
            onChange={(e) =>
            handleProfileChange(
                'last_name',
                e.target.value,
            )
            }
        />

        <input
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="Identificación"
            value={formData.profile?.identification}
            onChange={(e) =>
            handleProfileChange(
                'identification',
                e.target.value,
            )
            }
        />

        {formData.role === UserRole.TEACHER && (
            <>
            <input
                className="w-full rounded border px-3 py-2 text-sm"
                placeholder="Teléfono"
                value={formData.profile?.phone}
                onChange={(e) =>
                handleProfileChange(
                    'phone',
                    e.target.value,
                )
                }
            />

            <input
                className="w-full rounded border px-3 py-2 text-sm"
                placeholder="Especialidad"
                value={formData.profile?.specialty}
                onChange={(e) =>
                handleProfileChange(
                    'specialty',
                    e.target.value,
                )
                }
            />
            </>
        )}

        <button
            type="submit"
            className="rounded bg-primary px-5 py-2 text-sm text-white"
        >
            Guardar
        </button>
        </form>
    );
}