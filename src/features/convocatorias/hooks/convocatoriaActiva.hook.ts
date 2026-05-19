import { useQuery } from "@tanstack/react-query";
import { convocatoriaApi } from "../api/convocatoriaActiva.api";

export function useConvocatoriaActivaQuery() {
  return useQuery({
    queryKey: ["convocatoria", "activa"],
    queryFn: () => convocatoriaApi.getActiva(),
  });
}
