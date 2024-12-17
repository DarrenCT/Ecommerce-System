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
      throw new Error('Failed to get user cart');
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

  async getOrCreateCart() {
    try {
      const cartId = localStorage.getItem('cartId');
      const auth = JSON.parse(localStorage.getItem('auth') || '{}');
      const userId = auth.user?.userId;

      if (cartId) {
        try {
          const cart = await this.getCart(cartId);
          
          // If user is logged in and cart is a guest cart, convert it
          if (userId && !cart.userId) {
            const updatedCart = await this.updateCartUser(cartId, userId);
            return updatedCart;
          }
          
          // If user is logged out but trying to access a user cart, create new guest cart
          if (!userId && cart.userId) {
            const newCart = await this.createCart(null);
            localStorage.setItem('cartId', newCart.cartId);
            return newCart;
          }
          
          return cart;
        } catch (error) {
          console.log('Error fetching existing cart:', error);
          // Continue to create new cart
        }
      }

      // Create new cart
      const response = await axios.post('/api/cart', { userId });
      localStorage.setItem('cartId', response.data.cartId);
      return response.data;
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

  async mergeAndDeleteCart(targetCartId, sourceCartId) {
    try {
      const response = await axios.post(`/api/cart/${targetCartId}/merge`, {
        sourceCartId
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to merge carts');
    }
  },

  async deleteCart(cartId) {
    try {
      await axios.delete(`/api/cart/${cartId}`);
    } catch (error) {
      throw new Error('Failed to delete cart');
    }
  },

  async associateWithUser(userId, cartId) {
    try {
      // First check if user already has a cart
      const existingUserCart = await this.getUserCart(userId);
      const guestCart = await this.getCart(cartId);

      if (existingUserCart) {
        // If user has a cart and there's a guest cart with items
        if (guestCart && !guestCart.userId && guestCart.items.length > 0) {
          // Merge guest cart into user cart
          const mergedCart = await this.mergeAndDeleteCart(existingUserCart.cartId, guestCart.cartId);
          localStorage.setItem('cartId', existingUserCart.cartId);
          return mergedCart;
        }
        // If no guest cart or empty guest cart, just use existing user cart
        if (guestCart && !guestCart.userId) {
          await this.deleteCart(guestCart.cartId);
        }
        localStorage.setItem('cartId', existingUserCart.cartId);
        return existingUserCart;
      }

      // If no user cart exists, convert guest cart
      if (!guestCart.userId) {
        const response = await axios.put(`/api/cart/${cartId}/user`, { userId });
        return response.data;
      }
      return guestCart;
    } catch (error) {
      throw new Error('Failed to associate cart with user');
    }
  }
};