import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Breadcrumb from "../../components/Breadcrumb";
import GenericTable from "../../components/GenericTable";

import { RootState } from "../../store/store";
import { Group } from "../../models/Group";
import { groupService } from "../../services/groupService";

export default function MyGroups() {
  const currentUser = useSelector((state: RootState) => state.user.user);

  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const loadGroups = async () => {
      const data = await groupService.getGroups();

      const teacherGroups = data.filter(
        (group) => group.teacher_id === currentUser?.id,
      );

      setGroups(teacherGroups);
    };

    loadGroups();
  }, [currentUser]);

  const tableData = groups.map((group) => ({
    id: group.id,
    name: group.name || "",
    group_code: group.group_code || "",
    subject_id: group.subject_id || "",
    capacity: group.capacity || "",
    original: group,
  }));

  const columns = ["name", "group_code", "subject_id", "capacity"];

  return (
    <>
      <Breadcrumb pageName="Mis grupos" />

      {groups.length === 0 ? (
        <div className="rounded-sm border border-stroke bg-white p-6 text-center shadow-default dark:border-strokedark dark:bg-boxdark">
          No tienes grupos asignados.
        </div>
      ) : (
        <GenericTable
          data={tableData}
          columns={columns}
          actions={[]}
          onAction={() => {}}
        />
      )}
    </>
  );
}