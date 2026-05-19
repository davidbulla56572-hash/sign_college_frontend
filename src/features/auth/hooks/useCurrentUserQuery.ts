import { useQuery } from "@tanstack/react-query";

import { getMe } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";

export function useCurrentUserQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    retry: false,
    staleTime: 5 * 60 * 1000
  });
}
