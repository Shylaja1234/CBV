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
exports.deleteStaff = exports.getStaffUsers = exports.createStaff = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
// Create new staff user (only admin can do this)
const createStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        const existingUser = yield prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create staff user
        const staff = yield prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'STAFF',
            },
        });
        res.status(201).json({
            message: 'Staff user created successfully',
            user: {
                id: staff.id,
                name: staff.name,
                email: staff.email,
                role: staff.role,
            },
        });
    }
    catch (error) {
        console.error('Error creating staff user:', error);
        res.status(500).json({ message: 'Error creating staff user' });
    }
});
exports.createStaff = createStaff;
// Get all staff users
const getStaffUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staffUsers = yield prisma.user.findMany({
            where: {
                role: 'STAFF',
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        res.json(staffUsers);
    }
    catch (error) {
        console.error('Error fetching staff users:', error);
        res.status(500).json({ message: 'Error fetching staff users' });
    }
});
exports.getStaffUsers = getStaffUsers;
// Delete staff user
const deleteStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const staff = yield prisma.user.findUnique({
            where: { id: parseInt(id) },
        });
        if (!staff || staff.role !== 'STAFF') {
            return res.status(404).json({ message: 'Staff user not found' });
        }
        yield prisma.user.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: 'Staff user deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting staff user:', error);
        res.status(500).json({ message: 'Error deleting staff user' });
    }
});
exports.deleteStaff = deleteStaff;
