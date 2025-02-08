import { currentProfilePages } from "@/lib/current-profile-pages";
import { auth } from "@clerk/nextjs";
import handler from "@/pages/api/socket/direct-messages/[directMessageId]";
import { createMocks } from "node-mocks-http";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

// Mocks
jest.mock("@clerk/nextjs", () => ({
    auth: jest.fn(),
}));

jest.mock("@/lib/db", () => ({
    db: {
        conversation: {
            findFirst: jest.fn(),
        },
        directMessage: {
            findFirst: jest.fn(),
            update: jest.fn(),
        },
    },
}));

jest.mock("@/lib/current-profile-pages", () => ({
    currentProfilePages: jest.fn(),
}));

describe("DELETE/PATCH /api/messages/:id", () => {
    let req: any, res: any;

    beforeEach(() => {
        const { req: mockReq, res: mockRes } = createMocks({
            method: "DELETE", // Puedes cambiar a "PATCH" para probar el otro método
            query: { directMessageId: "message123", conversationId: "conversation123" },
            body: { content: "Updated message content" },
        });

        req = mockReq;
        res = mockRes;
        res.socket = { server: { io: { emit: jest.fn() } } }; // Mock WebSocket emit
    });

    it("should return 401 if user is not authenticated", async () => {
        (auth as jest.Mock).mockReturnValue({ userId: null }); // Simula que no hay un userId

        await handler(req, res);
    });

    it("should return 404 if conversation is not found", async () => {
        (auth as jest.Mock).mockReturnValue({ userId: 'user_2b2v6Nx7yW2eAqdlLvOZO30fG3B' });
        (currentProfilePages as jest.Mock).mockResolvedValue({ id: "profile123" });
        (db.conversation.findFirst as jest.Mock).mockResolvedValue(null);

        await handler(req, res);
    });

    it("should return 404 if message is not found or deleted", async () => {
        (auth as jest.Mock).mockReturnValue({ userId: 'user_2b2v6Nx7yW2eAqdlLvOZO30fG3B' });
        (currentProfilePages as jest.Mock).mockResolvedValue({ id: "profile123" });
        (db.conversation.findFirst as jest.Mock).mockResolvedValue({
            id: "conversation123",
            memberOne: { profileId: "profile123", id: "member123" },
            memberTwo: { profileId: "profile456", id: "member456" },
        });
        (db.directMessage.findFirst as jest.Mock).mockResolvedValue(null);

        await handler(req, res);
    });

    it("should delete the message if user is authorized", async () => {
        (auth as jest.Mock).mockReturnValue({ userId: 'user_2b2v6Nx7yW2eAqdlLvOZO30fG3B' });
        (currentProfilePages as jest.Mock).mockResolvedValue({ id: "profile123" });
        (db.conversation.findFirst as jest.Mock).mockResolvedValue({
            id: "conversation123",
            memberOne: { profileId: "profile123", id: "member123", role: MemberRole.GUEST },
            memberTwo: { profileId: "profile456", id: "member456", role: MemberRole.GUEST },
        });
        (db.directMessage.findFirst as jest.Mock).mockResolvedValue({
            id: "message123",
            memberId: "member123",
            deleted: false,
        });
        (db.directMessage.update as jest.Mock).mockResolvedValue({
            id: "message123",
            content: "This message has been deleted.",
            deleted: true,
        });

        await handler(req, res);
    });

    it("should return 401 if user is not message owner and not admin/moderator", async () => {
        (auth as jest.Mock).mockReturnValue({ userId: 'user_2b2v6Nx7yW2eAqdlLvOZO30fG3B' });
        (currentProfilePages as jest.Mock).mockResolvedValue({ id: "profile123" });
        (db.conversation.findFirst as jest.Mock).mockResolvedValue({
            id: "conversation123",
            memberOne: { profileId: "profile123", id: "member123", role: MemberRole.GUEST },
            memberTwo: { profileId: "profile456", id: "member456", role: MemberRole.GUEST },
        });
        (db.directMessage.findFirst as jest.Mock).mockResolvedValue({
            id: "message123",
            memberId: "member456", // Otro usuario
            deleted: false,
        });

        await handler(req, res);
    });

});

