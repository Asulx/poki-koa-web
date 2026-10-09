# Poki Koa / Mamoru — Guía de instalación y desarrollo

## 1. Descripción del proyecto

Poki Koa / Mamoru es una aplicación web orientada a la gestión y monitoreo de una unidad de neonatología hospitalaria.

El sistema permite desarrollar funcionalidades relacionadas con:

- Gestión de pacientes neonatales.
- Registro y edición de información clínica.
- Gestión de cunas e incubadoras.
- Gestión de medicamentos.
- Visualización de estadísticas y reportes.
- Búsqueda y filtrado de pacientes.
- Integración con una API REST.

El proyecto está dividido en dos aplicaciones independientes:

| Componente | Tecnologías |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Python, Django, Django REST Framework |
| Comunicación | Axios y API REST |
| Formularios | React Hook Form y Zod |
| Gráficos | Recharts |
| Control de versiones | Git y GitHub |
| Dependencias backend | uv |

---

## 2. Requisitos previos

Para ejecutar el proyecto desde cero en Windows, instalar las siguientes herramientas.

### 2.1. Visual Studio Code

Descargar desde:

https://code.visualstudio.com/

Extensiones recomendadas:

- ES7+ React/Redux/React-Native Snippets
- Prettier
- ESLint
- Python
- GitLens

### 2.2. Git

Descargar desde:

https://git-scm.com/downloads

Comprobar la instalación desde PowerShell:

```powershell
git --version
```

Configurar la identidad de Git:

```powershell
git config --global user.name "Tu Nombre"
git config --global user.email "tu-correo@example.com"
```

Utilizar el correo asociado a GitHub.

### 2.3. Node.js

Descargar una versión LTS compatible con Vite desde:

https://nodejs.org/

Se recomienda Node.js 22 LTS o superior compatible.

Comprobar:

```powershell
node --version
npm --version
```

### 2.4. Python

Descargar desde:

https://www.python.org/downloads/

El backend declara compatibilidad con Python `>=3.10`, aunque las dependencias pueden imponer restricciones adicionales.

Para reproducir el entorno que utilizábamos anteriormente, trabajábamos con Python 3.14 administrado por `uv`.

Comprobar:

```powershell
py --version
```

### 2.5. uv

`uv` permite gestionar versiones de Python, entornos virtuales y dependencias del backend.

Instalación oficial en PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Ejecutar únicamente después de verificar que se está utilizando el instalador oficial. Si PowerShell no reconoce `uv`, cerrar y volver a abrir la terminal.

Comprobar:

```powershell
uv --version
```

---

## 3. Descargar el frontend

Abrir PowerShell y ubicarse en la carpeta donde se guardarán los proyectos.

Ejemplo:

```powershell
cd "$HOME\Documents"
```

Clonar el repositorio:

```powershell
git clone https://github.com/Asulx/poki-koa-web.git
```

Entrar:

```powershell
cd poki-koa-web
```

Verificar las ramas disponibles:

```powershell
git branch -a
```

Cambiar a la rama principal de integración del frontend:

```powershell
git switch integration
```

Si la rama todavía no existe localmente:

```powershell
git switch --track origin/integration
```

Actualizar:

```powershell
git pull origin integration
```

**Importante:** las funcionalidades fusionadas a `integration` estarán disponibles desde esa rama. Para desarrollar nuevas tareas, crear una rama `feature` a partir de ella.

---

## 4. Instalar dependencias del frontend

Dentro del directorio del frontend:

```powershell
npm ci
```

Este comando instala las dependencias declaradas en `package-lock.json`.

Si el repositorio no contiene un archivo de bloqueo válido, utilizar:

```powershell
npm install
```

Las dependencias principales del proyecto incluyen:

- `react`
- `react-dom`
- `react-router-dom`
- `axios`
- `react-hook-form`
- `zod`
- `@hookform/resolvers`
- `recharts`

No es necesario instalar individualmente estas dependencias si ya aparecen en `package.json`.

---

## 5. Configurar las variables de entorno

En la raíz del frontend, crear un archivo llamado:

```text
.env
```

Agregar:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Esta variable indica al frontend dónde se encuentra la API Django.

El archivo de configuración de Axios se encuentra en:

```text
src/api/axios.ts
```

Su configuración utiliza:

```typescript
import.meta.env.VITE_API_URL
```

**Importante:** no subir archivos `.env` que contengan secretos a GitHub. Las variables `VITE_` son visibles en el navegador, por lo que nunca deben contener contraseñas ni claves privadas.

Reiniciar Vite cuando se modifiquen las variables de entorno.

---

## 6. Ejecutar el frontend

Dentro del directorio del frontend:

```powershell
npm run dev
```

Vite mostrará una dirección local, normalmente:

```text
http://localhost:5173/
```

Abrir la dirección indicada por la terminal.

Para verificar que el proyecto compila correctamente:

```powershell
npm run build
```

Si finaliza sin errores, la compilación del frontend es correcta.

---

## 7. Descargar el backend

Abrir una segunda terminal de PowerShell.

Ubicarse en la carpeta de proyectos:

```powershell
cd "$HOME\Documents"
```

Clonar el repositorio del backend utilizando la URL HTTPS o SSH oficial compartida por el equipo:

```powershell
git clone <URL_DEL_REPOSITORIO_BACKEND> poki-koa-backend
```

Entrar:

```powershell
cd poki-koa-backend
```

Consultar las ramas:

```powershell
git branch -a
```

Durante la integración de pacientes utilizábamos la rama:

```text
feat/requerimientos-bebes
```

Para reproducir esa integración, si la rama sigue disponible:

```powershell
git switch --track origin/feat/requerimientos-bebes
```

Si ya existe localmente:

```powershell
git switch feat/requerimientos-bebes
```

Si el equipo ya fusionó estos cambios a `desarrollo`, utilizar la rama de desarrollo actualizada en su lugar.

Comprobar:

```powershell
git status
```

---

## 8. Instalar las dependencias del backend

Dentro de `poki-koa-backend`:

```powershell
uv sync
```

Esto prepara el entorno virtual `.venv` e instala las dependencias declaradas en `pyproject.toml` y resueltas por el proyecto.

El backend utiliza:

- Django
- Django REST Framework
- django-cors-headers
- Ruff para desarrollo

Comprobar Django:

```powershell
uv run python src/manage.py check
```

El resultado esperado es:

```text
System check identified no issues (0 silenced).
```

---

## 9. Preparar la base de datos

Antes de iniciar el backend, revisar la configuración de base de datos del proyecto.

Si el equipo utiliza SQLite para desarrollo local, comprobar que la configuración de Django apunta a la base correspondiente.

Si se utiliza PostgreSQL u otro servidor, solicitar al equipo las variables de entorno y las instrucciones de conexión.

Una vez configurada la base de datos de desarrollo, aplicar las migraciones:

```powershell
uv run python src/manage.py migrate
```

Este comando actualiza el esquema de la base de datos según las migraciones del proyecto.

**Precaución:** no ejecutar migraciones sobre una base de datos compartida o de producción sin autorización del equipo.

Para revisar migraciones:

```powershell
uv run python src/manage.py showmigrations
```

---

## 10. Ejecutar Django

Dentro del backend:

```powershell
uv run python src/manage.py runserver
```

Si funciona correctamente, aparecerá:

```text
Starting development server at http://127.0.0.1:8000/
```

La terminal debe permanecer abierta mientras se utiliza el backend.

Para detenerlo:

```text
Ctrl + C
```

---

## 11. Solución al bloqueo de Python en Windows

En una instalación anterior encontramos el error:

```text
Una directiva de Control de aplicaciones bloqueó este archivo.
(os error 4551)
```

Este error ocurría al ejecutar el Python del entorno virtual mediante `uv run`.

La solución temporal que permitió iniciar el backend fue utilizar directamente el Python administrado por `uv` y cargar las dependencias del entorno virtual.

**Aplicar esta solución únicamente si el error vuelve a presentarse.**

### Paso 1. Identificar el Python instalado por uv

```powershell
uv python list
```

Buscar la ruta de un Python instalado y permitido por Windows.

### Paso 2. Comprobar el ejecutable

Ejemplo correspondiente a nuestra instalación anterior:

```powershell
& "$HOME\AppData\Roaming\uv\python\cpython-3.14-windows-x86_64-none\python.exe" --version
```

La ruta puede cambiar según el computador y la versión instalada.

### Paso 3. Configurar PYTHONPATH

Desde la raíz del backend:

```powershell
$env:PYTHONPATH="$PWD\.venv\Lib\site-packages"
```

### Paso 4. Verificar Django

```powershell
& "$HOME\AppData\Roaming\uv\python\cpython-3.14-windows-x86_64-none\python.exe" -m django --version
```

### Paso 5. Comprobar el proyecto

```powershell
& "$HOME\AppData\Roaming\uv\python\cpython-3.14-windows-x86_64-none\python.exe" src/manage.py check
```

### Paso 6. Ejecutar el servidor

```powershell
& "$HOME\AppData\Roaming\uv\python\cpython-3.14-windows-x86_64-none\python.exe" src/manage.py runserver
```

Este procedimiento permitió ejecutar Django 6.1 en el entorno anterior.

Es una solución temporal para un problema específico de Windows; no reemplaza la configuración normal del entorno virtual. No se recomienda desactivar las políticas de seguridad de Windows para resolverlo.

---

## 12. Comprobar que frontend y backend se comunican

Con ambos servidores ejecutándose:

Frontend:

```text
http://localhost:5173/
```

Backend:

```text
http://127.0.0.1:8000/
```

API:

```text
http://127.0.0.1:8000/api/
```

Endpoint de bebés/pacientes:

```text
http://127.0.0.1:8000/api/bebes/
```

Si la API responde con HTTP 200 y devuelve una lista JSON, el endpoint de consulta está disponible.

El frontend consume estos datos mediante:

```text
src/services/pacientesService.ts
```

La estructura es:

```text
React
  ↓
PacientesPage
  ↓
pacientesService.ts
  ↓
Axios
  ↓
GET /api/bebes/
  ↓
Django REST Framework
  ↓
Base de datos
```

El frontend utiliza el modelo `Paciente`, mientras que el backend utiliza `Bebe`.

El servicio transforma los nombres de campos entre ambos formatos.

---

## 13. Ejecutar frontend y backend simultáneamente

Utilizar dos terminales independientes.

### Terminal 1 — Backend

```powershell
cd "$HOME\Documents\poki-koa-backend"
uv run python src/manage.py runserver
```

### Terminal 2 — Frontend

```powershell
cd "$HOME\Documents\poki-koa-web"
npm run dev
```

Abrir:

```text
http://localhost:5173/
```

Comprobar que la página de pacientes muestra los registros proporcionados por la API.

Si los servidores utilizan puertos distintos, actualizar la configuración correspondiente.

---

## 14. Flujo de trabajo con Git

El frontend utiliza `integration` como rama de integración.

Antes de comenzar una tarea:

```powershell
git status
git switch integration
git pull origin integration
```

Crear una rama para una Issue:

```powershell
git switch -c feature/NUMERO-descripcion
```

Ejemplo para la Issue #82:

```powershell
git switch -c feature/82-integracion-crud-pacientes
```

Publicarla:

```powershell
git push -u origin feature/82-integracion-crud-pacientes
```

Después de implementar los cambios:

```powershell
npm run build
git status
git add .
git commit -m "feat: integrar registro y edicion de pacientes"
git push
```

Antes de utilizar `git add .`, revisar que no existan archivos locales, credenciales o cambios ajenos a la tarea.

Crear un Pull Request en GitHub:

```text
base: integration
compare: feature/82-integracion-crud-pacientes
```

Una vez revisado y aprobado, realizar el merge.

---

## 15. Errores frecuentes

### El frontend no conecta con el backend

Verificar:

- Que Django esté ejecutándose.
- Que `.env` tenga la URL correcta.
- Que el endpoint exista.
- Que Axios utilice `VITE_API_URL`.
- Que no existan errores CORS.
- Que el navegador pueda abrir `/api/bebes/`.

### Error 404 en `/api/pacientes/`

La API utilizada durante la integración expone:

```text
/api/bebes/
```

El frontend debe consumir el endpoint configurado en el backend actual.

### Error `ModuleNotFoundError: No module named 'django'`

Comprobar que las dependencias se instalaron:

```powershell
uv sync
```

Ejecutar normalmente mediante `uv run`, para utilizar el entorno del proyecto.

### Error al registrar pacientes

Revisar:

- Los campos obligatorios del serializer.
- Los nombres esperados por Django.
- Las relaciones con médicos y cunas.
- Los valores permitidos por el backend.
- La respuesta HTTP y los errores de validación.

Una compilación exitosa no garantiza que una operación POST o PATCH se guarde correctamente.

### La página está en blanco

Abrir las herramientas del navegador:

```text
F12 → Console
```

Revisar los errores de JavaScript y las solicitudes HTTP en la pestaña Network.

### Cambios en `.env` no se reflejan

Detener Vite y volver a ejecutar:

```powershell
npm run dev
```

---

## 16. Estado del proyecto y próximos pasos

Al finalizar la integración de búsqueda y filtros, se habían implementado:

- Arquitectura base React + TypeScript.
- Navegación con React Router.
- Layout responsive.
- Componentes UI reutilizables.
- Sistema visual.
- Formularios con React Hook Form y Zod.
- Listado de pacientes.
- Búsqueda y filtros.
- Dashboard y gráficos.
- Configuración de Axios.
- Conexión de lectura con el backend Django.

### Trabajo pendiente

**Issue #82 — Integrar registro y edición de pacientes con Django**

Objetivo: completar las operaciones POST y PATCH, validar los datos y comprobar su persistencia en la base de datos.

También se contempla implementar TanStack Query para centralizar consultas, mutaciones, caché y sincronización del estado remoto.

---

## 17. Recomendaciones de seguridad

Este sistema trabaja con información clínica sensible de pacientes neonatales.

Durante el desarrollo:

- Utilizar únicamente datos ficticios o autorizados.
- No subir contraseñas ni secretos a GitHub.
- No incluir bases de datos reales en commits.
- No almacenar datos clínicos sensibles en registros de depuración innecesarios.
- Respetar los permisos y controles de acceso.
- Mantener separadas las configuraciones de desarrollo y producción.

La puesta en producción requiere revisar los requisitos de privacidad, seguridad, trazabilidad y cumplimiento normativo aplicables.

---

## 18. Comprobación final

Antes de comenzar a desarrollar, verificar:

- [ ] Git funciona.
- [ ] Node.js y npm funcionan.
- [ ] Python y uv funcionan.
- [ ] Frontend descargado desde GitHub.
- [ ] Backend descargado desde GitHub.
- [ ] Ramas correctas seleccionadas.
- [ ] Dependencias instaladas.
- [ ] `.env` configurado.
- [ ] Base de datos de desarrollo preparada.
- [ ] Django ejecutándose.
- [ ] Vite ejecutándose.
- [ ] `/api/bebes/` responde correctamente.
- [ ] Pacientes visibles en el frontend.
- [ ] `npm run build` finaliza sin errores.

Con estas verificaciones, el entorno está preparado para continuar el desarrollo de Poki Koa / Mamoru.
