import { createContext, useContext, useState } from "react";

type DatosReemplazo = {
  hero: any;
  player: number;
} | null;

type TipoContextoReemplazo = {
  reemplazo: DatosReemplazo;
  setReemplazo: (data: DatosReemplazo) => void;
};

const ContextoReemplazoHeroe = createContext<TipoContextoReemplazo>({
  reemplazo: null,
  setReemplazo: () => {},
});

export function ProveedorReemplazoHeroe({
  children,
}: {
  children: React.ReactNode;
}) {
  const [reemplazo, setReemplazo] = useState<DatosReemplazo>(null);

  return (
    <ContextoReemplazoHeroe.Provider value={{ reemplazo, setReemplazo }}>
      {children}
    </ContextoReemplazoHeroe.Provider>
  );
}

export function useReemplazoHeroe() {
  return useContext(ContextoReemplazoHeroe);
}
