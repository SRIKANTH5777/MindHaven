import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import './Category.css';

// Use this template for ALL your category components
// Just change the component name and export statement

const ScienceFiction = ({ books }) => {
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState(new Set());

  // Function to handle cases where buyLink might be missing
  const getBuyLink = (book) => {
    return book.buyLink || 
           `https://www.google.com/search?q=Buy+${encodeURIComponent(book.title)}+by+${encodeURIComponent(book.authors)}`;
  };

  const handleAddToCart = (book) => {
    // Add price to book object (since Google Books API doesn't always provide price)
    const bookWithPrice = {
      ...book,
      price: Math.floor(Math.random() * 500) + 200 // Random price between ₹200-₹699
    };
    
    addToCart(bookWithPrice);
    
    // Show temporary feedback
    setAddedItems(prev => new Set([...prev, book.id]));
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(book.id);
        return newSet;
      });
    }, 2000);
  };

  if (!books || books.length === 0) {
    return (
      <div className="category-section">
        <div className="no-books-message">
          <p>No books available in this category</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-section">
      <div className="books-grid">
        {books.map(book => (
          <div key={book.id} className="book-card">
            <img src={book.image} alt={book.title} className="book-cover" />
            <div className="book-info">
              <h3 className="book-title" title={book.title}>{book.title}</h3>
              <p className="book-author">by {book.authors}</p>
              
              <div className="book-meta">
                <span className="book-rating">
                  {book.averageRating ? '★'.repeat(Math.round(book.averageRating)) : 'No Reviews'}
                </span>
                <span className="book-pages">{book.pageCount || 'N/A'} pages</span>
              </div>
              
              <div className="book-actions">
                <a 
                  href={getBuyLink(book)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="buy-button"
                >
                  Buy Now
                </a>
                {book.previewLink && (
                  <a 
                    href={book.previewLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="preview-button"
                  >
                    Preview
                  </a>
                )}
              </div>
              
              <button
                onClick={() => handleAddToCart(book)}
                className={`add-to-cart-button ${addedItems.has(book.id) ? 'added' : ''}`}
                disabled={addedItems.has(book.id)}
              >
                {addedItems.has(book.id) ? '✓ Added!' : '🛒 Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScienceFiction;

// INSTRUCTIONS FOR OTHER COMPONENTS:
// 1. Copy this entire code
// 2. Change "ScienceFiction" to your component name (Romance, Thriller, etc.)
// 3. Change the export statement at the bottom
// 
// For example, for Romance.jsx:
// const Romance = ({ books }) => {
// export default Romance;