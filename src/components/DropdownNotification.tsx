/* Archivo: Frontend\src\components\DropdownNotification.tsx
   Proposito: Implementa la logica principal del archivo DropdownNotification.
*/

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface Notification {
  id: number;
  message: string;
  time: string;
}

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications] = useState<Notification[]>([]);

  const trigger = useRef<HTMLAnchorElement | null>(null);
  const dropdown = useRef<HTMLDivElement | null>(null);

  // Click outside
  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      const target = event.target as Node;

      if (!dropdown.current || !trigger.current) return;

      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      ) {
        return;
      }

      setDropdownOpen(false);
    };

    document.addEventListener("click", clickHandler);

    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, [dropdownOpen]);

  // ESC key
  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if (!dropdownOpen || event.key !== "Escape") return;

      setDropdownOpen(false);
    };

    document.addEventListener("keydown", keyHandler);

    return () => {
      document.removeEventListener("keydown", keyHandler);
    };
  }, [dropdownOpen]);

  return (
    <li className="relative">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen((prev) => !prev)}
        to="#"
        className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary"
        aria-expanded={dropdownOpen}
        aria-label="Abrir notificaciones"
      >
        {notifications.length > 0 && (
          <span className="absolute -right-1 -top-1 z-50 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-red-600 shadow">
            {notifications.length}
          </span>
        )}

        <svg width="18" height="18" viewBox="0 0 18 18" className="fill-current">
          <path d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343Z" />
        </svg>
      </Link>

      <div
        ref={dropdown}
        className={`absolute right-0 mt-2 w-80 rounded-sm border bg-white shadow ${
          dropdownOpen ? "block" : "hidden"
        }`}
      >
        <div className="px-4 py-3">
          <h5 className="text-sm font-medium">Notificaciones</h5>
        </div>

        <ul className="max-h-80 overflow-y-auto">
          {notifications.length === 0 && (
            <li className="px-4 py-3 text-sm text-gray-500">
              No hay notificaciones
            </li>
          )}

          {notifications.map((notification) => (
            <li key={notification.id}>
              <Link
                to="#"
                className="flex flex-col gap-1 border-t px-4 py-3 hover:bg-gray-100"
              >
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-gray-500">{notification.time}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export default DropdownNotification;