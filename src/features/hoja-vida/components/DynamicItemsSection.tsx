import { FieldArray, useFormikContext } from "formik";
import { Plus, Trash2, Inbox } from "lucide-react";

import { Button, Card } from "../../../components/ui";
import { Input } from "../../../components/ui/Input";
import type {
  HojaVidaItem,
  HojaVidaSavePayload,
  HojaVidaSectionKey,
} from "../types/hojaVida.types";

type DynamicItemsSectionProps = {
  sectionKey: HojaVidaSectionKey;
  title: string;
  description: string;
};

export function DynamicItemsSection({
  sectionKey,
  title,
  description,
}: DynamicItemsSectionProps) {
  const { values, errors, touched } = useFormikContext<HojaVidaSavePayload>();

  const items = values.items[sectionKey] ?? [];
  const sectionErrors = errors.items?.[sectionKey] as Array<{ descripcion?: string }> | undefined;
  const sectionTouched = touched.items?.[sectionKey] as Array<{ descripcion?: boolean }> | undefined;

  return (
    <FieldArray name={`items.${sectionKey}`}>
      {({ push, remove }) => (
        <Card>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-ink">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                push({
                  descripcion: "",
                  institucion: null,
                  fecha_inicio: null,
                  fecha_fin: null,
                  cantidad: null,
                })
              }
            >
              <Plus className="h-4 w-4" />
              Agregar
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="mt-4 flex flex-col items-center gap-2 rounded-md border border-dashed border-gray-300 py-8 text-center text-gray-400">
              <Inbox className="h-6 w-6" />
              <p className="text-sm">Aun no hay registros en esta seccion</p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {items.map((item: HojaVidaItem, index: number) => {
                const itemErrors = sectionErrors?.[index] ?? {};
                const itemTouched = sectionTouched?.[index] ?? {};

                return (
                  <div
                    key={index}
                    className="rounded-md border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-500">
                        Item {index + 1}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => remove(index)}
                        className="h-auto p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <Input
                        label="Descripcion"
                        name={`items.${sectionKey}[${index}].descripcion`}
                        value={item.descripcion}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          values.items[sectionKey][index].descripcion = e.target.value;
                        }}
                        onBlur={() => {
                          if (sectionTouched) {
                            sectionTouched[index] = { ...sectionTouched[index], descripcion: true };
                          }
                        }}
                        error={
                          itemTouched.descripcion && itemErrors.descripcion
                            ? itemErrors.descripcion
                            : undefined
                        }
                      />
                      <Input
                        label="Institucion"
                        name={`items.${sectionKey}[${index}].institucion`}
                        value={item.institucion ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          values.items[sectionKey][index].institucion = e.target.value || null;
                        }}
                      />
                      <Input
                        label="Fecha inicio"
                        name={`items.${sectionKey}[${index}].fecha_inicio`}
                        value={item.fecha_inicio ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          values.items[sectionKey][index].fecha_inicio = e.target.value || null;
                        }}
                      />
                      <Input
                        label="Fecha fin"
                        name={`items.${sectionKey}[${index}].fecha_fin`}
                        value={item.fecha_fin ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          values.items[sectionKey][index].fecha_fin = e.target.value || null;
                        }}
                      />
                      <Input
                        label="Cantidad"
                        name={`items.${sectionKey}[${index}].cantidad`}
                        value={item.cantidad ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          values.items[sectionKey][index].cantidad = e.target.value ? Number(e.target.value) : null;
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}
    </FieldArray>
  );
}
