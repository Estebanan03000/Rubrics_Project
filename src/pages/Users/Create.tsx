import { useNavigate } from 'react-router-dom';

import Breadcrumb from '../../components/Breadcrumb';
import UserForm from '../../components/users/UserForm';

import { User } from '../../models/User';
import { userService } from '../../services/userService';
import { auditLogService } from '../../services/auditLogService';

export default function CreateUser() {
  const navigate = useNavigate();

  const handleCreate = async (data: User) => {
    try {
      await userService.createUser(data);
      auditLogService.createLog({
        action: 'CREATE',
        entity_name: 'User',
        entity_id: data.id,
        detail: `Usuario creado: ${data.email}`,
      });
      navigate('/users');
    } catch (error: any) {
      alert(
        error?.response?.data?.detail ||
          'Error creando usuario',
      );
    }
  };

  return (
    <>
      <Breadcrumb pageName="Crear usuario" />

      <div className="mx-auto max-w-2xl rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <UserForm onSubmit={handleCreate} />
      </div>
    </>
  );
}