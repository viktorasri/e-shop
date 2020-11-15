import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

//  @desc   Fetch all products
//  @route  GET /api/products
//  @access Public
const getProducts = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const { pagination, limit, skip } = req;

  const query = search
    ? {
        name: {
          $regex: search.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&'),
          $options: 'i',
        },
      }
    : {};

  const products = await Product.find({ ...query })
    .limit(limit)
    .skip(skip);
  res.json({ products, pagination });
});

//  @desc   Fetch single product by id
//  @route  GET /api/products/:id
//  @access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

//  @desc   Delete product
//  @route  DELETE /api/products/:id
//  @access Private / Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

//  @desc   Create product
//  @route  POST /api/products
//  @access Private / Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, image, description, brand, category, price, countInStock } = req.body;
  const product = new Product({
    user: req.user._id,
    name: name || 'Sample product',
    image: image || '/images/sample.jpg',
    description: description || 'Sample description',
    brand: brand || 'Sampe brand',
    category: category || 'Sample category',
    price: price || 0,
    countInStock: countInStock || 0,
  });

  const savedProduct = await product.save();
  res.status(201).json(savedProduct);
});

//  @desc   Update product
//  @route  PUT /api/products/:id
//  @access Private / Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    const { name, image, description, brand, category, price, countInStock } = req.body;
    product.name = name || product.name;
    product.image = image || product.image;
    product.description = description || product.description;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.price = price || product.price;
    product.countInStock = countInStock || product.countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export { getProductById, getProducts, deleteProduct, createProduct, updateProduct };
