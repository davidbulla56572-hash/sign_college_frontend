# Project Context

## Product
Sistema inteligente de evaluación de aspirantes docentes.

## Main actors
- Aspirante
- Administrador

## Core flows in scope
1. Login
2. Registro de aspirante
3. Carga de CV PDF/DOCX
4. Extracción IA de datos del CV
5. Edición del formato de hoja de vida
6. Envío de postulación
7. Consulta de estado y resultados
8. Dashboard administrador

## Domain entities the frontend should reflect
- Usuario
- Convocatoria
- Postulación
- ItemHojaVida
- SoporteItem
- ReglaEvaluacion

## Important frontend implications
- The edited hoja de vida must support repeated sections
- Results must show status and score clearly
- Admin views need filters and ranking-friendly tables
- File upload and processing status must be explicit
- Frontend should remain ready for future convocatoria and rules configuration screens
