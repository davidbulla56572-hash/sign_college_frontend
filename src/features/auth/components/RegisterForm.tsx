import { Form, Formik } from "formik";
import { UserPlus } from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { registerSchema } from "../schemas/register.schema";

type RegisterPayload = {
  nombre: string;
  apellido: string;
  cedula: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterFormProps = {
  errorMessage?: string;
  isPending: boolean;
  onSubmit: (values: RegisterPayload) => void;
};

const initialValues: RegisterPayload = {
  nombre: "",
  apellido: "",
  cedula: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function RegisterForm({ errorMessage, isPending, onSubmit }: RegisterFormProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={registerSchema}
      onSubmit={(values) => onSubmit(values)}
    >
      {({ errors, handleBlur, handleChange, touched, values }) => (
        <Form className="space-y-4" noValidate>
          {errorMessage ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Nombre"
              name="nombre"
              type="text"
              placeholder="Nombre"
              value={values.nombre}
              onBlur={handleBlur}
              onChange={handleChange}
              error={touched.nombre ? errors.nombre : undefined}
            />
            <Input
              label="Apellido"
              name="apellido"
              type="text"
              placeholder="Apellido"
              value={values.apellido}
              onBlur={handleBlur}
              onChange={handleChange}
              error={touched.apellido ? errors.apellido : undefined}
            />
          </div>
          <Input
            label="Cedula"
            name="cedula"
            type="text"
            placeholder="Numero de cedula"
            value={values.cedula}
            onBlur={handleBlur}
            onChange={handleChange}
            error={touched.cedula ? errors.cedula : undefined}
          />
          <Input
            label="Correo electronico"
            name="email"
            type="email"
            placeholder="correoelectronico@mail.com"
            value={values.email}
            onBlur={handleBlur}
            onChange={handleChange}
            error={touched.email ? errors.email : undefined}
          />
          <Input
            label="Contraseña"
            name="password"
            type="password"
            placeholder="Minimo 8 caracteres"
            value={values.password}
            onBlur={handleBlur}
            onChange={handleChange}
            error={touched.password ? errors.password : undefined}
          />
          <Input
            label="Confirmar Contraseña"
            name="confirmPassword"
            type="password"
            placeholder="Repite tu contraseña"
            value={values.confirmPassword}
            onBlur={handleBlur}
            onChange={handleChange}
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            {isPending ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
