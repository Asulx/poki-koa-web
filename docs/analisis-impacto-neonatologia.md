# Análisis de impacto y propuesta de adaptación para gestión de unidad de neonatología
## 1. Contexto

La historia original plantea la gestión de una sala institucional con múltiples cunas y personal distribuido por turnos. Sin embargo, el dominio de Poki Koa está orientado a una unidad de neonatología hospitalaria, por lo que es necesario adaptar el escenario para representar adecuadamente los actores, procesos y necesidades del entorno clínico.
El objetivo es evaluar el impacto de este cambio sobre la arquitectura funcional del sistema.

## 2. Identificación de actores

### Jefe de Neonatología
Responsable de supervisar la unidad completa.

**Permisos:**
- Visualizar todos los pacientes.
- Visualizar todas las cunas e incubadoras.
- Consultar reportes y estadísticas.
- Gestionar asignaciones.

### Médico Neonatólogo
Responsable de la atención clínica de los recién nacidos.

**Permisos:**
- Consultar pacientes asignados.
- Registrar diagnósticos.
- Registrar indicaciones médicas.
- Consultar historial clínico.

### Enfermero/a
Responsable de los cuidados diarios.

**Permisos:**
- Consultar pacientes asignados.
- Registrar controles.
- Registrar administración de medicamentos.
- Registrar observaciones.

### Apoderado
Responsable legal del recién nacido. 

**Permisos:**
- Consultar únicamente la información autorizada de su hijo.
- Visualizar estado general.
- Consultar información relevante compartida por el personal médico.

### Administrador
Responsable de la configuración del sistema.

**Permisos:** 
- Gestión de usuarios.
- Gestión de roles.
- Configuración general.

## 3. Análisis de roles y permisos

| Funcionalidad | Jefe Neonatología | Médico Neonatólogo | Enfermero/a | Apoderado | Administrador |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Visualizar Pacientes** | Sí | Sí (Asignados) | Sí (Asignados) | Solo su hijo | No (Solo maestros) |
| **Gestionar Cunas / Incubadoras** | Sí | No | Consulta | No | Configuración |
| **Editar Ficha Clínica** | Sí | Sí | No | No | No |
| **Registrar Controles / Signos** | Sí | No | Sí | No | No |
| **Gestionar Usuarios y Roles** | No | No | No | No | Sí |
| **Consultar Reportes** | Globales | Clínicos | No | No | Sistema |

## 4. Evaluación del modelo de datos
**Entidades existentes**

Actualmente Poki Koa ya contempla:

- Pacientes
- Medicamentos
- Usuarios
- Reportes

**Nuevas entidades requeridas**

### Cuna
```txt
id
numero
estado
pacienteAsignado
```
### Incubadora
```txt
id
codigo
estado
pacienteAsignado
```
### Turno
```txt
id
nombre
horaInicio
horaFin
```
### Asignación de Personal
```txt
usuario
turno
paciente
```

### Nuevas relaciones
```txt
Paciente -> Cuna
Paciente -> Incubadora
Paciente -> Medicamentos
Paciente -> Apoderado

Usuario -> Turno
Turno -> Pacientes
```
## 5. Impacto en módulos existentes

### Módulo Pacientes
```txt
Impacto: Alto
Cambios:
Relación con cunas.
Relación con apoderados.
Relación con personal clínico.
```
### Módulo Medicamentos
```txt
Impacto: Medio
Cambios:
Asociar medicamentos a pacientes hospitalizados.
Registrar administración por enfermería.
```
### Módulo Usuarios
```txt
Impacto: Alto
Cambios:
Incorporar nuevos roles.
Gestionar permisos.
```
### Módulo Reportes
```txt
Impacto: Medio
Cambios:
Reportes de ocupación.
Reportes por turno.
Reportes clínicos.
```
## 6. Impacto en interfaz de usuario
### Nuevas vistas propuestas:
- Dashboard Neonatal
```txt
Visualización general de:
Pacientes hospitalizados.
Cunas ocupadas.
Cunas disponibles.
Personal en turno.
```
- Gestión de Cunas
```txt
Permite:
Ver ocupación.
Asignar pacientes.
Registrar traslados.
```
- Vista Clínica
```txt
Permite:
Consultar historial.
Registrar observaciones.
Gestionar medicamentos.
```
- Portal Apoderado
```txt
Permite:
Consultar estado del recién nacido.
Visualizar información autorizada.
```


## 7. Privacidad y protección de datos

La información gestionada por Poki Koa corresponde a datos personales y clínicos asociados a recién nacidos, los cuales son considerados datos sensibles debido a su naturaleza médica. Además, al tratarse de menores de edad, se requiere un nivel adicional de protección y control sobre el acceso a la información.

La adaptación del sistema a una unidad de neonatología debe considerar medidas que permitan resguardar la confidencialidad, integridad y disponibilidad de los datos, evitando accesos no autorizados y garantizando que cada usuario pueda acceder únicamente a la información necesaria para el desempeño de sus funciones.

### Riesgos identificados

- Acceso no autorizado a información clínica de pacientes.
- Exposición de datos personales de recién nacidos y apoderados.
- Modificación indebida de registros médicos.
- Acceso a información fuera del ámbito de responsabilidad de un usuario.
- Uso de datos clínicos para fines distintos a los autorizados.

### Medidas recomendadas

- Implementar control de acceso basado en roles (RBAC).
- Restringir la visualización de información según el perfil y responsabilidades del usuario.
- Registrar accesos y modificaciones realizadas sobre los datos clínicos.
- Utilizar mecanismos de autenticación seguros.
- Proteger la información sensible durante su almacenamiento y transmisión.
- Mantener trazabilidad de las acciones realizadas por los usuarios del sistema 


### Consideraciones legales

En una implementación productiva, el tratamiento de los datos deberá ajustarse a la normativa chilena vigente en materia de protección de datos personales, particularmente la Ley N.º 19.628 sobre Protección de la Vida Privada y las disposiciones introducidas por la Ley N.º 21.719.

Debido a que la plataforma gestiona información clínica de menores de edad, se recomienda incorporar mecanismos que permitan acreditar el consentimiento informado de los apoderados para el tratamiento de datos personales y sensibles, así como procedimientos que permitan restringir o revocar accesos cuando corresponda.

Tambien, se recomienda aplicar el principio de minimización de datos, almacenando únicamente la información necesaria para la atención y gestión clínica de los pacientes dentro de la unidad neonatal.

## 8. Propuesta de solución
Se propone adaptar Poki Koa para soportar una unidad de neonatología mediante:
- Incorporación de roles clínicos específicos.
- Gestión de cunas e incubadoras.
- Asignación de pacientes a recursos físicos.
- Gestión de personal por turnos.
- Control de acceso basado en roles.
- Adaptación de módulos existentes para soportar el nuevo flujo clínico.
- Implementación de vistas diferenciadas según perfil de usuario.
- Consideraciones futuras de cumplimiento normativo.

Como parte de una implementación productiva, se recomienda incorporar un mecanismo de gestión de consentimientos para el tratamiento de datos personales y clínicos de los recién nacidos.

### La solución podría contemplar:
- Registro de la autorización otorgada por el apoderado.
- Almacenamiento seguro de la evidencia de consentimiento.
- Validación de la autorización antes de habilitar el acceso al portal del apoderado.
- Trazabilidad de la fecha, versión y aceptación de los términos de tratamiento de datos.
- Revocación o actualización de consentimientos cuando corresponda.

De esta manera, el acceso al portal de apoderados podría condicionarse a la existencia de una autorización válida para el tratamiento de datos personales y sensibles, en concordancia con los principios establecidos por la Ley N.º 19.628 y las disposiciones introducidas por la Ley N.º 21.719.

### Trazabilidad y auditoría
El sistema deberá considerar mecanismos de trazabilidad que permitan registrar las acciones realizadas por los usuarios sobre la información clínica de los pacientes.

Como parte de una futura implementación, se recomienda registrar:

- Usuario que realizó la acción.
- Fecha y hora del evento.
- Tipo de acción ejecutada (consulta, creación, modificación o eliminación).
- Información afectada.
- Resultado de la operación.

Estos registros permitirían realizar auditorías, detectar accesos no autorizados y proporcionar evidencia ante incidentes de seguridad o requerimientos normativos.

## Conclusión
La adaptación es técnicamente viable y reutiliza gran parte de los módulos existentes de Poki Koa. Los cambios de mayor impacto se concentran en la gestión de roles, permisos, asignaciones de pacientes a cunas e incorporación de flujos específicos para neonatología hospitalaria. Esto permite mantener la base actual del sistema mientras se amplía su alcance funcional hacia un entorno clínico especializado.

Debido a que el sistema gestionará información clínica asociada a recién nacidos, se identifican requerimientos adicionales relacionados con la seguridad, privacidad y protección de datos sensibles. En una implementación productiva, la solución deberá considerar el cumplimiento de la normativa chilena vigente sobre protección de datos personales, particularmente la Ley N.º 19.628 y las disposiciones introducidas por la Ley N.º 21.719, garantizando el acceso restringido a la información, la trazabilidad de las acciones realizadas por los usuarios y el tratamiento adecuado de los datos clínicos.

La propuesta presentada permite mantener la arquitectura actual de Poki Koa mientras amplía sus capacidades para responder a las necesidades operativas de una unidad de neonatología, proporcionando una base sólida para futuras etapas de diseño e implementación.