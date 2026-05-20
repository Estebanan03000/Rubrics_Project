import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Breadcrumb from '../../components/Breadcrumb';
import UserForm from '../../components/users/UserForm';

import { User } from '../../models/User';
import { userService } from '../../services/userService';
import { auditLogService } from '../../services/auditLogService';

export default function UpdateUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (!id) return;

      const data = await userService.getUserById(id);
      setUser(data);
    };

    loadUser();
  }, [id]);

  const handleUpdate = async (data: User) => {
    if (!id) return;

    try {
      await userService.updateUser(id, data);
      auditLogService.createLog({
        action: 'UPDATE',
        entity_name: 'User',
        entity_id: id,
        detail: `Usuario actualizado: ${data.email}`,
      });
      navigate('/users');
    } catch (error: any) {
      alert(
        error?.response?.data?.detail ||
          'Error actualizando usuario',
      );
    }
  };

  if (!user) return <div>Cargando...</div>;

  return (
    <>
      <Breadcrumb pageName="Editar usuario" />

      <div className="mx-auto max-w-2xl rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <UserForm initialData={user} onSubmit={handleUpdate} />
      </div>
    </>
  );
}