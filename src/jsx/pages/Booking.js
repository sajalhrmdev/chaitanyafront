import React, { useEffect, useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

const API = 'https://chaitanyaback.onrender.com/api/booking';

const SERVICE_CHARGE = 1000;
const BOOKING_CHARGE = 3000; // for 3 hours
const EXTRA_HOUR_CHARGE = 1000;
const BASE_HOURS = 3;

const Booking = () => {
  const [formData, setFormData] = useState({
    fullname: '', phone: '', email: '', address: '',
    booking_date: '', booking_time: '',
    extra_hours: '0', payment: '0', txn_id: ''
  });
  const [loading, setLoading] = useState(false);

  const extraHours = Number(formData.extra_hours) || 0;
  const extraCharge = extraHours * EXTRA_HOUR_CHARGE;
  const totalAmt = SERVICE_CHARGE + BOOKING_CHARGE + extraCharge;
  const totalHours = BASE_HOURS + extraHours;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      hours: totalHours,
      service_charge: SERVICE_CHARGE,
      booking_charge: BOOKING_CHARGE,
      extra_charge: extraCharge,
      total_amt: totalAmt
    };

    // Online payment → Razorpay
    if (formData.payment === '1') {
      try {
        const { data: order } = await axios.post(
          'https://chaitanyaback.onrender.com/api/razorpay/create-order',
          { amount: totalAmt }
        );

        const options = {
          key: 'rzp_live_RkF1Uzk5QpuC1K',
          amount: order.amount,
          currency: 'INR',
          name: 'Booking Payment',
          description: `${totalHours} Hours Booking`,
          order_id: order.id,
          handler: async function (response) {
            const finalPayload = { ...payload, payment: '1', txn_id: response.razorpay_payment_id };
            const res = await axios.post(API, finalPayload);
            swal("Success!", "Payment Done & Booking Confirmed!", "success");
            resetForm();
          },
          theme: { color: '#3399cc' }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch {
        swal("Error!", "Payment Failed", "error");
      } finally { setLoading(false); }
      return;
    }

    // Cash payment
    try {
      await axios.post(API, payload);
      swal("Success!", "Booking Created!", "success");
      resetForm();
    } catch {
      swal("Error!", "Failed to create booking", "error");
    } finally { setLoading(false); }
  };

  const resetForm = () => {
    setFormData({ fullname: '', phone: '', email: '', address: '', booking_date: '', booking_time: '', extra_hours: '0', payment: '0', txn_id: '' });
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">📋 Booking Form</h2>

      {/* PRICE BREAKDOWN */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center shadow-sm border-0 rounded-4">
            <div className="card-body">
              <h6 className="text-muted">Service Charge</h6>
              <h3 className="text-primary fw-bold">₹{SERVICE_CHARGE}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm border-0 rounded-4">
            <div className="card-body">
              <h6 className="text-muted">Booking (3 Hours)</h6>
              <h3 className="text-success fw-bold">₹{BOOKING_CHARGE}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm border-0 rounded-4">
            <div className="card-body">
              <h6 className="text-muted">Extra Hour</h6>
              <h3 className="text-danger fw-bold">₹{EXTRA_HOUR_CHARGE}/hr</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>

            <h5 className="mb-3 fw-bold">👤 Personal Info</h5>
            <div className="row">
              <div className="col-md-6 mb-3">
                <input className="form-control form-control-lg" placeholder="Full Name *" name="fullname" value={formData.fullname} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <input className="form-control form-control-lg" placeholder="Phone *" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <input className="form-control" placeholder="Email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <input className="form-control" placeholder="Address" name="address" value={formData.address} onChange={handleChange} />
              </div>
            </div>

            <h5 className="mt-4 fw-bold">📅 Booking Details</h5>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label>Booking Date *</label>
                <input type="date" className="form-control" name="booking_date" value={formData.booking_date} onChange={handleChange} required />
              </div>
              <div className="col-md-4 mb-3">
                <label>Booking Time</label>
                <input type="time" className="form-control" name="booking_time" value={formData.booking_time} onChange={handleChange} />
              </div>
              <div className="col-md-4 mb-3">
                <label>Extra Hours (₹{EXTRA_HOUR_CHARGE}/hr)</label>
                <input type="number" className="form-control" name="extra_hours" value={formData.extra_hours} onChange={handleChange} min="0" />
              </div>
            </div>

            {/* PRICE SUMMARY */}
            <div className="mt-3 p-3 rounded-4 bg-light">
              <div className="row text-center">
                <div className="col-4"><small className="text-muted">Service</small><br/><strong>₹{SERVICE_CHARGE}</strong></div>
                <div className="col-4"><small className="text-muted">Booking ({BASE_HOURS}hr)</small><br/><strong>₹{BOOKING_CHARGE}</strong></div>
                <div className="col-4"><small className="text-muted">Extra ({extraHours}hr)</small><br/><strong>₹{extraCharge}</strong></div>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-4 bg-dark text-white text-center">
              <h4 className="mb-0">Total: ₹{totalAmt} ({totalHours} Hours)</h4>
            </div>

            {/* PAYMENT */}
            <h5 className="mt-4 fw-bold">💳 Payment</h5>
            <div className="row">
              <div className="col-md-6 mb-3">
                <select className="form-control" name="payment" value={formData.payment} onChange={handleChange}>
                  <option value="0">Cash</option>
                  <option value="1">Online</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <input className="form-control" placeholder="Transaction ID" name="txn_id" value={formData.txn_id} onChange={handleChange} />
              </div>
            </div>

            <button className="btn btn-lg w-100 mt-3 text-white" style={{ background: 'linear-gradient(45deg,#4facfe,#00f2fe)', border: 'none' }} disabled={loading}>
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
