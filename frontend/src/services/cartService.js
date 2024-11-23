import axios from 'axios';

export const cartService = {
  async createCart(userId = null) {
    try {
      const response = await axios.post('/api/cart', { userId });
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to create cart');
    }
  },

  async getCart(cartId) {
    try {
      const response = await axios.get(`/api/cart/${cartId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch cart');
    }
  },

  async addToCart(cartId, productId, quantity) {
    try {
      const response = await axios.post(`/api/cart/${cartId}/items`, {
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to add item to cart');
    }
  },

  async updateQuantity(cartId, productId, quantity) {
    try {
      const response = await axios.put(`/api/cart/${cartId}/items/${productId}`, {
        quantity
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update item quantity');
    }
  },

  async removeItem(cartId, productId) {
    try {
      const response = await axios.delete(`/api/cart/${cartId}/items/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to remove item from cart');
    }
  },

  async associateWithUser(userId, currentCartId) {
    try {
      const response = await axios.post(`/api/cart/user/${userId}`, { currentCartId });
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to associate cart with user');
    }
  }
};