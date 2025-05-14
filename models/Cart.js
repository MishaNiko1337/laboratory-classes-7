const { getDatabase } = require("../database");
const Product = require("./Product");

const COLLECTION_NAME = "carts";

class Cart {
  constructor() {}

  static async add(productName) {
    const db = getDatabase();
    const product = await Product.findByName(productName);

  if (!product) {
  console.warn(`Product '${productName}' not found. Skipping add to cart.`);
  return;
  }


    const cart = await db.collection(COLLECTION_NAME).findOne({});

    if (!cart) {
      await db.collection(COLLECTION_NAME).insertOne({
        items: [{ product, quantity: 1 }],
      });
      return;
    }

    const existingItem = cart.items.find(
      (item) => item.product.name === productName
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ product, quantity: 1 });
    }

    await db
      .collection(COLLECTION_NAME)
      .updateOne({}, { $set: { items: cart.items } });
  }

  static async getItems() {
    const db = getDatabase();
    const cart = await db.collection(COLLECTION_NAME).findOne({});
    return cart?.items || [];
  }

  static async getProductsQuantity() {
    const items = await this.getItems();
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  static async getTotalPrice() {
    const items = await this.getItems();
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  static async clearCart() {
    const db = getDatabase();
    await db.collection(COLLECTION_NAME).updateOne({}, { $set: { items: [] } });
  }
}

module.exports = Cart;
