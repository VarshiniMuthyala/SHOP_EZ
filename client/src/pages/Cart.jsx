import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Trash2, CreditCard, MapPin, CheckCircle, ArrowRight, ShoppingCart, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateCartItem, removeFromCart, placeOrder } = useApp();

  const [checkoutStep, setCheckoutStep] = useState(false); // false = cart details, true = address & payment details
  const [orderSuccess, setOrderSuccess] = useState(null); // stores order result on success

  // Form states
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [submitting, setSubmitting] = useState(false);

  if (orderSuccess) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', animation: 'fadeIn 0.6s ease forwards' }}>
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
          <CheckCircle size={64} style={{ color: 'var(--primary)', marginBottom: '20px' }} />
          <h2 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
            Order Placed Successfully!
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px' }}>
            Thank you for your order! We have sent a confirmation email regarding your purchase. The seller has been notified and is preparing your shipment.
          </p>

          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'left',
            marginBottom: '32px',
            fontSize: '0.9rem'
          }}>
            <h4 style={{ fontWeight: 700, marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Order Reference: {orderSuccess._id}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p><strong>Shipping Destination:</strong> {orderSuccess.shippingAddress.address}, {orderSuccess.shippingAddress.city}, {orderSuccess.shippingAddress.state} {orderSuccess.shippingAddress.zipCode}, {orderSuccess.shippingAddress.country}</p>
              <p><strong>Payment Method:</strong> {orderSuccess.paymentMethod}</p>
              <p><strong>Total Charged:</strong> <span style={{ color: 'var(--primary)', fontWeight: 700 }}>${orderSuccess.totalAmount.toFixed(2)}</span></p>
              <p><strong>Status:</strong> <span className="status-pill status-pending">{orderSuccess.status}</span></p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button onClick={() => navigate('/profile')} className="btn btn-primary">
              <span>View My Orders</span>
            </button>
            <button onClick={() => navigate('/products')} className="btn btn-secondary">
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '80px 20px', maxWidth: '600px', margin: '40px auto' }}>
        <ShoppingBag size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
        <h2>Your Shopping Cart is Empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '10px', marginBottom: '32px' }}>
          Explore our range of student smartphones, laptops, headphones, and smartwatches.
        </p>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          <span>Browse Products</span>
        </button>
      </div>
    );
  }

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => {
    // Check if product is populated or has a nested discount
    const discount = item.productId?.discount || 0;
    const itemPrice = item.price * (1 - discount / 100);
    return sum + (itemPrice * item.quantity);
  }, 0);
  const discountTotal = cart.reduce((sum, item) => {
    const discount = item.productId?.discount || 0;
    const savings = item.price * (discount / 100);
    return sum + (savings * item.quantity);
  }, 0);
  const shipping = subtotal > 150 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!address || !city || !state || !zipCode) return;
    setSubmitting(true);
    const shippingDetails = { address, city, state, zipCode, country };
    const order = await placeOrder(shippingDetails, paymentMethod);
    setSubmitting(false);
    if (order) {
      setOrderSuccess(order);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-gradient" style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '32px' }}>
        Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)} items)
      </h1>

      <div className="checkout-layout">
        {/* Left Column: Cart items list OR checkout form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {!checkoutStep ? (
            // Cart Items Step
            <div className="glass-card">
              <h3 style={{ fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                Cart Items
              </h3>
              <div>
                {cart.map((item) => {
                  const discount = item.productId?.discount || 0;
                  const itemDiscountedPrice = item.price * (1 - discount / 100);

                  return (
                    <div key={item._id} className="cart-list-item">
                      <img src={item.image} alt={item.name} className="cart-item-img" />

                      <div className="cart-item-details">
                        <h4 className="cart-item-title">{item.name}</h4>
                        <p className="cart-item-meta">
                          Variant:
                          <select
                            value={item.size}
                            onChange={(e) => updateCartItem(item._id, item.quantity, e.target.value)}
                            style={{
                              background: 'var(--bg-card)',
                              color: 'var(--text-primary)',
                              border: '1px solid var(--border-color)',
                              marginLeft: '6px',
                              borderRadius: '4px',
                              padding: '2px 6px'
                            }}
                          >
                            {item.size === '128GB' || item.size === '256GB' ? (
                              <>
                                <option value="128GB">128GB</option>
                                <option value="256GB">256GB</option>
                              </>
                            ) : (
                              <>
                                <option value="Standard">Standard</option>
                                <option value="Premium">Premium</option>
                              </>
                            )}
                          </select>
                        </p>
                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={() => updateCartItem(item._id, Math.max(1, item.quantity - 1), item.size)}
                            className="qty-btn"
                            style={{ width: '26px', height: '26px', fontSize: '0.9rem' }}
                          >
                            -
                          </button>
                          <span style={{ fontWeight: 600 }}>{item.quantity}</span>
                          <button
                            onClick={() => updateCartItem(item._id, item.quantity + 1, item.size)}
                            className="qty-btn"
                            style={{ width: '26px', height: '26px', fontSize: '0.9rem' }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 700, display: 'block', fontSize: '1.1rem' }}>
                          ${(itemDiscountedPrice * item.quantity).toFixed(2)}
                        </span>
                        {discount > 0 && (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'line-through' }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        )}
                        <button
                          onClick={() => removeFromCart(item._id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            marginTop: '12px',
                            transition: 'color 0.2s'
                          }}
                          onMouseOver={e => e.currentTarget.style.color = 'var(--error)'}
                          onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // Checkout Details Form
            <div className="glass-card">
              <h3 style={{ fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin className="text-primary" size={20} />
                <span>Shipping & Payment Details</span>
              </h3>

              <form onSubmit={handleCheckoutSubmit}>
                {/* Recipient Address */}
                <div className="form-group">
                  <label htmlFor="address">Recipient Street Address</label>
                  <input
                    type="text"
                    id="address"
                    placeholder="e.g. 123 Main St, Apt 4B"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      placeholder="e.g. New York"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State / Region</label>
                    <input
                      type="text"
                      id="state"
                      placeholder="e.g. NY"
                      value={state}
                      onChange={e => setState(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '16px' }}>
                  <div className="form-group">
                    <label htmlFor="zipCode">Zip Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      placeholder="e.g. 10001"
                      value={zipCode}
                      onChange={e => setZipCode(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      placeholder="e.g. United States"
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="form-group" style={{ marginTop: '24px' }}>
                  <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={16} />
                    <span>Select Payment Method</span>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px' }}>
                    {['Credit Card', 'PayPal'].map((method) => (
                      <div
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        style={{
                          border: `1px solid ${paymentMethod === method ? 'var(--primary)' : 'var(--border-color)'}`,
                          background: paymentMethod === method ? 'rgba(0, 242, 254, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                          padding: '12px',
                          borderRadius: '8px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          fontWeight: 600,
                          transition: 'all 0.2s'
                        }}
                      >
                        {method}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Buttons inside Form */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(false)}
                    className="btn btn-secondary"
                    style={{ flexGrow: 1 }}
                  >
                    Back to Cart
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flexGrow: 1.5 }}
                    disabled={submitting}
                  >
                    <span>{submitting ? 'Placing Order...' : 'Confirm Order'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="glass-card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            Order Summary
          </h3>
          <div className="cart-summary">
            <div className="summary-row">
              <span>Items Total (Original)</span>
              <span>${(subtotal + discountTotal).toFixed(2)}</span>
            </div>
            {discountTotal > 0 && (
              <div className="summary-row" style={{ color: 'var(--success)' }}>
                <span>Discounts Applied</span>
                <span>-${discountTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping cost</span>
              <span>{shipping === 0 ? 'FREE' : `${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row total">
              <span>Total Price</span>
              <span className="text-gradient" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                ${total.toFixed(2)}
              </span>
            </div>

            {!checkoutStep && (
              <button
                onClick={() => setCheckoutStep(true)}
                className="btn btn-primary animate-fade-in"
                style={{ width: '100%', marginTop: '20px', gap: '8px' }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
