import { Container, Row, Col, Image } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get("/api/gallery");
        // Filter only active items for public view
        const activeItems = res.data.filter(item => item.isActive);
        setGalleryItems(activeItems);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      }
    };
    fetchGallery();
  }, []);

  return (
    <Container className="py-5">
      <Row>
        {galleryItems.map((item) => (
          <Col xs={12} sm={6} md={4} lg={3} key={item._id} className="mb-4">
            <div className="p-2 border rounded shadow-sm">
              <Image 
                src={item.media?.url?.startsWith('http') ? item.media.url : `/${item.media?.url}`} 
                alt={item.title} 
                fluid 
                className="rounded border border-secondary"
                style={{ height: '250px', objectFit: 'cover', width: '100%' }}
              />
              <div className="mt-2 text-center fw-bold">{item.title}</div>
              <div className="text-center text-muted small">{item.category}</div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
