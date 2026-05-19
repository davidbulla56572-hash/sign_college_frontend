import { Link } from "react-router-dom";

import { RegisterForm } from "../components/RegisterForm";
import { useRegisterMutation } from "../hooks/useRegisterMutation";

export function SignUpPage() {
  const registerMutation = useRegisterMutation();

  return (
    <main className="flex min-h-screen w-full">
      {/* Left panel: maroon circle branding */}
      <section className="hidden items-center justify-center bg-brand-primary lg:flex lg:w-[750px]">
        <div className="panel-circle-inner relative z-10 text-center text-white">
          <h2 className="mb-7 font-serif text-[40px] leading-tight">¿Ya tienes cuenta?</h2>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-brand-sm border-2 border-white px-12 py-4 text-lg font-bold text-white transition hover:bg-white/15"
          >
            Iniciar Sesión
          </Link>
        </div>
        {/* Decorative circle */}
        <div
          className="absolute -bottom-[180px] -left-[180px] h-[480px] w-[480px] rounded-full"
          style={{ background: "rgba(255, 255, 255, 0.08)" }}
        />
      </section>

      {/* Right panel: registration form */}
      <section className="flex flex-1 flex-col items-center justify-center bg-cream px-8 py-16 sm:px-12 lg:px-[120px]">
        <div className="w-full max-w-[540px]">
          {/* Branding - smaller */}
          <div className="mb-8 flex flex-col items-center gap-1.5 text-center">
            <div className="flex h-[110px] w-[110px] items-center justify-center">
              <img
                src="/logo_ucaldas.png"
                alt="Logo Universidad de Caldas"
                className="h-20 w-20 object-contain"
              />
            </div>
            <h1 className="font-serif text-[22px] font-bold text-brand-primary">
              Universidad de Caldas
            </h1>
            <p className="text-sm text-ink-mid">Sistema de Aspirantes Docentes</p>
          </div>

          <h2 className="mb-7 text-center font-serif text-[38px] font-bold text-brand-primary">
            Registrarse
          </h2>

          <RegisterForm
            errorMessage={
              registerMutation.error ? "No se pudo crear la cuenta. Intenta nuevamente." : undefined
            }
            isPending={registerMutation.isPending}
            onSubmit={(values) => registerMutation.mutate(values)}
          />

          <div className="mt-5 text-center">
            <Link to="/login" className="cursor-pointer text-sm text-brand-primary underline">
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
