import { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(1);
  
  // Determine the active step based on current path
  useEffect(() => {
    if (location.pathname === '/shipping') setActiveStep(2);
    else if (location.pathname === '/payment') setActiveStep(3);
    else if (location.pathname === '/placeorder') setActiveStep(4);
    else setActiveStep(1);
  }, [location]);

  // Calculate progress percentage
  const progressPercentage = ((activeStep - 1) / 3) * 100;
  
  return (
    <div className="checkout-steps-container">
      {/* Progress bar */}
      <div className="progress-container mb-3">
        <div 
          className="progress-bar" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <Nav className="justify-content-center mb-4 checkout-nav">
        <Nav.Item className={activeStep >= 1 ? 'active' : ''}>
          {step1 ? (
            <Nav.Link 
              as={Link} 
              to="/login"
              className={`step-link ${activeStep >= 1 ? 'completed' : ''}`}
            >
              Sign In
            </Nav.Link>
          ) : (
            <Nav.Link disabled>Sign In</Nav.Link>
          )}
        </Nav.Item>
        
        <Nav.Item className={activeStep >= 2 ? 'active' : ''}>
          {step2 ? (
            <Nav.Link 
              as={Link} 
              to="/shipping"
              className={`step-link ${activeStep >= 2 ? 'completed' : ''}`}
            >
              Shipping
            </Nav.Link>
          ) : (
            <Nav.Link disabled>Shipping</Nav.Link>
          )}
        </Nav.Item>
        
        <Nav.Item className={activeStep >= 3 ? 'active' : ''}>
          {step3 ? (
            <Nav.Link 
              as={Link} 
              to="/payment"
              className={`step-link ${activeStep >= 3 ? 'completed' : ''}`}
            >
              Payment
            </Nav.Link>
          ) : (
            <Nav.Link disabled>Payment</Nav.Link>
          )}
        </Nav.Item>
        
        <Nav.Item className={activeStep >= 4 ? 'active' : ''}>
          {step4 ? (
            <Nav.Link 
              as={Link} 
              to="/placeorder"
              className={`step-link ${activeStep >= 4 ? 'completed' : ''}`}
            >
              Place Order
            </Nav.Link>
          ) : (
            <Nav.Link disabled>Place Order</Nav.Link>
          )}
        </Nav.Item>
      </Nav>
      
      {/* Add the CSS for transitions */}
      <style jsx>{`
        .checkout-steps-container {
          position: relative;
          padding: 20px 0;
        }
        
        .progress-container {
          height: 4px;
          background-color: #e0e0e0;
          position: relative;
          margin: 0 auto;
          width: 80%;
          max-width: 500px;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          background-color: #4caf50;
          transition: width 0.5s ease-in-out;
        }
        
        .checkout-nav {
          position: relative;
          z-index: 2;
        }
        
        .nav-item {
          position: relative;
          transition: transform 0.3s ease;
        }
        
        .nav-item.active {
          transform: translateY(-3px);
        }
        
        .step-link {
          transition: all 0.3s ease;
        }
        
        .step-link.completed {
          font-weight: bold;
          color: #4caf50 !important;
        }
        
        /* Fix for React Bootstrap Nav spacing */
        .nav-item {
          margin: 0 15px;
        }
      `}</style>
    </div>
  );
};

export default CheckoutSteps;