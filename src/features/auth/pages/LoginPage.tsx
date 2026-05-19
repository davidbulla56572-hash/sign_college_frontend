import { Link } from "react-router-dom";

import { LoginForm } from "../components/LoginForm";
import { useLoginMutation } from "../hooks/useLoginMutation";

export function LoginPage() {
  const loginMutation = useLoginMutation();

  return (
    <main className="flex min-h-screen w-full">
      {/* Left panel: login form */}
      <section className="flex flex-1 flex-col items-center justify-center bg-cream px-8 py-16 sm:px-12 lg:px-[120px]">
        <div className="w-full max-w-[500px]">
          {/* Branding */}
          <div className="mb-12 flex flex-col items-center gap-1.5 text-center">
            <div className="flex h-[110px] w-[110px] items-center justify-center">
              <img
                src="/logo_ucaldas.png"
                alt="Logo Universidad de Caldas"
                className="h-20 w-20 object-contain"
              />
            </div>
            <h1 className="font-serif text-[30px] font-bold text-brand-primary">
              Universidad de Caldas
            </h1>
            <p className="text-base text-ink-mid">Sistema de Aspirantes Docentes</p>
          </div>

          <p className="mb-6 text-base text-ink-mid">Use su correo y contraseña</p>

          <LoginForm
            errorMessage={
              loginMutation.error
                ? "Credenciales invalidas o servicio no disponible"
                : undefined
            }
            isPending={loginMutation.isPending}
            onSubmit={(values) => loginMutation.mutate(values)}
          />

          <div className="mt-4 text-center">
            <Link to="/registro" className="cursor-pointer text-sm text-brand-primary underline">
              ¿No tienes cuenta? Registrate aqui
            </Link>
          </div>
        </div>
      </section>

      {/* Right panel: maroon circle branding */}
      <section className="hidden items-center justify-center bg-brand-primary lg:flex lg:w-[500px] xl:w-[750px]">
        <div className="relative z-10 text-center text-white">
          <h2 className="mb-6 font-serif text-[46px] leading-tight">¡Bienvenido!</h2>
          <p className="mb-10 text-lg leading-relaxed text-white/85">
            Ingrese sus datos personales para usar
            <br />
            todas las funciones del sitio
          </p>
          <Link
            to="/registro"
            className="inline-flex items-center justify-center rounded-brand-sm border-2 border-white px-12 py-4 text-lg font-bold text-white transition hover:bg-white/15"
          >
            Registrarse
          </Link>
        </div>
        {/* Decorative circle element */}
        <div
          className="absolute -bottom-[180px] -left-[180px] h-[480px] w-[480px] rounded-full"
          style={{ background: "rgba(255, 255, 255, 0.08)" }}
        />
      </section>
    </main>
  );
}
