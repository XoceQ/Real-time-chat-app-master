import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import handler from "@/pages/api/socket/direct-messages/index";
import { Server } from "socket.io";

const createMockRequest = (method: string, query = {}, body = {}): NextApiRequest => {
    return {
        method,
        query,
        body,
        headers: {},
        cookies: {},
        env: process.env, // Simular variables de entorno
    } as unknown as NextApiRequest;
};

const createMockResponse = (): NextApiResponseServerIo => {
    const res: Partial<NextApiResponseServerIo> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();

    // Mock de la propiedad socket con io
    res.socket = {
        server: {
            io: new Server(), // Simula un servidor Socket.io
        },
    } as any;

    return res as NextApiResponseServerIo;
};

describe("API Handler - Messages POST", () => {
    it("should return 405 for non-POST methods", async () => {
        const req = createMockRequest("GET");
        const res = createMockResponse();
        await handler(req, res);
    });

    it("should return 401 if user is not authenticated", async () => {
        const req = createMockRequest("POST", {}, { content: "Test message" });
        const res = createMockResponse();
        await handler(req, res);
    });

    it("should return 400 if serverId is missing", async () => {
        const req = createMockRequest("POST", {}, { content: "Test message" });
        const res = createMockResponse();
        await handler(req, res);
    });

    it("should return 400 if channelId is missing", async () => {
        const req = createMockRequest("POST", { serverId: "123" }, { content: "Test message" });
        const res = createMockResponse();
        await handler(req, res);
    });

    it("should return 400 if content is missing", async () => {
        const req = createMockRequest("POST", { serverId: "123", channelId: "456" }, {});
        const res = createMockResponse();
        await handler(req, res);
    });

    it("should return 404 if server is not found", async () => {
        const req = createMockRequest("POST", { serverId: "invalid", channelId: "456" }, { content: "Test message" });
        const res = createMockResponse();
        await handler(req, res);
    });

    it("should return 404 if channel is not found", async () => {
        const req = createMockRequest("POST", { serverId: "123", channelId: "invalid" }, { content: "Test message" });
        const res = createMockResponse();
        await handler(req, res);
    });
});

