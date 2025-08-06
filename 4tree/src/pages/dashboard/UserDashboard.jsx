import React, { useState, useEffect } from 'react';
import './UserDashboard.css';
import { useParams } from "react-router-dom";


const Userdashboard = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('newDonation');
  const [donationIdCounter, setDonationIdCounter] = useState(4);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [selectedDonationItems, setSelectedDonationItems] = useState([]);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);


  if (error) {
    return <div>Error: {error} ahh</div>;
  }

  if (!userData) {
    return <div>No user data found</div>;
  }


  const categories = [
    { id: "Home Essentials", label: "Home Essentials" },
    { id: "Furniture", label: "Furniture" },
    { id: "Clothing & Footwear", label: "Clothing & Footwear" },
    { id: "Hygiene Essentials", label: "Hygiene Essentials" },
    { id: "Education Supplies", label: "Education Supplies" },
    { id: "Childcare and Toys", label: "Childcare and Toys" },
    { id: "Medical Supplies", label: "Medical Supplies" },
    { id: "Bedding & Shelter", label: "Bedding & Shelter" }
  ];

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      alert('Thank you for your generous contributions! See you soon! 🌟');
      console.log('User logged out');
    }
  };

  const switchTab = (tabName) => {
    setCurrentTab(tabName);
  }; const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      alert('Only image files are allowed!');
    }
    setUploadedPhotos(prev => [...prev, ...validFiles]);
  };

  const removePhoto = (index) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? []  // Deselect if clicking the same category
        : [category]  // Select only this category
    );
  };

  const submitDonation = async (event) => {
    event.preventDefault();

    // Form validation
    const formData = new FormData(event.target);
    const title = formData.get('title');
    const description = formData.get('description');
    const quantity = formData.get('quantity');
    const contactMethod = formData.get('contactMethod');
    const availability = formData.get('availability');

    if (!title || !description || !quantity) {
      alert('Please fill in all required fields!');
      return;
    }

    if (uploadedPhotos.length === 0) {
      alert('Please upload at least one photo!');
      return;
    }

    if (selectedCategories.length === 0) {
      alert('Please select a category!');
      return;
    }

    try {
      // Create FormData for file upload
      const apiFormData = new FormData();

      // Append files
      uploadedPhotos.forEach((file) => {
        apiFormData.append('photos', file);
      });

      // Append other form data
      apiFormData.append('title', title);
      apiFormData.append('description', description);
      apiFormData.append('quantity', quantity);
      apiFormData.append('contact_method', contactMethod);
      apiFormData.append('availability', availability);
      apiFormData.append('category', selectedCategories[0]); // Single category selection

      // Get CSRF token from cookies
      const csrfToken = getCookie('csrftoken');

      const response = await fetch('http://localhost:8000/api/userfuncs/donate', {
        method: 'POST',
        headers: {
          'X-CSRFToken': csrfToken,
        },
        body: apiFormData,
        credentials: 'include' // Include cookies for session/auth
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit donation');
      }

      const data = await response.json();

      // Handle successful submission
      alert('Donation submitted successfully!');

      // Reset form
      event.target.reset();
      setUploadedPhotos([]);
      setSelectedCategories([]);

      // Optionally redirect or update UI
      // window.location.href = '/donations/';

    } catch (error) {
      console.error('Submission error:', error);
      alert(`Error: ${error.message}`);
    }
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'orange';
      case 'Accepted': return 'green';
      case 'Rejected': return 'red';
      default: return 'gray';
    }
  };

  const openDonationModal = (requestId) => {
    const request = ngoRequests.find(req => req.id === requestId);
    setCurrentRequest(request);
    setIsDonationModalOpen(true);
    setSelectedDonationItems([]);
  };

  const closeDonationModal = () => {
    setIsDonationModalOpen(false);
    setCurrentRequest(null);
    setSelectedDonationItems([]);
  };

  const toggleDonationSelection = (donationId) => {
    setSelectedDonationItems(prev =>
      prev.includes(donationId)
        ? prev.filter(id => id !== donationId)
        : [...prev, donationId]
    );
  };

  const confirmDonation = () => {
    if (selectedDonationItems.length === 0) {
      alert('Please select at least one item to donate!');
      return;
    }

    alert(`Thank you! Your donation has been confirmed for ${currentRequest.ngoName}. They will contact you soon with pickup/drop-off details. 🎉`);
    closeDonationModal();
  };

  const totalDonations = donations.length;
  const pendingApproval = donations.filter(d => d.status === 'Pending').length;
  const acceptedDonations = donations.filter(d => d.status === 'Accepted').length;
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const approvedDonations = donations.filter(donation =>
    donation.status === 'Accepted' &&
    currentRequest && donation.categories.some(category => currentRequest.items.includes(category))
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown-container')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileDropdownOpen]);

  return (
    <div className="app-container">
      {/* Background decorative elements */}
      <div className="background-decorations">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-inner">
            {/* Logo */}
            <div className="logo-section">
              <div className="logo-container">
                <div className="logo-icon">
                  <svg className="heart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </div>
                <div className="logo-text">
                  <span className="logo-title">EcoConnect</span>
                  <span className="logo-subtitle">Donor Portal</span>
                </div>
              </div>
            </div>

            {/* Notifications & Profile */}
            <div className="nav-actions">
              {/* Notifications Bell */}
              <div className="notification-bell">
                <button className="bell-button">
                  <svg className="bell-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM11 19H6.5a2.5 2.5 0 010-5H11m0 5v-5m0 5h5m-5-5V9a3 3 0 116 0v5m-6 0h6"></path>
                  </svg>
                  <span className="notification-badge">{unreadNotifications}</span>
                </button>
              </div>

              {/* Profile Dropdown */}
              <div className="profile-dropdown-container">
                <button onClick={toggleProfileDropdown} className="profile-button">
                  <svg className="profile-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-content">
                      <a href="#" className="dropdown-item">
                        <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Help & Support
                      </a>
                      <hr className="dropdown-divider" />
                      <button onClick={handleLogout} className="dropdown-item logout-item">
                        <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome back, {userData.username}! 🌟</h1>
          <p className="welcome-subtitle">Thank you for making a difference in your community</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {/* Total Donations */}
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Total Donations</p>
                <p className="stat-value">{totalDonations}</p>
                <p className="stat-description green">Items donated</p>
              </div>
              <div className="stat-icon green">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Pending Approval */}
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Pending Approval</p>
                <p className="stat-value">{pendingApproval}</p>
                <p className="stat-description orange">Under review</p>
              </div>
              <div className="stat-icon orange">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Accepted Donations */}
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Accepted Donations</p>
                <p className="stat-value">{acceptedDonations}</p>
                <p className="stat-description green">Approved items</p>
              </div>
              <div className="stat-icon green">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* People Helped */}
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">People Helped</p>
                <p className="stat-value">47</p>
                <p className="stat-description purple">Lives impacted</p>
              </div>
              <div className="stat-icon purple">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Donation Management Section */}
        <div className="management-section">
          <h2 className="section-title">Donation Management</h2>

          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              onClick={() => switchTab('newDonation')}
              className={`tab-button ${currentTab === 'newDonation' ? 'active' : ''}`}
            >
              New Donation
            </button>
            <button
              onClick={() => switchTab('myDonations')}
              className={`tab-button ${currentTab === 'myDonations' ? 'active' : ''}`}
            >
              My Donations
            </button>
            <button
              onClick={() => switchTab('requests')}
              className={`tab-button ${currentTab === 'requests' ? 'active' : ''}`}
            >
              Requests
            </button>
            <button
              onClick={() => switchTab('notifications')}
              className={`tab-button ${currentTab === 'notifications' ? 'active' : ''}`}
            >
              Notifications
            </button>
          </div>

          {/* New Donation Tab */}
          {currentTab === 'newDonation' && (
            <div className="tab-content">
              <div className="form-container">
                <h3 className="form-title">Create New Donation Request</h3>
                <form onSubmit={submitDonation} className="donation-form">

                  {/* Title */}
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <textarea
                      name="title"
                      rows="4"
                      className="form-textarea"
                      placeholder="Title of the Donation"
                    ></textarea>
                  </div>

                  {/* Photo Upload Section */}
                  <div className="form-group">
                    <label className="form-label">Upload Photos of Items</label>
                    <div className="upload-area">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="file-input"
                        id="fileInput"
                      />
                      <label htmlFor="fileInput" className="upload-label">
                        <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p className="upload-text">Drag and drop photos here, or click to select</p>
                        <p className="upload-subtext">Support for multiple images (JPG, PNG, GIF)</p>
                      </label>
                    </div>

                    {/* Photo Previews */}
                    {uploadedPhotos.length > 0 && (
                      <div className="photo-preview-grid">
                        {uploadedPhotos.map((photo, index) => (
                          <div key={index} className="photo-preview">
                            <img src={URL.createObjectURL(photo)} alt="Preview" className="preview-image" />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="remove-photo-btn"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category Selection */}
                  <div className="form-group">
                    <label className="form-label">Select Categories</label>
                    <div className="category-grid">
                      {categories.map(category => (
                        <div
                          key={category.id}
                          onClick={() => toggleCategory(category.id)}
                          className={`category-chip ${selectedCategories.includes(category.id) ? 'selected' : ''}`}
                        >
                          {category.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="form-row">

                    <div className="form-group">
                      <label className="form-label">Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        min="1"
                        className="form-input"
                        placeholder="Number of items"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      rows="4"
                      className="form-textarea"
                      placeholder="Describe the items, their condition, and any special notes..."
                    ></textarea>
                  </div>

                  {/* Contact Information */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Preferred Contact Method</label>
                      <select name="contactMethod" className="form-select">
                        <option value="Email">Email</option>
                        <option value="Phone">Phone</option>
                        <option value="Both">Both</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Availability</label>
                      <select name="availability" className="form-select">
                        <option value="Weekdays">Weekdays</option>
                        <option value="Weekends">Weekends</option>
                        <option value="Anytime">Anytime</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="submit-btn">
                    Submit Donation Request
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* My Donations Tab */}
          {currentTab === 'myDonations' && (
            <div className="tab-content">
              <div className="donations-list">
                {donations.length === 0 ? (
                  <div className="empty-state">
                    <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="empty-text">No donations found</p>
                  </div>
                ) : (
                  donations.map(donation => (
                    <div key={donation.id} className="donation-card">
                      <div className="donation-header">
                        <div className="donation-info">
                          <div className="donation-photos">
                            {donation.photos.map((photo, index) => (
                              <span key={index} className="photo-emoji">{photo}</span>
                            ))}
                          </div>
                          <h3 className="donation-title">{donation.categories.join(', ')}</h3>
                          <p className="donation-details">Quantity: {donation.quantity} • Condition: {donation.condition}</p>
                          <p className="donation-date">Submitted on {donation.submissionDate}</p>
                        </div>
                        <span className={`status-badge ${getStatusColor(donation.status)}`}>
                          {donation.status}
                        </span>
                      </div>
                      <p className="donation-description">{donation.description}</p>
                      {donation.status === 'Accepted' && donation.dropOffLocation && (
                        <div className="success-info">
                          <p className="info-title">Drop-off Location:</p>
                          <p className="info-text">{donation.dropOffLocation}</p>
                        </div>
                      )}
                      {donation.status === 'Rejected' && donation.rejectionReason && (
                        <div className="error-info">
                          <p className="info-title">Rejection Reason:</p>
                          <p className="info-text">{donation.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Requests Tab */}
          {currentTab === 'requests' && (
            <div className="tab-content">
              <div className="requests-list">
                {ngoRequests.length === 0 ? (
                  <div className="empty-state">
                    <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <p className="empty-text">No requests found</p>
                  </div>
                ) : (
                  ngoRequests.map(request => (
                    <div key={request.id} className="request-card">
                      <div className="request-header">
                        <div className="request-info">
                          <h3 className="request-title">{request.ngoName}</h3>
                          <div className="request-meta">
                            <span className={`priority-badge ${request.urgency.toLowerCase()}`}>
                              {request.urgency} Priority
                            </span>
                            <span className="location-text">📍 {request.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="request-items">
                        <h4 className="items-title">Items Needed:</h4>
                        <div className="items-list">
                          {request.items.map(item => (
                            <span key={item} className="item-tag">
                              {item} ({request.quantities[item]} needed)
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="request-description">{request.description}</p>

                      <div className="request-footer">
                        <div className="contact-info">
                          <p><strong>Contact:</strong> {request.contactPerson}</p>
                          <p><strong>Phone:</strong> {request.phone}</p>
                        </div>
                        <button
                          onClick={() => openDonationModal(request.id)}
                          className="donate-btn"
                        >
                          Donate Now
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {currentTab === 'notifications' && (
            <div className="tab-content">
              <div className="notifications-list">
                {notifications.length === 0 ? (
                  <div className="empty-state">
                    <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM11 19H6.5a2.5 2.5 0 010-5H11m0 5v-5m0 5h5m-5-5V9a3 3 0 116 0v5m-6 0h6"></path>
                    </svg>
                    <p className="empty-text">No notifications found</p>
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div key={notification.id} className={`notification-card ${!notification.read ? 'unread' : ''}`}>
                      <div className="notification-header">
                        <h3 className="notification-title">{notification.title}</h3>
                        <span className={`notification-type ${notification.type}`}>
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                        </span>
                      </div>
                      <p className="notification-message">{notification.message}</p>
                      <p className="notification-date">{notification.date}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Donation Modal */}
      {isDonationModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 className="modal-title">Donate to NGO</h2>
              <button onClick={closeDonationModal} className="modal-close">
                <svg className="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {currentRequest && (
              <>
                <div className="modal-ngo-info">
                  <h3 className="ngo-name">{currentRequest.ngoName}</h3>
                  <p className="ngo-description">{currentRequest.description}</p>
                  <div className="ngo-items">
                    {currentRequest.items.map(item => (
                      <span key={item} className="ngo-item-tag">
                        {item} ({currentRequest.quantities[item]} needed)
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="available-title">Your Matching Approved Items:</h3>
                <div className="available-items">
                  {approvedDonations.length === 0 ? (
                    <div className="no-items">
                      <p>No matching approved donations found.</p>
                      <p className="no-items-sub">Submit new donations that match the requested categories to help this NGO.</p>
                    </div>
                  ) : (
                    approvedDonations.map(donation => (
                      <div key={donation.id} className="available-item">
                        <div className="item-content">
                          <input
                            type="checkbox"
                            id={`donation-${donation.id}`}
                            className="item-checkbox"
                            onChange={() => toggleDonationSelection(donation.id)}
                            checked={selectedDonationItems.includes(donation.id)}
                          />
                          <div className="item-details">
                            <div className="item-photos">
                              {donation.photos.map((photo, index) => (
                                <span key={index} className="item-photo">{photo}</span>
                              ))}
                            </div>
                            <h4 className="item-title">{donation.categories.join(', ')}</h4>
                            <p className="item-info">Quantity: {donation.quantity} • Condition: {donation.condition}</p>
                            <p className="item-description">{donation.description}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="modal-actions">
                  <button onClick={closeDonationModal} className="cancel-btn">
                    Cancel
                  </button>
                  <button onClick={confirmDonation} className="confirm-btn">
                    Confirm Donation
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Userdashboard;