"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
function initAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const adminEmail = process.env.ADMIN_EMAIL;
            const adminPassword = process.env.ADMIN_PASSWORD;
            const adminName = process.env.ADMIN_NAME;
            if (!adminEmail || !adminPassword || !adminName) {
                throw new Error('Admin credentials not found in environment variables');
            }
            // Check if admin already exists
            const existingAdmin = yield prisma.user.findUnique({
                where: { email: adminEmail },
            });
            if (existingAdmin) {
                console.log('Admin user already exists');
                return;
            }
            // Hash password
            const hashedPassword = yield bcrypt_1.default.hash(adminPassword, 10);
            // Create admin user
            yield prisma.user.create({
                data: {
                    name: adminName,
                    email: adminEmail,
                    password: hashedPassword,
                    role: 'ADMIN',
                },
            });
            console.log('Admin user created successfully');
        }
        catch (error) {
            console.error('Error creating admin user:', error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
initAdmin();
