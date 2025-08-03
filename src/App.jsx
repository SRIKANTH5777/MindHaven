import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Navbar from './components/Navbar'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <div className="bg-gray-100 min-h-screen p-4">
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <h1 className="text-2xl font-bold mb-4">Welcome to the Bookstore</h1>
                  <Home />
                </div>
              }
            />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App