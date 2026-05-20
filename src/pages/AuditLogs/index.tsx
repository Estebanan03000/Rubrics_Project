import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import Breadcrumb from '../../components/Breadcrumb';
import GenericTable from '../../components/GenericTable';

import { AuditLog } from '../../models/AuditLog';
import { auditLogService } from '../../services/auditLogService';

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  const loadLogs = () => {
    setLogs(auditLogService.getLogs());
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const tableData = logs.map((log) => ({
    id: log.id,
    action: log.action,
    entity_name: log.entity_name,
    entity_id: log.entity_id || '',
    detail: log.detail || '',
    created_at: log.created_at
      ? new Date(log.created_at).toLocaleString()
      : '',
    original: log,
  }));

  const columns = [
    'action',
    'entity_name',
    'entity_id',
    'detail',
    'created_at',
  ];

  const actions = [
    {
      name: 'view',
      label: 'Ver',
    },
  ];

  const handleTableAction = (
    action: string,
    item: Record<string, any>,
  ) => {
    const log = item.original as AuditLog;

    if (action === 'view') {
      Swal.fire({
        title: 'Detalle de auditoría',
        html: `
          <div style="text-align:left">
            <p><strong>Acción:</strong> ${log.action}</p>
            <p><strong>Entidad:</strong> ${log.entity_name}</p>
            <p><strong>ID Entidad:</strong> ${log.entity_id || 'N/A'}</p>
            <p><strong>Detalle:</strong> ${log.detail || 'Sin detalle'}</p>
            <p><strong>Fecha:</strong> ${
              log.created_at
                ? new Date(log.created_at).toLocaleString()
                : 'N/A'
            }</p>
          </div>
        `,
        icon: 'info',
      });
    }
  };

  const handleClearLogs = async () => {
    const result = await Swal.fire({
      title: '¿Limpiar auditoría?',
      text: 'Esto eliminará los logs simulados guardados en este navegador.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, limpiar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    auditLogService.clearLogs();
    loadLogs();

    Swal.fire(
      'Limpio',
      'Los logs simulados fueron eliminados.',
      'success',
    );
  };

  return (
    <>
      <Breadcrumb pageName="Auditorías" />

      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={handleClearLogs}
          className="rounded bg-danger px-5 py-2 text-sm text-white"
        >
          Limpiar logs
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="rounded-sm border border-stroke bg-white p-6 text-center shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-sm text-black dark:text-white">
            No hay logs de auditoría registrados en este navegador.
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