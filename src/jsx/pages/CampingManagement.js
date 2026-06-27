import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

const API = 'https://chaitanyaback.onrender.com/api/camping';

const CampingManagement = () => {
  const [tab, setTab] = useState('events'); // events | leads
  const [campings, setCampings] = useState([]);
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filterCamping, setFilterCamping] = useState('');

  // Camping form
  const [campForm, setCampForm] = useState({
    camping_name: '', location: '', start_date: '', end_date: '',
    organizer_name: '', contact_details: '', participants_count: '', remarks: '', doctors: ''
  });

  // Lead form
  const [leadForm, setLeadForm] = useState({
    camping_id: '', patient_name: '', phone: '', email: '', age: '', interest: '', source: '', date: ''
  });

  useEffect(() => { fetchCampings(); }, []);
  useEffect(() => { if (tab === 'leads') fetchLeads(); }, [tab, filterCamping]);

  const fetchCampings = async () => {
    try {
      const { data } = await axios.get(API);
      setCampings(data);
    } catch { swal("Error!", "Failed to fetch camping records", "error"); }
  };

  const fetchLeads = async () => {
    try {
      const url = filterCamping ? `${API}/leads?camping_id=${filterCamping}` : `${API}/leads`;
      const { data } = await axios.get(url);
      setLeads(data);
    } catch { swal("Error!", "Failed to fetch leads", "error"); }
  };

  // ========== CAMPING HANDLERS ==========
  const handleCampSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, campForm);
        swal("Success!", "Updated!", "success");
      } else {
        await axios.post(API, campForm);
        swal("Success!", "Camping Created!", "success");
      }
      setShowModal(false); setEditId(null);
      setCampForm({ camping_name: '', location: '', start_date: '', end_date: '', organizer_name: '', contact_details: '', participants_count: '', remarks: '', doctors: '' });
      fetchCampings();
    } catch { swal("Error!", "Failed", "error"); }
  };

  const editCamping = (c) => {
    setCampForm({
      camping_name: c.camping_name, location: c.location,
      start_date: c.start_date?.split('T')[0], end_date: c.end_date?.split('T')[0],
      organizer_name: c.organizer_name, contact_details: c.contact_details,
      participants_count: c.participants_count, remarks: c.remarks, doctors: c.doctors || ''
    });
    setEditId(c.id); setShowModal(true);
  };

  const deleteCamping = async (id) => {
    const confirm = await swal({ title: "Delete?", text: "This will also delete all leads!", icon: "warning", buttons: true, dangerMode: true });
    if (confirm) {
      await axios.delete(`${API}/${id}`);
      fetchCampings();
      swal("Deleted!", "", "success");
    }
  };

  // ========== LEAD HANDLERS ==========
  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API}/leads/${editId}`, leadForm);
        swal("Success!", "Updated!", "success");
      } else {
        await axios.post(`${API}/leads`, leadForm);
        swal("Success!", "Lead Added!", "success");
      }
      setShowModal(false); setEditId(null);
      setLeadForm({ camping_id: '', patient_name: '', phone: '', email: '', age: '', interest: '', source: '', date: '' });
      fetchLeads();
    } catch { swal("Error!", "Failed", "error"); }
  };

  const editLead = (l) => {
    setLeadForm({
      camping_id: l.camping_id, patient_name: l.patient_name,
      phone: l.phone, email: l.email, age: l.age,
      interest: l.interest, source: l.source, date: l.date?.split('T')[0]
    });
    setEditId(l.id); setShowModal(true);
  };

  const deleteLead = async (id) => {
    const confirm = await swal({ title: "Delete?", icon: "warning", buttons: true, dangerMode: true });
    if (confirm) {
      await axios.delete(`${API}/leads/${id}`);
      fetchLeads();
      swal("Deleted!", "", "success");
    }
  };

  // ========== PRINT REPORT ==========
  const handlePrintReport = () => {
    const printWindow = window.open('', '');
    const rows = leads.filter(l =>
      l.patient_name?.toLowerCase().includes(search.toLowerCase()) ||
      l.phone?.includes(search)
    );
    printWindow.document.write(`
      <html><head><title>Lead Report</title>
      <style>table{width:100%;border-collapse:collapse}th,td{border:1px solid #000;padding:6px;font-size:12px}th{background:#eee}</style>
      </head><body>
      <h2>Camping Lead Report</h2>
      <table><tr><th>#</th><th>Camping</th><th>Patient</th><th>Phone</th><th>Email</th><th>Age</th><th>Interest</th><th>Source</th><th>Date</th></tr>
      ${rows.map((l, i) => `<tr><td>${i + 1}</td><td>${l.camping_name || ''}</td><td>${l.patient_name}</td><td>${l.phone}</td><td>${l.email}</td><td>${l.age}</td><td>${l.interest}</td><td>${l.source}</td><td>${l.date?.split('T')[0] || ''}</td></tr>`).join('')}
      </table>
      <script>window.print();window.onafterprint=()=>window.close();</script>
      </body></html>
    `);
    printWindow.document.close();
  };

  // ========== FILTER ==========
  const filteredCampings = campings.filter(c =>
    c.camping_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.location?.toLowerCase().includes(search.toLowerCase()) ||
    c.organizer_name?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredLeads = leads.filter(l =>
    l.patient_name?.toLowerCase().includes(search.toLowerCase()) ||
    l.phone?.includes(search)
  );

  return (
    <div className="container-fluid">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>🏕️ Camping Management</h4>
        <div className="d-flex gap-2">
          <input className="form-control" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 180 }} />
          <button className="btn btn-success" onClick={() => { setShowModal(true); setEditId(null); setCampForm({ camping_name: '', location: '', start_date: '', end_date: '', organizer_name: '', contact_details: '', participants_count: '', remarks: '', doctors: '' }); setLeadForm({ camping_id: '', patient_name: '', phone: '', email: '', age: '', interest: '', source: '', date: '' }); }}>+ Add New</button>
          {tab === 'leads' && <button className="btn btn-dark" onClick={handlePrintReport}>🖨️ Print Report</button>}
        </div>
      </div>

      {/* TABS */}
      <div className="mb-3">
        <button className={`btn me-2 ${tab === 'events' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setTab('events')}>🏕️ Camping Events</button>
        <button className={`btn ${tab === 'leads' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setTab('leads')}>👥 Lead Management</button>
      </div>

      {/* CAMPING EVENTS TAB */}
      {tab === 'events' && (
        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Action</th><th>SL No.</th><th>Camping Name</th><th>Location</th><th>Start Date</th><th>End Date</th><th>Organizer</th><th>Contact</th><th>Participants</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCampings.map((c, i) => (
                    <tr key={c.id}>
                      <td>
                        <button className="btn btn-sm btn-warning me-1" onClick={() => editCamping(c)}>✏️</button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteCamping(c.id)}>🗑️</button>
                      </td>
                      <td>{i + 1}</td>
                      <td>{c.camping_name}</td>
                      <td>{c.location}</td>
                      <td>{c.start_date?.split('T')[0]}</td>
                      <td>{c.end_date?.split('T')[0]}</td>
                      <td>{c.organizer_name}</td>
                      <td>{c.contact_details}</td>
                      <td>{c.participants_count}</td>
                    </tr>
                  ))}
                  {filteredCampings.length === 0 && <tr><td colSpan="9" className="text-center py-4">No records</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* LEADS TAB */}
      {tab === 'leads' && (
        <>
          <div className="mb-3">
            <select className="form-control d-inline-block" style={{ width: 250 }} value={filterCamping} onChange={e => setFilterCamping(e.target.value)}>
              <option value="">🏕️ All Campings</option>
              {campings.map(c => <option key={c.id} value={c.id}>{c.camping_name}</option>)}
            </select>
          </div>

          <div className="card">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Action</th><th>SL No.</th><th>Camping</th><th>Patient Name</th><th>Phone</th><th>Email</th><th>Age</th><th>Interest</th><th>Source</th><th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((l, i) => (
                      <tr key={l.id}>
                        <td>
                          <button className="btn btn-sm btn-warning me-1" onClick={() => editLead(l)}>✏️</button>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteLead(l.id)}>🗑️</button>
                        </td>
                        <td>{i + 1}</td>
                        <td>{l.camping_name}</td>
                        <td>{l.patient_name}</td>
                        <td>{l.phone}</td>
                        <td>{l.email}</td>
                        <td>{l.age}</td>
                        <td>{l.interest}</td>
                        <td>{l.source}</td>
                        <td>{l.date?.split('T')[0]}</td>
                      </tr>
                    ))}
                    {filteredLeads.length === 0 && <tr><td colSpan="10" className="text-center py-4">No records</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{editId ? 'Edit' : '+ Add'} {tab === 'events' ? 'Camping' : 'Lead'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">

                {tab === 'events' ? (
                  <form onSubmit={handleCampSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label>Camping Name *</label>
                        <input className="form-control" value={campForm.camping_name} onChange={e => setCampForm({ ...campForm, camping_name: e.target.value })} required />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>Location</label>
                        <input className="form-control" value={campForm.location} onChange={e => setCampForm({ ...campForm, location: e.target.value })} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>📅 Start Date *</label>
                        <input type="date" className="form-control" value={campForm.start_date} onChange={e => setCampForm({ ...campForm, start_date: e.target.value })} required />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>📅 End Date *</label>
                        <input type="date" className="form-control" value={campForm.end_date} onChange={e => setCampForm({ ...campForm, end_date: e.target.value })} required />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>👤 Organizer Name *</label>
                        <input className="form-control" value={campForm.organizer_name} onChange={e => setCampForm({ ...campForm, organizer_name: e.target.value })} required />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>📞 Contact Details *</label>
                        <input className="form-control" value={campForm.contact_details} onChange={e => setCampForm({ ...campForm, contact_details: e.target.value })} required />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>👥 Participants Count</label>
                        <input type="number" className="form-control" value={campForm.participants_count} onChange={e => setCampForm({ ...campForm, participants_count: e.target.value })} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>📝 Remarks</label>
                        <textarea className="form-control" value={campForm.remarks} onChange={e => setCampForm({ ...campForm, remarks: e.target.value })} />
                      </div>
                      <div className="col-md-12 mb-3">
                        <label>🩺 Doctors</label>
                        <textarea className="form-control" value={campForm.doctors} onChange={e => setCampForm({ ...campForm, doctors: e.target.value })} placeholder="Doctor names (comma separated)" />
                      </div>
                    </div>
                    <button className="btn btn-primary w-100">{editId ? 'Update' : 'Create'} Camping</button>
                  </form>
                ) : (
                  <form onSubmit={handleLeadSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label>Select Camping *</label>
                        <select className="form-control" value={leadForm.camping_id} onChange={e => setLeadForm({ ...leadForm, camping_id: e.target.value })} required>
                          <option value="">-- Select --</option>
                          {campings.map(c => <option key={c.id} value={c.id}>{c.camping_name}</option>)}
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>Patient Name *</label>
                        <input className="form-control" value={leadForm.patient_name} onChange={e => setLeadForm({ ...leadForm, patient_name: e.target.value })} required />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>Phone</label>
                        <input className="form-control" value={leadForm.phone} onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>Email</label>
                        <input type="email" className="form-control" value={leadForm.email} onChange={e => setLeadForm({ ...leadForm, email: e.target.value })} />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label>Age</label>
                        <input className="form-control" value={leadForm.age} onChange={e => setLeadForm({ ...leadForm, age: e.target.value })} />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label>Interest</label>
                        <input className="form-control" value={leadForm.interest} onChange={e => setLeadForm({ ...leadForm, interest: e.target.value })} />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label>Source</label>
                        <input className="form-control" value={leadForm.source} onChange={e => setLeadForm({ ...leadForm, source: e.target.value })} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>Date</label>
                        <input type="date" className="form-control" value={leadForm.date} onChange={e => setLeadForm({ ...leadForm, date: e.target.value })} />
                      </div>
                    </div>
                    <button className="btn btn-primary w-100">{editId ? 'Update' : 'Add'} Lead</button>
                  </form>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampingManagement;
