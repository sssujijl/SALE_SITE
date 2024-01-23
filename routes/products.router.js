import express from "express";
import Product from "../schemas/products.schema.js";

const router = express.Router();

router.post("/products", async (req, res) => {
  const { title, content, author, password } = req.body;
  const status = "FOR-SALE";
  const createAt = new Date();

  if (!title || !content || !author || !password) {
    return res
      .status(400)
      .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }

  const product = new Product({
    title,
    content,
    author,
    password,
    status,
    createAt,
  });

  try {
    await product.save();
    return res.json({ product });
  } catch (err) {
    return res
      .status(500)
      .json({ errorMessage: "상품 등록 중 오류가 발생했습니다." });
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find()
      .select("_id title author status createAt")
      .sort("-createAt")
      .exec();
    return res.status(200).json({ products });
  } catch (err) {
    return res
      .status(500)
      .json({ errorMessage: "상품 목록을 불러오던 중 오류가 발생했습니다." });
  }
});

router.get("/products/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    const currentProduct = await Product.findById(productId)
      .select("_id title content author status createAt")
      .exec();

    if (!currentProduct) {
      return res.status(404).json({ message: "상품 조회에 실패하였습니다." });
    }

    return res.status(200).json({ currentProduct });
  } catch (err) {
    return res
      .status(500)
      .json({
        errorMessage: "상품 상세 목록을 불러오던 중 오류가 발생했습니다.",
      });
  }
});

router.put("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  const { title, content, password, status } = req.body;

  if (!title || !content || !status || !productId) {
    return res
      .status(400)
      .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }

  try {
    const currentProduct = await Product.findById(productId);

    if (!currentProduct) {
      return res
        .status(404)
        .json({ errorMessage: "상품 조회에 실패하였습니다." });
    }

    if (title && content && status) {
      currentProduct.title = title;
      currentProduct.content = content;
      currentProduct.status = status;
    }

    if (password !== currentProduct.password) {
      return res
        .status(403)
        .json({ errorMessage: "상품을 수정할 권한이 존재하지 않습니다." });
    }

    await currentProduct.save();

    return res
      .status(200)
      .json({ currentProduct, message: "상품 정보를 수정하였습니다." });
  } catch (err) {
    return res
      .status(500)
      .json({ errorMessage: "상품 정보 수정 중 오류가 발생했습니다." });
  }
});

router.delete("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  const { password } = req.body;

  if (!productId || !password) {
    return res
      .status(400)
      .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }

  try {
    const currentProduct = await Product.findById(productId).exec();
    if (!currentProduct) {
      return res.status(404).json({ message: "상품을 조회에 실패하였습니다." });
    }

    if (password !== currentProduct.password) {
      return res
        .status(403)
        .json({ errorMessage: "상품을 삭제할 권한이 존재하지 않습니다." });
    }

    await Product.deleteOne({ _id: productId }).exec();

    return res.status(200).json({ message: "상품을 삭제하였습니다." });
  } catch (err) {
    return res
      .status(500)
      .json({ errorMessage: "상품 삭제 중 오류가 발생했습니다." });
  }
});

export default router;
