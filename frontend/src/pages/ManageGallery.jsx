import { useState, useEffect } from "react";
import { Container, Form, Button, Table, Image, Modal, Badge } from "react-bootstrap";
import axios from "axios";

export default function ManageGallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Wedding",
    mediaType: "image",
    price: "",
    tags: "",
    isActive: true,
    file: null
  });

  // Fetch Gallery Items
  const fetchGallery = async () => {
    try {
      const res = await axios.get("/api/gallery");
      setGalleryItems(res.data);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    }
  };

  useEffect(() => {
    fetchGallery();
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
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("mediaType", formData.mediaType);
    data.append("price", formData.price);
    data.append("tags", formData.tags);
    data.append("isActive", formData.isActive);
    if (formData.file) data.append("media", formData.file);

    try {
      if (editingItem) {
        // Edit Mode (Update Details)
        await axios.put(`/api/gallery/update/${editingItem._id}`, {
            title: formData.title,
            category: formData.category,
            price: formData.price,
            tags: formData.tags,
            isActive: formData.isActive
        });
        
        // If file is selected in edit mode, it's a replace operation
        if (formData.file) {
             const replaceData = new FormData();
             replaceData.append("media", formData.file);
             await axios.put(`/api/gallery/replace/${editingItem._id}`, replaceData);
        }

      } else {
        // Create Mode
        await axios.post("/api/gallery/create", data);
      }
      
      setShowModal(false);
      setEditingItem(null);
      resetForm();
      fetchGallery();
    } catch (error) {
      console.error("Error saving media:", error.response?.data || error.message);
      alert(`Failed to save media: ${error.response?.data?.error || error.message}`);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`/api/gallery/delete/${id}`);
        fetchGallery();
      } catch (error) {
        console.error("Error deleting media:", error);
      }
    }
  };

  // Open Edit Modal
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      mediaType: item.mediaType,
      price: item.price || "",
      tags: item.tags.join(","),
      isActive: item.isActive,
      file: null // Don't prefill file input
    });
    setShowModal(true);
  };

  // Reset Form
  const resetForm = () => {
     setFormData({
        title: "",
        category: "Wedding",
        mediaType: "image",
        price: "",
        tags: "",
        isActive: true,
        file: null
      });
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Gallery</h2>
        <Button onClick={() => { setEditingItem(null); resetForm(); setShowModal(true); }}>
          + Upload New Media
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {galleryItems.map((item) => (
            <tr key={item._id}>
              <td>
                {item.media?.url && (
                    <Image 
                        src={item.media.url.startsWith('http') ? item.media.url : `/${item.media.url}`} 
                        thumbnail 
                        style={{ width: "80px", height: "80px", objectFit: "cover" }} 
                    />
                )}
              </td>
              <td>{item.title}</td>
              <td>{item.category}</td>
              <td>₹{item.price}</td>
              <td>
                <Badge bg={item.isActive ? "success" : "secondary"}>
                  {item.isActive ? "Active" : "Hidden"}
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
          <Modal.Title>{editingItem ? "Edit Media" : "Upload New Media"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select name="category" value={formData.category} onChange={handleChange}>
                <option value="Wedding">Wedding</option>
                <option value="Drone">Drone</option>
                <option value="Event">Event</option>
                <option value="LED Screen">LED Screen</option>
                <option value="Camera Rental">Camera Rental</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Media Type</Form.Label>
                <div>
                    <Form.Check
                        inline
                        label="Image"
                        name="mediaType"
                        type="radio"
                        value="image"
                        checked={formData.mediaType === "image"}
                        onChange={handleChange}
                    />
                    <Form.Check
                        inline
                        label="Video"
                        name="mediaType"
                        type="radio"
                        value="video"
                        checked={formData.mediaType === "video"}
                        onChange={handleChange}
                    />
                </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price (₹)</Form.Label>
              <Form.Control 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags (comma separated)</Form.Label>
              <Form.Control 
                type="text" 
                name="tags" 
                value={formData.tags} 
                onChange={handleChange} 
                placeholder="wedding, outdoor, candid"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{editingItem ? "Replace Media (Optional)" : "Upload File"}</Form.Label>
              <Form.Control 
                type="file" 
                name="media" 
                onChange={handleChange} 
                required={!editingItem} // Required only for new uploads
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox" 
                label="Active (Visible on website)" 
                name="isActive" 
                checked={formData.isActive} 
                onChange={handleChange} 
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              {editingItem ? "Save Changes" : "Upload"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
