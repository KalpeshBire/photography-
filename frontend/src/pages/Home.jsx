import { Container, Button } from 'react-bootstrap';
import WhatsAppButton from "../components/WhatsAppButton";
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="text-center py-5">
      <Container>
        <h1 className="display-4 fw-bold mb-4">
          NEW CLASSIC PHOTOGRAPHY
        </h1>
        <p className="lead mb-5">Make your events unforgettable</p>
        <Button 
          as={Link} 
          to="/services" 
          variant="dark" 
          size="lg" 
          className="px-5 py-3"
        >
          View Services
        </Button>
        <WhatsAppButton />
      </Container>
    </section>
  );
}
