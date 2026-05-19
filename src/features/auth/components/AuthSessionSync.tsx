import axios from "axios";
import { useEffect, type ReactNode } from "react";

import { useCurrentUserQuery } from "../hooks/useCurrentUserQuery";
import { useAuthStore } from "../store/auth.store";

type AuthSessionSyncProps = {
  children: ReactNode;
};

export function AuthSessionSync({ children }: AuthSessionSyncProps) {
  const clearSession = useAuthStore((state) => state.clearSession);
  const setUser = useAuthStore((state) => state.setUser);
  const { data, error } = useCurrentUserQuery();

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  useEffect(() => {
    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 401 || error.response?.status === 403)
    ) {
      clearSession();
    }
  }, [clearSession, error]);

  return children;
}
