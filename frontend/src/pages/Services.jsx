import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Services() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("/api/services");
        // Filter only active items for public view
        const activeServices = res.data.filter(item => item.active);
        setServices(activeServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">Our Services</h2>
      <Row>
        {services.map((service) => (
          <Col xs={12} sm={6} md={6} lg={4} key={service._id} className="mb-4">
            <Card className="h-100 shadow-sm border-0">
              <div className="p-3">
                 <Card.Img 
                    variant="top" 
                    src={service.image?.url ? (service.image.url.startsWith('http') ? service.image.url : `/${service.image.url}`) : "https://via.placeholder.com/300"} 
                    style={{ height: "200px", objectFit: "cover" }}
                    className="rounded border border-secondary"
                 />
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold">{service.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{service.serviceType}</Card.Subtitle>
                <Card.Text style={{ flexGrow: 1 }}>
                  {service.description}
                </Card.Text>
                <div className="mt-auto">
                    <h5 className="text-primary">
                        {service.pricing?.basePrice ? `₹${service.pricing.basePrice}` : "Contact for Price"} 
                        <span className="fs-6 text-muted fw-normal"> {service.pricing?.type === 'custom' ? '' : `/ ${service.pricing?.type}`}</span>
                    </h5>
                    <Button variant="dark" className="w-100 mt-2" onClick={() => navigate("/contact")}>Book Now</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
        {services.length === 0 && (
            <Col className="text-center">
                <p>No services found. <a href="/admin/services">Add services in admin panel</a>.</p>
            </Col>
        )}
      </Row>
    </Container>
  );
}
