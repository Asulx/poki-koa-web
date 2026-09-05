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

## Alias

Se utiliza el alias `@` para acceder a archivos dentro de `src`.

Ejemplo:

```ts
import Button from '@/components/ui/Button'
```
