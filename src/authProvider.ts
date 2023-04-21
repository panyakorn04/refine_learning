import type { AuthBindings } from "@refinedev/core";
import { axiosInstance } from "./utils"

const mockUsers = [
    { email: "john@mail.com", roles: ["admin"],password: "123" },
    { email: "jane@mail.com", roles: ["editor"] },
];
const authProvider: AuthBindings = {
    login: async ({ email, password }) => {
        const {data} = await axiosInstance.post("https://backoffice-backoffice-api.sit.edupluz.io/api/auth/login", { email, password,role: "ADMIN" });
        const user = data.user
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${data.token.access_token}`;
        if (user) {
            localStorage.setItem("auth", JSON.stringify(user));
            return {
                success: true,
                redirectTo: "/",
            };
        }
        return  {
            success: false,
            error: {
                message: "Invalid email or password",
                name: "Invalid email or password",
            },
        }
    },
    check: async (params: any) => {
        const user = localStorage.getItem("auth");
        if (user) {
            return {
                authenticated: true,
            };
        }
        return {
            authenticated: false,
            logout: true,
            redirectTo: "/login",
            error: {
                message: "Check failed",
                name: "Unauthorized",
            }
        }
    },
    logout: async (params: any) => {
        localStorage.removeItem("auth");
        return {
            success: true,
            redirectTo: "/login",
        };
    },
    onError: async (error: any) => {
        if (error.status === 401 || error.status === 403) {
            return {
                logout: true,
                redirectTo: "/login",
                error,
            }
        }
        return {};
    },
    getPermissions: async (params: any) => {
        const user = localStorage.getItem("auth");

        if (user) {
            const { roles } = JSON.parse(user);

            return roles;
        }

        return null;
    }
};

export default authProvider;
