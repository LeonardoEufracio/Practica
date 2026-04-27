# Documentacion Tecnica - Unidad 2

## Objetivo
Desarrollar una aplicacion web en Angular 21 para gestionar pacientes del hospital Dr. Sano mediante operaciones CRUD, aplicando reglas de negocio, validaciones y diseno responsive.

## Tecnologias usadas
- Angular 21 (standalone components).
- Formularios reactivos (`ReactiveFormsModule`) con manejo de estado mediante `signals`.
- Bootstrap 5 para estilos y comportamiento responsive.

## Estructura de la solucion
- `src/app/app.ts`: orquestador del estado con `signals` y reglas de negocio CRUD.
- `src/app/app.html`: compone la pagina usando componentes especializados.
- `src/app/models/paciente.model.ts`: contrato de datos del paciente.
- `src/app/components/panel-aforo/*`: muestra aforo, cupos y alerta de capacidad.
- `src/app/components/paciente-form/*`: formulario reactivo para crear/editar pacientes.
- `src/app/components/paciente-list/*`: tabla responsive para listar, editar y eliminar.
- `src/styles.css`: import de Bootstrap y estilos globales.

## Modelo de datos
Cada paciente se representa con el tipo `Paciente`:
- `id`: identificador interno.
- `nombre`: nombre completo del paciente.
- `cedula`: documento numerico.
- `edad`: edad del paciente.
- `telefono`: telefono de contacto.
- `diagnostico`: observacion o diagnostico clinico.

Se almacenan 6 campos, cumpliendo el requisito de minimo 5 datos.

## Reglas de negocio implementadas
1. **Aforo maximo de 10 pacientes**
   - Variable `capacidadMaxima = 10`.
   - Signal derivada `capacidadCompleta` bloquea nuevos registros cuando se llega al limite.
   - Se muestra alerta visual cuando no hay cupos.

2. **CRUD completo**
   - **Create**: `guardarPaciente()` crea un registro nuevo.
   - **Read**: tabla responsiva muestra todos los pacientes.
   - **Update**: `editarPaciente()` carga datos al formulario y `guardarPaciente()` actualiza.
   - **Delete**: `eliminarPaciente()` elimina por `id`.

3. **Edicion segura**
   - Si se elimina un paciente que estaba en edicion, se cancela el modo edicion automaticamente.

## Formularios reactivos basados en signals
- El formulario usa `FormBuilder` + validadores de Angular.
- El estado de la lista y del flujo de UI se maneja con `signals`:
  - `pacientes`
  - `modoEdicion`
  - `pacienteEditandoId`
  - `ocupacionActual` (computed)
  - `cuposDisponibles` (computed)
  - `capacidadCompleta` (computed)

Esto permite una vista reactiva y consistente sin manejar estado manual imperativo en el HTML.

## Uso de componentes para cumplir el objetivo
- Se aplica separacion de responsabilidades:
  - `panel-aforo`: comunica la regla de aforo maximo.
  - `paciente-form`: concentra captura y validacion de datos.
  - `paciente-list`: concentra visualizacion y acciones de lectura/edicion/eliminacion.
- `app` mantiene las reglas de negocio y coordina eventos entre componentes.
- Esta estructura facilita mantenimiento, pruebas y defensa tecnica del proyecto.

## Validaciones implementadas
- `nombre`: obligatorio, minimo 3 caracteres.
- `cedula`: obligatoria, solo numeros, entre 8 y 12 digitos.
- `edad`: obligatoria, entre 0 y 120.
- `telefono`: obligatorio, solo numeros, entre 7 y 10 digitos.
- `diagnostico`: obligatorio, minimo 5 caracteres.

Cuando un campo es invalido y fue tocado, se muestra un mensaje especifico con `obtenerError()`.

## Responsive design
- Se utiliza la grilla de Bootstrap:
  - columnas `col-12`, `col-md-6`, `col-md-4`, etc.
- La tabla usa `table-responsive` para pantallas pequenas.
- Los botones usan `flex-wrap` para ajustarse en dispositivos moviles.

## Flujo de uso del sistema
1. Registrar paciente completando el formulario.
2. Visualizarlo en la tabla de pacientes.
3. Editarlo con el boton **Editar**.
4. Eliminarlo con **Eliminar**.
5. Si hay 10 pacientes, no se pueden crear nuevos hasta liberar cupo.

## Comandos de ejecucion
```bash
npm install
npm start
```

## Criterios de defensa (para evaluacion)
- Explicar por que se usan `signals` para estado y `computed` para reglas derivadas.
- Mostrar en vivo la regla del aforo maximo (registrar hasta 10).
- Mostrar validaciones de formulario con datos invalidos.
- Mostrar operacion CRUD completa y comportamiento responsive.
