import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <Button variant="danger" onClick={handleLogout}>Logout</Button>
      </div>
      
      <Row>
        <Col md={4} className="mb-4">
          <Card className="shadow-sm text-center p-4">
            <h4>Manage Gallery</h4>
            <p>Upload new photos and videos</p>
            <Button variant="primary" onClick={() => navigate("/admin/gallery")}>Go to Gallery</Button>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="shadow-sm text-center p-4">
            <h4>Manage Services</h4>
            <p>Update service details and prices</p>
            <Button variant="primary" onClick={() => navigate("/admin/services")}>Go to Services</Button>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="shadow-sm text-center p-4">
            <h4>Manage Rentals</h4>
            <p>Update equipment rental availability</p>
            <Button variant="primary" onClick={() => navigate("/admin/rentals")}>Go to Rentals</Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
