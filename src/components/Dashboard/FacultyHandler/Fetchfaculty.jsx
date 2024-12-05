import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Alert, Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { BsPencil, BsTrash } from "react-icons/bs";

const FetchFaculty = () => {
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageVariant, setMessageVariant] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    branch: '',
    subject: ''
  });
  const [isRequestPending, setIsRequestPending] = useState(false); // Track if an update request is already pending

  // Fetch faculties
  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await axios.get("http://localhost:5000/api/hod/getFaculty", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFacultyMembers(response.data.facultyMembers);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to fetch faculty');
      setMessageVariant('danger');
    } finally {
      setLoading(false);
    }
  };

  // Handle faculty update modal
  const handleUpdate = (faculty) => {
    setSelectedFaculty(faculty);
    setFormData({
      name: faculty.name,
      branch: faculty.branch,
      subject: faculty.subject
    });
    setShowModal(true);
  };

  // Submit update form
  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (isRequestPending) {
      setMessage("Update request is already in progress.");
      setMessageVariant('danger');
      return;
    }
  
    setIsRequestPending(true); // Set the request pending state
  
    const token = sessionStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to update faculty');
      setMessageVariant('danger');
      setIsRequestPending(false);
      return;
    }
  
    const updatedFacultyData = {
      name: formData.name,
      facultyUsername: selectedFaculty.username, // Preserving username for update
      password: formData.password, // Assuming password is part of the form data
      branch: formData.branch,
      subject: formData.subject,
      action: 'update'
    };
  
    try {
      const response = await axios.put(`http://localhost:5000/api/hod/update/${selectedFaculty.id}`, updatedFacultyData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(response.data.message);
      setMessageVariant('success');
      setShowModal(false);
      fetchFaculties(); // Refresh the faculty list
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update faculty');
      setMessageVariant('danger');
    } finally {
      setIsRequestPending(false);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle delete request
  const handleDelete = async (facultyId) => {
    const token = sessionStorage.getItem('token');
  
    if (!token) {
      setMessage('You must be logged in to delete faculty');
      setMessageVariant('danger');
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:5000/api/hod/remove/${facultyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage(response.data.message);
      setMessageVariant('success');
      setShowDeleteModal(false); // Close the modal after deletion
      fetchFaculties(); // Refresh the faculty list
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete faculty');
      setMessageVariant('danger');
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  return (
    <Container>
      <h1 className="text-center mt-5">Faculty List</h1>
      
      {message && <Alert variant={messageVariant}>{message}</Alert>}
      
      {loading && <Spinner animation="border" variant="primary" className="d-block mx-auto mt-3" />}
      
      <Row className="mt-4">
        {facultyMembers.map(faculty => (
          <Col key={faculty.id} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{faculty.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{faculty.branch}</Card.Subtitle>
                <Card.Text>
                  <strong>Username:</strong> {faculty.username}<br />
                  <strong>Subject:</strong> {faculty.subject}
                </Card.Text>
                <Button variant="warning" className="me-2" onClick={() => handleUpdate(faculty)}>
                  <BsPencil /> Update
                </Button>
                <Button variant="danger" onClick={() => { setSelectedFaculty(faculty); setShowDeleteModal(true); }}>
                  <BsTrash /> Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for updating faculty */}
      {showModal && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Faculty</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmitUpdate}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              {/* Removed the Username field */}
              <Form.Group>
                <Form.Label>Branch</Form.Label>
                <Form.Control
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Button type="submit" variant="primary" className="mt-3" disabled={isRequestPending}>
                {isRequestPending ? 'Updating...' : 'Update Faculty'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this faculty member?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => handleDelete(selectedFaculty.id)}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default FetchFaculty;
