import axios from 'axios';

export const cartService = {
  async getCart(cartId) {
    const response = await axios.get(`/api/cart/${cartId}`);
    return response.data;
  },

  async addToCart(cartId, productId, quantity) {
    const response = await axios.post(`/api/cart/${cartId}/items`, {
      productId,
      quantity
    });
    return response.data;
  },

  async updateQuantity(cartId, productId, quantity) {
    const response = await axios.put(`/api/cart/${cartId}/items/${productId}`, {
      quantity
    });
    return response.data;
  },

  async removeItem(cartId, productId) {
    const response = await axios.delete(`/api/cart/${cartId}/items/${productId}`);
    return response.data;
  }
}; 