# 🏢 Aplicación SPA Empresarial con React + Vite

Una estructura base profesional y escalable para Single Page Applications con integración de API.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar linter
npm run lint
```

## 📦 Stack Tecnológico

- **React 19.2.0** - Framework UI
- **Vite 7.3.1** - Build tool y dev server
- **Node.js ES Modules** - Arquitectura moderna

## 🏗️ Estructura Base

La aplicación está organizada siguiendo patrones empresariales:

```
src/
├── components/     - Componentes reutilizables
├── pages/         - Páginas de la aplicación
├── hooks/         - Hooks personalizados
├── services/      - Lógica de negocio y API
├── utils/         - Funciones auxiliares
├── constants/     - Configuración y constantes
└── styles/        - Estilos CSS
```

## 📊 Ejemplo: Integración con PokeAPI

La aplicación incluye una integración completa con PokeAPI como ejemplo:

- **Búsqueda de Pokémon** por nombre o ID
- **Visualización de detalles**: tipos, habilidades, estadísticas
- **Manejo de estados**: carga, errores, datos
- **Componentes reutilizables** y bien organizados

## 🔧 Características

✅ **Arquitectura Modular** - Fácil de mantener y escalar
✅ **Servicios Centralizados** - APIs y lógica business en un lugar
✅ **Hooks Personalizados** - Lógica reutilizable en componentes
✅ **Manejo de Errores** - Validación y feedback al usuario
✅ **Estilos Modernos** - Gradientes, animaciones y responsivos
✅ **TypeScript Ready** - Preparado para migración a TypeScript

## 📖 Documentación Detallada

Ver [ARCHITECTURE.md](ARCHITECTURE.md) para documentación completa de la estructura y patrones.

## 🌐 API Utilizada

- **PokeAPI v2**: https://pokeapi.co/api/v2/pokemon/

Para agregar más servicios y endpoints, revisar `src/services/` y `src/constants/api.js`

---

**Desarrollado como base empresarial para SPAs**
