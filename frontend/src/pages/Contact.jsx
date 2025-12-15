import { Container, Button } from 'react-bootstrap';

export default function Contact() {
  return (
    <Container className="text-center py-5 my-5 d-flex flex-column justify-content-center" style={{ minHeight: "60vh" }}>
      <h2 className="display-5 fw-bold mb-4">Contact Us</h2>
      <p className="lead">Call or WhatsApp us for bookings</p>
      
      <div className="d-flex justify-content-center gap-3 mt-4">
        <Button 
          href="https://wa.me/918668704570" 
          variant="success" 
          size="lg"
          className="px-4 py-2 rounded-pill d-flex align-items-center gap-2"
          target="_blank"
        >
          <i className="bi bi-whatsapp"></i> WhatsApp +91 8668704570
        </Button>
        
        <Button 
          href="https://instagram.com" 
          variant="danger" // Instagram brand color approximation
          size="lg"
          className="px-4 py-2 rounded-pill d-flex align-items-center gap-2"
          target="_blank"
        >
          <i className="bi bi-instagram"></i> Follow on Instagram
        </Button>
      </div>
    </Container>
  );
}
