// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import swal from 'sweetalert';

// const MuseumEntry = () => {
//   const GALLERY_PRICE = 50;
// const MOVIE_PRICE = 30;
//   // const [formData, setFormData] = useState({
//   //   firstname: '',
//   //   phone: '',
//   //   address: '',
//   //   num_of_persons: '1',
//   //   total_amt: '50',
//   //   payment: '0',
//   //   gallery: '1',
//   //   movie_show: '0',
//   //   discount: '0',
//   //   image_name: '',
//   //   txn_id: ''
//   // });
//   const [formData, setFormData] = useState({
//   firstname: '',
//   phone: '',
//   address: '',
//   num_of_persons: '1',
//   total_amt: '50',
//   payment: '0',
//   gallery: '1',
//   movie_show: '0',   // 👉 now number of tickets
//   discount: '0',
//   image_name: '',
//   txn_id: ''
// });

//   const [loading, setLoading] = useState(false);

// useEffect(() => {
//   const persons = Number(formData.num_of_persons) || 0;
//   const gallery = formData.gallery === '1';
//   const movieTickets = Number(formData.movie_show) || 0;
//   const discount = Number(formData.discount) || 0;

//   let total = 0;

//   // Gallery → sobai
//   if (gallery) total += persons * GALLERY_PRICE;

//   // Movie → ticket onujayi
//   total += movieTickets * MOVIE_PRICE;

//   total = total - discount;

//   setFormData(prev => ({
//     ...prev,
//     total_amt: total > 0 ? total.toString() : '0'
//   }));

// }, [
//   formData.num_of_persons,
//   formData.gallery,
//   formData.movie_show,
//   formData.discount
// ]);

//  const handleChange = (e) => {
//   const { name, value, type, checked } = e.target;

//   setFormData(prev => ({
//     ...prev,
//     [name]:
//       type === 'checkbox'
//         ? (checked ? '1' : '0')
//         : value
//   }));
// };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
// if (Number(formData.movie_show) > Number(formData.num_of_persons)) {
//   setLoading(false);
//   return swal("Error!", "Movie tickets cannot exceed number of persons", "error");
// }
// if (formData.payment === '1' && !formData.txn_id) {
//   setLoading(false);
//   return swal("Error!", "Transaction ID required!", "error");
// }
// if (Number(formData.discount) > Number(formData.total_amt)) {
//   setLoading(false);
//   return swal("Error!", "Discount cannot exceed total amount", "error");
// }
//     try {
//       const response = await axios.post('https://sri-chaitanya-mahaprabhu-museum-entry.onrender.com/api/museum', formData);
      
//       swal("Success!", "Museum entry created successfully!", "success");
      
//       // Reset form
//       setFormData({
//         firstname: '',
//         phone: '',
//         address: '',
//         num_of_persons: '1',
//         total_amt: '50',
//         payment: '0',
//         gallery: '1',
//         movie_show: '0',
//         discount: '0',
//         image_name: '',
//         txn_id: ''
//       });
//     } catch (error) {
//       swal("Error!", error.response?.data?.error || "Failed to create entry", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="card-header">
//               <h4 className="card-title">Museum Entry Form</h4>
//             </div>
//             <div className="card-body">
//               <form onSubmit={handleSubmit}>
//                 <div className="row">
//                   <div className="col-lg-6 mb-3">
//                     <label className="form-label">Full Name *</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="firstname"
//                       value={formData.firstname}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
                  
//                   <div className="col-lg-6 mb-3">
//                     <label className="form-label">Phone Number *</label>
//                     <input
//                       type="tel"
//                       className="form-control"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
                  
//                   <div className="col-lg-12 mb-3">
//                     <label className="form-label">Address *</label>
//                     <textarea
//                       className="form-control"
//                       name="address"
//                       rows="3"
//                       value={formData.address}
//                       onChange={handleChange}
//                       required
//                     ></textarea>
//                   </div>
                  
//                   <div className="col-lg-4 mb-3">
//                     <label className="form-label">Number of Persons</label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       name="num_of_persons"
//                       value={formData.num_of_persons}
//                       onChange={handleChange}
//                       min="1"
//                     />
//                   </div>
                  
//                   <div className="col-lg-4 mb-3">
//                     <label className="form-label">Total Amount</label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       name="total_amt"
//                       value={formData.total_amt}
//                         readOnly
//                       onChange={handleChange}
//                       min="0"
//                     />
//                   </div>
                  
//                   <div className="col-lg-4 mb-3">
//                     <label className="form-label">Discount</label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       name="discount"
//                       value={formData.discount}
//                       onChange={handleChange}
//                       min="0"
//                     />
//                   </div>
                  
//                   <div className="col-lg-6 mb-3">
//                     <div className="form-check">
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         name="gallery"
//                         checked={formData.gallery === '1'}
//                         onChange={handleChange}
//                       />
//                       <label className="form-check-label">Gallery Visit</label>
//                     </div>
//                   </div>
                  
//                   <div className="col-lg-6 mb-3">
//                    <div className="col-lg-4 mb-3">
//   <label className="form-label">Movie Tickets</label>
//   <input
//     type="number"
//     className="form-control"
//     name="movie_show"
//     value={formData.movie_show}
//     onChange={handleChange}
//     min="0"
//     max={formData.num_of_persons} // optional
//   />
// </div>
//                   </div>
                  
//                   <div className="col-lg-6 mb-3">
//                     <label className="form-label">Payment Method</label>
//                     <select
//                       className="form-control"
//                       name="payment"
//                       value={formData.payment}
//                       onChange={handleChange}
//                     >
//                       <option value="0">Cash</option>
//                       <option value="1">Online</option>
//                     </select>
//                   </div>
                  
//                   <div className="col-lg-6 mb-3">
//                     <label className="form-label">Transaction ID</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="txn_id"
//                       value={formData.txn_id}
//                       onChange={handleChange}
//                       placeholder="For online payments"
//                     />
//                   </div>
//                 </div>
                
//                 <div className="text-end">
//                   <button
//                     type="submit"
//                     className="btn btn-primary"
//                     disabled={loading}
//                   >
//                     {loading ? 'Creating...' : 'Create Entry'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MuseumEntry;



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import swal from 'sweetalert';

// const MuseumEntry = () => {
//   const GALLERY_PRICE = 50;
//   const MOVIE_PRICE = 30;

//   const [formData, setFormData] = useState({
//     firstname: '',
//     phone: '',
//     address: '',
//     num_of_persons: '1',
//     total_amt: '50',
//     payment: '0',
//     gallery: '1',
//     movie_show: '0',
//     discount: '0',
//     image_name: '',
//     txn_id: ''
//   });

//   const [loading, setLoading] = useState(false);

//   // ✅ AUTO CALCULATION
//   useEffect(() => {
//     const persons = Number(formData.num_of_persons) || 0;
//     const gallery = formData.gallery === '1';
//     const movieTickets = Number(formData.movie_show) || 0;
//     const discount = Number(formData.discount) || 0;

//     let total = 0;

//     if (gallery) total += persons * GALLERY_PRICE;
//     total += movieTickets * MOVIE_PRICE;

//     total = total - discount;

//     setFormData(prev => ({
//       ...prev,
//       total_amt: total > 0 ? total.toString() : '0'
//     }));
//   }, [
//     formData.num_of_persons,
//     formData.gallery,
//     formData.movie_show,
//     formData.discount
//   ]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setFormData(prev => ({
//       ...prev,
//       [name]:
//         type === 'checkbox'
//           ? (checked ? '1' : '0')
//           : value
//     }));
//   };

//   // ✅ SUBMIT
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // validations
//     if (Number(formData.movie_show) > Number(formData.num_of_persons)) {
//       setLoading(false);
//       return swal("Error!", "Movie tickets cannot exceed number of persons", "error");
//     }

//     if (formData.payment === '1' && !formData.txn_id) {
//       setLoading(false);
//       return swal("Error!", "Transaction ID required!", "error");
//     }

//     if (Number(formData.discount) > Number(formData.total_amt)) {
//       setLoading(false);
//       return swal("Error!", "Discount cannot exceed total amount", "error");
//     }

//     try {
//       await axios.post(
//         'https://sri-chaitanya-mahaprabhu-museum-entry.onrender.com/api/museum',
//         formData
//       );

//       swal("Success!", "Museum entry created successfully!", "success");

//       setFormData({
//         firstname: '',
//         phone: '',
//         address: '',
//         num_of_persons: '1',
//         total_amt: '50',
//         payment: '0',
//         gallery: '1',
//         movie_show: '0',
//         discount: '0',
//         image_name: '',
//         txn_id: ''
//       });

//     } catch (error) {
//       swal("Error!", error.response?.data?.error || "Failed to create entry", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container-fluid py-4">
//       <div className="card shadow-lg border-0">
//         <div className="card-body">

//           {/* ✅ PRICE CARDS */}
//           <div className="row mb-4">
//             <div className="col-lg-6">
//               <div className="card bg-light text-center shadow-sm">
//                 <div className="card-body">
//                   <h5>🎟️ Museum Entry</h5>
//                   <h3 className="text-primary">₹{GALLERY_PRICE}</h3>
//                   <small>per person</small>
//                 </div>
//               </div>
//             </div>

//             <div className="col-lg-6">
//               <div className="card bg-light text-center shadow-sm">
//                 <div className="card-body">
//                   <h5>🎬 Movie Ticket</h5>
//                   <h3 className="text-success">₹{MOVIE_PRICE}</h3>
//                   <small>per ticket</small>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit}>

//             {/* PERSONAL */}
//             <h5 className="mb-3 border-bottom pb-2">👤 Personal Details</h5>

//             <div className="row">
//               <div className="col-lg-6 mb-3">
//                 <input type="text" className="form-control" placeholder="Full Name"
//                   name="firstname" value={formData.firstname} onChange={handleChange} required />
//               </div>

//               <div className="col-lg-6 mb-3">
//                 <input type="tel" className="form-control" placeholder="Phone Number"
//                   name="phone" value={formData.phone} onChange={handleChange} required />
//               </div>

//               <div className="col-lg-12 mb-3">
//                 <textarea className="form-control" placeholder="Address"
//                   name="address" value={formData.address} onChange={handleChange} required />
//               </div>
//             </div>

//             {/* TICKET */}
//             <h5 className="mt-4 mb-3 border-bottom pb-2">🎟️ Ticket Details</h5>

//             <div className="row">
//               <div className="col-lg-4 mb-3">
//                 <label>Persons</label>
//                 <input type="number" className="form-control"
//                   name="num_of_persons"
//                   value={formData.num_of_persons}
//                   onChange={handleChange} min="1" />
//               </div>

//               <div className="col-lg-4 mb-3">
//                 <label>Movie Tickets (₹{MOVIE_PRICE})</label>
//                 <input type="number" className="form-control"
//                   name="movie_show"
//                   value={formData.movie_show}
//                   onChange={handleChange}
//                   min="0"
//                   max={formData.num_of_persons} />
//               </div>

//               <div className="col-lg-4 mb-3">
//                 <label>Discount</label>
//                 <input type="number" className="form-control"
//                   name="discount"
//                   value={formData.discount}
//                   onChange={handleChange} min="0" />
//               </div>

//               <div className="col-lg-6 mb-3">
//                 <div className="form-check form-switch">
//                   <input className="form-check-input"
//                     type="checkbox"
//                     name="gallery"
//                     checked={formData.gallery === '1'}
//                     onChange={handleChange} />
//                   <label>🏛️ Include Museum (₹{GALLERY_PRICE}/person)</label>
//                 </div>
//               </div>

//               <div className="col-lg-6 mb-3">
//                 <label>Total</label>
//                 <div className="form-control bg-dark text-white text-center fw-bold fs-5">
//                   ₹ {formData.total_amt}
//                 </div>
//               </div>
//             </div>

//             {/* PAYMENT */}
//             <h5 className="mt-4 mb-3 border-bottom pb-2">💳 Payment</h5>

//             <div className="row">
//               <div className="col-lg-6 mb-3">
//                 <select className="form-control"
//                   name="payment"
//                   value={formData.payment}
//                   onChange={handleChange}>
//                   <option value="0">Cash</option>
//                   <option value="1">Online</option>
//                 </select>
//               </div>

//               <div className="col-lg-6 mb-3">
//                 <input type="text"
//                   className="form-control"
//                   placeholder="Transaction ID"
//                   name="txn_id"
//                   value={formData.txn_id}
//                   onChange={handleChange} />
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="btn btn-primary w-100 mt-3"
//               disabled={loading}
//             >
//               {loading ? "Processing..." : "Create Entry"}
//             </button>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MuseumEntry;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

const MuseumEntry = () => {
  const GALLERY_PRICE = 50;
  const MOVIE_PRICE = 30;
const authStatus = localStorage.getItem('isAuthenticated');
const role = localStorage.getItem('userRole');
  const [formData, setFormData] = useState({
    firstname: '',
    phone: '',
    address: '',
    num_of_persons: '1',
    total_amt: '50',
    payment: '0',
    gallery: '1', // always 1
   
    movie_show: '0',
    discount: '0',
    txn_id: ''
  });

  const [loading, setLoading] = useState(false);

  // ✅ AUTO CALC
  useEffect(() => {
    const persons = Number(formData.num_of_persons) || 0;
    const movieTickets = Number(formData.movie_show) || 0;
  const discount = Math.max(0, Number(formData.discount) || 0);

    let total = persons * GALLERY_PRICE; // mandatory
    total += movieTickets * MOVIE_PRICE;

    total = total - discount;

    setFormData(prev => ({
      ...prev,
      total_amt: total > 0 ? total.toString() : '0'
    }));
  }, [
    formData.num_of_persons,
    formData.movie_show,
    formData.discount
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
const handlePrint = (entry) => {
  const qrData = `
Name: ${entry.firstname}
Phone: ${entry.phone}
Date: ${entry.date}
Persons: ${entry.num_of_persons}
Amount: ${entry.total_amt}
`;

  const printWindow = window.open('', '', );

  printWindow.document.write(`
    <html>
      <head>
        <title>Entry Pass</title>
        <style>
          body {
            font-family: monospace;
            width: 300px;
            margin: auto;
            text-align: center;
          }
          .line {
            border-top: 1px dashed #000;
            margin: 8px 0;
          }
          h3, h4, p {
            margin: 4px 0;
          }
          .bold {
            font-weight: bold;
          }
        </style>
      </head>
      <body>

        <h3>SRI CHAITANYA MAHAPRABHU MUSEUM</h3>
        <p>Visit: chaitanyamuseum.org</p>
        <p>📞 8617528955</p>

        <div class="line"></div>

        <h4>ENTRY PASS</h4>

        <div class="line"></div>

        <p><b>Txn ID :</b> ${entry.txn_id || '-'}</p>
        <p><b>Name :</b> ${entry.firstname}</p>
        <p><b>Phone :</b> ${entry.phone}</p>
        <p><b>Address :</b> ${entry.address}</p>
        <p><b>Date :</b> ${entry.date}</p>
        <p><b>Persons :</b> ${entry.num_of_persons}</p>

        <br/>

        <!-- QR -->
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrData)}" />

        <div class="line"></div>

        <p class="bold">Donation Details</p>

        <p>Entry : ₹50 x ${entry.num_of_persons} = ₹${entry.num_of_persons * 50}</p>

        <p>Movie : ${
          Number(entry.movie_show) > 0
            ? `${entry.movie_show} x ₹30 = ₹${entry.movie_show * 30}`
            : "None"
        }</p>

        <p>Discount : ₹${entry.discount}</p>

        <div class="line"></div>

        <h3>Total : ₹ ${entry.total_amt}</h3>

        <div class="line"></div>

        <p>[Srivas Angan, Jiva Uddhar, Sankirtan, Philosophy, All Galleries]</p>
        <p>No refunds. Open: 10am–12pm & 3pm–7pm</p>
        <p>Mon Closed</p>

        <p>Thank You. Visit Again!</p>

        <script>
          window.print();
          window.onafterprint = () => window.close();
        </script>

      </body>
    </html>
  `);

  printWindow.document.close();
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (Number(formData.movie_show) > Number(formData.num_of_persons)) {
      setLoading(false);
      return swal("Error!", "Movie tickets cannot exceed persons", "error");
    }

    // if (formData.payment === '1' && !formData.txn_id) {
    //   setLoading(false);
    //   return swal("Error!", "Transaction ID required!", "error");
    // }

    try {
     const res = await axios.post(
        // 'https://sri-chaitanya-mahaprabhu-museum-entry.onrender.com/api/museum',
        // 'http://localhost:3003/api/museum',
        'https://chaitanyaback.onrender.com/api/museum',

        formData
      );

      // swal("Success!", "Entry Created!", "success");
      const entry = res.data; // 🔥 backend response

swal("Success!", "Entry Created!", "success").then(() => {
  handlePrint(entry); // 🔥 auto print
});

      setFormData({
        firstname: '',
        phone: '',
        address: '',
        num_of_persons: '1',
        total_amt: '50',
        payment: '0',
        gallery: '1',
      
        movie_show: '0',
        discount: '0',
        txn_id: ''
      });

    } catch (err) {
      swal("Error!", "Failed", "error");
    } finally {
      setLoading(false);
    }
  };


// const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (Number(formData.movie_show) > Number(formData.num_of_persons)) {
//     return swal("Error!", "Movie tickets cannot exceed persons", "error");
//   }

//   try {
//     // 🔥 1. Create order
//     const { data: order } = await axios.post(
//       "http://localhost:3003/api/razorpay/create-order",
//       { amount: formData.total_amt }
//     );

//     // 🔥 2. Open Razorpay
//     const options = {
//       key: "rzp_test_ShCsZlBHwUMcF0",
//       amount: order.amount,
//       currency: "INR",
//       name: "Museum Entry",
//       description: "Ticket Payment",
//       order_id: order.id,

//       handler: async function (response) {

//         // 🔥 SAVE txn_id
//         const updatedData = {
//           ...formData,
//           payment: "1",
//           txn_id: response.razorpay_payment_id
//         };

//         // 🔥 3. Save entry
//         await axios.post(
//           "https://sri-chaitanya-mahaprabhu-museum-entry.onrender.com/api/museum",
//           updatedData
//         );

//         swal("Success!", "Payment Successful & Entry Created!", "success");
//       },

//       theme: {
//         color: "#3399cc"
//       }
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();

//   } catch (err) {
//     swal("Error!", "Payment Failed", "error");
//   }
// };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Chaitanya Mahaprabhu Museum Entry Pass</h1>
      {/* 🔥 PRICE DISPLAY */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card text-center shadow border-0 rounded-4">
            <div className="card-body">
              <h6 className="text-muted">Museum Entry</h6>
              <h2 className="text-primary fw-bold">₹{GALLERY_PRICE}</h2>
              <small>per person</small>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card text-center shadow border-0 rounded-4">
            <div className="card-body">
              <h6 className="text-muted">Movie Ticket</h6>
              <h2 className="text-success fw-bold">₹{MOVIE_PRICE}</h2>
              <small>per ticket</small>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body">

          <form onSubmit={handleSubmit}>

            {/* 👤 INFO */}
            <h5 className="mb-3 fw-bold">👤 Visitor Info</h5>

            <div className="row">
              <div className="col-md-6 mb-3">
                <input className="form-control form-control-lg"
                  placeholder="Full Name"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required />
              </div>

              <div className="col-md-6 mb-3">
                <input className="form-control form-control-lg"
                  placeholder="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required />
              </div>

              <div className="col-md-12 mb-3">
                <textarea className="form-control"
                  placeholder="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required />
              </div>
            </div>

            {/* 🎟️ TICKETS */}
            <h5 className="mt-4 fw-bold">🎟️ Ticket Info</h5>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label>Persons</label>
                <input type="number"
                  className="form-control"
                  name="num_of_persons"
                  value={formData.num_of_persons}
                  onChange={handleChange}
                  min="1" />
              </div>

              <div className="col-md-4 mb-3">
                <label>Movie Tickets</label>
                <input type="number"
                  className="form-control"
                  name="movie_show"
                  value={formData.movie_show}
                  onChange={handleChange}
                  min="0"
                  max={formData.num_of_persons} />
              </div>
                {authStatus  && <div className="col-md-4 mb-3">
                <label>Discount</label>
                <input
  type="number"
  className="form-control"
  name="discount"
  value={formData.discount}
  onChange={(e) => {
    const val = e.target.value;
    if (val < 0) return; // ❌ block negative
    handleChange(e);
  }}
  min="0"
/>
              </div>}

              
            </div>

            {/* 💰 TOTAL BOX */}
            <div className="mt-3 p-3 rounded-4 bg-dark text-white text-center">
              <h4 className="mb-0">Total: ₹ {formData.total_amt}</h4>
            </div>

            {/* 💳 PAYMENT */}
            <h5 className="mt-4 fw-bold">💳 Payment</h5>

            <div className="row">
              <div className="col-md-6 mb-3">
                <select className="form-control"
                  name="payment"
                  value={formData.payment}
                  onChange={handleChange}>
                  <option value="0">Cash</option>
                  <option value="1">Online</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <input className="form-control"
                  placeholder="Transaction ID"
                  name="txn_id"
                  value={formData.txn_id}
                  onChange={handleChange} />
              </div>
            </div>

            <button
              className="btn btn-lg w-100 mt-3 text-white"
              style={{
                background: "linear-gradient(45deg,#4facfe,#00f2fe)",
                border: "none"
              }}
              disabled={loading}
            >
              {loading ? "Processing..." : "Create Entry"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default MuseumEntry;