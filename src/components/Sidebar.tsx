import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  HiOutlineAcademicCap,
  HiOutlineArchiveBox,
  HiOutlineBookOpen,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
  HiOutlineClipboardDocumentCheck,
  HiOutlineCog6Tooth,
  HiOutlineDocumentText,
  HiOutlineHome,
  HiOutlineIdentification,
  HiOutlineRectangleGroup,
  HiOutlineUserGroup,
  HiOutlineUsers,
} from "react-icons/hi2";
import { HiOutlineClipboardList } from "react-icons/hi";
import {
  AppRole,
  getCurrentUserRole,
  getRoleLabel,
} from "../utils/authRole";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

interface MenuItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
  roles: AppRole[];
  disabled?: boolean;
  children?: MenuItem[];
}

interface MenuSection {
  title?: string;
  roles: AppRole[];
  items: MenuItem[];
}

const allRoles: AppRole[] = ["ADMIN", "TEACHER", "STUDENT"];

const menuSections: MenuSection[] = [
  {
    roles: allRoles,
    items: [
      {
        label: "Inicio",
        path: "/dashboard",
        icon: <HiOutlineHome />,
        roles: allRoles,
      },
    ],
  },

  /*
    ADMINISTRADOR
    CU-01 a CU-07
  */
  {
    title: "Académico",
    roles: ["ADMIN"],
    items: [
      {
        label: "Carreras y semestres",
        icon: <HiOutlineAcademicCap />,
        roles: ["ADMIN"],
        children: [
          {
            label: "Carreras",
            path: "/careers/list",
            roles: ["ADMIN"],
          },
          {
            label: "Semestres",
            path: "/semesters/list",
            roles: ["ADMIN"],
          },
        ],
      },
      {
        label: "Asignaturas",
        path: "/subjects",
        icon: <HiOutlineBookOpen />,
        roles: ["ADMIN"],
      },
      {
        label: "Plan de estudios",
        path: "/studyplans/list",
        icon: <HiOutlineDocumentText />,
        roles: ["ADMIN"],
      },
      {
        label: "Grupos",
        path: "/groups/list",
        icon: <HiOutlineRectangleGroup />,
        roles: ["ADMIN"],
      },
      {
        label: "Inscripciones",
        path: "/enrollments/list",
        icon: <HiOutlineClipboardDocumentCheck />,
        roles: ["ADMIN"],
      },
    ],
  },
  {
    title: "Gestión",
    roles: ["ADMIN"],
    items: [
      {
        label: "Usuarios",
        path: "/users",
        icon: <HiOutlineUsers />,
        roles: ["ADMIN"],
      },
      {
        label: "Docentes",
        path: "/users/teachers",
        icon: <HiOutlineIdentification />,
        roles: ["ADMIN"],
      },
      {
        label: "Estudiantes",
        path: "/users/students",
        icon: <HiOutlineUserGroup />,
        roles: ["ADMIN"],
      },
      {
        label: "Matrículas",
        path: "/registrations/list",
        icon: <HiOutlineArchiveBox />,
        roles: ["ADMIN"],
      },
    ],
  },
  {
    title: "Sistema",
    roles: ["ADMIN"],
    items: [
      {
        label: "Reportes",
        icon: <HiOutlineChartBar />,
        roles: ["ADMIN"],
        disabled: true,
      },
      {
        label: "Auditorías",
        path: "/audit-logs",
        icon: <HiOutlineClipboardList />,
        roles: ["ADMIN"],
      },
      {
        label: "Configuración",
        path: "/settings",
        icon: <HiOutlineCog6Tooth />,
        roles: ["ADMIN"],
      },
    ],
  },

  /*
    DOCENTE
    CU-08 a CU-12
  */
  {
    title: "Mi clase",
    roles: ["TEACHER"],
    items: [
      {
        label: "Grupos",
        path: "/groups/list",
        icon: <HiOutlineRectangleGroup />,
        roles: ["TEACHER"],
      },
      {
        label: "Evaluaciones",
        path: "/evaluations/list",
        icon: <HiOutlineClipboardDocumentCheck />,
        roles: ["TEACHER"],
      },
      {
        label: "Calificaciones",
        path: "/grades/list",
        icon: <HiOutlineChartBar />,
        roles: ["TEACHER"],
      },
    ],
  },
  {
    title: "Rúbricas",
    roles: ["TEACHER"],
    items: [
      {
        label: "Rúbricas",
        path: "/rubrics/list",
        icon: <HiOutlineDocumentText />,
        roles: ["TEACHER"],
      },
      {
        label: "Crear rúbrica",
        path: "/rubrics/create",
        icon: <HiOutlineBookOpen />,
        roles: ["TEACHER"],
      },
    ],
  },
  {
    title: "Configuración",
    roles: ["TEACHER"],
    items: [
      {
        label: "Perfil",
        path: "/profile",
        icon: <HiOutlineIdentification />,
        roles: ["TEACHER"],
      },
      {
        label: "Preferencias",
        path: "/settings",
        icon: <HiOutlineCog6Tooth />,
        roles: ["TEACHER"],
      },
    ],
  },

  /*
    ESTUDIANTE
    CU-13 y CU-14
  */
  {
    title: "Mi espacio",
    roles: ["STUDENT"],
    items: [
      {
        label: "Mis asignaturas",
        path: "/subjects",
        icon: <HiOutlineBookOpen />,
        roles: ["STUDENT"],
      },
      {
        label: "Mis evaluaciones",
        path: "/evaluations/list",
        icon: <HiOutlineClipboardDocumentCheck />,
        roles: ["STUDENT"],
      },
      {
        label: "Mis calificaciones",
        path: "/my-grades/list",
        icon: <HiOutlineChartBar />,
        roles: ["STUDENT"],
      },
      {
        label: "Calendario",
        path: "/calendar",
        icon: <HiOutlineCalendarDays />,
        roles: ["STUDENT"],
      },
    ],
  },
  {
    title: "Recursos",
    roles: ["STUDENT"],
    items: [
      {
        label: "Rúbricas",
        path: "/rubrics/list",
        icon: <HiOutlineDocumentText />,
        roles: ["STUDENT"],
      },
      {
        label: "Material de apoyo",
        icon: <HiOutlineArchiveBox />,
        roles: ["STUDENT"],
        disabled: true,
      },
      {
        label: "Anuncios",
        icon: <HiOutlineDocumentText />,
        roles: ["STUDENT"],
        disabled: true,
      },
    ],
  },
];

const itemHasRole = (item: MenuItem, role: AppRole): boolean => {
  return item.roles.includes(role);
};

const sectionHasRole = (section: MenuSection, role: AppRole): boolean => {
  return section.roles.includes(role);
};

const isItemActive = (pathname: string, item: MenuItem): boolean => {
  if (item.path && pathname === item.path) return true;

  if (item.children) {
    return item.children.some((child) => child.path === pathname);
  }

  return false;
};

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<HTMLButtonElement | null>(null);
  const sidebar = useRef<HTMLElement | null>(null);

  const [sidebarExpanded, setSidebarExpanded] = useState(
    localStorage.getItem("sidebar-expanded") === "true"
  );

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const role = getCurrentUserRole();

  const visibleSections = useMemo(() => {
    return menuSections
      .filter((section) => sectionHasRole(section, role))
      .map((section) => ({
        ...section,
        items: section.items
          .filter((item) => itemHasRole(item, role))
          .map((item) => ({
            ...item,
            children: item.children?.filter((child) => itemHasRole(child, role)),
          })),
      }));
  }, [role]);

  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      const target = event.target as Node;

      if (!sidebar.current || !trigger.current) return;

      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      ) {
        return;
      }

      setSidebarOpen(false);
    };

    document.addEventListener("click", clickHandler);

    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if (!sidebarOpen || event.key !== "Escape") return;

      setSidebarOpen(false);
    };

    document.addEventListener("keydown", keyHandler);

    return () => {
      document.removeEventListener("keydown", keyHandler);
    };
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());

    if (sidebarExpanded) {
      document.body.classList.add("sidebar-expanded");
    } else {
      document.body.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const renderItem = (item: MenuItem) => {
    const active = isItemActive(pathname, item);

    if (item.children && item.children.length > 0) {
      const open = openGroups[item.label] ?? active;

      return (
        <li key={item.label}>
          <button
            type="button"
            onClick={() => toggleGroup(item.label)}
            className={`group flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium duration-200 ${
              active
                ? "bg-success/10 text-success"
                : "text-bodydark2 hover:bg-success/10 hover:text-success"
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </span>

            <span
              className={`text-xs duration-200 ${open ? "rotate-90" : ""}`}
            >
              ›
            </span>
          </button>

          {open && (
            <ul className="mt-1 space-y-1 pl-8">
              {item.children.map((child) => renderChildItem(child))}
            </ul>
          )}
        </li>
      );
    }

    return renderSingleItem(item);
  };

  const renderSingleItem = (item: MenuItem) => {
    if (item.disabled) {
      return (
        <li key={item.label}>
          <button
            type="button"
            disabled
            title="Módulo pendiente de implementar"
            className="group flex w-full cursor-not-allowed items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-bodydark2 opacity-50"
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
            <span className="ml-auto rounded bg-white/10 px-2 py-0.5 text-[10px]">
              Próx.
            </span>
          </button>
        </li>
      );
    }

    return (
      <li key={item.label}>
        <NavLink
          to={item.path || "#"}
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium duration-200 ${
              isActive
                ? "bg-success/10 text-success"
                : "text-bodydark2 hover:bg-success/10 hover:text-success"
            }`
          }
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      </li>
    );
  };

  const renderChildItem = (item: MenuItem) => {
    if (item.disabled) {
      return (
        <li key={item.label}>
          <button
            type="button"
            disabled
            className="block w-full cursor-not-allowed rounded px-3 py-2 text-left text-sm text-bodydark2 opacity-50"
          >
            {item.label}
          </button>
        </li>
      );
    }

    return (
      <li key={item.label}>
        <NavLink
          to={item.path || "#"}
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `block rounded px-3 py-2 text-sm duration-200 ${
              isActive
                ? "bg-success/10 text-success"
                : "text-bodydark2 hover:bg-success/10 hover:text-success"
            }`
          }
        >
          {item.label}
        </NavLink>
      </li>
    );
  };

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72 flex-col overflow-y-hidden border-r border-stroke bg-white duration-300 ease-linear dark:border-strokedark dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success">
            <HiOutlineAcademicCap className="text-2xl" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-black dark:text-white">
              EduGest
            </h1>
            <p className="text-xs text-bodydark2">{getRoleLabel(role)}</p>
          </div>
        </NavLink>

        <button
          ref={trigger}
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <span className="text-xl text-black dark:text-white">×</span>
        </button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="px-4 py-4">
          {visibleSections.map((section, index) => (
            <div key={`${section.title || "main"}-${index}`} className="mb-6">
              {section.title && (
                <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-bodydark2">
                  {section.title}
                </h3>
              )}

              <ul className="space-y-1">
                {section.items.map((item) => renderItem(item))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t border-stroke px-6 py-4 dark:border-strokedark">
        <button
          type="button"
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          className="flex items-center gap-2 text-sm text-bodydark2 hover:text-success"
        >
          <span>{sidebarExpanded ? "Contraer menú" : "Expandir menú"}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;