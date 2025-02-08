import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIo } from "@/types";
import ioHandler from "@/pages/api/socket/io";

const createMockResponse = (): NextApiResponseServerIo => {
    const res: Partial<NextApiResponseServerIo> = {};
    res.socket = {
        server: {
            io: undefined as unknown as ServerIO,
        },
    } as any;
    res.end = jest.fn();
    return res as NextApiResponseServerIo;
};

describe("Socket.io API Handler", () => {
    it("should initialize a new Socket.io server if not already present", () => {
        const req = {} as NextApiRequest;
        const res = createMockResponse();

        ioHandler(req, res);
    });

    it("should not reinitialize an existing Socket.io server", () => {
        const req = {} as NextApiRequest;
        const res = createMockResponse();
        res.socket.server.io = new ServerIO({} as NetServer, { path: "/api/socket/io" });

        ioHandler(req, res);
    });
});
