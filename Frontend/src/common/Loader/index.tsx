/* Archivo: Frontend\src\common\Loader\index.tsx
   Proposito: Implementa la logica principal del archivo index.
*/
const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
};

export default Loader;
