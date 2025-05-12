import express from 'express';
import { getCategoriesFromProducts } from '../controllers/product.controller';
const router = express.Router();

const categories = [
  { id: "infrastructure", name: "IT Infrastructure" },
  { id: "user-devices", name: "User Devices" },
  { id: "networking", name: "Networking" },
  { id: "security", name: "Security" },
  { id: "solutions", name: "Solutions" }
];

router.get('/', (req, res) => {
  res.json(categories);
});

router.get('/dynamic', getCategoriesFromProducts);

export default router; 