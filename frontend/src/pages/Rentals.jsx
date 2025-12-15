import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Rentals() {
  const [rentals, setRentals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/rentals");
        // Filter only active items for public view
        const activeRentals = res.data.filter(item => item.active);
        setRentals(activeRentals);
      } catch (error) {
        console.error("Error fetching rentals:", error);
      }
    };
    fetchRentals();
  }, []);

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">Equipment Rentals</h2>
      <Row>
        {rentals.map((item) => (
          <Col md={6} lg={4} key={item._id} className="mb-4">
            <Card className="h-100 shadow-sm border-0">
               <div className="p-3">
                 <Card.Img 
                   variant="top" 
                   src={item.image?.url ? (item.image.url.startsWith('http') ? item.image.url : `http://localhost:5000/${item.image.url}`) : "https://via.placeholder.com/300"} 
                   style={{ height: "200px", objectFit: "cover" }}
                   className="rounded border border-secondary"
                 />
               </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold">{item.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{item.type}</Card.Subtitle>
                <Card.Text style={{ flexGrow: 1 }}>
                  {item.specs}
                </Card.Text>
                 <div className="mt-auto">
                    <h5 className="text-success">₹{item.pricePerDay} <span className="text-muted fs-6 fw-normal">/ day</span></h5>
                     <Button 
                      variant="success"
                      className="w-100 mt-2"
                      onClick={() => navigate("/contact")}
                    >
                      Book Now
                    </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
         {rentals.length === 0 && (
            <Col className="text-center">
                <p>No rental equipment available. <a href="/admin/rentals">Add items in admin panel</a>.</p>
            </Col>
        )}
      </Row>
    </Container>
  );
}
