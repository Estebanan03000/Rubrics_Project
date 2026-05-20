import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Breadcrumb from '../../components/Breadcrumb';
import GenericTable from '../../components/GenericTable';

import { User } from '../../models/User';
import { userService } from '../../services/userService';

export default function Users() {
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState<User[]>([]);

  const roleFilter = useMemo(() => {
    if (location.pathname.includes('/users/students')) {
      return 'STUDENT';
    }

    if (location.pathname.includes('/users/teachers')) {
      return 'TEACHER';
    }

    return null;
  }, [location.pathname]);

  const pageTitle = useMemo(() => {
    if (roleFilter === 'STUDENT') {
      return 'Usuarios estudiantes';
    }

    if (roleFilter === 'TEACHER') {
      return 'Usuarios docentes';
    }

    return 'Usuarios';
  }, [roleFilter]);

  const loadUsers = async () => {
    const data = await userService.getUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!roleFilter) {
      return users;
    }

    return users.filter(
      (user) => user.role?.toUpperCase() === roleFilter,
    );
  }, [users, roleFilter]);

  const tableData = filteredUsers.map((user) => ({
    id: user.id,
    email: user.email || '',
    code: user.code || '',
    role: user.role || '',
    status: user.is_active ? 'Activo' : 'Inactivo',
    original: user,
  }));

  const columns = ['email', 'code', 'role', 'status'];

  const actions = [
    { name: 'edit', label: 'Editar' },
    { name: 'delete', label: 'Desactivar' },
  ];

  const handleDeactivate = async (id: string) => {
    const confirmed = confirm('¿Deseas desactivar este usuario?');

    if (!confirmed) return;

    await userService.deactivateUser(id);
    await loadUsers();
  };

  const handleTableAction = (
    actionName: string,
    item: Record<string, any>,
  ) => {
    const user = item.original as User;

    if (actionName === 'edit' && user.id) {
      navigate(`/users/update/${user.id}`);
    }

    if (actionName === 'delete' && user.id) {
      handleDeactivate(user.id);
    }
  };

  return (
    <>
      <Breadcrumb pageName={pageTitle} />

      <div className="mb-6 flex justify-end">
        <button
          onClick={() => navigate('/users/create')}
          className="rounded bg-primary px-5 py-2 text-sm text-white"
        >
          Crear usuario
        </button>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="rounded-sm border border-stroke bg-white p-6 text-center shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-sm text-black dark:text-white">
            No hay usuarios para mostrar.
          </p>
        </div>
      ) : (
        <GenericTable
          data={tableData}
          columns={columns}
          actions={actions}
          onAction={handleTableAction}
        />
      )}
    </>
  );
}