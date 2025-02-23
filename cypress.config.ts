import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000", // Cambia la URL si tu aplicación corre en otro puerto
    setupNodeEvents(on, config) {
      // Puedes agregar aquí los listeners de eventos si los necesitas
    },
    specPattern: "cypress/e2e/**/*.spec.js", // Ubicación de tus archivos de pruebas
    supportFile: false, // Opción para no usar un archivo de soporte, ya que no lo estamos configurando
  },

  component: {
    devServer: {
      framework: "next", // Framework de tu aplicación (Next.js)
      bundler: "webpack", // Empaquetador de tu aplicación
    },
    specPattern: "cypress/component/**/*.cy.tsx", // Ubicación de tus archivos de pruebas de componentes
  },
});
