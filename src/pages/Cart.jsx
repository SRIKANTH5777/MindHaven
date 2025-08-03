import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Cart.css';

const Cart = () => {
  const { items, totalItems, updateQuantity, removeFromCart, clearCart, addToCart } = useCart();
  const [similarBooks, setSimilarBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Calculate total price
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Fetch similar books based on cart items
  useEffect(() => {
    if (items.length > 0) {
      fetchSimilarBooks();
    } else {
      setSimilarBooks([]);
    }
  }, [items]);

  const fetchSimilarBooks = async () => {
    setLoading(true);
    try {
      // Get categories from cart items
      const categories = [...new Set(items.map(item => item.category))];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)] || 'fiction';
      
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${randomCategory}&maxResults=6&orderBy=relevance`
      );
      
      if (response.ok) {
        const data = await response.json();
        const formattedBooks = data.items?.map(book => ({
          id: book.id,
          title: book.volumeInfo?.title || 'Untitled',
          authors: book.volumeInfo?.authors?.join(', ') || 'Unknown Author',
          image: book.volumeInfo?.imageLinks?.thumbnail || 'https://via.placeholder.com/128x195?text=No+Image',
          price: Math.floor(Math.random() * 500) + 200,
          category: book.volumeInfo?.categories?.[0] || 'Uncategorized',
          description: book.volumeInfo?.description || 'No description available',
          averageRating: book.volumeInfo?.averageRating || 0,
          pageCount: book.volumeInfo?.pageCount || 0,
          buyLink: book.saleInfo?.buyLink || null
        })) || [];
        
        // Filter out books already in cart
        const filteredBooks = formattedBooks.filter(book => 
          !items.some(cartItem => cartItem.id === book.id)
        );
        
        setSimilarBooks(filteredBooks.slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching similar books:', error);
      setSimilarBooks([]);
    }
    setLoading(false);
  };

  const handleQuantityChange = (bookId, newQuantity) => {
    const quantity = Math.max(0, parseInt(newQuantity) || 0);
    updateQuantity(bookId, quantity);
  };

  const handleAddSimilarBook = (book) => {
    addToCart(book);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-cart-content">
          <div className="empty-cart-icon">🛒</div>
          <h2 className="empty-cart-title">Your Cart is Empty</h2>
          <p className="empty-cart-message">
            Your cart is currently empty. Browse books and add your favorites!
          </p>
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2 className="cart-title">🛒 Your Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})</h2>
        <button onClick={handleClearCart} className="clear-cart-btn">
          Clear Cart
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {items.map(item => (
            <div key={item.id} className="cart-item">
              <img 
                src={item.image} 
                alt={item.title} 
                className="cart-item-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/100x140?text=No+Image';
                }}
              />
              
              <div className="cart-item-details">
                <h3 className="cart-item-title" title={item.title}>{item.title}</h3>
                <p className="cart-item-author">by {item.authors}</p>
                <p className="cart-item-description">
                  {item.description?.substring(0, 150)}{item.description?.length > 150 ? '...' : ''}
                </p>
                <div className="cart-item-rating">
                  {item.averageRating ? '★'.repeat(Math.round(item.averageRating)) : 'No Reviews'}
                </div>
              </div>

              <div className="cart-item-actions">
                <div className="cart-item-price">₹{item.price.toLocaleString()}</div>
                
                <div className="quantity-controls">
                  <label htmlFor={`qty-${item.id}`} className="quantity-label">Qty:</label>
                  <div className="quantity-input-group">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="quantity-btn"
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <input
                      id={`qty-${item.id}`}
                      type="number"
                      min="1"
                      max="10"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      className="quantity-input"
                      aria-label="Quantity"
                    />
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="quantity-btn"
                      disabled={item.quantity >= 10}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-total">
                  Total: ₹{(item.price * item.quantity).toLocaleString()}
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="remove-item-btn"
                  aria-label={`Remove ${item.title} from cart`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="cart-total">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Total Items:</span>
              <span>{totalItems}</span>
            </div>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span className="free-shipping">Free</span>
            </div>
            <div className="summary-row total-row">
              <span>Total:</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
            <button className="checkout-btn">
              Proceed to Checkout
            </button>
            <Link to="/" className="continue-shopping-link">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Similar Books Section */}
      {items.length > 0 && (
        <div className="similar-books-section">
          <h3 className="similar-books-title">📚 Similar Books You Might Like</h3>
          
          {loading ? (
            <div className="similar-books-loading">
              <div className="loading-spinner"></div>
              <p>Loading recommendations...</p>
            </div>
          ) : similarBooks.length > 0 ? (
            <div className="similar-books-grid">
              {similarBooks.map(book => (
                <div key={book.id} className="similar-book-card">
                  <img 
                    src={book.image} 
                    alt={book.title} 
                    className="similar-book-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x120?text=No+Image';
                    }}
                  />
                  <div className="similar-book-info">
                    <h4 className="similar-book-title" title={book.title}>{book.title}</h4>
                    <p className="similar-book-author">by {book.authors}</p>
                    <div className="similar-book-price">₹{book.price.toLocaleString()}</div>
                    <button 
                      className="similar-book-add-btn"
                      onClick={() => handleAddSimilarBook(book)}
                      aria-label={`Add ${book.title} to cart`}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-recommendations">
              <p>No recommendations available at the moment.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;