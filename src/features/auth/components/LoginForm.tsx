import { Form, Formik } from "formik";
import { LogIn } from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { loginSchema } from "../schemas/login.schema";
import type { LoginPayload } from "../types/auth.types";

type LoginFormProps = {
  isPending: boolean;
  onSubmit: (values: LoginPayload) => void;
};

const initialValues: LoginPayload = {
  email: "",
  password: ""
};

export function LoginForm({ isPending, onSubmit }: LoginFormProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loginSchema}
      onSubmit={(values) => onSubmit(values)}
    >
      {({ errors, handleBlur, handleChange, touched, values }) => (
        <Form className="space-y-5" noValidate>
          <Input
            label="Correo"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="aspirante@correo.com"
            value={values.email}
            onBlur={handleBlur}
            onChange={handleChange}
            error={touched.email ? errors.email : undefined}
          />
          <Input
            label="Contrasena"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="********"
            value={values.password}
            onBlur={handleBlur}
            onChange={handleChange}
            error={touched.password ? errors.password : undefined}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            <LogIn className="h-4 w-4" aria-hidden="true" />
            {isPending ? "Ingresando..." : "Iniciar sesion"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
