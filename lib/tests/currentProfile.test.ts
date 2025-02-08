import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs";
import * as assert from 'assert'; // Importamos assert de Node.js

// Mock de Clerk's auth
jest.mock("@clerk/nextjs", () => ({
    auth: jest.fn().mockReturnValue({ userId: 'user_2b2v6Nx7yW2eAqdlLvOZO30fG3B' }),  // Simulamos un userId disponible
}));

describe("currentProfile", () => {
    it("should return null if no userId", async () => {
        (auth as jest.Mock).mockReturnValue({ userId: null });  // Simulamos que no hay un userId

        const result = await currentProfile();

        assert.strictEqual(result, null);  // Verifica que result sea null
    });

    it("should return the full user object if it exists", async () => {
        const user = {
            createdAt: "2024-07-10T21:49:16.098Z",
            email: "josefernandorevelo@gmail.com",
            id: "ec839de1-2d47-4034-afd1-643698a54ea2",
            imageUrl: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yYjJ2NklMUU40RVYySGtxcnc4dFlocUJpYjQifQ",
            name: "Jose Revelo null",
            updatedAt: "2024-07-10T21:49:16.098Z",
            userId: "user_2b2v6Nx7yW2eAqdlLvOZO30fG3B"
        };

        (auth as jest.Mock).mockReturnValue(user);  // Simula el objeto completo

        const result = await currentProfile();  // Llamamos a la función

        // Verificamos si result es null antes de proceder
        if (!result) {
            throw new Error("currentProfile() returned null");
        }

        // Clonamos el objeto para evitar modificar el original
        const normalizedResult = {
            ...result,
            createdAt: result.createdAt instanceof Date ? result.createdAt.toISOString() : result.createdAt,
            updatedAt: result.updatedAt instanceof Date ? result.updatedAt.toISOString() : result.updatedAt
        };

        assert.deepStrictEqual(normalizedResult, user);
    });

});
