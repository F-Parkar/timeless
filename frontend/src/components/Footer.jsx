import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaClock, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <Row className="py-4">
          <Col md={4} className="footer-col ms-auto">
            <h5 className="footer-heading">Contact Us</h5>
            <div className="footer-contact">
              <p className="d-flex align-items-center justify-content-md-end mb-2">
                <span>123 Watch Street, Timepiece City, TC 10001</span>
                <FaMapMarkerAlt className="ms-2 me-0 contact-icon d-none d-md-block" />
                <FaMapMarkerAlt className="me-2 contact-icon d-block d-md-none" />
              </p>
              <p className="d-flex align-items-center justify-content-md-end mb-2">
                <span>(555) 123-4567</span>
                <FaPhone className="ms-2 me-0 contact-icon d-none d-md-block" />
                <FaPhone className="me-2 contact-icon d-block d-md-none" />
              </p>
              <p className="d-flex align-items-center justify-content-md-end mb-2">
                <span>support@watchshop.com</span>
                <FaEnvelope className="ms-2 me-0 contact-icon d-none d-md-block" />
                <FaEnvelope className="me-2 contact-icon d-block d-md-none" />
              </p>
              <p className="d-flex align-items-center justify-content-md-end mb-2">
                <span>Mon-Fri: 9AM - 8PM, Sat-Sun: 10AM - 6PM</span>
                <FaClock className="ms-2 me-0 contact-icon d-none d-md-block" />
                <FaClock className="me-2 contact-icon d-block d-md-none" />
              </p>
            </div>
          </Col>

          {/* Centered copyright text below contact */}
          <Col xs={12} className="text-center pt-2">
            <p className="mb-0">&copy; {currentYear} WatchShop. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
