const express = require('express');
const Product = require('../Model/Product');
const router = express.Router();
const cloudinary = require('../config/cloudinary');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

// POST /uploadProduct
router.post('/uploadProduct', upload.array('images', 5), async (req, res) => {
    try {
        const { name, brand, features, category, sellingPrice, price, details, size } = req.body;
        const parsedFeatures = JSON.parse(features);
        const parsedSize = JSON.parse(size);

        if (!name || !brand || !category || !sellingPrice || !price) {
            return res.status(400).json({ success: false, message: 'All required fields must be provided' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Images are required' });
        }

        const imageUrls = [];
        for (const file of req.files) {
            const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            const result = await cloudinary.uploader.upload(base64Image, { folder: 'products' });
            imageUrls.push(result.secure_url);
        }

        const product = new Product({
            name, brand, price, sellingPrice, category, details,
            features: parsedFeatures, imageUrls, size: parsedSize,
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /updateProduct/:id
router.put('/updateProduct/:id', upload.array('images', 5), async (req, res) => {
    try {
        const { name, brand, category, sellingPrice, price, features, details, size } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        product.name = name;
        product.brand = brand;
        product.price = price;
        product.sellingPrice = sellingPrice;
        product.category = category;
        product.details = details;
        product.features = JSON.parse(features);
        product.size = JSON.parse(size);

        if (req.files && req.files.length > 0) {
            const newImageUrls = [];
            for (const file of req.files) {
                const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                const result = await cloudinary.uploader.upload(base64Image, { folder: 'products' });
                newImageUrls.push(result.secure_url);
            }
            product.imageUrls = newImageUrls;
        }

        await product.save();
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /deleteProduct/:id
router.delete('/deleteProduct/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        await Product.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET / (all products)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /search (SPECIFIC ROUTE BEFORE PARAMETRIC)
router.get('/search', async (req, res) => {
    try {
        const { q, page = 1, limit = 10 } = req.query;

        if (!q || q.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                message: 'Search query is required' 
            });
        }

        const searchRegex = new RegExp(q.trim(), 'i');
        const searchQuery = {
            $or: [
                { name: { $regex: searchRegex } },
                { brand: { $regex: searchRegex } },
                { category: { $regex: searchRegex } }
            ]
        };

        const skip = (page - 1) * limit;
        const [products, total] = await Promise.all([
            Product.find(searchQuery)
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Product.countDocuments(searchQuery)
        ]);


        if (!products || products.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'No products found matching the search criteria' 
            });
        }

        const response = {
            success: true,
            data: products,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalResults: total,
                limit: parseInt(limit)
            }
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// GET /category/lifestyle-group
router.get('/category/lifestyle-group', async (req, res) => {
    try {
        const categories = ['Lifestyle', 'Running', 'Sneakers', 'Training'];
        const products = await Product.aggregate([
            { $match: { category: { $in: categories } } },
            { $group: { _id: '$category', product: { $first: '$$ROOT' } } },
            { $replaceRoot: { newRoot: '$product' } }
        ]);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /related-products/:id
router.get('/related-products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const originalProduct = await Product.findById(productId);
        if (!originalProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        const relatedProducts = await Product.find({
            $or: [
                { brand: originalProduct.brand, category: { $ne: originalProduct.category } },
                { category: originalProduct.category, brand: { $ne: originalProduct.brand } }
            ],
            _id: { $ne: productId }
        });
        res.json(relatedProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /:id (LAST ROUTE)
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;