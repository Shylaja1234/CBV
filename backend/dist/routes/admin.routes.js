"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const admin_controller_1 = require("../controllers/admin.controller");
const router = express_1.default.Router();
// All admin routes require authentication and admin role
router.use(auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)(['ADMIN']));
// Staff management routes
router.post('/staff', admin_controller_1.createStaff);
router.get('/staff', admin_controller_1.getStaffUsers);
router.delete('/staff/:id', admin_controller_1.deleteStaff);
exports.default = router;
