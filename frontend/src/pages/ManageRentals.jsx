import { useState, useEffect } from "react";
import { Container, Form, Button, Table, Image, Modal, Badge, Row, Col } from "react-bootstrap";
import axios from "axios";

export default function ManageRentals() {
  const [rentals, setRentals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    type: "Camera",
    specs: "",
    pricePerDay: "",
    quantity: 1,
    active: true,
    file: null
  });

  // Fetch Rentals
  const fetchRentals = async () => {
    try {
      const res = await axios.get("/api/rentals");
      setRentals(res.data);
    } catch (error) {
      console.error("Error fetching rentals:", error);
    }
  };

  useEffect(() => {
    fetchRentals();
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
    data.append("type", formData.type);
    data.append("specs", formData.specs);
    data.append("pricePerDay", formData.pricePerDay);
    data.append("quantity", formData.quantity);
    data.append("active", formData.active);
    if (formData.file) data.append("image", formData.file);

    try {
      if (editingItem) {
        // Edit Mode (Update Details)
        await axios.put(`/api/rentals/update/${editingItem._id}`, {
            name: formData.name,
            type: formData.type,
            specs: formData.specs,
            pricePerDay: formData.pricePerDay,
            quantity: formData.quantity,
            active: formData.active
        });
        
        // If file is selected in edit mode, replace image
        if (formData.file) {
             const replaceData = new FormData();
             replaceData.append("image", formData.file);
             await axios.put(`/api/rentals/replace/${editingItem._id}`, replaceData);
        }

      } else {
        // Create Mode
        await axios.post("/api/rentals/create", data);
      }
      
      setShowModal(false);
      setEditingItem(null);
      resetForm();
      fetchRentals();
    } catch (error) {
      console.error("Error saving rental:", error.response?.data || error.message);
      alert(`Failed to save rental: ${error.response?.data?.error || error.message}`);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this rental item?")) {
      try {
        await axios.delete(`/api/rentals/delete/${id}`);
        fetchRentals();
      } catch (error) {
        console.error("Error deleting rental:", error);
      }
    }
  };

  // Open Edit Modal
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      type: item.type,
      specs: item.specs || "",
      pricePerDay: item.pricePerDay,
      quantity: item.quantity,
      active: item.active,
      file: null 
    });
    setShowModal(true);
  };

  // Reset Form
  const resetForm = () => {
     setFormData({
        name: "",
        type: "Camera",
        specs: "",
        pricePerDay: "",
        quantity: 1,
        active: true,
        file: null
      });
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Rentals</h2>
        <Button onClick={() => { setEditingItem(null); resetForm(); setShowModal(true); }}>
          + Add New Rental
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Type</th>
            <th>Price / Day</th>
            <th>Qty</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rentals.map((item) => (
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
              <td>{item.type}</td>
              <td>₹{item.pricePerDay}</td>
              <td>{item.quantity}</td>
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
          <Modal.Title>{editingItem ? "Edit Rental" : "Add New Rental"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Item Name</Form.Label>
              <Form.Control 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select name="type" value={formData.type} onChange={handleChange}>
                <option value="Camera">Camera</option>
                <option value="Drone">Drone</option>
                <option value="LED">LED</option>
                <option value="Lens">Lens</option>
                <option value="Lighting">Lighting</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Specifications / Details</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                name="specs" 
                value={formData.specs} 
                onChange={handleChange} 
              />
            </Form.Group>

            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Price Per Day (₹)</Form.Label>
                        <Form.Control 
                            type="number" 
                            name="pricePerDay" 
                            value={formData.pricePerDay} 
                            onChange={handleChange} 
                            required
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control 
                            type="number" 
                            name="quantity" 
                            value={formData.quantity} 
                            onChange={handleChange} 
                            required
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
                label="Active / Available" 
                name="active" 
                checked={formData.active} 
                onChange={handleChange} 
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              {editingItem ? "Save Changes" : "Create Rental"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
