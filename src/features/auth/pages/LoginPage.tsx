import { GraduationCap } from "lucide-react";

import { LoginForm } from "../components/LoginForm";
import { useLoginMutation } from "../hooks/useLoginMutation";

export function LoginPage() {
  const loginMutation = useLoginMutation();

  return (
    <main className="grid min-h-screen bg-[#f6f7f9] lg:grid-cols-[minmax(0,1fr)_460px]">
      <section className="flex min-h-[42vh] items-end bg-[linear-gradient(135deg,#0e7490_0%,#0f766e_52%,#3f3f46_100%)] p-8 text-white lg:min-h-screen lg:p-12">
        <div className="max-w-2xl space-y-5">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-white/15">
            <GraduationCap className="h-7 w-7" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100">
              Sign College
            </p>
            <h1 className="mt-3 max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
              Evaluacion docente con trazabilidad desde la hoja de vida.
            </h1>
          </div>
          <p className="max-w-xl text-base text-cyan-50">
            Convocatorias, postulaciones y resultados en un solo entorno.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md rounded-md border border-gray-200 bg-white p-6 shadow-soft sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-ink">Iniciar sesion</h2>
            <p className="mt-2 text-sm text-gray-600">
              Usa tus credenciales de aspirante o administrador.
            </p>
          </div>
          <LoginForm
            isPending={loginMutation.isPending}
            onSubmit={(values) => loginMutation.mutate(values)}
          />
        </div>
      </section>
    </main>
  );
}
