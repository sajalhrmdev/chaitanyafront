// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import loginbg from "../../images/pic1.png";

// function AdminLogin() {
//   const [email, setEmail] = useState('admin@museum.com');
//   const [password, setPassword] = useState('admin123');
//   const [errors, setErrors] = useState({ email: '', password: '' });
//   const navigate = useNavigate();

//   function onLogin(e) {
//     e.preventDefault();
//     let error = false;
//     const errorObj = { email: '', password: '' };
    
//     if (email === '') {
//       errorObj.email = 'Email is Required';
//       error = true;
//     }
//     if (password === '') {
//       errorObj.password = 'Password is Required';
//       error = true;
//     }
    
//     setErrors(errorObj);
//     if (error) return;

//     // Admin credentials check
//     if (email === 'admin@museum.com' && password === 'admin123') {
//       localStorage.setItem('userRole', 'admin');
//       localStorage.setItem('isAuthenticated', 'true');
//       navigate('/data-entry');
//     } else {
//       setErrors({ email: 'Invalid Admin credentials', password: '' });
//     }
//   }

//   return (
//     <div className="authincation d-flex flex-column flex-lg-row flex-column-fluid">
//       <div className="login-aside text-center d-flex flex-column flex-row-auto">
//         <div className="d-flex flex-column-auto flex-column pt-lg-40 pt-15">
//           <div className="text-center mb-4 pt-5">
//             <h2 className="text-white">Museum</h2>
//           </div>
//           <h3 className="mb-2 text-white">Admin Portal</h3>
//           <p className="text-white">Data Entry & Management</p>
//         </div>
//         <div className="aside-image" style={{backgroundImage:"url(" + loginbg + ")"}}></div>
//       </div>
      
//       <div className="container flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
//         <div className="d-flex justify-content-center h-100 align-items-center">
//           <div className="authincation-content style-2">
//             <div className="row no-gutters">
//               <div className="col-xl-12 tab-content">
//                 <div id="sign-in" className="auth-form form-validation">
//                   <form onSubmit={onLogin} className="form-validate">
//                     <h3 className="text-center mb-4 text-black">Admin Login</h3>
                    
//                     <div className="form-group mb-3">
//                       <label className="mb-1" htmlFor="val-email"><strong>Email</strong></label>
//                       <input 
//                         type="email" 
//                         className="form-control"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         placeholder="Admin Email"
//                       />
//                       {errors.email && <div className="text-danger fs-12">{errors.email}</div>}
//                     </div>
                    
//                     <div className="form-group mb-3">
//                       <label className="mb-1"><strong>Password</strong></label>
//                       <input
//                         type="password"
//                         className="form-control"
//                         value={password}
//                         placeholder="Admin Password"
//                         onChange={(e) => setPassword(e.target.value)}
//                       />
//                       {errors.password && <div className="text-danger fs-12">{errors.password}</div>}
//                     </div>
                    
//                     <div className="text-center form-group mb-3">
//                       <button type="submit" className="btn btn-primary btn-block">
//                         Admin Login
//                       </button>
//                     </div>
//                   </form>
                  
//                   <div className="new-account mt-3">
//                     <p>Super Admin? <Link className="text-primary" to="/super-admin-login">Super Admin Login</Link></p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminLogin;




import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginbg from "../../images/pic1.png";
import axios from 'axios';
import { loadUserPermissions } from '../../utils/permissions';

function AdminLogin() {

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');

  const [errors, setErrors] = useState({ username: '', password: '' });

  const navigate = useNavigate();

  // function onLogin(e) {
  //   e.preventDefault();

  //   let error = false;
  //   const errorObj = { username: '', password: '' };

  //   if (!username) {
  //     errorObj.username = 'Username is Required';
  //     error = true;
  //   }

  //   if (!password) {
  //     errorObj.password = 'Password is Required';
  //     error = true;
  //   }

  //   setErrors(errorObj);
  //   if (error) return;

  //   // 🔥 HARD CODED LOGIN (TEMP)
  //   if (username === 'admin' && password === 'admin123') {
  //     localStorage.setItem('userRole', 'admin');
  //     localStorage.setItem('isAuthenticated', 'true');
  //     navigate('/data-entry');
  //   } else {
  //     setErrors({ username: 'Invalid Admin credentials', password: '' });
  //   }
  // }
 

async function onLogin(e) {
  e.preventDefault();

  let error = false;
  const errorObj = { username: '', password: '' };

  if (!username) {
    errorObj.username = 'Username is Required';
    error = true;
  }

  if (!password) {
    errorObj.password = 'Password is Required';
    error = true;
  }

  setErrors(errorObj);
  if (error) return;

  try {
    const res = await axios.post(
      // 'http://localhost:3003/api/auth/login',
      // 'https://sri-chaitanya-mahaprabhu-museum-entry.onrender.com/api/auth/login',
      'https://chaitanyaback.onrender.com/api/auth/login',
      {
        username,
        password
      }
    );

    const user = res.data.user;

    // 🔥 STORE USER INFO
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', user.admin_role_id === 1 ? 'superadmin' : 'admin');
    localStorage.setItem('adminRoleId', user.admin_role_id);
    localStorage.setItem('username', user.username);
    localStorage.setItem('userData', JSON.stringify(user));

    await loadUserPermissions();

    // 🔥 REDIRECT BASED ON ROLE
    if (user.admin_role_id === 1) {
      navigate('/super-admin-dashboard');
    } else {
      navigate('/museum-entries');
    }

  } catch (err) {
    setErrors({
      username: err.response?.data?.error || 'Login failed',
      password: ''
    });
  }
}

  return (
    <div className="authincation d-flex flex-column flex-lg-row flex-column-fluid">

      {/* LEFT SIDE */}
      <div className="login-aside text-center d-flex flex-column flex-row-auto bg-primary text-white">

        <div className="d-flex flex-column-auto flex-column pt-lg-40 pt-15">
          <div className="text-center mb-4 pt-5">
            <h2 className="fw-bold">🏛️ Museum</h2>
          </div>

          <h3 className="mb-2">Admin Portal</h3>
          <p>Data Entry & Management</p>
        </div>

        <div
          className="aside-image"
          style={{ backgroundImage: `url(${loginbg})` }}
        ></div>

      </div>

      {/* RIGHT SIDE */}
      <div className="container flex-row-fluid d-flex flex-column justify-content-center p-4">

        <div className="d-flex justify-content-center align-items-center">

          <div className="authincation-content shadow-lg rounded-4 p-4 bg-white" style={{ width: "100%", maxWidth: "400px" }}>

            <form onSubmit={onLogin}>

              <h3 className="text-center mb-4 fw-bold text-dark">
                🔐 Admin Login
              </h3>

              {/* USERNAME */}
              <div className="form-group mb-3">
                <label className="mb-1"><strong>Username</strong></label>
                <input
                  type="text"
                  className="form-control shadow-sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                />
                {errors.username && (
                  <div className="text-danger small">{errors.username}</div>
                )}
              </div>

              {/* PASSWORD */}
              <div className="form-group mb-3">
                <label className="mb-1"><strong>Password</strong></label>
                <input
                  type="password"
                  className="form-control shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
                {errors.password && (
                  <div className="text-danger small">{errors.password}</div>
                )}
              </div>

              {/* BUTTON */}
              <div className="text-center mt-3">
                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-bold shadow-sm"
                >
                  Login
                </button>
              </div>

            </form>

            <div className="text-center mt-3">
              <small>
                Super Admin?{" "}
                <Link className="text-primary fw-semibold" to="/super-admin-login">
                  Login here
                </Link>
              </small>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;