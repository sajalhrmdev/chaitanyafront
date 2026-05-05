import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import swal from 'sweetalert';
 import QRCode from "qrcode";

const MuseumEntries = () => {
const authStatus = localStorage.getItem('isAuthenticated');
const role = localStorage.getItem('userRole');
const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};
const [searchData, setSearchData] = useState({
  phone: '',
  name: '',
  fromDate: getTodayDate(),
  toDate: getTodayDate(),
  address: ''
});
const handleSearchChange = (e) => {
  const { name, value } = e.target;

  setSearchData(prev => ({
    ...prev,
    [name]: value
  }));
};
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({ 
    firstname: '',
    phone: '',
    address: '',
    num_of_persons: '1',
    total_amt: '50',
    payment: '0',
    gallery: '1',
    movie_show: '0',
    discount: '0'
  });

  useEffect(() => {
   handleSearch()
  }, []);

  const fetchEntries = async () => {  
    try {
      setLoading(true);
   // const response = await axios.get('https://sri-chaitanya-mahaprabhu-museum-entry.onrender.com/api/museum');
      const response = await axios.get('https://chaitanyaback.onrender.com/api/museum');
      
      setEntries(response.data);
    } catch (error) {
      swal('Error', 'Failed to fetch entries', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({ 
      firstname: entry.firstname,
      phone: entry.phone,
      address: entry.address,
      num_of_persons: entry.num_of_persons,
      total_amt: entry.total_amt,
      payment: entry.payment,
      gallery: entry.gallery,
      movie_show: entry.movie_show,
      discount: entry.discount,
        txn_id: entry.txn_id || '',
  image_name: entry.image_name || ''
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // await axios.put(`https://sri-chaitanya-mahaprabhu-museum-entry.onrender.com/api/museum/${editingEntry.id}`, formData);
        await axios.put(`https://chaitanyaback.onrender.com/api/museum/${editingEntry.id}`, formData);
     
      swal('Success', 'Entry updated successfully', 'success');
      setShowModal(false);
       handleSearch()
    } catch (error) {
      swal('Error', error.response?.data?.error || 'Failed to update entry', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (entryId) => {
    const willDelete = await swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this entry!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    });

    if (willDelete) {
      try {
        setLoading(true);
        // await axios.delete(`https://sri-chaitanya-mahaprabhu-museum-entry.onrender.com/api/museum/${entryId}`);
          await axios.delete(`https://chaitanyaback.onrender.com/api/museum/${entryId}`);
        swal('Success', 'Entry deleted successfully', 'success');
         handleSearch()
      } catch (error) {
        swal('Error', error.response?.data?.error || 'Failed to delete entry', 'error');
      } finally {
        setLoading(false);
      }
    }
  };


const handleSearch = async () => {
  try {
    setLoading(true);

    const res = await axios.post(
      // 'https://sri-chaitanya-mahaprabhu-museum-entry.onrender.com/api/museum/search',
      // 'http://localhost:3003/api/museum/search',
      'https://chaitanyaback.onrender.com/api/museum/search',
      searchData
    );

    setEntries(res.data);

  } catch (error) {
    console.error("Search failed:", error.response || error);
    swal("Error", error.response?.data?.error || error.message || "Search failed", "error");
  } finally {
    setLoading(false);
  }
};

const handlePrint = async (entry) => {
  // 🔥 QR generate
  const qrData = `
    Txn: ${entry.txn_id}
    Name: ${entry.firstname}
    Phone: ${entry.phone}
    Total: ₹${entry.total_amt}
  `;

  const qrImage = await QRCode.toDataURL(qrData);

  const printWindow = window.open('', '_blank', );

  const content = `
  <html>
  <head>
    <title>Print</title>
    <style>
      body {
        font-family: monospace;
        width: 260px;
        margin: 0;
        padding: 10px;
      }
      .center { text-align: center; }
      .line { border-top: 1px dashed black; margin: 6px 0; }
      .small { font-size: 12px; }
    </style>
  </head>
  <body>

    <div class="center">
      <b>SRI CHAITANYA MAHAPRABHU MUSEUM</b><br/>
      <span class="small">Visit: chaitanyamuseum.org</span><br/>
      <span class="small">📞 8617528955</span>
    </div>

    <div class="line"></div>

    <div class="center"><b>ENTRY PASS</b></div>

    <div class="line"></div>

    <p>Txn ID : ${entry.txn_id || '-'}</p>
    <p>Name : ${entry.firstname}</p>
    <p>Phone : ${entry.phone}</p>
    <p>Address : ${entry.address}</p>
    <p>Date : ${entry.date}</p>
    <p>Persons : ${entry.num_of_persons}</p>

    <div class="center">
      <img src="${qrImage}" width="100" />
    </div>

    <div class="line"></div>

    <div class="center"><b>Donation Details</b></div>

    <p>Entry : ₹50 x ${entry.num_of_persons} = ₹${entry.num_of_persons * 50}</p>

    <p>Movie : ${
      Number(entry.movie_show) > 0
        ? `₹30 x ${entry.movie_show} = ₹${entry.movie_show * 30}`
        : 'None'
    }</p>

    <p>Discount : ${entry.discount}</p>

    <div class="line"></div>

    <h3 class="center">Total : ₹ ${entry.total_amt}</h3>

    <div class="line"></div>

    <div class="small center">
      [Srivas Angan, Jiva Uddhar, Sankirtan, Philosophy, All Galleries]<br/>
      No refunds. Open: 10am–12pm & 3pm–7pm | Mon Closed<br/>
      Thank You. Visit Again!
    </div>

    <script>
      window.print();
      window.onafterprint = () => window.close();
    </script>

  </body>
  </html>
  `;

  printWindow.document.write(content);
  printWindow.document.close();
};
const handlePrintReport = () => {
  if (!entries.length) {
    return swal("Error", "No data to print", "error");
  }

  // 📊 calculations
  const totalAmount = entries.reduce((sum, e) => sum + Number(e.total_amt || 0), 0);
  const totalPersons = entries.reduce((sum, e) => sum + Number(e.num_of_persons || 0), 0);
  const totalMovies = entries.reduce((sum, e) => sum + Number(e.movie_show || 0), 0);

  // 📅 date range
  const dates = entries.map(e => new Date(e.date));
  const minDate = new Date(Math.min(...dates)).toLocaleDateString();
  const maxDate = new Date(Math.max(...dates)).toLocaleDateString();

  // table rows
  const rows = entries.map((e, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${e.firstname}</td>
      <td>${e.phone}</td>
      <td>${e.num_of_persons}</td>
      <td>${e.movie_show}</td>
      <td>₹${e.total_amt}</td>
      <td>${new Date(e.date).toLocaleDateString()}</td>
    </tr>
  `).join("");

  const printWindow = window.open('', '_blank');

  const content = `
  <html>
  <head>
    <title>Entry Report</title>
    <style>
      body {
        font-family: 'Segoe UI', Arial;
        padding: 25px;
        color: #222;
      }

      .header {
        text-align: center;
        margin-bottom: 10px;
      }

      .header h2 {
        margin: 0;
        font-weight: 700;
        letter-spacing: 1px;
      }

      .sub {
        font-size: 13px;
        color: #666;
      }

      .divider {
        margin: 15px 0;
        border-top: 2px solid #eee;
      }

      .summary-box {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        margin-top: 15px;
      }

      .card {
        border-radius: 10px;
        padding: 12px;
        text-align: center;
        background: #f9fafc;
        border: 1px solid #ddd;
      }

      .card:nth-child(1) { background: #e3f2fd; }
      .card:nth-child(2) { background: #e8f5e9; }
      .card:nth-child(3) { background: #fff3e0; }
      .card:nth-child(4) { background: #fce4ec; }

      .card h4 {
        margin: 5px 0;
        font-size: 18px;
      }

      .card span {
        font-size: 12px;
        color: #555;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
        font-size: 13px;
      }

      th {
        background: #2c3e50;
        color: white;
        padding: 8px;
      }

      td {
        border: 1px solid #ddd;
        padding: 6px;
        text-align: center;
      }

      tr:nth-child(even) {
        background: #f5f5f5;
      }

      .footer {
        margin-top: 15px;
        text-align: right;
        font-weight: bold;
        font-size: 15px;
      }

      @media print {
        body {
          margin: 0;
        }
      }
    </style>
  </head>

  <body>

    <div class="header">
      <h2>Sri Chaitanya Mahaprabhu Museum</h2>
      <div class="sub">Entry Report</div>
    </div>

    <div class="divider"></div>

    <div class="summary-box">
      <div class="card">
        <span>📅 Date Range</span>
        <h4>${minDate} → ${maxDate}</h4>
      </div>

      <div class="card">
        <span>👤 Total Persons</span>
        <h4>${totalPersons}</h4>
      </div>

      <div class="card">
        <span>🎬 Movie Tickets</span>
        <h4>${totalMovies}</h4>
      </div>

      <div class="card">
        <span>💰 Total Collection</span>
        <h4>₹ ${totalAmount}</h4>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Persons</th>
          <th>Movie</th>
          <th>Amount</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div class="footer">
      Grand Total: ₹ ${totalAmount}
    </div>

    <script>
      window.print();
      window.onafterprint = () => window.close();
    </script>

  </body>
  </html>
  `;

  printWindow.document.write(content);
  printWindow.document.close();
};
  return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-12">
//           <div className="card">
//             <div className="card-header">
//               <h4 className="card-title">Museum Entries</h4>
//             </div>
//             <div className="row mb-3">
//   <div className="row mb-3">

//   <div className="col-md-3">
//     <input
//       type="text"
//       className="form-control"
//       placeholder="Phone"
//       name="phone"
//       value={searchData.phone}
//       onChange={handleSearchChange}
//     />
//   </div>

//   <div className="col-md-3">
//     <input
//       type="text"
//       className="form-control"
//       placeholder="Name"
//       name="name"
//       value={searchData.name}
//       onChange={handleSearchChange}
//     />
//   </div>

//  <div className="col-md-2">
//   <input
//     type="date"
//     className="form-control"
//     name="fromDate"
//     value={searchData.fromDate}
//     onChange={handleSearchChange}
//   />
// </div>

// <div className="col-md-2">
//   <input
//     type="date"
//     className="form-control"
//     name="toDate"
//     value={searchData.toDate}
//     onChange={handleSearchChange}
//   />
// </div>

//   {/* <div className="col-md-3">
//     <input
//       type="text"
//       className="form-control"
//       placeholder="Address"
//       name="address"
//       value={searchData.address}
//       onChange={handleSearchChange}
//     />
//   </div> */}

//   <div className="col-md-2 mt-2">
//     <button className="btn btn-primary w-100" onClick={handleSearch}>
//       🔍 Search
//     </button>
//   </div>

//   <div className="col-md-2 mt-2">
//     <button
//       className="btn btn-secondary w-100"
//       onClick={() => {
//       setSearchData({
//     phone: '',
//     name: '',
//     fromDate: getTodayDate(),
//     toDate: getTodayDate(),
//     address: ''
//   });
//          handleSearch()
//       }}
//     >
//       Reset
//     </button>
//   </div>
//   <div className="col-md-2 mt-2">
//   <button
//     className="btn btn-success w-100"
//     onClick={handlePrintReport}
//   >
//     🖨️ Print Report
//   </button>
// </div>

// </div>

 

  
// </div>
//             <div className="card-body">
//               {loading && <div className="text-center"><div className="spinner-border" role="status"></div></div>}
//               <div className="table-responsive">
//                 <table className="table table-striped">
//                   <thead>
//                     <tr>
//                       <th>ID</th>
//                       <th>Name</th>
//                       <th>Phone</th>
//                       <th>Address</th>
//                       <th>Persons</th>
//                       <th>Amount</th>
//                       <th>Date</th>
//                       {authStatus && role==="superadmin" && <th>Actions</th>}
//                       <th>Print</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {entries.map(entry => (
//                       <tr key={entry.id}>
//                         <td>{entry.id}</td>
//                         <td>{entry.firstname}</td>
//                         <td>{entry.phone}</td>
//                         <td>{entry.address}</td>
//                         <td>{entry.num_of_persons}</td>
//                         <td>₹{entry.total_amt}</td>
//                         <td>{entry.date}</td>
//                          {authStatus && role === "superadmin" && (
//   <td>
//     <div className="d-flex gap-2">
//       <button
//         className="btn btn-sm btn-warning"
//         onClick={() => handleEdit(entry)}
//       >
//         ✏️ Edit
//       </button>

//       <button
//         className="btn btn-sm btn-danger"
//         onClick={() => handleDelete(entry.id)}
//       >
//         🗑️ Delete
//       </button>
//     </div>
//   </td>
// )}
//                       <td><button 
//   className="btn btn-sm btn-primary"
//   onClick={() => handlePrint(entry)}
// >
//   🖨️ Print
// </button></td>  
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

 
//     </div>


  <>
  <div className="container-fluid py-3">

    <div className="card shadow border-0 rounded-4">

      {/* HEADER */}
      <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
        <h4 className="fw-bold mb-0">🏛️ Museum Entries</h4>
        <span className="badge bg-primary">Dashboard</span>
      </div>

      {/* 🔍 SEARCH SECTION */}
      <div className="card-body border-bottom bg-body-tertiary rounded-top-4">

        <div className="row g-3 align-items-end">

          <div className="col-md-3">
            <label className="form-label small text-muted">Phone</label>
            <input
              type="text"
              className="form-control shadow-sm"
              placeholder="Search phone"
              name="phone"
              value={searchData.phone}
              onChange={handleSearchChange}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label small text-muted">Name</label>
            <input
              type="text"
              className="form-control shadow-sm"
              placeholder="Search name"
              name="name"
              value={searchData.name}
              onChange={handleSearchChange}
            />
          </div>

          <div className="col-md-2">
            <label className="form-label small text-muted">From Date</label>
            <input
              type="date"
              className="form-control shadow-sm"
              name="fromDate"
              value={searchData.fromDate}
              onChange={handleSearchChange}
            />
          </div>

          <div className="col-md-2">
            <label className="form-label small text-muted">To Date</label>
            <input
              type="date"
              className="form-control shadow-sm"
              name="toDate"
              value={searchData.toDate}
              onChange={handleSearchChange}
            />
          </div>

          <div className="col-md-2 d-grid">
            <button
              className="btn btn-primary fw-bold shadow-sm"
              onClick={handleSearch}
            >
              🔍 Search
            </button>
          </div>

        </div>

        {/* ACTION BUTTONS */}
        <div className="d-flex justify-content-end gap-2 mt-3">

          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              setSearchData({
                phone: '',
                name: '',
                fromDate: getTodayDate(),
                toDate: getTodayDate(),
                address: ''
              });
              handleSearch();
            }}
          >
            Reset
          </button>

          <button
            className="btn text-white fw-bold shadow-sm"
            style={{
              background: "linear-gradient(45deg,#43e97b,#38f9d7)",
              border: "none"
            }}
            onClick={handlePrintReport}
          >
            🖨️ Print Report
          </button>

        </div>

      </div>

      {/* TABLE */}
      <div className="card-body">

        {loading && (
          <div className="text-center my-4">
            <div className="spinner-border text-primary"></div>
          </div>
        )}

        <div className="table-responsive">

          <table className="table table-hover align-middle">

            <thead className="table-info">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Persons</th>
                <th>Amount</th>
                <th>Date</th>
                {authStatus && role === "1" && <th>Actions</th>}
                <th>Print</th>
              </tr>
            </thead>

            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry.id}>

                  <td>{index + 1}</td>
                  <td className="fw-semibold">{entry.firstname}</td>
                  <td>{entry.phone}</td>
                  <td>{entry.num_of_persons}</td>
                  <td className="text-success fw-bold">₹{entry.total_amt}</td>
                  <td>{new Date(entry.date).toLocaleDateString()}</td>

                  {authStatus && role === "1" && (
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-warning shadow-sm"
                          onClick={() => handleEdit(entry)}
                        >
                          ✏️
                        </button>

                        <button
                          className="btn btn-sm btn-danger shadow-sm"
                          onClick={() => handleDelete(entry.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  )}

                  <td>
                    <button
                      className="btn btn-sm btn-primary shadow-sm"
                      onClick={() => handlePrint(entry)}
                    >
                      🖨️
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>

    </div>

  </div>

  {/* <Modal show={showModal} onHide={() => setShowModal(false)} centered>
    <Modal.Header closeButton>
      <Modal.Title>Edit Entry</Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          type="text"
          className="form-control"
          value={formData.firstname}
          onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Phone</label>
        <input
          type="text"
          className="form-control"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Address</label>
        <input
          type="text"
          className="form-control"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Number of Persons</label>
          <input
            type="number"
            className="form-control"
            value={formData.num_of_persons}
            onChange={(e) => setFormData({ ...formData, num_of_persons: e.target.value })}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Total Amount</label>
          <input
            type="number"
            className="form-control"
            value={formData.total_amt}
            onChange={(e) => setFormData({ ...formData, total_amt: e.target.value })}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Payment</label>
          <input
            type="number"
            className="form-control"
            value={formData.payment}
            onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Discount</label>
          <input
            type="number"
            className="form-control"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Gallery</label>
          <input
            type="number"
            className="form-control"
            value={formData.gallery}
            onChange={(e) => setFormData({ ...formData, gallery: e.target.value })}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Movie Show</label>
          <input
            type="number"
            className="form-control"
            value={formData.movie_show}
            onChange={(e) => setFormData({ ...formData, movie_show: e.target.value })}
          />
        </div>
      </div>
    </Modal.Body>

    <Modal.Footer>
      <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
        Cancel
      </button>
      <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
        Update Entry
      </button>
    </Modal.Footer>
  </Modal> */}

       <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Entry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.firstname}
              onChange={(e) => setFormData({...formData, firstname: e.target.value})}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              type="text"
              className="form-control"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Number of Persons</label>
            <input
              type="number"
              className="form-control"
              value={formData.num_of_persons}
              onChange={(e) => setFormData({...formData, num_of_persons: e.target.value})}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Total Amount</label>
            <input
              type="number"
              className="form-control"
              value={formData.total_amt}
              onChange={(e) => setFormData({...formData, total_amt: e.target.value})}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Update Entry
          </button>
        </Modal.Footer>
      </Modal>
  
  </>
);

  
};

export default MuseumEntries;
