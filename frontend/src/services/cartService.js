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
      const auth = JSON.parse(localStorage.getItem('auth') || '{}');
      const userId = auth.user?.userId;
      
      const response = await axios.get(`/api/cart/${cartId}${userId ? `?userId=${userId}` : ''}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        // Get userId from auth context
        const auth = JSON.parse(localStorage.getItem('auth') || '{}');
        const userId = auth.user?.userId || null;
        const newCart = await this.createCart(userId);
        localStorage.setItem('cartId', newCart.cartId);
        return newCart;
      }
      throw new Error('Failed to fetch cart');
    }
  },

  async getUserCart(userId) {
    try {
      const response = await axios.get(`/api/cart/user/${userId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch user cart');
    }
  },

  async updateCartUser(cartId, userId) {
    try {
      const response = await axios.put(`/api/cart/${cartId}/user`, { userId });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update cart user');
    }
  },

  async getOrCreateCart(userId = null) {
    try {
      // Check for existing cart in localStorage
      const existingCartId = localStorage.getItem('cartId');
      
      if (existingCartId) {
        try {
          const cart = await this.getCart(existingCartId);
          
          // If logged in
          if (userId) {
            // If this is a guest cart, update it with user ID
            if (!cart.userId) {
              const updatedCart = await this.updateCartUser(cart.cartId, userId);
              return updatedCart;
            }
            // If this is a user cart but belongs to a different user, create new cart
            if (cart.userId !== userId) {
              localStorage.removeItem('cartId');
              const newCart = await this.createCart(userId);
              localStorage.setItem('cartId', newCart.cartId);
              return newCart;
            }
          } else {
            // If logged out, only use cart if it's a guest cart
            if (cart.userId) {
              localStorage.removeItem('cartId');
              const newCart = await this.createCart(null);
              localStorage.setItem('cartId', newCart.cartId);
              return newCart;
            }
          }
          return cart;
        } catch (error) {
          // If cart not found or error, remove from localStorage
          localStorage.removeItem('cartId');
        }
      }

      // If logged in, try to find existing user cart
      if (userId) {
        try {
          const userCart = await this.getUserCart(userId);
          if (userCart) {
            localStorage.setItem('cartId', userCart.cartId);
            return userCart;
          }
        } catch (error) {
          console.error('Error fetching user cart:', error);
        }
      }

      // Create new cart
      const newCart = await this.createCart(userId);
      localStorage.setItem('cartId', newCart.cartId);
      return newCart;
    } catch (error) {
      throw new Error('Failed to get or create cart');
    }
  },

  async addToCart(cartId, productId, quantity) {
    try {
      const auth = JSON.parse(localStorage.getItem('auth') || '{}');
      const userId = auth.user?.userId;
      
      const response = await axios.post(`/api/cart/${cartId}/items${userId ? `?userId=${userId}` : ''}`, {
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      // If cart not found, create a new one and try again
      if (error.response?.status === 404) {
        // Get userId from auth context
        const auth = JSON.parse(localStorage.getItem('auth') || '{}');
        const userId = auth.user?.userId || null;
        const newCart = await this.createCart(userId);
        localStorage.setItem('cartId', newCart.cartId);
        
        // Retry adding item with new cart
        const response = await axios.post(`/api/cart/${newCart.cartId}/items${userId ? `?userId=${userId}` : ''}`, {
          productId,
          quantity
        });
        return response.data;
      }
      throw new Error('Failed to add item to cart');
    }
  },

  async updateQuantity(cartId, productId, quantity) {
    try {
      const auth = JSON.parse(localStorage.getItem('auth') || '{}');
      const userId = auth.user?.userId;
      
      const response = await axios.put(`/api/cart/${cartId}/items/${productId}${userId ? `?userId=${userId}` : ''}`, {
        quantity
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update item quantity');
    }
  },

  async removeItem(cartId, productId) {
    try {
      const auth = JSON.parse(localStorage.getItem('auth') || '{}');
      const userId = auth.user?.userId;
      
      const response = await axios.delete(`/api/cart/${cartId}/items/${productId}${userId ? `?userId=${userId}` : ''}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to remove item from cart');
    }
  },

  async associateWithUser(userId, cartId) {
    try {
      const response = await axios.post(`/api/cart/user/${userId}`, {
        currentCartId: cartId
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to associate cart with user');
    }
  }
};