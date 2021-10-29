import express from 'express';
import {
    createProduct,
    deleteProduct,
    getProducts,
    getSingleProduct,
    updateProduct,
    createProductReview,
    getTopProducts
} from '../controller/productController.js';
const router = express.Router();
import { admin, protect } from '../middleware/authMiddleware.js';

router.route('/').get(getProducts).post(protect, admin, createProduct)
router.route('/:id/reviews').post(protect, createProductReview)
router.get('/top', getTopProducts)

router.route('/:id')
    .get(getSingleProduct)
    .delete(protect, admin, deleteProduct)
    .put(protect, admin, updateProduct)

export default router;