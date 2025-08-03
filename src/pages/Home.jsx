import React, { Component } from 'react';
import './Home.css';
import Romance from '../components/Romance';
import Thriller from '../components/Thriller';
import Fantasy from '../components/Fantasy';
import Motivation from '../components/Motivation';
import ScienceFiction from '../components/ScienceFiction';
import Biography from '../components/Biography';
import History from '../components/History';
import Business from '../components/Business';
import HealthWellness from '../components/HealthWellness';
import Loader from '../components/Loader';

const API_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

const CATEGORIES = {
  ROMANCE: 'romance',
  THRILLER: 'thriller',
  FANTASY: 'fantasy',
  MOTIVATIONAL: 'motivational',
  SCIENCE_FICTION: 'science_fiction',
  BIOGRAPHY: 'biography',
  HISTORY: 'history',
  BUSINESS: 'business',
  HEALTH: 'health'
};

class Home extends Component {
  state = {
    books: {
      [CATEGORIES.ROMANCE]: [],
      [CATEGORIES.THRILLER]: [],
      [CATEGORIES.FANTASY]: [],
      [CATEGORIES.MOTIVATIONAL]: [],
      [CATEGORIES.SCIENCE_FICTION]: [],
      [CATEGORIES.BIOGRAPHY]: [],
      [CATEGORIES.HISTORY]: [],
      [CATEGORIES.BUSINESS]: [],
      [CATEGORIES.HEALTH]: []
    },
    apiStatus: API_STATUS.IDLE,
    error: null
  };

  componentDidMount() {
    this.fetchAllBooks();
  }

  fetchAllBooks = async () => {
    this.setState({ apiStatus: API_STATUS.LOADING, error: null });

    try {
      const [
        romance, 
        thriller, 
        fantasy, 
        motivational,
        scienceFiction,
        biography,
        history,
        business,
        health
      ] = await Promise.all([
        this.fetchBooksByCategory(CATEGORIES.ROMANCE),
        this.fetchBooksByCategory(CATEGORIES.THRILLER),
        this.fetchBooksByCategory(CATEGORIES.FANTASY),
        this.fetchBooksByCategory(CATEGORIES.MOTIVATIONAL),
        this.fetchBooksByCategory(CATEGORIES.SCIENCE_FICTION),
        this.fetchBooksByCategory(CATEGORIES.BIOGRAPHY),
        this.fetchBooksByCategory(CATEGORIES.HISTORY),
        this.fetchBooksByCategory(CATEGORIES.BUSINESS),
        this.fetchBooksByCategory(CATEGORIES.HEALTH)
      ]);

      this.setState({
        books: {
          [CATEGORIES.ROMANCE]: romance,
          [CATEGORIES.THRILLER]: thriller,
          [CATEGORIES.FANTASY]: fantasy,
          [CATEGORIES.MOTIVATIONAL]: motivational,
          [CATEGORIES.SCIENCE_FICTION]: scienceFiction,
          [CATEGORIES.BIOGRAPHY]: biography,
          [CATEGORIES.HISTORY]: history,
          [CATEGORIES.BUSINESS]: business,
          [CATEGORIES.HEALTH]: health
        },
        apiStatus: API_STATUS.SUCCESS
      });
    } catch (error) {
      this.setState({
        apiStatus: API_STATUS.ERROR,
        error: error.message
      });
      console.error('Error fetching books:', error);
    }
  };

  fetchBooksByCategory = async (category) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${category}&maxResults=12&orderBy=newest`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${category} books`);
      }

      const data = await response.json();
      return this.formatBookData(data.items || []);
    } catch (error) {
      console.error(`Error fetching ${category} books:`, error);
      return [];
    }
  };

  formatBookData = (books) => {
    return books.map(book => ({
      id: book.id,
      title: book.volumeInfo?.title || 'Untitled',
      authors: book.volumeInfo?.authors?.join(', ') || 'Unknown Author',
      description: book.volumeInfo?.description || 'No description available',
      image: book.volumeInfo?.imageLinks?.thumbnail || 'https://via.placeholder.com/128x195?text=No+Image',
      category: book.volumeInfo?.categories?.[0] || 'Uncategorized',
      publishedDate: book.volumeInfo?.publishedDate || '',
      publisher: book.volumeInfo?.publisher || 'Unknown',
      pageCount: book.volumeInfo?.pageCount || 0,
      averageRating: book.volumeInfo?.averageRating || 0,
      buyLink: book.saleInfo?.buyLink || null
    }));
  };

  renderLoader = () => (
    <div className="loaderContainer" data-testid="loader">
      <Loader />
    </div>
  );

  renderError = () => (
    <div className="errorContainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error"
        className="errorImage"
      />
      <h2 className="errorTitle">Oops! Something Went Wrong</h2>
      <p className="errorMessage">{this.state.error}</p>
      <button
        onClick={this.fetchAllBooks}
        className="retryButton"
      >
        Retry
      </button>
    </div>
  );

  renderBooks = () => {
    const { books } = this.state;
    
    return (
      <div className="homeContainer">
        {/* Original Categories */}
        <div className="categorySection">
          <h2 className="categoryTitle">Romance</h2>
          <Romance books={books[CATEGORIES.ROMANCE]} />
        </div>

        <div className="categorySection">
          <h2 className="categoryTitle">Thriller</h2>
          <Thriller books={books[CATEGORIES.THRILLER]} />
        </div>

        <div className="categorySection">
          <h2 className="categoryTitle">Fantasy</h2>
          <Fantasy books={books[CATEGORIES.FANTASY]} />
        </div>

        <div className="categorySection">
          <h2 className="categoryTitle">Motivational</h2>
          <Motivation books={books[CATEGORIES.MOTIVATIONAL]} />
        </div>

        {/* New Categories */}
        <div className="categorySection">
          <h2 className="categoryTitle">Science Fiction</h2>
          <ScienceFiction books={books[CATEGORIES.SCIENCE_FICTION]} />
        </div>

        <div className="categorySection">
          <h2 className="categoryTitle">Biography</h2>
          <Biography books={books[CATEGORIES.BIOGRAPHY]} />
        </div>

        <div className="categorySection">
          <h2 className="categoryTitle">History</h2>
          <History books={books[CATEGORIES.HISTORY]} />
        </div>

        <div className="categorySection">
          <h2 className="categoryTitle">Business</h2>
          <Business books={books[CATEGORIES.BUSINESS]} />
        </div>

        <div className="categorySection">
          <h2 className="categoryTitle">Health & Wellness</h2>
          <HealthWellness books={books[CATEGORIES.HEALTH]} />
        </div>
      </div>
    );
  };

  render() {
    const { apiStatus } = this.state;

    switch (apiStatus) {
      case API_STATUS.LOADING:
        return this.renderLoader();
      case API_STATUS.ERROR:
        return this.renderError();
      case API_STATUS.SUCCESS:
        return this.renderBooks();
      default:
        return null;
    }
  }
}

export default Home;