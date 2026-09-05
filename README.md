# Poki Koa - Lectura y manejo de datos
## Requisitos

- Node v24.19.0
- npm 11.17.0

## Clonar el repositorio

```bash
git clone https://github.com/Asulx/poki-koa-web.git
cd poki-koa-web
```

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

3. Ejecutar la web

```bash
npm run dev
```

# Arquitectura Frontend

## Estructura de carpetas

src/
├── components/ → Componentes reutilizables
├── pages/ → Vistas principales
├── services/ → Comunicación con APIs
├── hooks/ → Hooks personalizados
├── types/ → Interfaces y tipos TypeScript
├── utils/ → Funciones auxiliares
├── routes/ → Configuración de rutas
├── context/ → Estado global
├── constants/ → Constantes compartidas
├── mocks/ → Datos simulados
├── styles/ → Estilos globales

## Alias

Se utiliza el alias `@` para acceder a archivos dentro de `src`.

Ejemplo:

```ts
import Button from '@/components/ui/Button'
```