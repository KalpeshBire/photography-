import { Button } from 'react-bootstrap';

export default function WhatsAppButton() {
  return (
    <Button
      href="https://wa.me/918668704570"
      target="_blank"
      variant="success"
      className="position-fixed bottom-0 end-0 m-4 rounded-circle shadow-lg d-flex align-items-center justify-content-center"
      style={{ zIndex: 1000, width: "60px", height: "60px" }}
    >
      <i className="bi bi-whatsapp fs-3"></i>
    </Button>
  );
}
