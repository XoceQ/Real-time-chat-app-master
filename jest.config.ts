export default {
    preset: "ts-jest",
    testEnvironment: "node",
    rootDir: ".", // Indica que la raíz es "C:/Real-time-chat-app-master"
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>$1", // Ajusta la ruta de los imports con alias "@/"
    },
    transform: {
        "^.+\\.tsx?$": "ts-jest", // Asegura la transformación de archivos TypeScript
    },
};
