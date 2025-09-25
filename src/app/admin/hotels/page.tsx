"use client";

import React, { useState, useEffect, FormEvent } from 'react';

// This is the data structure for your database model
interface Hotel {
  _id?: string;
  name: string;
  type: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  description: string;
}

// This is the data structure for your form's state
// Note that images is a string, and numbers can be strings for the input fields
interface HotelFormData {
    name: string;
    type: string;
    location: string;
    price: number | string;
    rating: number | string;
    reviews: number | string;
    images: string;
    description: string;
}

const HotelAdminPage = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isEditing, setIsEditing] = useState<Hotel | null>(null);

  // The initial state for the form
  const initialFormData: HotelFormData = {
    name: '',
    type: '',
    location: '',
    price: '',
    rating: '',
    reviews: '',
    images: '', // Correctly initialized as a string
    description: ''
  };

  const [formData, setFormData] = useState<HotelFormData>(initialFormData);
  
  const API_URL = 'http://localhost:5000/api/accommodations';

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        // The GET request for the admin panel should fetch all hotels without filters
        const response = await fetch(API_URL); 
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setHotels(data);
      } catch (error) {
        console.error("Failed to fetch hotels", error);
      }
    };
    fetchHotels();
  }, [API_URL]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // This now works correctly for all fields, including images
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Prepare payload by converting types before sending to the backend
    const payload = {
        ...formData,
        price: Number(formData.price),
        rating: Number(formData.rating),
        reviews: Number(formData.reviews),
        images: formData.images.split(',').map(url => url.trim()).filter(url => url) // Convert string to string[]
    };
    
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${API_URL}/admin/${isEditing._id}` : `${API_URL}/admin`;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save hotel');
      }

      const savedHotel = await response.json();
      
      if (isEditing) {
        setHotels(hotels.map(h => h._id === savedHotel._id ? savedHotel : h));
      } else {
        setHotels([...hotels, savedHotel]);
      }
      
      resetForm();

    } catch (error) {
      console.error("Error saving hotel:", error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = (hotel: Hotel) => {
    setIsEditing(hotel);
    // Convert the hotel data to the form's data structure
    setFormData({
        name: hotel.name,
        type: hotel.type,
        location: hotel.location,
        price: String(hotel.price),
        rating: String(hotel.rating),
        reviews: String(hotel.reviews),
        description: hotel.description,
        images: hotel.images.join(', ') // Convert string[] to a single string for the input
    });
  };

  const handleDelete = async (id?: string) => {
    if (!id || !window.confirm('Are you sure you want to delete this hotel?')) return;
    
    try {
      await fetch(`${API_URL}/admin/${id}`, { method: 'DELETE' });
      setHotels(hotels.filter(h => h._id !== id));
    } catch (error) {
      console.error("Failed to delete hotel", error);
    }
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormData(initialFormData);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '1200px', margin: 'auto', color: '#111827' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Hotel Admin Panel</h1>
      
      <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>{isEditing ? `Editing: ${isEditing.name}` : 'Add New Hotel'}</h2>
        <form onSubmit={handleFormSubmit} style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Form fields */}
          <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Hotel Name" required style={inputStyle} />
          <input name="type" value={formData.type} onChange={handleInputChange} placeholder="Type (e.g., Luxury Villa)" required style={inputStyle} />
          <input name="location" value={formData.location} onChange={handleInputChange} placeholder="Location (e.g., Kandy)" required style={inputStyle} />
          <input name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="Price per night" required style={inputStyle} />
          <input name="rating" type="number" step="0.1" value={formData.rating} onChange={handleInputChange} placeholder="Rating (e.g., 4.9)" required style={inputStyle} />
          <input name="reviews" type="number" value={formData.reviews} onChange={handleInputChange} placeholder="Number of Reviews" required style={inputStyle} />
          <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" style={{ ...inputStyle, gridColumn: 'span 2' }} />
          <input name="images" value={formData.images} onChange={handleInputChange} placeholder="Image URLs (comma-separated)" style={{ ...inputStyle, gridColumn: 'span 2' }} />
          
          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" style={buttonStyle('primary')}>{isEditing ? 'Update Hotel' : 'Save Hotel'}</button>
            {isEditing && <button type="button" onClick={resetForm} style={buttonStyle('secondary')}>Cancel Edit</button>}
          </div>
        </form>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Existing Hotels ({hotels.length})</h2>
        <div style={{ marginTop: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
          {hotels.map(hotel => (
            <div key={hotel._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
              <div>
                <p style={{ fontWeight: '600' }}>{hotel.name} <span style={{ color: '#6b7280', fontWeight: 'normal' }}>({hotel.location})</span></p>
                <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>LKR {hotel.price.toLocaleString()} - {hotel.rating} ★</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(hotel)} style={buttonStyle('secondary')}>Edit</button>
                <button onClick={() => handleDelete(hotel._id)} style={buttonStyle('danger')}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper for styles to keep component clean
const inputStyle: React.CSSProperties = { padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px', width: '100%' };
const buttonStyle = (type: 'primary' | 'secondary' | 'danger'): React.CSSProperties => ({
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: '1px solid transparent',
    cursor: 'pointer',
    fontWeight: 600,
    color: type === 'primary' ? 'white' : type === 'danger' ? '#991b1b' : '#1f2937',
    backgroundColor: type === 'primary' ? '#1f2937' : type === 'danger' ? '#fee2e2' : '#f3f4f6',
});

export default HotelAdminPage;