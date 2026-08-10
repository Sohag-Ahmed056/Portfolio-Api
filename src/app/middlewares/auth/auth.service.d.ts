interface ILoginPayload {
    email: string;
    password: string;
}
export declare const AuthService: {
    login: (payload: ILoginPayload) => Promise<{
        user: {
            email: string;
            password: string;
            name: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
    }>;
};
export {};
//# sourceMappingURL=auth.service.d.ts.map