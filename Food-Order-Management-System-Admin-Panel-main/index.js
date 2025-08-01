require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const {MongoClient} = require('mongodb');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT;
const methodOverride = require('method-override');
const cors = require("cors");
const admin = require("firebase-admin");

app.use(cors());
app.use(express.json());


const serviceAccount = require("./serviceAccountKey.json"); // 👉 Add your service account key JSON here

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Utility to fetch data from a collection
const fetchCollection = async (collectionName) => {
  const snapshot = await db.collection(collectionName).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Create GET APIs for each collection
const routes = [
  "ProfessionalDB",
  "UserDB",
  "orders",
  "proLogin",
  "tableBookings",
  "userLogin",
];

routes.forEach((route) => {
  app.get(`/api/${route}`, async (req, res) => {
    try {
      const data = await fetchCollection(route);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: `Failed to fetch from ${route}` });
    }
  });
});

// Middleware to serve static files from 'assets' folder
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Middleware for body parsing
app.use(bodyParser.urlencoded({extended: true}));

// Serve Login Page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Meals On Wheels Admin Panel</title>
      <script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>
      <link rel="icon" href="assets/logo.png">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Poppins', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #000;
          color: #fff;
          overflow: hidden;
        }
        #particles-js {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: -1;
        }
        .login-container {
          text-align: center;
          background: rgba(0, 0, 0, 0.6);
          padding: 50px 30px;
          border-radius: 20px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.8);
          max-width: 500px;
          width: 95%;
          animation: slideIn 1s ease-out forwards;
          transition: transform 0.3s ease;
        }
        .login-container:hover {
          transform: scale(1.05);
        }
        .logo {
          width: 120px;
          height: 120px;
          margin-bottom: 20px;
          border-radius: 50%;
          border: 3px solid #fff;
          animation: pulse 1.5s infinite;
        }
        h1 {
          font-size: 36px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #fff;
          text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
        }
        input {
          width: 85%;
          padding: 12px 15px;
          margin: 15px 0;
          border: 2px solid #fff;
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
          font-size: 16px;
          transition: all 0.3s ease;
        }
        input:focus {
          border-color: #4CAF50;
          background: rgba(255, 255, 255, 0.1);
          outline: none;
        }
        button {
          width: 90%;
          padding: 12px 20px;
          border: none;
          border-radius: 5px;
          background-color: #4CAF50;
          color: #fff;
          font-size: 18px;
          cursor: pointer;
          margin-top: 20px;
          transition: all 0.3s ease;
        }
        button:hover {
          background-color: #45a049;
        }
        @keyframes slideIn {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        @media (max-width: 768px) {
          .login-container {
            padding: 40px 20px;
          }
          h1 {
            font-size: 28px;
          }
          input {
            width: 90%;
          }
          button {
            width: 95%;
          }
        }
      </style>
    </head>
    <body>
      <script>
        // Check if user is already logged in
        if (localStorage.getItem('loggedIn') === 'true') {
          window.location.href = '/home'; // Redirect to home if logged in
        }
      </script>
      <div id="particles-js"></div>
      <div class="login-container">
        <img src="/assets/logo.png" alt="App Logo" class="logo">
        <h1>Admin Login</h1>
        <form action="/login" method="POST">
          <input type="text" name="username" placeholder="Username" required>
          <input type="password" name="password" placeholder="Password" required>
          <button type="submit">Login</button>
        </form>
      </div>
      <script>
        particlesJS("particles-js", {
          particles: {
            number: { value: 150, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: {
              type: "circle",
              stroke: { width: 0, color: "#000000" },
              polygon: { nb_sides: 5 }
            },
            opacity: {
              value: 0.5,
              random: false,
              anim: { enable: false }
            },
            size: {
              value: 5,
              random: true,
              anim: { enable: false }
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: "#ffffff",
              opacity: 0.4,
              width: 1
            },
            move: {
              enable: true,
              speed: 4,
              direction: "none",
              random: false,
              straight: false,
              out_mode: "out",
              bounce: false,
              attract: { enable: false }
            }
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: { enable: true, mode: "repulse" },
              onclick: { enable: true, mode: "push" },
              resize: true
            },
            modes: {
              grab: { distance: 400, line_linked: { opacity: 1 } },
              bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
              repulse: { distance: 200, duration: 0.4 },
              push: { particles_nb: 4 },
              remove: { particles_nb: 2 }
            }
          },
          retina_detect: true
        });
      </script>
    </body>
    </html>
  `);
});

// Handle Login
app.post('/login', (req, res) => {
  const {username, password} = req.body;
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // Save login data to localStorage (in the browser context)
    res.send(`
      <script>
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('username', '${username}');
        window.location.href = '/home';
      </script>
    `);
  } else {
    res.send(`
      <script>
        alert('Invalid Username or Password');
        window.location.href = '/'; // Redirect back to login page
      </script>
    `);
  }
});

// Middleware to parse JSON
app.use(express.json());

app.get('/getdata', async (req, res) => {
  try {
    const collections = [
      "ProfessionalDB",
      "UserDB",
      "orders",
      "proLogin",
      "tableBookings",
      "userLogin",
    ];

    let allTablesHTML = '';

for (const col of collections) {
  const data = await fetchCollection(col);

  // Step 1: Get all unique keys
  const allKeysSet = new Set();
  data.forEach(doc => {
    Object.keys(doc).forEach(key => allKeysSet.add(key));
  });

  const allKeys = Array.from(allKeysSet); // consistent column order

  // Step 2: Build table rows with consistent columns
  const tableRows = data.map((doc, index) => {
    const cells = allKeys.map(key => {
      const value = doc[key];
      return `<td style="padding: 8px; border: 1px solid #ddd;">${value !== undefined ? (typeof value === 'object' ? JSON.stringify(value) : value) : ''}</td>`;
    }).join('');

    return `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
        ${cells}
        <td style="padding: 8px; border: 1px solid #ddd;">
          <form method="GET" action="/edit/${col}/${doc.id}" style="display:inline;">
            <button type="submit" style="background-color: #ffc107; border: none; padding: 5px 10px; margin-right: 5px; border-radius: 4px; color: #000;">Edit</button>
          </form>
          <form method="POST" action="/delete/${col}/${doc.id}" style="display:inline;" onsubmit="return confirm('Are you sure you want to delete this entry?');">
            <button type="submit" style="background-color: #dc3545; border: none; padding: 5px 10px; border-radius: 4px; color: #fff;">Delete</button>
          </form>
        </td>
      </tr>
    `;
  }).join('');

  // Step 3: Generate table header
  const headers = allKeys.map(key => `<th style="padding: 10px; border: 1px solid #ddd;">${key}</th>`).join('');

const tableHTML = `
  <div style="margin-bottom: 50px;">
    <h4 style="margin-bottom: 20px; color: #ff6600; border-bottom: 2px solid #000; padding-bottom: 5px;">${col}</h4>
    
    <!-- Responsive scroll wrapper -->
    <div style="
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 10px;
      background-color: #fff;
    ">
      <!-- Responsive table -->
      <table style="
        width: 100%;
        min-width: 700px;
        border-collapse: collapse;
      ">
        <thead>
          <tr style="background-color: #f1f1f1;">
            <th style="padding: 10px; border: 1px solid #ddd; white-space: nowrap;">#</th>
            ${headers}
            <th style="padding: 10px; border: 1px solid #ddd; white-space: nowrap;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows || `<tr><td colspan="${allKeys.length + 2}" style="padding: 10px; text-align: center;">No data available</td></tr>`}
        </tbody>
      </table>
    </div>
  </div>
`;


  allTablesHTML += tableHTML;
}

    res.send(`
    
<!doctype html>
<html lang="en">

<head>
    <meta charset=
    "utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Language" content="en">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <link rel="icon" href="assets/logo.png">
    <title>Meals On Wheels Admin Dashboard - This is an example dashboard created using built-in elements and components.</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no" />
    <meta name="description" content="This is an example dashboard created using built-in elements and components.">
    <meta name="msapplication-tap-highlight" content="no">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    // <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

    <!-- Include ArchitectUI styles -->
    <link href="https://demo.dashboardpack.com/architectui-html-free/main.css" rel="stylesheet">

    <!-- Include Stroke 7 Icon Font styles -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/pe-icon-7-stroke/1.2.0/pe-icon-7-stroke.min.css">
<link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
<style>
        .script-font {
            font-family: 'Pacifico', cursive;
            font-size: 30px;
            color: black;
        }
    </style>
    </head>
<body>
    <div class="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header">
        <div class="app-header header-shadow">
            <div class="app-header__logo">
                <div class="script-font">Admin Panel</div>
                <div class="header__pane ml-auto">
                    <div>
                        <button type="button" class="hamburger close-sidebar-btn hamburger--elastic" data-class="closed-sidebar">
                            <span class="hamburger-box">
                                <span class="hamburger-inner"></span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="app-header__mobile-menu">
                <div>
                    <button type="button" class="hamburger hamburger--elastic mobile-toggle-nav">
                        <span class="hamburger-box">
                            <span class="hamburger-inner"></span>
                        </span>
                    </button>
                </div>
            </div>
            <div class="app-header__menu">
                <span>
                    <button type="button" class="btn-icon btn-icon-only btn btn-primary btn-sm mobile-toggle-header-nav">
                        <span class="btn-icon-wrapper">
                            <i class="fa fa-ellipsis-v fa-w-6"></i>
                        </span>
                    </button>
                </span>
            </div>    <div class="app-header__content">
                <div class="app-header-left">
                    <div class="search-wrapper">
                        <div class="input-holder">
                            <input type="text" class="search-input" placeholder="Type to search">
                            <button class="search-icon"><span></span></button>
                        </div>
                        <button class="close"></button>
                    </div>
                    </div>
                <div class="app-header-right">
                    <div class="header-btn-lg pr-0">
                        <div class="widget-content p-0">
                            <div class="widget-content-wrapper">
                                <div class="widget-content-left">
                                    <div class="btn-group">
                                        <a data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="p-0 btn">
                                            <img width="42" class="rounded-circle" src="assets/images/avatars/1.jpg" alt="">
                                            <i class="fa fa-sign-out-alt ml-2 opacity-8" style="font-size: 15px; background: linear-gradient(145deg, #ff4b5c, #ff1e41); border-radius: 50%; padding: 10px; color: white; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), inset 0 4px 6px rgba(255, 255, 255, 0.3);"></i>

                                        </a>
                                        <div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu dropdown-menu-right">
<a href="/logout" class="dropdown-item" tabindex="0">Logout</a>                                        </div>
                                    </div>
                                </div>
                                <div class="widget-content-left  ml-3 header-user-info">
                                    <div class="widget-heading">
                                        ADMIN
                                    </div>
                                    <div class="widget-subheading">
                                        Meals On Wheels Admin
                                    </div>
                                </div>
                                <div class="widget-content-right header-user-info ml-3">
                                    <button type="button" class="btn-shadow p-1 btn btn-primary btn-sm show-toastr-example">
                                        <i class="fa text-white fa-calendar pr-1 pl-1"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>        </div>
            </div>
        </div>        <div class="ui-theme-settings">
            <button type="button" id="TooltipDemo" class="btn-open-options btn btn-warning">
                <i class="fa fa-cog fa-w-16 fa-spin fa-2x"></i>
            </button>
            <div class="theme-settings__inner">
                <div class="scrollbar-container">
                    <div class="theme-settings__options-wrapper">
                        <h3 class="themeoptions-heading">Layout Options
                        </h3>
                        <div class="p-3">
                            <ul class="list-group">
                                <li class="list-group-item">
                                    <div class="widget-content p-0">
                                        <div class="widget-content-wrapper">
                                            <div class="widget-content-left mr-3">
                                                <div class="switch has-switch switch-container-class" data-class="fixed-header">
                                                    <div class="switch-animate switch-on">
                                                        <input type="checkbox" checked data-toggle="toggle" data-onstyle="success">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="widget-content-left">
                                                <div class="widget-heading">Fixed Header
                                                </div>
                                                <div class="widget-subheading">Makes the header top fixed, always visible!
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class="list-group-item">
                                    <div class="widget-content p-0">
                                        <div class="widget-content-wrapper">
                                            <div class="widget-content-left mr-3">
                                                <div class="switch has-switch switch-container-class" data-class="fixed-sidebar">
                                                    <div class="switch-animate switch-on">
                                                        <input type="checkbox" checked data-toggle="toggle" data-onstyle="success">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="widget-content-left">
                                                <div class="widget-heading">Fixed Sidebar
                                                </div>
                                                <div class="widget-subheading">Makes the sidebar left fixed, always visible!
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class="list-group-item">
                                    <div class="widget-content p-0">
                                        <div class="widget-content-wrapper">
                                            <div class="widget-content-left mr-3">
                                                <div class="switch has-switch switch-container-class" data-class="fixed-footer">
                                                    <div class="switch-animate switch-off">
                                                        <input type="checkbox" data-toggle="toggle" data-onstyle="success">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="widget-content-left">
                                                <div class="widget-heading">Fixed Footer
                                                </div>
                                                <div class="widget-subheading">Makes the app footer bottom fixed, always visible!
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <h3 class="themeoptions-heading">
                            <div>
                                Header Options
                            </div>
                            <button type="button" class="btn-pill btn-shadow btn-wide ml-auto btn btn-focus btn-sm switch-header-cs-class" data-class="">
                                Restore Default
                            </button>
                        </h3>
                        <div class="p-3">
                            <ul class="list-group">
                                <li class="list-group-item">
                                    <h5 class="pb-2">Choose Color Scheme
                                    </h5>
                                    <div class="theme-settings-swatches">
                                        <div class="swatch-holder bg-primary switch-header-cs-class" data-class="bg-primary header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-secondary switch-header-cs-class" data-class="bg-secondary header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-success switch-header-cs-class" data-class="bg-success header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-info switch-header-cs-class" data-class="bg-info header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-warning switch-header-cs-class" data-class="bg-warning header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-danger switch-header-cs-class" data-class="bg-danger header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-light switch-header-cs-class" data-class="bg-light header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-dark switch-header-cs-class" data-class="bg-dark header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-focus switch-header-cs-class" data-class="bg-focus header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-alternate switch-header-cs-class" data-class="bg-alternate header-text-light">
                                        </div>
                                        <div class="divider">
                                        </div>
                                        <div class="swatch-holder bg-vicious-stance switch-header-cs-class" data-class="bg-vicious-stance header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-midnight-bloom switch-header-cs-class" data-class="bg-midnight-bloom header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-night-sky switch-header-cs-class" data-class="bg-night-sky header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-slick-carbon switch-header-cs-class" data-class="bg-slick-carbon header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-asteroid switch-header-cs-class" data-class="bg-asteroid header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-royal switch-header-cs-class" data-class="bg-royal header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-warm-flame switch-header-cs-class" data-class="bg-warm-flame header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-night-fade switch-header-cs-class" data-class="bg-night-fade header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-sunny-morning switch-header-cs-class" data-class="bg-sunny-morning header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-tempting-azure switch-header-cs-class" data-class="bg-tempting-azure header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-amy-crisp switch-header-cs-class" data-class="bg-amy-crisp header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-heavy-rain switch-header-cs-class" data-class="bg-heavy-rain header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-mean-fruit switch-header-cs-class" data-class="bg-mean-fruit header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-malibu-beach switch-header-cs-class" data-class="bg-malibu-beach header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-deep-blue switch-header-cs-class" data-class="bg-deep-blue header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-ripe-malin switch-header-cs-class" data-class="bg-ripe-malin header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-arielle-smile switch-header-cs-class" data-class="bg-arielle-smile header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-plum-plate switch-header-cs-class" data-class="bg-plum-plate header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-happy-fisher switch-header-cs-class" data-class="bg-happy-fisher header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-happy-itmeo switch-header-cs-class" data-class="bg-happy-itmeo header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-mixed-hopes switch-header-cs-class" data-class="bg-mixed-hopes header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-strong-bliss switch-header-cs-class" data-class="bg-strong-bliss header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-grow-early switch-header-cs-class" data-class="bg-grow-early header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-love-kiss switch-header-cs-class" data-class="bg-love-kiss header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-premium-dark switch-header-cs-class" data-class="bg-premium-dark header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-happy-green switch-header-cs-class" data-class="bg-happy-green header-text-light">
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <h3 class="themeoptions-heading">
                            <div>Sidebar Options</div>
                            <button type="button" class="btn-pill btn-shadow btn-wide ml-auto btn btn-focus btn-sm switch-sidebar-cs-class" data-class="">
                                Restore Default
                            </button>
                        </h3>
                        <div class="p-3">
                            <ul class="list-group">
                                <li class="list-group-item">
                                    <h5 class="pb-2">Choose Color Scheme
                                    </h5>
                                    <div class="theme-settings-swatches">
                                        <div class="swatch-holder bg-primary switch-sidebar-cs-class" data-class="bg-primary sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-secondary switch-sidebar-cs-class" data-class="bg-secondary sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-success switch-sidebar-cs-class" data-class="bg-success sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-info switch-sidebar-cs-class" data-class="bg-info sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-warning switch-sidebar-cs-class" data-class="bg-warning sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-danger switch-sidebar-cs-class" data-class="bg-danger sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-light switch-sidebar-cs-class" data-class="bg-light sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-dark switch-sidebar-cs-class" data-class="bg-dark sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-focus switch-sidebar-cs-class" data-class="bg-focus sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-alternate switch-sidebar-cs-class" data-class="bg-alternate sidebar-text-light">
                                        </div>
                                        <div class="divider">
                                        </div>
                                        <div class="swatch-holder bg-vicious-stance switch-sidebar-cs-class" data-class="bg-vicious-stance sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-midnight-bloom switch-sidebar-cs-class" data-class="bg-midnight-bloom sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-night-sky switch-sidebar-cs-class" data-class="bg-night-sky sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-slick-carbon switch-sidebar-cs-class" data-class="bg-slick-carbon sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-asteroid switch-sidebar-cs-class" data-class="bg-asteroid sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-royal switch-sidebar-cs-class" data-class="bg-royal sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-warm-flame switch-sidebar-cs-class" data-class="bg-warm-flame sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-night-fade switch-sidebar-cs-class" data-class="bg-night-fade sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-sunny-morning switch-sidebar-cs-class" data-class="bg-sunny-morning sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-tempting-azure switch-sidebar-cs-class" data-class="bg-tempting-azure sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-amy-crisp switch-sidebar-cs-class" data-class="bg-amy-crisp sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-heavy-rain switch-sidebar-cs-class" data-class="bg-heavy-rain sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-mean-fruit switch-sidebar-cs-class" data-class="bg-mean-fruit sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-malibu-beach switch-sidebar-cs-class" data-class="bg-malibu-beach sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-deep-blue switch-sidebar-cs-class" data-class="bg-deep-blue sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-ripe-malin switch-sidebar-cs-class" data-class="bg-ripe-malin sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-arielle-smile switch-sidebar-cs-class" data-class="bg-arielle-smile sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-plum-plate switch-sidebar-cs-class" data-class="bg-plum-plate sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-happy-fisher switch-sidebar-cs-class" data-class="bg-happy-fisher sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-happy-itmeo switch-sidebar-cs-class" data-class="bg-happy-itmeo sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-mixed-hopes switch-sidebar-cs-class" data-class="bg-mixed-hopes sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-strong-bliss switch-sidebar-cs-class" data-class="bg-strong-bliss sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-grow-early switch-sidebar-cs-class" data-class="bg-grow-early sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-love-kiss switch-sidebar-cs-class" data-class="bg-love-kiss sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-premium-dark switch-sidebar-cs-class" data-class="bg-premium-dark sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-happy-green switch-sidebar-cs-class" data-class="bg-happy-green sidebar-text-light">
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <h3 class="themeoptions-heading">
                            <div>Main Content Options</div>
                            <button type="button" class="btn-pill btn-shadow btn-wide ml-auto active btn btn-focus btn-sm">Restore Default
                            </button>
                        </h3>
                        <div class="p-3">
                            <ul class="list-group">
                                <li class="list-group-item">
                                    <h5 class="pb-2">Page Section Tabs
                                    </h5>
                                    <div class="theme-settings-swatches">
                                        <div role="group" class="mt-2 btn-group">
                                            <button type="button" class="btn-wide btn-shadow btn-primary btn btn-secondary switch-theme-class" data-class="body-tabs-line">
                                                Line
                                            </button>
                                            <button type="button" class="btn-wide btn-shadow btn-primary active btn btn-secondary switch-theme-class" data-class="body-tabs-shadow">
                                                Shadow
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>        <div class="app-main">
                <div class="app-sidebar sidebar-shadow">
                    <div class="app-header__logo">
                         <div class="script-font">Admin Panel</div>
                        <div class="header__pane ml-auto">
                            <div>
                                <button type="button" class="hamburger close-sidebar-btn hamburger--elastic" data-class="closed-sidebar">
                                    <span class="hamburger-box">
                                        <span class="hamburger-inner"></span>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="app-header__mobile-menu">
                        <div>
                            <button type="button" class="hamburger hamburger--elastic mobile-toggle-nav">
                                <span class="hamburger-box">
                                    <span class="hamburger-inner"></span>
                                </span>
                            </button>
                        </div>
                    </div>
                    <div class="app-header__menu">
                        <span>
                            <button type="button" class="btn-icon btn-icon-only btn btn-primary btn-sm mobile-toggle-header-nav">
                                <span class="btn-icon-wrapper">
                                    <i class="fa fa-ellipsis-v fa-w-6"></i>
                                </span>
                            </button>
                        </span>
                    </div>    <div class="scrollbar-sidebar">
                        <div class="app-sidebar__inner">
                            <ul class="vertical-nav-menu">
                                <li class="app-sidebar__heading">Dashboards Options</li>
<li>
    <a href="/home" class="mm-active" style="display: flex; align-items: center; background: linear-gradient(to right, #007bff, #a6c8ff); color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none; font-weight: bold; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), inset 0 0 5px rgba(255, 255, 255, 0.3);">
        <i class="fa fa-home" style="margin-right: 10px; font-size: 15px;"></i> <!-- Modern home icon -->
        Home
    </a>
</li>

<br>

<li>
  <a href="/getdata" class="mm-active"
     style="
      display: flex;
      align-items: center;
      background: linear-gradient(to right, #ff7e5f, #feb47b); 
      color: white;
      padding: 12px 18px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2), inset 0 0 8px rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease-in-out;
    "
    onmouseover="this.style.transform='scale(1.03)'"
    onmouseout="this.style.transform='scale(1)'"
  >
    <i class="fa fa-database" style="margin-right: 12px; font-size: 16px;"></i>
    View All Data
  </a>
</li>



<hr>

<li>
    <a href="/logout" class="mm-active" style="display: flex; align-items: center; background: linear-gradient(to right, #ff0000, #ffcccc); color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none; font-weight: bold; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), inset 0 0 5px rgba(255, 255, 255, 0.3);">
        <i class="fa fa-sign-out-alt" style="margin-right: 10px; font-size: 15px;"></i> <!-- Logout icon -->
        Logout
    </a>
</li>





                            </ul>
                        </div>
                    </div>
                </div>    
                <div class="app-main__outer">
                    <div class="app-main__inner">
                        <div class="app-page-title">
                            <div class="page-title-wrapper">
                                <div class="page-title-heading">
                                   <div class="page-title-icon" style="border-radius: 15px; display: flex; justify-content: center; align-items: center; width: 60px; height: 60px; padding: 10px;">
    <i class="fas fa-user-shield icon-gradient bg-mean-fruit"></i>
</div>

                                    <div>Meals On Wheels Record
                                        <div class="page-title-subheading">Meals On Wheels is a next-generation food order platform built with a modern full-stack architecture.
                                        </div>
                                    </div>
                                </div>
                                <div class="page-title-actions">
                                    
                                    
                                </div>    
                                </div>
                        </div>            
                       
                        
                        

<style>
    .widget-icon {
        text-align: center; /* Center align the icon */
        margin-top: 20px;
        transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease; /* Smooth transition */
    }

    .widget-icon i {
        color:rgb(235, 235, 235); /* Default white color for icons */
        font-size: 2.5rem; /* Smaller icon size */
        transition: transform 0.3s ease, color 0.5s ease, box-shadow 0.3s ease, filter 0.3s ease; /* Smooth transition */
        margin-right: 10px; /* Add margin on the right side of the icon */
        margin-left: 10px; /* Add margin on the right side of the icon */
    }

    /* Vibrant Icon Colors */
    .fa-users {
        color: #FF6347; /* Tomato red for Total Users icon */
    }

    .fa-puzzle-piece {
        color: #FFD700; /* Gold for Basic Quiz Users icon */
    }

    .fa-cogs {
        color: #20B2AA; /* Light Sea Green for Advanced Quiz icon */
    }

    /* Hover Effects for icons */
    .widget-icon:hover i {
        transform: rotate(360deg) scale(1.2); /* Rotate and scale on hover */
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2); /* Larger shadow on hover */
        filter: brightness(1.2); /* Slight brightness increase on hover */
    }

    /* Animation for Icons */
    .widget-icon i {
        animation: fadeIn 1s ease-in-out, bounce 1.5s ease infinite;
    }

    /* Fade-in Animation */
    @keyframes fadeIn {
        0% {
            opacity: 0;
            transform: translateY(20px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Bounce Animation */
    @keyframes bounce {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    /* Optional: Hover effect for the entire card (container) */
    .card {
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease;
    }

    .card:hover {
        transform: translateY(-5px); /* Slight lift on hover */
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1); /* Add shadow effect on hover */
    }
</style>








                      







                        


<style>
  /* Gradient Shiny Light Theme with White Shades and Light Colors */
  .custom-card {
    background: linear-gradient(145deg, #ffffff, #f7f7f7, #e6e6e6); /* Soft white gradient shades */
    border-radius: 15px; /* Rounded corners */
    box-shadow: 0px 4px 20px rgba(255, 255, 255, 0.5); /* Shiny white shadow effect */
    transition: box-shadow 0.3s ease-in-out; /* Smooth hover animation */
  }

  /* Hover Effect */
  .custom-card:hover {
    box-shadow: 0px 6px 25px rgba(255, 255, 255, 0.7); /* More pronounced white shadow on hover */
  }

  /* Header Style */
  .custom-card-header {
    background-color: #ffffff; /* Pure white background for the header */
    border-bottom: 2px solid #f0f0f0; /* Light grey border for separation */
    padding: 20px;
    border-top-left-radius: 15px; /* Rounded top-left corner */
    border-top-right-radius: 15px; /* Rounded top-right corner */
    box-shadow: 0px 2px 5px rgba(255, 255, 255, 0.3); /* Light shadow for floating effect */
    display: flex;
    align-items: center;
  }

  /* Icon and Title Style */
  .custom-card-header-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-left: 15px;
    color: #333; /* Darker color for text for better contrast */
  }

  /* Body of the Card */
  .custom-card-body {
    background-color: #ffffff; /* White background for the body */
    padding: 25px;
    border-bottom-left-radius: 15px; /* Rounded bottom-left corner */
    border-bottom-right-radius: 15px; /* Rounded bottom-right corner */
  }

  /* Colorful Gradient on Icons */
  .icon-gradient {
    background: linear-gradient(45deg, #ff6b6b, #ffb3b3, #ffdb99); /* Soft, colorful gradient */
    -webkit-background-clip: text;
    color: transparent;
  }

  /* Layout for the Dashboard */
  .dashboard-row {
    display: flex;
    flex-wrap: wrap; /* Wrap content in a row-wise manner */
    justify-content: space-around; /* Evenly space the cards */
  }

  .col-md-12, .col-lg-6 {
    width: 48%; /* Set width to 48% for the cards */
    margin-bottom: 20px; /* Add some space between the cards */
  }

  /* Ensure it works well on smaller screens */
  @media (max-width: 768px) {
    .col-md-12, .col-lg-6 {
      width: 100%; /* Stack cards vertically on small screens */
    }
  }

  /* Scrollable area for overflow content */
  .scroll-area-small {
    max-height: 200px;
    overflow-y: auto;
    margin-top: 20px;
  }

  /* Text styles */
  .text-muted {
    color: #6c757d !important;
  }

  .text-uppercase {
    text-transform: uppercase;
  }

  .font-size-md {
    font-size: 1rem;
  }

  .opacity-5 {
    opacity: 0.5;
  }

  .font-weight-normal {
    font-weight: normal;
  }
</style>

<div class="dashboard-row">



<!-- Include Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>



                           <div class="container">
          ${allTablesHTML}
        </div>


<script type="text/javascript" src="https://demo.dashboardpack.com/architectui-html-free/assets/scripts/main.js"></script></body>
</html>

  `);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
});



app.post('/delete/:collection/:id', async (req, res) => {
  const { collection, id } = req.params;
  try {
    await db.collection(collection).doc(id).delete();
    res.redirect('/getdata');
  } catch (error) {
    res.status(500).send(`Failed to delete from ${collection}: ${error.message}`);
  }
});

app.get('/edit/:collection/:id', async (req, res) => {
  const { collection, id } = req.params;
  try {
    const doc = await db.collection(collection).doc(id).get();
    if (!doc.exists) return res.status(404).send("Document not found");

    const data = doc.data();
    const fields = Object.entries(data)
      .map(([key, value]) => `
        <div class="mb-3">
          <label class="form-label">${key}</label>
          <input type="text" name="${key}" class="form-control" value="${value}">
        </div>
      `).join('');

    res.send(`
      <!doctype html>
      <html>
      <head>
        <title>Edit ${collection}</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body class="p-4">
        <div class="container">
          <h3 class="mb-4">Edit Record: ${collection} → ${id}</h3>
          <form method="POST" action="/edit/${collection}/${id}">
            ${fields}
            <button type="submit" class="btn btn-primary">Update</button>
            <a href="/getdata" class="btn btn-secondary">Cancel</a>
          </form>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("Failed to load edit form");
  }
});

app.post('/edit/:collection/:id', async (req, res) => {
  const { collection, id } = req.params;
  try {
    await db.collection(collection).doc(id).update(req.body);
    res.redirect('/getdata');
  } catch (error) {
    res.status(500).send(`Failed to update document: ${error.message}`);
  }
});






app.get('/home', async (req, res) => {
    try {
    const collections = [
      "ProfessionalDB",
      "UserDB",
      "orders",
      "proLogin",
      "tableBookings",
      "userLogin",
    ];

    let allTablesHTML = '';
    let totalUsers = 0;

    for (const col of collections) {
      const data = await fetchCollection(col);

      // Count users from relevant collections
      if (["UserDB", "userLogin", "proLogin", "ProfessionalDB"].includes(col)) {
        totalUsers += data.length;
      }

      const tableRows = data.map((doc, index) => {
        const cells = Object.entries(doc)
          .map(([key, value]) => `<td>${typeof value === 'object' ? JSON.stringify(value) : value}</td>`)
          .join('');

        return `
          <tr>
            <td>${index + 1}</td>
            ${cells}
            <td>
              <form method="GET" action="/edit/${col}/${doc.id}" style="display:inline;">
                <button type="submit" class="btn btn-warning btn-sm">Edit</button>
              </form>
              <form method="POST" action="/delete/${col}/${doc.id}" style="display:inline;" onsubmit="return confirm('Are you sure you want to delete this entry?');">
                <button type="submit" class="btn btn-danger btn-sm">Delete</button>
              </form>
            </td>
          </tr>
        `;
      }).join('');

      const headers = data.length > 0
        ? Object.keys(data[0]).map(key => `<th>${key}</th>`).join('')
        : '';

      const tableHTML = `
        <div class="row">
          <div class="col-12">
            <div class="main-card mb-3 card">
              <div class="card-header">${col}</div>
              <div class="table-responsive">
                <table class="align-middle mb-0 table table-borderless table-striped table-hover">
                  <thead>
                    <tr>
                      <th class="text-center">#</th>
                      ${headers}
                      <th class="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${tableRows || '<tr><td colspan="100%" class="text-center">No data available</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      `;

      allTablesHTML += tableHTML;
    }
    res.send(`
    
<!doctype html>
<html lang="en">

<head>
    <meta charset=
    "utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Language" content="en">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <link rel="icon" href="assets/logo.png">
    <title>Meals On Wheels Admin Dashboard - This is an example dashboard created using built-in elements and components.</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no" />
    <meta name="description" content="This is an example dashboard created using built-in elements and components.">
    <meta name="msapplication-tap-highlight" content="no">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    // <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

    <!-- Include ArchitectUI styles -->
    <link href="https://demo.dashboardpack.com/architectui-html-free/main.css" rel="stylesheet">

    <!-- Include Stroke 7 Icon Font styles -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/pe-icon-7-stroke/1.2.0/pe-icon-7-stroke.min.css">
<link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
<style>
        .script-font {
            font-family: 'Pacifico', cursive;
            font-size: 30px;
            color: black;
        }
    </style>
    </head>
<body>
    <div class="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header">
        <div class="app-header header-shadow">
            <div class="app-header__logo">
                <div class="script-font">Admin Panel</div>
                <div class="header__pane ml-auto">
                    <div>
                        <button type="button" class="hamburger close-sidebar-btn hamburger--elastic" data-class="closed-sidebar">
                            <span class="hamburger-box">
                                <span class="hamburger-inner"></span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="app-header__mobile-menu">
                <div>
                    <button type="button" class="hamburger hamburger--elastic mobile-toggle-nav">
                        <span class="hamburger-box">
                            <span class="hamburger-inner"></span>
                        </span>
                    </button>
                </div>
            </div>
            <div class="app-header__menu">
                <span>
                    <button type="button" class="btn-icon btn-icon-only btn btn-primary btn-sm mobile-toggle-header-nav">
                        <span class="btn-icon-wrapper">
                            <i class="fa fa-ellipsis-v fa-w-6"></i>
                        </span>
                    </button>
                </span>
            </div>    <div class="app-header__content">
                <div class="app-header-left">
                    <div class="search-wrapper">
                        <div class="input-holder">
                            <input type="text" class="search-input" placeholder="Type to search">
                            <button class="search-icon"><span></span></button>
                        </div>
                        <button class="close"></button>
                    </div>
                    </div>
                <div class="app-header-right">
                    <div class="header-btn-lg pr-0">
                        <div class="widget-content p-0">
                            <div class="widget-content-wrapper">
                                <div class="widget-content-left">
                                    <div class="btn-group">
                                        <a data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="p-0 btn">
                                            <img width="42" class="rounded-circle" src="assets/images/avatars/1.jpg" alt="">
                                            <i class="fa fa-sign-out-alt ml-2 opacity-8" style="font-size: 15px; background: linear-gradient(145deg, #ff4b5c, #ff1e41); border-radius: 50%; padding: 10px; color: white; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), inset 0 4px 6px rgba(255, 255, 255, 0.3);"></i>

                                        </a>
                                        <div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu dropdown-menu-right">
<a href="/logout" class="dropdown-item" tabindex="0">Logout</a>                                        </div>
                                    </div>
                                </div>
                                <div class="widget-content-left  ml-3 header-user-info">
                                    <div class="widget-heading">
                                        ADMIN
                                    </div>
                                    <div class="widget-subheading">
                                        Meals On Wheels Admin
                                    </div>
                                </div>
                                <div class="widget-content-right header-user-info ml-3">
                                    <button type="button" class="btn-shadow p-1 btn btn-primary btn-sm show-toastr-example">
                                        <i class="fa text-white fa-calendar pr-1 pl-1"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>        </div>
            </div>
        </div>        <div class="ui-theme-settings">
            <button type="button" id="TooltipDemo" class="btn-open-options btn btn-warning">
                <i class="fa fa-cog fa-w-16 fa-spin fa-2x"></i>
            </button>
            <div class="theme-settings__inner">
                <div class="scrollbar-container">
                    <div class="theme-settings__options-wrapper">
                        <h3 class="themeoptions-heading">Layout Options
                        </h3>
                        <div class="p-3">
                            <ul class="list-group">
                                <li class="list-group-item">
                                    <div class="widget-content p-0">
                                        <div class="widget-content-wrapper">
                                            <div class="widget-content-left mr-3">
                                                <div class="switch has-switch switch-container-class" data-class="fixed-header">
                                                    <div class="switch-animate switch-on">
                                                        <input type="checkbox" checked data-toggle="toggle" data-onstyle="success">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="widget-content-left">
                                                <div class="widget-heading">Fixed Header
                                                </div>
                                                <div class="widget-subheading">Makes the header top fixed, always visible!
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class="list-group-item">
                                    <div class="widget-content p-0">
                                        <div class="widget-content-wrapper">
                                            <div class="widget-content-left mr-3">
                                                <div class="switch has-switch switch-container-class" data-class="fixed-sidebar">
                                                    <div class="switch-animate switch-on">
                                                        <input type="checkbox" checked data-toggle="toggle" data-onstyle="success">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="widget-content-left">
                                                <div class="widget-heading">Fixed Sidebar
                                                </div>
                                                <div class="widget-subheading">Makes the sidebar left fixed, always visible!
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class="list-group-item">
                                    <div class="widget-content p-0">
                                        <div class="widget-content-wrapper">
                                            <div class="widget-content-left mr-3">
                                                <div class="switch has-switch switch-container-class" data-class="fixed-footer">
                                                    <div class="switch-animate switch-off">
                                                        <input type="checkbox" data-toggle="toggle" data-onstyle="success">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="widget-content-left">
                                                <div class="widget-heading">Fixed Footer
                                                </div>
                                                <div class="widget-subheading">Makes the app footer bottom fixed, always visible!
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <h3 class="themeoptions-heading">
                            <div>
                                Header Options
                            </div>
                            <button type="button" class="btn-pill btn-shadow btn-wide ml-auto btn btn-focus btn-sm switch-header-cs-class" data-class="">
                                Restore Default
                            </button>
                        </h3>
                        <div class="p-3">
                            <ul class="list-group">
                                <li class="list-group-item">
                                    <h5 class="pb-2">Choose Color Scheme
                                    </h5>
                                    <div class="theme-settings-swatches">
                                        <div class="swatch-holder bg-primary switch-header-cs-class" data-class="bg-primary header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-secondary switch-header-cs-class" data-class="bg-secondary header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-success switch-header-cs-class" data-class="bg-success header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-info switch-header-cs-class" data-class="bg-info header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-warning switch-header-cs-class" data-class="bg-warning header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-danger switch-header-cs-class" data-class="bg-danger header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-light switch-header-cs-class" data-class="bg-light header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-dark switch-header-cs-class" data-class="bg-dark header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-focus switch-header-cs-class" data-class="bg-focus header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-alternate switch-header-cs-class" data-class="bg-alternate header-text-light">
                                        </div>
                                        <div class="divider">
                                        </div>
                                        <div class="swatch-holder bg-vicious-stance switch-header-cs-class" data-class="bg-vicious-stance header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-midnight-bloom switch-header-cs-class" data-class="bg-midnight-bloom header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-night-sky switch-header-cs-class" data-class="bg-night-sky header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-slick-carbon switch-header-cs-class" data-class="bg-slick-carbon header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-asteroid switch-header-cs-class" data-class="bg-asteroid header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-royal switch-header-cs-class" data-class="bg-royal header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-warm-flame switch-header-cs-class" data-class="bg-warm-flame header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-night-fade switch-header-cs-class" data-class="bg-night-fade header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-sunny-morning switch-header-cs-class" data-class="bg-sunny-morning header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-tempting-azure switch-header-cs-class" data-class="bg-tempting-azure header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-amy-crisp switch-header-cs-class" data-class="bg-amy-crisp header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-heavy-rain switch-header-cs-class" data-class="bg-heavy-rain header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-mean-fruit switch-header-cs-class" data-class="bg-mean-fruit header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-malibu-beach switch-header-cs-class" data-class="bg-malibu-beach header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-deep-blue switch-header-cs-class" data-class="bg-deep-blue header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-ripe-malin switch-header-cs-class" data-class="bg-ripe-malin header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-arielle-smile switch-header-cs-class" data-class="bg-arielle-smile header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-plum-plate switch-header-cs-class" data-class="bg-plum-plate header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-happy-fisher switch-header-cs-class" data-class="bg-happy-fisher header-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-happy-itmeo switch-header-cs-class" data-class="bg-happy-itmeo header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-mixed-hopes switch-header-cs-class" data-class="bg-mixed-hopes header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-strong-bliss switch-header-cs-class" data-class="bg-strong-bliss header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-grow-early switch-header-cs-class" data-class="bg-grow-early header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-love-kiss switch-header-cs-class" data-class="bg-love-kiss header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-premium-dark switch-header-cs-class" data-class="bg-premium-dark header-text-light">
                                        </div>
                                        <div class="swatch-holder bg-happy-green switch-header-cs-class" data-class="bg-happy-green header-text-light">
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <h3 class="themeoptions-heading">
                            <div>Sidebar Options</div>
                            <button type="button" class="btn-pill btn-shadow btn-wide ml-auto btn btn-focus btn-sm switch-sidebar-cs-class" data-class="">
                                Restore Default
                            </button>
                        </h3>
                        <div class="p-3">
                            <ul class="list-group">
                                <li class="list-group-item">
                                    <h5 class="pb-2">Choose Color Scheme
                                    </h5>
                                    <div class="theme-settings-swatches">
                                        <div class="swatch-holder bg-primary switch-sidebar-cs-class" data-class="bg-primary sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-secondary switch-sidebar-cs-class" data-class="bg-secondary sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-success switch-sidebar-cs-class" data-class="bg-success sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-info switch-sidebar-cs-class" data-class="bg-info sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-warning switch-sidebar-cs-class" data-class="bg-warning sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-danger switch-sidebar-cs-class" data-class="bg-danger sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-light switch-sidebar-cs-class" data-class="bg-light sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-dark switch-sidebar-cs-class" data-class="bg-dark sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-focus switch-sidebar-cs-class" data-class="bg-focus sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-alternate switch-sidebar-cs-class" data-class="bg-alternate sidebar-text-light">
                                        </div>
                                        <div class="divider">
                                        </div>
                                        <div class="swatch-holder bg-vicious-stance switch-sidebar-cs-class" data-class="bg-vicious-stance sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-midnight-bloom switch-sidebar-cs-class" data-class="bg-midnight-bloom sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-night-sky switch-sidebar-cs-class" data-class="bg-night-sky sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-slick-carbon switch-sidebar-cs-class" data-class="bg-slick-carbon sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-asteroid switch-sidebar-cs-class" data-class="bg-asteroid sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-royal switch-sidebar-cs-class" data-class="bg-royal sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-warm-flame switch-sidebar-cs-class" data-class="bg-warm-flame sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-night-fade switch-sidebar-cs-class" data-class="bg-night-fade sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-sunny-morning switch-sidebar-cs-class" data-class="bg-sunny-morning sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-tempting-azure switch-sidebar-cs-class" data-class="bg-tempting-azure sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-amy-crisp switch-sidebar-cs-class" data-class="bg-amy-crisp sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-heavy-rain switch-sidebar-cs-class" data-class="bg-heavy-rain sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-mean-fruit switch-sidebar-cs-class" data-class="bg-mean-fruit sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-malibu-beach switch-sidebar-cs-class" data-class="bg-malibu-beach sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-deep-blue switch-sidebar-cs-class" data-class="bg-deep-blue sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-ripe-malin switch-sidebar-cs-class" data-class="bg-ripe-malin sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-arielle-smile switch-sidebar-cs-class" data-class="bg-arielle-smile sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-plum-plate switch-sidebar-cs-class" data-class="bg-plum-plate sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-happy-fisher switch-sidebar-cs-class" data-class="bg-happy-fisher sidebar-text-dark">
                                        </div>
                                        <div class="swatch-holder bg-happy-itmeo switch-sidebar-cs-class" data-class="bg-happy-itmeo sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-mixed-hopes switch-sidebar-cs-class" data-class="bg-mixed-hopes sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-strong-bliss switch-sidebar-cs-class" data-class="bg-strong-bliss sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-grow-early switch-sidebar-cs-class" data-class="bg-grow-early sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-love-kiss switch-sidebar-cs-class" data-class="bg-love-kiss sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-premium-dark switch-sidebar-cs-class" data-class="bg-premium-dark sidebar-text-light">
                                        </div>
                                        <div class="swatch-holder bg-happy-green switch-sidebar-cs-class" data-class="bg-happy-green sidebar-text-light">
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <h3 class="themeoptions-heading">
                            <div>Main Content Options</div>
                            <button type="button" class="btn-pill btn-shadow btn-wide ml-auto active btn btn-focus btn-sm">Restore Default
                            </button>
                        </h3>
                        <div class="p-3">
                            <ul class="list-group">
                                <li class="list-group-item">
                                    <h5 class="pb-2">Page Section Tabs
                                    </h5>
                                    <div class="theme-settings-swatches">
                                        <div role="group" class="mt-2 btn-group">
                                            <button type="button" class="btn-wide btn-shadow btn-primary btn btn-secondary switch-theme-class" data-class="body-tabs-line">
                                                Line
                                            </button>
                                            <button type="button" class="btn-wide btn-shadow btn-primary active btn btn-secondary switch-theme-class" data-class="body-tabs-shadow">
                                                Shadow
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>        <div class="app-main">
                <div class="app-sidebar sidebar-shadow">
                    <div class="app-header__logo">
                         <div class="script-font">Meals On Wheels</div>
                        <div class="header__pane ml-auto">
                            <div>
                                <button type="button" class="hamburger close-sidebar-btn hamburger--elastic" data-class="closed-sidebar">
                                    <span class="hamburger-box">
                                        <span class="hamburger-inner"></span>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="app-header__mobile-menu">
                        <div>
                            <button type="button" class="hamburger hamburger--elastic mobile-toggle-nav">
                                <span class="hamburger-box">
                                    <span class="hamburger-inner"></span>
                                </span>
                            </button>
                        </div>
                    </div>
                    <div class="app-header__menu">
                        <span>
                            <button type="button" class="btn-icon btn-icon-only btn btn-primary btn-sm mobile-toggle-header-nav">
                                <span class="btn-icon-wrapper">
                                    <i class="fa fa-ellipsis-v fa-w-6"></i>
                                </span>
                            </button>
                        </span>
                    </div>    <div class="scrollbar-sidebar">
                        <div class="app-sidebar__inner">
                            <ul class="vertical-nav-menu">
                                <li class="app-sidebar__heading">Dashboards Options</li>
<li>
    <a href="/home" class="mm-active" style="display: flex; align-items: center; background: linear-gradient(to right, #007bff, #a6c8ff); color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none; font-weight: bold; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), inset 0 0 5px rgba(255, 255, 255, 0.3);">
        <i class="fa fa-home" style="margin-right: 10px; font-size: 15px;"></i> <!-- Modern home icon -->
        Home
    </a>
</li>

<br>

<li>
  <a href="/getdata" class="mm-active"
     style="
      display: flex;
      align-items: center;
      background: linear-gradient(to right, #ff7e5f, #feb47b); 
      color: white;
      padding: 12px 18px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2), inset 0 0 8px rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease-in-out;
    "
    onmouseover="this.style.transform='scale(1.03)'"
    onmouseout="this.style.transform='scale(1)'"
  >
    <i class="fa fa-database" style="margin-right: 12px; font-size: 16px;"></i>
    View All Data
  </a>
</li>



<hr>

<li>
    <a href="/logout" class="mm-active" style="display: flex; align-items: center; background: linear-gradient(to right, #ff0000, #ffcccc); color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none; font-weight: bold; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), inset 0 0 5px rgba(255, 255, 255, 0.3);">
        <i class="fa fa-sign-out-alt" style="margin-right: 10px; font-size: 15px;"></i> <!-- Logout icon -->
        Logout
    </a>
</li>





                            </ul>
                        </div>
                    </div>
                </div>    
                <div class="app-main__outer">
                    <div class="app-main__inner">
                        <div class="app-page-title">
                            <div class="page-title-wrapper">
                                <div class="page-title-heading">
                                   <div class="page-title-icon" style="border-radius: 15px; display: flex; justify-content: center; align-items: center; width: 60px; height: 60px; padding: 10px;">
    <i class="fas fa-user-shield icon-gradient bg-mean-fruit"></i>
</div>

                                    <div>Meals On Wheels Admin Dashboard
                                        <div class="page-title-subheading">Meals On Wheels is a next-generation food order platform built with a modern full-stack architecture.
                                        </div>
                                    </div>
                                </div>
                                <div class="page-title-actions">
                                    
                                    
                                </div>    
                                </div>
                        </div>            
                       
                        
                        
<div class="row">
    <div class="col-md-6 col-xl-4">
        <div class="card mb-3 widget-content bg-midnight-bloom">
            <div class="widget-content-wrapper text-white">
                <div class="widget-content-left">
                    <div class="widget-heading">Total Users</div>
                    <div class="widget-subheading">Meals On Wheels Users</div>
                </div>
                <div class="widget-content-right">
                    <div class="widget-numbers text-white"><span>${totalUsers}</span></div>
                </div>
                <!-- Font Awesome Icon -->
                <div class="widget-icon">
                    <i class="fas fa-users-cog fa-3x"></i>  <!-- Modern Icon for Total Users -->
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-6 col-xl-4">
        <div class="card mb-3 widget-content bg-arielle-smile">
            <div class="widget-content-wrapper text-white">
                <div class="widget-content-left">
                    <div class="widget-heading">No of Servers</div>
                    <div class="widget-subheading">Total Users Of Servers</div>
                </div>
                <div class="widget-content-right">
                    <div class="widget-numbers text-white"><span>3</span></div>
                </div>
                <!-- Font Awesome Icon -->
                <div class="widget-icon">
                    <i class="fas fa-chalkboard-teacher fa-3x"></i>  <!-- Modern Icon for Basic Quiz Users -->
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-6 col-xl-4">
        <div class="card mb-3 widget-content bg-grow-early">
            <div class="widget-content-wrapper text-white">
                <div class="widget-content-left">
                    <div class="widget-heading">Meals On Wheels Versions</div>
                    <div class="widget-subheading">Total Users Of Meals On Wheels Versions</div>
                </div>
                <div class="widget-content-right">
                    <div class="widget-numbers text-white"><span>21</span></div>
                </div>
                <!-- Font Awesome Icon -->
                <div class="widget-icon">
                    <i class="fas fa-rocket fa-3x"></i>  <!-- Modern Icon for Advanced Quiz -->
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .widget-icon {
        text-align: center; /* Center align the icon */
        margin-top: 20px;
        transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease; /* Smooth transition */
    }

    .widget-icon i {
        color:rgb(235, 235, 235); /* Default white color for icons */
        font-size: 2.5rem; /* Smaller icon size */
        transition: transform 0.3s ease, color 0.5s ease, box-shadow 0.3s ease, filter 0.3s ease; /* Smooth transition */
        margin-right: 10px; /* Add margin on the right side of the icon */
        margin-left: 10px; /* Add margin on the right side of the icon */
    }

    /* Vibrant Icon Colors */
    .fa-users {
        color: #FF6347; /* Tomato red for Total Users icon */
    }

    .fa-puzzle-piece {
        color: #FFD700; /* Gold for Basic Quiz Users icon */
    }

    .fa-cogs {
        color: #20B2AA; /* Light Sea Green for Advanced Quiz icon */
    }

    /* Hover Effects for icons */
    .widget-icon:hover i {
        transform: rotate(360deg) scale(1.2); /* Rotate and scale on hover */
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2); /* Larger shadow on hover */
        filter: brightness(1.2); /* Slight brightness increase on hover */
    }

    /* Animation for Icons */
    .widget-icon i {
        animation: fadeIn 1s ease-in-out, bounce 1.5s ease infinite;
    }

    /* Fade-in Animation */
    @keyframes fadeIn {
        0% {
            opacity: 0;
            transform: translateY(20px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Bounce Animation */
    @keyframes bounce {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    /* Optional: Hover effect for the entire card (container) */
    .card {
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease;
    }

    .card:hover {
        transform: translateY(-5px); /* Slight lift on hover */
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1); /* Add shadow effect on hover */
    }
</style>








                      







                        


<style>
  /* Gradient Shiny Light Theme with White Shades and Light Colors */
  .custom-card {
    background: linear-gradient(145deg, #ffffff, #f7f7f7, #e6e6e6); /* Soft white gradient shades */
    border-radius: 15px; /* Rounded corners */
    box-shadow: 0px 4px 20px rgba(255, 255, 255, 0.5); /* Shiny white shadow effect */
    transition: box-shadow 0.3s ease-in-out; /* Smooth hover animation */
  }

  /* Hover Effect */
  .custom-card:hover {
    box-shadow: 0px 6px 25px rgba(255, 255, 255, 0.7); /* More pronounced white shadow on hover */
  }

  /* Header Style */
  .custom-card-header {
    background-color: #ffffff; /* Pure white background for the header */
    border-bottom: 2px solid #f0f0f0; /* Light grey border for separation */
    padding: 20px;
    border-top-left-radius: 15px; /* Rounded top-left corner */
    border-top-right-radius: 15px; /* Rounded top-right corner */
    box-shadow: 0px 2px 5px rgba(255, 255, 255, 0.3); /* Light shadow for floating effect */
    display: flex;
    align-items: center;
  }

  /* Icon and Title Style */
  .custom-card-header-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-left: 15px;
    color: #333; /* Darker color for text for better contrast */
  }

  /* Body of the Card */
  .custom-card-body {
    background-color: #ffffff; /* White background for the body */
    padding: 25px;
    border-bottom-left-radius: 15px; /* Rounded bottom-left corner */
    border-bottom-right-radius: 15px; /* Rounded bottom-right corner */
  }

  /* Colorful Gradient on Icons */
  .icon-gradient {
    background: linear-gradient(45deg, #ff6b6b, #ffb3b3, #ffdb99); /* Soft, colorful gradient */
    -webkit-background-clip: text;
    color: transparent;
  }

  /* Layout for the Dashboard */
  .dashboard-row {
    display: flex;
    flex-wrap: wrap; /* Wrap content in a row-wise manner */
    justify-content: space-around; /* Evenly space the cards */
  }

  .col-md-12, .col-lg-6 {
    width: 48%; /* Set width to 48% for the cards */
    margin-bottom: 20px; /* Add some space between the cards */
  }

  /* Ensure it works well on smaller screens */
  @media (max-width: 768px) {
    .col-md-12, .col-lg-6 {
      width: 100%; /* Stack cards vertically on small screens */
    }
  }

  /* Scrollable area for overflow content */
  .scroll-area-small {
    max-height: 200px;
    overflow-y: auto;
    margin-top: 20px;
  }

  /* Text styles */
  .text-muted {
    color: #6c757d !important;
  }

  .text-uppercase {
    text-transform: uppercase;
  }

  .font-size-md {
    font-size: 1rem;
  }

  .opacity-5 {
    opacity: 0.5;
  }

  .font-weight-normal {
    font-weight: normal;
  }
</style>

<div class="dashboard-row">



<!-- Include Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>



                            <div>
    <div class="mb-3 card">
        <div class="card-header-tab card-header">
            <div class="card-header-title">
                <i class="header-icon lnr-rocket icon-gradient bg-tempting-azure"> </i>
                Meals On Wheels Server Status
            </div>
            <div class="btn-actions-pane-right">
                <div class="nav">
                    <a href="javascript:void(0);" class="border-0 btn-pill btn-wide btn-transition active btn btn-outline-alternate">Server Statistics</a>
                    <a href="javascript:void(0);" class="ml-1 btn-pill btn-wide border-0 btn-transition  btn btn-outline-alternate second-tab-toggle-alt">Server Performance</a>
                </div>
            </div>
        </div>
        <div class="tab-content">
            <div class="tab-pane fade active show" id="tab-eg-55">
                <div class="widget-chart p-3">
                    <div style="height: 350px">
                        <canvas id="line-chart"></canvas>
                    </div>
                    <div class="widget-chart-content text-center mt-5">
                        <div class="widget-description mt-0 text-warning">
                            <i class="fa fa-arrow-left"></i>
                            <span class="pl-1">85%</span>
                            <span class="text-muted opacity-8 pl-1">Average Server Performance</span>
                        </div>
                    </div>
                </div>
                <div class="pt-2 card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="widget-content">
                                <div class="widget-content-outer">
                                    <div class="widget-content-wrapper">
                                        <div class="widget-content-left">
                                            <div class="widget-numbers fsize-3 text-muted">92%</div>
                                        </div>
                                        <div class="widget-content-right">
                                            <div class="text-muted opacity-6">Backup Ratio Since 30 Days</div>
                                        </div>
                                    </div>
                                    <div class="widget-progress-wrapper mt-1">
                                        <div class="progress-bar-sm progress-bar-animated-alt progress">
                                            <div class="progress-bar bg-success" role="progressbar" aria-valuenow="92" aria-valuemin="0" aria-valuemax="100" style="width: 92%;"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="widget-content">
                                <div class="widget-content-outer">
                                    <div class="widget-content-wrapper">
                                        <div class="widget-content-left">
                                            <div class="widget-numbers fsize-3 text-muted">8%</div>
                                        </div>
                                        <div class="widget-content-right">
                                            <div class="text-muted opacity-6">Shutdown Ratio</div>
                                        </div>
                                    </div>
                                    <div class="widget-progress-wrapper mt-1">
                                        <div class="progress-bar-sm progress-bar-animated-alt progress">
                                            <div class="progress-bar bg-danger" role="progressbar" aria-valuenow="8" aria-valuemin="0" aria-valuemax="100" style="width: 8%;"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="widget-content">
                                <div class="widget-content-outer">
                                    <div class="widget-content-wrapper">
                                        <div class="widget-content-left">
                                            <div class="widget-numbers fsize-3 text-muted">95%</div>
                                        </div>
                                        <div class="widget-content-right">
                                            <div class="text-muted opacity-6">Server Speed Ratio</div>
                                        </div>
                                    </div>
                                    <div class="widget-progress-wrapper mt-1">
                                        <div class="progress-bar-sm progress-bar-animated-alt progress">
                                            <div class="progress-bar bg-primary" role="progressbar" aria-valuenow="95" aria-valuemin="0" aria-valuemax="100" style="width: 95%;"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="widget-content">
                                <div class="widget-content-outer">
                                    <div class="widget-content-wrapper">
                                        <div class="widget-content-left">
                                            <div class="widget-numbers fsize-3 text-muted">60%</div>
                                        </div>
                                        <div class="widget-content-right">
                                            <div class="text-muted opacity-6">Average Time Ratio</div>
                                        </div>
                                    </div>
                                    <div class="widget-progress-wrapper mt-1">
                                        <div class="progress-bar-sm progress-bar-animated-alt progress">
                                            <div class="progress-bar bg-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tab-pane fade" id="tab-eg-56">
                <div class="widget-chart p-3">
                    <div class="text-center">
                        <h5>Quiz Performance Overview</h5>
                        <div style="height: 300px">
                            <canvas id="performance-chart"></canvas>
                        </div>
                    </div>
                </div>
                <div class="pt-2 card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="widget-content">
                                <div class="widget-content-outer">
                                    <div class="widget-content-wrapper">
                                        <div class="widget-content-left">
                                            <div class="widget-numbers fsize-3 text-muted">78%</div>
                                        </div>
                                        <div class="widget-content-right">
                                            <div class="text-muted opacity-6">Passed Quizzes</div>
                                        </div>
                                    </div>
                                    <div class="widget-progress-wrapper mt-1">
                                        <div class="progress-bar-sm progress-bar-animated-alt progress">
                                            <div class="progress-bar bg-success" role="progressbar" aria-valuenow="78" aria-valuemin="0" aria-valuemax="100" style="width: 78%;"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="widget-content">
                                <div class="widget-content-outer">
                                    <div class="widget-content-wrapper">
                                        <div class="widget-content-left">
                                            <div class="widget-numbers fsize-3 text-muted">22%</div>
                                        </div>
                                        <div class="widget-content-right">
                                            <div class="text-muted opacity-6">Failed Quizzes</div>
                                        </div>
                                    </div>
                                    <div class="widget-progress-wrapper mt-1">
                                        <div class="progress-bar-sm progress-bar-animated-alt progress">
                                            <div class="progress-bar bg-danger" role="progressbar" aria-valuenow="22" aria-valuemin="0" aria-valuemax="100" style="width: 22%;"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<div class="app-wrapper-footer">
                        <div class="app-footer">
                            <div class="app-footer__inner">
                                <div class="app-footer-left">
                                    <ul class="nav">
                                        <li class="nav-item">
                                            <a href="javascript:void(0);" class="nav-link">
                                                Meals On Wheels Private Limited
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a href="javascript:void(0);" class="nav-link">
                                                Developed By Meals On Wheels
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="app-footer-right">
                                    <ul class="nav">
                                        <li class="nav-item">
                                            <a href="javascript:void(0);" class="nav-link">
                                                Where Technology Meet Revolution
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a href="javascript:void(0);" class="nav-link">
                                                <div class="badge badge-success mr-1 ml-0">
                                                    <small>1.0 Version</small>
                                                </div>
                                                Beta Version
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>    </div>

                    
                <script src="http://maps.google.com/maps/api/js?sensor=true"></script>
        </div>
    </div>
<script type="text/javascript" src="https://demo.dashboardpack.com/architectui-html-free/assets/scripts/main.js"></script></body>
</html>

  `);}
  catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
});

// Logout Route
app.get('/logout', (req, res) => {
  res.send(`
    <script>
      if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('username');
        window.location.href = '/';
      } else {
        window.location.href = '/home';  // Redirect back to the home page if canceled
      }
    </script>
  `);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
