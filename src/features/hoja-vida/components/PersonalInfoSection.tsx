import { useFormikContext } from "formik";

import { Input } from "../../../components/ui";
import type { HojaVidaSavePayload } from "../types/hojaVida.types";

export function PersonalInfoSection() {
  const { values, handleChange, handleBlur, errors, touched } =
    useFormikContext<HojaVidaSavePayload>();

  const dp = values.datos_personales;
  const dpErrors = errors.datos_personales as Record<string, string> | undefined;
  const dpTouched = touched.datos_personales as Record<string, boolean> | undefined;

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-ink">Datos personales</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Nombre"
          name="datos_personales.nombre"
          value={dp.nombre}
          onChange={handleChange}
          onBlur={handleBlur}
          error={
            dpTouched?.nombre && dpErrors?.nombre ? dpErrors.nombre : undefined
          }
        />
        <Input
          label="Apellido"
          name="datos_personales.apellido"
          value={dp.apellido}
          onChange={handleChange}
          onBlur={handleBlur}
          error={
            dpTouched?.apellido && dpErrors?.apellido
              ? dpErrors.apellido
              : undefined
          }
        />
        <Input
          label="Email"
          name="datos_personales.email"
          value={dp.email ?? ""}
          onChange={handleChange}
          onBlur={handleBlur}
          error={
            dpTouched?.email && dpErrors?.email ? dpErrors.email : undefined
          }
        />
        <Input
          label="Telefono"
          name="datos_personales.telefono"
          value={dp.telefono ?? ""}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Municipio"
          name="datos_personales.municipio"
          value={dp.municipio ?? ""}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Departamento"
          name="datos_personales.departamento"
          value={dp.departamento ?? ""}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Pais"
          name="datos_personales.pais"
          value={dp.pais}
          onChange={handleChange}
          onBlur={handleBlur}
          error={
            dpTouched?.pais && dpErrors?.pais ? dpErrors.pais : undefined
          }
        />
      </div>
    </div>
  );
}
