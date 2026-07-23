import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

const API = 'https://chaitanyaback.onrender.com/api/camping';

const INTEREST_OPTIONS = [
  { value: 'High', label: '🔥 High Interest', badgeClass: 'bg-danger' },
  { value: 'Medium', label: '⚡ Medium Interest', badgeClass: 'bg-warning text-dark' },
  { value: 'Low', label: '🌱 Basic Interest', badgeClass: 'bg-info' }
];

const SOURCE_OPTIONS = ['Online Public Portal', 'Social Media', 'Walk-in', 'Referral', 'Phone', 'Camp Visit', 'Other'];

const CampingEntry = () => {
  const [activeCampings, setActiveCampings] = useState([]);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submittedLead, setSubmittedLead] = useState(null);
  const [showPassModal, setShowPassModal] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    camping_id: '',
    patient_name: '',
    phone: '',
    email: '',
    age: '',
    interest: 'High',
    source: 'Online Public Portal',
    date: today
  });

  useEffect(() => {
    fetchActiveCampings();
  }, []);

  const fetchActiveCampings = async () => {
    try {
      const { data } = await axios.get(`${API}?status=Active`);
      // Double check active filter
      const filtered = data.filter(c => (c.status || 'Active') === 'Active');
      setActiveCampings(filtered);
      if (filtered.length > 0) {
        setFormData(prev => ({ ...prev, camping_id: filtered[0].id.toString() }));
        setSelectedCamp(filtered[0]);
      }
    } catch (err) {
      console.error("Failed to fetch active campings", err);
      swal("Error!", "Could not load active camp events. Please try again later.", "error");
    }
  };

  const handleCampChange = (e) => {
    const campId = e.target.value;
    setFormData(prev => ({ ...prev, camping_id: campId }));
    const camp = activeCampings.find(c => c.id.toString() === campId.toString());
    setSelectedCamp(camp || null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.camping_id) {
      return swal("Required", "Please select an active camp event", "warning");
    }
    if (!formData.patient_name.trim()) {
      return swal("Required", "Please enter full name", "warning");
    }
    if (!formData.phone.trim()) {
      return swal("Required", "Please enter phone number", "warning");
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/leads`, formData);
      const passRef = `CMP-${data.id || Math.floor(1000 + Math.random() * 9000)}`;
      
      const leadRecord = {
        ...formData,
        id: data.id || passRef,
        passRef,
        camping_name: selectedCamp ? selectedCamp.camping_name : 'Camp Event',
        location: selectedCamp ? selectedCamp.location : '',
        organizer: selectedCamp ? selectedCamp.organizer_name : '',
        contact: selectedCamp ? selectedCamp.contact_details : ''
      };

      setSubmittedLead(leadRecord);
      setShowPassModal(true);
      
      swal({
        title: "Registration Successful! 🎉",
        text: `Thank you ${formData.patient_name}! Your camp registration pass has been generated.`,
        icon: "success",
        buttons: {
          confirm: { text: "View Registration Pass 🎫", value: true }
        }
      });

      // Reset form fields except camping selection
      setFormData(prev => ({
        ...prev,
        patient_name: '',
        phone: '',
        email: '',
        age: '',
        interest: 'High',
        date: today
      }));
    } catch (err) {
      swal("Error!", err.response?.data?.error || "Registration failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintPass = () => {
    if (!submittedLead) return;

    const qrData = `PassRef:${submittedLead.passRef}|Event:${submittedLead.camping_name}|Name:${submittedLead.patient_name}|Phone:${submittedLead.phone}|Date:${submittedLead.date}`;

    const printWindow = window.open('', '', 'width=600,height=800');
    printWindow.document.write(`
      <html>
        <head>
          <title>Camp Registration Pass - ${submittedLead.passRef}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              width: 340px;
              margin: 20px auto;
              padding: 20px;
              border: 2px dashed #4F46E5;
              border-radius: 12px;
              text-align: center;
              color: #1F2937;
              background-color: #FAFAFA;
            }
            .header {
              border-bottom: 2px solid #E5E7EB;
              padding-bottom: 12px;
              margin-bottom: 12px;
            }
            .title {
              font-size: 16px;
              font-weight: 800;
              color: #4F46E5;
              margin: 4px 0;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .subtitle {
              font-size: 11px;
              color: #6B7280;
              margin: 0;
            }
            .badge {
              display: inline-block;
              background: #EEF2FF;
              color: #4F46E5;
              padding: 4px 12px;
              border-radius: 20px;
              font-weight: bold;
              font-size: 12px;
              margin: 10px 0;
            }
            .details {
              text-align: left;
              font-size: 13px;
              line-height: 1.6;
              margin: 12px 0;
              background: #FFFFFF;
              padding: 12px;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            }
            .details p {
              margin: 4px 0;
            }
            .qr-code {
              margin: 15px 0 10px 0;
            }
            .footer {
              font-size: 11px;
              color: #9CA3AF;
              border-top: 1px dashed #D1D5DB;
              padding-top: 10px;
              margin-top: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h3 class="title">SRI CHAITANYA MAHAPRABHU MUSEUM</h3>
            <p class="subtitle">Official Camp Registration Pass</p>
          </div>

          <div class="badge">REF #: ${submittedLead.passRef}</div>

          <div class="details">
            <p><b>🏕️ Event:</b> ${submittedLead.camping_name}</p>
            <p><b>📍 Venue:</b> ${submittedLead.location || 'Museum Campus'}</p>
            <p><b>👤 Name:</b> ${submittedLead.patient_name}</p>
            <p><b>📞 Contact:</b> ${submittedLead.phone}</p>
            ${submittedLead.email ? `<p><b>✉️ Email:</b> ${submittedLead.email}</p>` : ''}
            ${submittedLead.age ? `<p><b>🎂 Age:</b> ${submittedLead.age} yrs</p>` : ''}
            <p><b>📅 Preferred Date:</b> ${submittedLead.date}</p>
            <p><b>⭐ Interest Level:</b> ${submittedLead.interest}</p>
          </div>

          <div class="qr-code">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(qrData)}" alt="QR Code" />
          </div>

          <div class="footer">
            <p>Please present this pass or digital screenshot at the camp entry desk.</p>
            <p>🌐 chaitanyamuseum.org | 📞 8617528955</p>
          </div>

          <script>
            window.print();
            window.onafterprint = () => window.close();
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #311042 100%)',
      color: '#F8FAFC',
      padding: '40px 15px',
      fontFamily: "'Outfit', 'Inter', system-ui, -apple-system, sans-serif"
    }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        
        {/* HERO BRANDING HEADER */}
        <div className="text-center mb-5" style={{ animation: 'fadeIn 0.8s ease-in-out' }}>
          <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50px',
            padding: '8px 24px',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.25)'
          }}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>✨</span>
            <span style={{ fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '13px', color: '#A5B4FC' }}>
              Sri Chaitanya Mahaprabhu Museum
            </span>
          </div>

          <h1 style={{
            fontWeight: '900',
            fontSize: 'calc(1.8rem + 1.5vw)',
            background: 'linear-gradient(90deg, #FFFFFF 0%, #C7D2FE 50%, #818CF8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '10px 0',
            letterSpacing: '-0.5px'
          }}>
            Camp Event Public Registration
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '16px', maxWidth: '640px', margin: '0 auto' }}>
            Register online for upcoming medical, spiritual, and community camping events hosted by Sri Chaitanya Mahaprabhu Museum.
          </p>
        </div>

        {/* MAIN CONTAINER GRID */}
        <div className="row g-4 align-items-stretch">
          
          {/* EVENT SUMMARY CARD */}
          <div className="col-lg-5">
            <div style={{
              background: 'rgba(30, 41, 59, 0.7)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '24px',
              padding: '28px',
              height: '100%',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between'
            }}>
              <div>
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h5 style={{ margin: 0, fontWeight: '700', color: '#F1F5F9' }}>
                    🏕️ Select Active Event
                  </h5>
                  <span className="badge bg-success bg-gradient px-3 py-2 rounded-pill" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                    ● LIVE EVENT
                  </span>
                </div>

                {activeCampings.length === 0 ? (
                  <div className="text-center py-5" style={{ color: '#94A3B8' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏕️</div>
                    <h6>No Active Camp Events</h6>
                    <p style={{ fontSize: '13px' }}>Currently there are no active camping events open for public registration.</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '8px', display: 'block' }}>
                        Choose Camping Event *
                      </label>
                      <select
                        className="form-select form-select-lg"
                        style={{
                          background: 'rgba(15, 23, 42, 0.8)',
                          border: '1px solid #475569',
                          color: '#F8FAFC',
                          borderRadius: '14px',
                          fontSize: '15px',
                          padding: '12px 16px'
                        }}
                        value={formData.camping_id}
                        onChange={handleCampChange}
                      >
                        {activeCampings.map(c => (
                          <option key={c.id} value={c.id} style={{ background: '#0F172A', color: '#FFF' }}>
                            {c.camping_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedCamp && (
                      <div style={{
                        background: 'linear-gradient(145deg, rgba(79, 70, 229, 0.15), rgba(124, 58, 237, 0.15))',
                        border: '1px solid rgba(165, 180, 252, 0.2)',
                        borderRadius: '18px',
                        padding: '20px',
                        marginTop: '15px'
                      }}>
                        <h5 style={{ fontWeight: '800', color: '#E0E7FF', marginBottom: '14px' }}>
                          {selectedCamp.camping_name}
                        </h5>

                        <div className="mb-2 d-flex align-items-start gap-2" style={{ fontSize: '14px', color: '#CBD5E1' }}>
                          <span>📍</span>
                          <div>
                            <strong>Location:</strong> {selectedCamp.location || 'Museum Auditorium'}
                          </div>
                        </div>

                        <div className="mb-2 d-flex align-items-start gap-2" style={{ fontSize: '14px', color: '#CBD5E1' }}>
                          <span>📅</span>
                          <div>
                            <strong>Dates:</strong> {selectedCamp.start_date?.split('T')[0]} to {selectedCamp.end_date?.split('T')[0]}
                          </div>
                        </div>

                        <div className="mb-2 d-flex align-items-start gap-2" style={{ fontSize: '14px', color: '#CBD5E1' }}>
                          <span>👤</span>
                          <div>
                            <strong>Organizer:</strong> {selectedCamp.organizer_name}
                          </div>
                        </div>

                        <div className="mb-2 d-flex align-items-start gap-2" style={{ fontSize: '14px', color: '#CBD5E1' }}>
                          <span>📞</span>
                          <div>
                            <strong>Contact:</strong> {selectedCamp.contact_details}
                          </div>
                        </div>

                        {selectedCamp.remarks && (
                          <div className="mt-3 pt-3 border-top border-secondary" style={{ fontSize: '13px', color: '#94A3B8' }}>
                            💬 <em>{selectedCamp.remarks}</em>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="mt-4 pt-3 text-center border-top border-secondary border-opacity-25" style={{ fontSize: '12px', color: '#64748B' }}>
                Protected & Secured by Sri Chaitanya Museum Portal
              </div>
            </div>
          </div>

          {/* PUBLIC FORM CARD */}
          <div className="col-lg-7">
            <div style={{
              background: 'rgba(30, 41, 59, 0.7)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}>
              <h4 style={{ fontWeight: '800', color: '#F8FAFC', marginBottom: '8px' }}>
                📝 Visitor & Participant Registration Form
              </h4>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>
                Fill in your personal details to receive your instant digital entry pass.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  
                  {/* PATIENT/PARTICIPANT NAME */}
                  <div className="col-md-6">
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '6px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="patient_name"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.patient_name}
                      onChange={handleChange}
                      style={{
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid #475569',
                        color: '#F8FAFC',
                        borderRadius: '12px',
                        padding: '12px 14px'
                      }}
                      required
                    />
                  </div>

                  {/* PHONE NUMBER */}
                  <div className="col-md-6">
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '6px' }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      style={{
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid #475569',
                        color: '#F8FAFC',
                        borderRadius: '12px',
                        padding: '12px 14px'
                      }}
                      required
                    />
                  </div>

                  {/* EMAIL */}
                  <div className="col-md-6">
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '6px' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      style={{
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid #475569',
                        color: '#F8FAFC',
                        borderRadius: '12px',
                        padding: '12px 14px'
                      }}
                    />
                  </div>

                  {/* AGE */}
                  <div className="col-md-6">
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '6px' }}>
                      Age (Years)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="age"
                      placeholder="e.g. 28"
                      value={formData.age}
                      onChange={handleChange}
                      min="1"
                      max="120"
                      style={{
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid #475569',
                        color: '#F8FAFC',
                        borderRadius: '12px',
                        padding: '12px 14px'
                      }}
                    />
                  </div>

                  {/* INTEREST LEVEL */}
                  <div className="col-md-6">
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '6px' }}>
                      Interest Level *
                    </label>
                    <select
                      className="form-select"
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      style={{
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid #475569',
                        color: '#F8FAFC',
                        borderRadius: '12px',
                        padding: '12px 14px'
                      }}
                      required
                    >
                      {INTEREST_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value} style={{ background: '#0F172A' }}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* SOURCE */}
                  <div className="col-md-6">
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '6px' }}>
                      Registration Source *
                    </label>
                    <select
                      className="form-select"
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      style={{
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid #475569',
                        color: '#F8FAFC',
                        borderRadius: '12px',
                        padding: '12px 14px'
                      }}
                      required
                    >
                      {SOURCE_OPTIONS.map(s => (
                        <option key={s} value={s} style={{ background: '#0F172A' }}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* PREFERRED DATE */}
                  <div className="col-md-12">
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '6px' }}>
                      Preferred Registration Date *
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      style={{
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid #475569',
                        color: '#F8FAFC',
                        borderRadius: '12px',
                        padding: '12px 14px'
                      }}
                      required
                    />
                  </div>

                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn w-100"
                    disabled={loading || activeCampings.length === 0}
                    style={{
                      background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)',
                      border: 'none',
                      color: '#FFFFFF',
                      fontWeight: '800',
                      fontSize: '16px',
                      padding: '14px',
                      borderRadius: '14px',
                      boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading ? 'Processing Registration...' : '🚀 Submit Camp Registration'}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>

      </div>

      {/* REGISTRATION PASS MODAL */}
      {showPassModal && submittedLead && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '440px' }}>
            <div className="modal-content text-dark" style={{ borderRadius: '24px', overflow: 'hidden', border: 'none' }}>
              <div className="modal-header bg-gradient text-white p-4" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
                <div>
                  <h5 className="modal-title font-weight-bold" style={{ fontWeight: '800' }}>
                    🎫 Camp Registration Pass
                  </h5>
                  <small style={{ opacity: 0.9 }}>Ref: {submittedLead.passRef}</small>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowPassModal(false)}></button>
              </div>

              <div className="modal-body p-4 text-center">
                <h4 style={{ color: '#4F46E5', fontWeight: '800' }}>
                  {submittedLead.camping_name}
                </h4>
                <p className="text-muted" style={{ fontSize: '13px' }}>
                  📍 {submittedLead.location || 'Sri Chaitanya Museum'}
                </p>

                <div className="my-3 p-3 bg-light rounded-3 text-start" style={{ fontSize: '14px', lineHeight: '1.7' }}>
                  <div><strong>Participant Name:</strong> {submittedLead.patient_name}</div>
                  <div><strong>Phone Number:</strong> {submittedLead.phone}</div>
                  {submittedLead.email && <div><strong>Email:</strong> {submittedLead.email}</div>}
                  {submittedLead.age && <div><strong>Age:</strong> {submittedLead.age} yrs</div>}
                  <div><strong>Registration Date:</strong> {submittedLead.date}</div>
                  <div><strong>Interest:</strong> {submittedLead.interest}</div>
                </div>

                {/* QR CODE */}
                <div className="my-3">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(`PassRef:${submittedLead.passRef}|Event:${submittedLead.camping_name}|Name:${submittedLead.patient_name}`)}`}
                    alt="Registration QR Code"
                    className="border p-2 rounded-3 shadow-sm"
                  />
                  <div className="mt-2 text-muted" style={{ fontSize: '11px' }}>
                    Scan QR code at camp reception desk
                  </div>
                </div>
              </div>

              <div className="modal-footer bg-light d-flex justify-content-between p-3">
                <button className="btn btn-secondary rounded-pill px-4" onClick={() => setShowPassModal(false)}>
                  Close
                </button>
                <button className="btn btn-primary rounded-pill px-4" style={{ background: '#4F46E5', border: 'none' }} onClick={handlePrintPass}>
                  🖨️ Print Entry Pass
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CampingEntry;
