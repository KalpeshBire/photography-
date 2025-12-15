import { useState, useEffect } from "react";
import { Container, Form, Button, Table, Image, Modal, Badge, Row, Col } from "react-bootstrap";
import axios from "axios";

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    serviceType: "Photography",
    description: "",
    pricing_type: "per day",
    pricing_basePrice: "",
    active: true,
    file: null
  });

  // Fetch Services
  const fetchServices = async () => {
    try {
      const res = await axios.get("/api/services");
      setServices(res.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, file: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle Create/Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("serviceType", formData.serviceType);
    data.append("description", formData.description);
    data.append("pricing_type", formData.pricing_type);
    data.append("pricing_basePrice", formData.pricing_basePrice);
    data.append("active", formData.active);
    if (formData.file) data.append("image", formData.file);

    try {
      if (editingItem) {
        // Edit Mode (Update Details)
        await axios.put(`/api/services/update/${editingItem._id}`, {
            name: formData.name,
            serviceType: formData.serviceType,
            description: formData.description,
            pricing_type: formData.pricing_type,
            pricing_basePrice: formData.pricing_basePrice,
            active: formData.active
        });
        
        // If file is selected in edit mode, replace image
        if (formData.file) {
             const replaceData = new FormData();
             replaceData.append("image", formData.file);
             await axios.put(`/api/services/replace/${editingItem._id}`, replaceData);
        }

      } else {
        // Create Mode
        await axios.post("/api/services/create", data);
      }
      
      setShowModal(false);
      setEditingItem(null);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error("Error saving service:", error.response?.data || error.message);
      alert(`Failed to save service: ${error.response?.data?.error || error.message}`);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(`/api/services/delete/${id}`);
        fetchServices();
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  // Open Edit Modal
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      serviceType: item.serviceType,
      description: item.description || "",
      pricing_type: item.pricing.type,
      pricing_basePrice: item.pricing.basePrice || "",
      active: item.active,
      file: null 
    });
    setShowModal(true);
  };

  // Reset Form
  const resetForm = () => {
     setFormData({
        name: "",
        serviceType: "Photography",
        description: "",
        pricing_type: "per day",
        pricing_basePrice: "",
        active: true,
        file: null
      });
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Services</h2>
        <Button onClick={() => { setEditingItem(null); resetForm(); setShowModal(true); }}>
          + Add New Service
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Type</th>
            <th>Pricing</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((item) => (
            <tr key={item._id}>
              <td>
                {item.image?.url && (
                    <Image 
                        src={item.image.url.startsWith('http') ? item.image.url : `/${item.image.url}`} 
                        thumbnail 
                        style={{ width: "80px", height: "80px", objectFit: "cover" }} 
                    />
                )}
              </td>
              <td>{item.name}</td>
              <td>{item.serviceType}</td>
              <td>{item.pricing?.type} - ₹{item.pricing?.basePrice}</td>
              <td>
                <Badge bg={item.active ? "success" : "secondary"}>
                  {item.active ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td>
                <Button variant="info" size="sm" className="me-2" onClick={() => handleEdit(item)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(item._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Upload/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? "Edit Service" : "Add New Service"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Service Name</Form.Label>
              <Form.Control 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Service Type</Form.Label>
              <Form.Select name="serviceType" value={formData.serviceType} onChange={handleChange}>
                <option value="Photography">Photography</option>
                <option value="Videography">Videography</option>
                <option value="LED">LED</option>
                <option value="Drone">Drone</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
              />
            </Form.Group>

            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Pricing Type</Form.Label>
                        <Form.Select name="pricing_type" value={formData.pricing_type} onChange={handleChange}>
                            <option value="per day">Per Day</option>
                            <option value="per event">Per Event</option>
                            <option value="custom">Custom</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Base Price (₹)</Form.Label>
                        <Form.Control 
                            type="number" 
                            name="pricing_basePrice" 
                            value={formData.pricing_basePrice} 
                            onChange={handleChange} 
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>{editingItem ? "Replace Image (Optional)" : "Upload Image"}</Form.Label>
              <Form.Control 
                type="file" 
                name="image" 
                onChange={handleChange} 
                required={!editingItem} 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox" 
                label="Active" 
                name="active" 
                checked={formData.active} 
                onChange={handleChange} 
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              {editingItem ? "Save Changes" : "Create Service"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
