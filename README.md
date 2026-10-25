# Poki Koa - Lectura y manejo de datos
## Requisitos

- Node v22.17.0
- npm 10.9.2

## Clonar el repositorio

```bash
git clone [https://github.com/Asulx/poki-koa-web.git](https://github.com/Asulx/poki-koa-web.git)
cd poki-koa-web
```
## Configuración del Entorno

1. Crea tu archivo de entorno local copiando la plantilla:

```bash
cp .env.example .env
```

2. Configura las variables necesarias:

| Variable | Descripción | Formato/Ejemplo | Obligatoriedad |
| VITE_API_URL | URL base para la comunicación con el backend | http://localhost:3000/api | Obligatoria |

## Inicializar el frontend

1. Verifica la versión de Node y npm instalada.

```bash
node --version
npm --version
```

2. Instalar dependencias del proyecto.

```bash
npm install
```

3. Construir el proyecto para producción.

```bash
npm run build
```

4. Ejecutar la web

```bash
npm run dev
```

# Arquitectura Frontend

## Estructura de carpetas

```text
src/
├── assets/
├── components/
│   ├── ui/
│   ├── layout/
│   └── common/
├── pages/
│   ├── Dashboard/
│   ├── Pacientes/
│   ├── Medicamentos/
│   ├── Reportes/
│   └── Configuracion/
├── routes/
├── services/
├── hooks/
├── types/
├── context/
├── constants/
├── utils/
├── mocks/
└── styles/
```
## Responsabilidad de carpetas

| Carpeta | Responsabilidad |
|----------|-----------------|
| components | Componentes reutilizables |
| pages | Vistas principales |
| services | Comunicación con APIs |
| hooks | Hooks personalizados |
| types | Interfaces y tipos TypeScript |
| routes | Configuración de rutas |
| context | Estado global |
| constants | Constantes compartidas |
| utils | Funciones auxiliares |
| mocks | Datos simulados |
| styles | Estilos globales |

## Alias

Se utiliza el alias `@` para acceder a archivos dentro de `src`.

Ejemplo:

```ts
import Button from '@/components/ui/Button'
```
