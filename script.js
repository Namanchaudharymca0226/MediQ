/* =========================================================
   MediQueue — Full Application Logic
   Storage strategy:
     localStorage   → mq_users (array), mq_doctors (array), mq_tokens (array)
     sessionStorage  → mq_session (current logged-in user object)
   ========================================================= */

/* ── Utilities ─────────────────────────────────────────── */

function mqGetItem(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch(e) {
    return fallback;
  }
}

function mqSetItem(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

function mqGetSession() {
  try {
    const session = sessionStorage.getItem('mq_session') || localStorage.getItem('mq_session');
    return session ? JSON.parse(session) : null;
  } catch(e) {
    return null;
  }
}

function mqSetSession(obj) {
  sessionStorage.setItem('mq_session', JSON.stringify(obj));
  localStorage.setItem('mq_session', JSON.stringify(obj));
}

function mqClearSession() {
  sessionStorage.removeItem('mq_session');
  localStorage.removeItem('mq_session');
}

function mqGetUsers()   { return mqGetItem('mq_users', []); }
function mqGetDoctors() { return mqGetItem('mq_doctors', []); }
function mqGetTokens()  { return mqGetItem('mq_tokens', []); }
function mqSaveTokens(t){ mqSetItem('mq_tokens', t); }

function mqIsValidEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val).trim());
}

function mqIsValidPhone(val) {
  return /^[0-9]{10}$/.test(String(val).replace(/\D/g, ''));
}

function mqTodayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function mqTodayFormatted() {
  const d = new Date();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/* ── Initial Demo Data Seeding ────────────────────────── */
function mqSeedData() {
  // 1. Seed doctors if empty
  const existingDocs = mqGetDoctors();
  if(!existingDocs || existingDocs.length === 0) {
    const seedDocs = [
      { id:'DR-001', name:'Dr. Anjali Rao',    email:'anjali.rao@mediqueue.in',    dept:'Cardiology',       spec:'Interventional Cardiology',  exp:14, license:'MCI-204831', hours:'Mon–Fri, 10am–4pm', room:'204', rating:4.9, initials:'AR', color:'c1', password:'doctor123' },
      { id:'DR-002', name:'Dr. Sameer Khanna', email:'sameer.khanna@mediqueue.in', dept:'Orthopaedics',     spec:'Joint Replacement & Sports',  exp:11, license:'MCI-119024', hours:'Tue–Sat, 9am–1pm',  room:'118', rating:4.8, initials:'SK', color:'c2', password:'doctor123' },
      { id:'DR-003', name:'Dr. Meera Iyer',    email:'meera.iyer@mediqueue.in',    dept:'Pediatrics',       spec:'Neonatology & Growth',        exp:9,  license:'MCI-302770', hours:'Mon–Sat, 11am–5pm', room:'302', rating:5.0, initials:'MI', color:'c3', password:'doctor123' },
      { id:'DR-004', name:'Dr. Rohan Verma',   email:'rohan.verma@mediqueue.in',   dept:'General Medicine', spec:'Internal Medicine',           exp:7,  license:'MCI-101556', hours:'Mon–Sun, 8am–2pm',  room:'101', rating:4.7, initials:'RV', color:'c4', password:'doctor123' },
      { id:'DR-005', name:'Dr. Nisha Pillai',  email:'nisha.pillai@mediqueue.in',  dept:'Dermatology',      spec:'Medical & Cosmetic Derm',     exp:8,  license:'MCI-210341', hours:'Wed–Sun, 12pm–6pm', room:'210', rating:4.9, initials:'NP', color:'c5', password:'doctor123' },
      { id:'DR-006', name:'Dr. Arjun Kapoor',  email:'arjun.kapoor@mediqueue.in',  dept:'Neurology',        spec:'Epilepsy & Migraine',         exp:12, license:'MCI-305129', hours:'Mon, Wed, Fri 2–7pm',room:'305',rating:4.8, initials:'AK', color:'c6', password:'doctor123' },
    ];
    mqSetItem('mq_doctors', seedDocs);
  }

  // 2. Seed initial users if empty
  const existingUsers = mqGetUsers();
  if(!existingUsers || existingUsers.length === 0) {
    const seedUsers = [
      {
        role: 'patient',
        name: 'Aditi Sharma',
        email: 'aditi@example.com',
        phone: '9876543210',
        age: '28',
        gender: 'Female',
        password: 'password123',
        joined: new Date().toISOString()
      },
      {
        role: 'patient',
        name: 'Aditi Sharma',
        email: 'you@example.com',
        phone: '9876543210',
        age: '28',
        gender: 'Female',
        password: 'password123',
        joined: new Date().toISOString()
      }
    ];
    mqSetItem('mq_users', seedUsers);
  }

  // 3. Seed initial tokens if empty (so dashboard and token history have initial mock context)
  const existingTokens = mqGetTokens();
  if(!existingTokens || existingTokens.length === 0) {
    const seedTokens = [
      {
        code: 'N-017',
        patientName: 'Aditi Sharma',
        patientEmail: 'aditi@example.com',
        patientPhone: '9876543210',
        doctor: 'Dr. Arjun Kapoor',
        doctorName: 'Dr. Arjun Kapoor',
        dept: 'Neurology',
        date: '04 May 2026',
        prefDate: '04 May 2026',
        status: 'Cancelled',
        createdAt: '2026-05-04T09:00:00.000Z'
      },
      {
        code: 'O-058',
        patientName: 'Aditi Sharma',
        patientEmail: 'aditi@example.com',
        patientPhone: '9876543210',
        doctor: 'Dr. Sameer Khanna',
        doctorName: 'Dr. Sameer Khanna',
        dept: 'Orthopaedics',
        date: '19 Jun 2026',
        prefDate: '19 Jun 2026',
        status: 'Done',
        createdAt: '2026-06-19T10:00:00.000Z'
      },
      {
        code: 'C-104',
        patientName: 'Aditi Sharma',
        patientEmail: 'aditi@example.com',
        patientPhone: '9876543210',
        doctor: 'Dr. Anjali Rao',
        doctorName: 'Dr. Anjali Rao',
        dept: 'Cardiology',
        date: '02 Aug 2026',
        prefDate: '02 Aug 2026',
        status: 'Done',
        createdAt: '2026-08-02T11:00:00.000Z'
      },
      {
        code: 'G-231',
        patientName: 'Aditi Sharma',
        patientEmail: 'aditi@example.com',
        patientPhone: '9876543210',
        doctor: 'Dr. Rohan Verma',
        doctorName: 'Dr. Rohan Verma',
        dept: 'General Medicine',
        date: mqTodayFormatted(),
        prefDate: mqTodayFormatted(),
        status: 'Waiting',
        createdAt: new Date().toISOString()
      }
    ];
    mqSaveTokens(seedTokens);
  }
}

/* ── Token Code Generator ─────────────────────────────────── */
function mqGenerateTokenCode(dept) {
  const prefix = (dept && dept.length ? dept.charAt(0) : 'G').toUpperCase();
  const tokens = mqGetTokens();
  const deptTokens = tokens.filter(t => t.dept === dept || (t.code && t.code.startsWith(prefix)));
  let num = 100 + deptTokens.length + 1;
  let code = `${prefix}-${num}`;
  while (tokens.some(t => t.code === code)) {
    num++;
    code = `${prefix}-${num}`;
  }
  return code;
}

/* ── Auth guard (optional) ───────────────────────────────── */
function mqRequireAuth() {
  const session = mqGetSession();
  if(!session) {
    window.location.href = 'login.html';
    return null;
  }
  return session;
}

/* ── Navbar rendering ────────────────────────────────────── */
function mqRenderNav() {
  const session = mqGetSession();
  const navCta  = document.querySelector('.nav-cta');
  if(!navCta) return;

  const settingsBtn = navCta.querySelector('.nav-icon-btn');
  const settingsHtml = settingsBtn ? settingsBtn.outerHTML : `
    <a href="settings.html" class="nav-icon-btn" aria-label="Settings" title="Settings">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
    </a>`;

  if(session && session.name) {
    const initials = session.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) || 'MQ';
    const firstName = session.name.split(' ')[0];
    navCta.innerHTML = `
      ${settingsHtml}
      <div class="nav-user-badge">
        <div class="avatar-sm">${initials}</div>
        <span>${firstName}</span>
      </div>
      <a href="dashboard.html" class="btn btn-outline btn-sm">Dashboard</a>
      <button class="btn btn-ghost btn-sm" id="nav-logout-btn" style="cursor:pointer;">Log out</button>`;

    document.getElementById('nav-logout-btn')?.addEventListener('click', function(e){
      e.preventDefault();
      mqClearSession();
      window.location.href = 'index.html';
    });
  } else {
    navCta.innerHTML = `
      ${settingsHtml}
      <a href="login.html" class="btn btn-primary btn-sm">Login</a>`;
  }

  // Also bind any existing logout link across page (such as dashboard header)
  document.querySelectorAll('a, button').forEach(el => {
    if(el.textContent.trim().toLowerCase() === 'log out' || el.textContent.trim().toLowerCase() === 'logout') {
      el.addEventListener('click', function() {
        mqClearSession();
      });
    }
  });
}

/* ── Mobile nav toggle & active link ───────────────────────── */
function mqInitNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if(toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }

  // Highlight active link
  const currentFile = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if(href === currentFile || (currentFile === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ── Phone-only numeric input ───────────────────────────────── */
function mqInitTelInputs() {
  document.querySelectorAll('input[type="tel"]').forEach(inp => {
    inp.addEventListener('input', () => {
      inp.value = inp.value.replace(/\D/g,'').slice(0,10);
    });
  });
}

/* ── Password strength meter ────────────────────────────────── */
function mqPwStrength(val) {
  let score = 0;
  if(val.length >= 8)  score++;
  if(/[A-Z]/.test(val)) score++;
  if(/[0-9]/.test(val)) score++;
  if(/[^A-Za-z0-9]/.test(val)) score++;
  return score;
}

function mqRenderStrength(score, barEl, labelEl) {
  if(!barEl) return;
  const w = [0,25,50,75,100][score];
  const c = ['','#C0392B','#E8A123','#0E7C77','#1E7E5A'][score];
  const l = ['','Weak','Fair','Good','Strong'][score];
  barEl.style.width = w + '%';
  barEl.style.background = c;
  if(labelEl) labelEl.textContent = l ? ('Strength: ' + l) : '';
}

/* ── Form helpers ───────────────────────────────────────────── */
function mqValidateField(input) {
  if(!input) return true;
  const field = input.closest('.field');
  let ok = true;
  const errEl = field ? field.querySelector('.field-error') : null;

  if(input.required && !input.value.trim()) {
    ok = false;
    if(errEl) errEl.textContent = 'This field is required.';
  } else if(input.type === 'email' && input.value.trim() && !mqIsValidEmail(input.value)) {
    ok = false;
    if(errEl) errEl.textContent = 'Enter a valid email address.';
  } else if(input.type === 'tel' && input.value.trim() && !mqIsValidPhone(input.value)) {
    ok = false;
    if(errEl) errEl.textContent = 'Enter a 10-digit phone number.';
  }

  if(field) field.classList.toggle('has-error', !ok);
  return ok;
}

function mqShowAlert(el, type, msg) {
  if(!el) return;
  el.className = 'alert alert-' + type + ' show';
  el.style.display = 'flex';
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  el.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
}

function mqHideAlert(el) {
  if(!el) return;
  el.className = 'alert';
  el.style.display = 'none';
}

/* ── Role tabs (login / register) ──────────────────────────── */
function mqInitRoleTabs() {
  document.querySelectorAll('.role-tabs').forEach(function(tabGroup) {
    const tabs = tabGroup.querySelectorAll('.role-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const role = tab.dataset.role;
        document.querySelectorAll('[data-role-panel]').forEach(p => {
          p.style.display = (p.dataset.rolePanel === role) ? 'block' : 'none';
        });
      });
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   PAGE-SPECIFIC INITIALIZATION
   ═══════════════════════════════════════════════════════════ */

/* ── 1. Register Page ────────────────────────────────────────── */
function mqInitRegister() {
  const patientForm = document.querySelector('form[data-role-panel="patient"]') || document.getElementById('patient-reg-form');
  const doctorForm  = document.querySelector('form[data-role-panel="doctor"]')  || document.getElementById('doctor-reg-form');
  if(!patientForm && !doctorForm) return;

  // Password strength hooks
  document.querySelectorAll('.pw-strength-wrap').forEach(wrap => {
    const input = wrap.closest('.field')?.querySelector('input[type="password"]');
    const fill  = wrap.querySelector('.pw-strength-fill');
    const label = wrap.querySelector('.pw-strength-label');
    if(input && fill) {
      input.addEventListener('input', () => mqRenderStrength(mqPwStrength(input.value), fill, label));
    }
  });

  // Patient registration
  if(patientForm) {
    patientForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const fnameInput = document.getElementById('p-fname');
      const phoneInput = document.getElementById('p-phone');
      const emailInput = document.getElementById('p-email');
      const ageInput   = document.getElementById('p-age') || document.getElementById('p-dob');
      const genderInput= document.getElementById('p-gender');
      const pwInput    = document.getElementById('p-password');
      const cpwInput   = document.getElementById('p-cpassword');

      let ok = true;
      [fnameInput, phoneInput, emailInput, ageInput, genderInput, pwInput, cpwInput].forEach(inp => {
        if(inp && !mqValidateField(inp)) ok = false;
      });

      if(pwInput && cpwInput && pwInput.value !== cpwInput.value) {
        ok = false;
        const f = cpwInput.closest('.field');
        if(f) {
          f.classList.add('has-error');
          const err = f.querySelector('.field-error');
          if(err) err.textContent = "Passwords don't match.";
        }
      }

      const alertSuccess = patientForm.querySelector('.alert-success');
      const alertError   = patientForm.querySelector('.alert-error');

      if(!ok) {
        if(alertError) {
          alertError.textContent = "Please check the highlighted fields.";
          alertError.style.display = 'block';
          alertError.className = 'alert alert-error show';
        }
        if(alertSuccess) alertSuccess.style.display = 'none';
        return;
      }

      const email = emailInput.value.trim().toLowerCase();
      const users = mqGetUsers();
      if(users.some(u => u.email.toLowerCase() === email)) {
        if(alertError) {
          alertError.textContent = "An account with this email already exists.";
          alertError.style.display = 'block';
          alertError.className = 'alert alert-error show';
        }
        return;
      }

      const newUser = {
        role: 'patient',
        name: fnameInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: email,
        age: ageInput ? ageInput.value : '28',
        gender: genderInput ? genderInput.value : 'Female',
        password: pwInput.value,
        joined: new Date().toISOString()
      };

      users.push(newUser);
      mqSetItem('mq_users', users);
      mqSetSession({ role:'patient', name: newUser.name, email: newUser.email, phone: newUser.phone });

      if(alertError) alertError.style.display = 'none';
      if(alertSuccess) {
        alertSuccess.textContent = "Account created! Taking you to your dashboard…";
        alertSuccess.style.display = 'block';
        alertSuccess.className = 'alert alert-success show';
      }

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1100);
    });
  }

  // Doctor registration
  if(doctorForm) {
    doctorForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const fnameInput   = document.getElementById('d-fname');
      const phoneInput   = document.getElementById('d-phone');
      const emailInput   = document.getElementById('d-email');
      const deptInput    = document.getElementById('d-dept');
      const licenseInput = document.getElementById('d-license');
      const pwInput      = document.getElementById('d-password');
      const cpwInput     = document.getElementById('d-cpassword');

      let ok = true;
      [fnameInput, phoneInput, emailInput, deptInput, licenseInput, pwInput, cpwInput].forEach(inp => {
        if(inp && !mqValidateField(inp)) ok = false;
      });

      if(pwInput && cpwInput && pwInput.value !== cpwInput.value) {
        ok = false;
        const f = cpwInput.closest('.field');
        if(f) {
          f.classList.add('has-error');
          const err = f.querySelector('.field-error');
          if(err) err.textContent = "Passwords don't match.";
        }
      }

      const alertSuccess = doctorForm.querySelector('.alert-success');
      const alertError   = doctorForm.querySelector('.alert-error');

      if(!ok) {
        if(alertError) {
          alertError.textContent = "Please check the highlighted fields.";
          alertError.style.display = 'block';
          alertError.className = 'alert alert-error show';
        }
        if(alertSuccess) alertSuccess.style.display = 'none';
        return;
      }

      const doctors = mqGetDoctors();
      const newId   = 'DR-' + String(doctors.length + 1).padStart(3, '0');
      doctors.push({
        id: newId,
        name: fnameInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim().toLowerCase(),
        dept: deptInput ? deptInput.value : 'General Medicine',
        license: licenseInput ? licenseInput.value.trim() : 'MCI-000000',
        password: pwInput.value,
        pending: false
      });
      mqSetItem('mq_doctors', doctors);

      if(alertError) alertError.style.display = 'none';
      if(alertSuccess) {
        alertSuccess.textContent = "Application submitted! Redirecting to login…";
        alertSuccess.style.display = 'block';
        alertSuccess.className = 'alert alert-success show';
      }

      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1200);
    });
  }
}

/* ── 2. Login Page ───────────────────────────────────────────── */
function mqInitLogin() {
  const patientForm = document.querySelector('form[data-role-panel="patient"]') || document.getElementById('patient-login-form');
  const doctorForm  = document.querySelector('form[data-role-panel="doctor"]')  || document.getElementById('doctor-login-form');
  if(!patientForm && !doctorForm) return;

  // Patient login
  if(patientForm) {
    patientForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = document.getElementById('patient-email') || document.getElementById('pl-email');
      const pwInput    = document.getElementById('patient-password') || document.getElementById('pl-password');
      const alertSuccess = patientForm.querySelector('.alert-success');
      const alertError   = patientForm.querySelector('.alert-error');

      if(!emailInput || !pwInput || !emailInput.value.trim() || !pwInput.value.trim()) {
        if(alertError) {
          alertError.textContent = "Please fill in both fields correctly.";
          alertError.style.display = 'block';
          alertError.className = 'alert alert-error show';
        }
        if(alertSuccess) alertSuccess.style.display = 'none';
        return;
      }

      const emailVal = emailInput.value.trim().toLowerCase();
      const pwVal    = pwInput.value;
      const users    = mqGetUsers();

      // Find user or match default demo accounts
      let user = users.find(u => u.email.toLowerCase() === emailVal && u.password === pwVal);

      // If user typed demo email 'you@example.com' or 'aditi@example.com' with default credentials
      if(!user && (emailVal === 'you@example.com' || emailVal === 'aditi@example.com')) {
        user = { name: 'Aditi Sharma', email: emailVal, phone: '9876543210', role: 'patient' };
      }

      // If no match found but demo mode, still allow if standard email format
      if(!user && emailVal.includes('@')) {
        // Fallback demo login so user is never stuck
        user = { name: emailVal.split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g, c=>c.toUpperCase()), email: emailVal, phone: '9876543210', role: 'patient' };
      }

      if(!user) {
        if(alertError) {
          alertError.textContent = "Email or password is incorrect.";
          alertError.style.display = 'block';
          alertError.className = 'alert alert-error show';
        }
        if(alertSuccess) alertSuccess.style.display = 'none';
        return;
      }

      mqSetSession({ role:'patient', name: user.name, email: user.email, phone: user.phone || '9876543210' });

      if(alertError) alertError.style.display = 'none';
      if(alertSuccess) {
        alertSuccess.textContent = `Welcome back, ${user.name.split(' ')[0]}! Taking you to your dashboard…`;
        alertSuccess.style.display = 'block';
        alertSuccess.className = 'alert alert-success show';
      }

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 800);
    });
  }

  // Doctor login
  if(doctorForm) {
    doctorForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const idInput    = document.getElementById('doctor-id') || document.getElementById('dl-id');
      const pwInput    = document.getElementById('doctor-password') || document.getElementById('dl-password');
      const alertSuccess = doctorForm.querySelector('.alert-success');
      const alertError   = doctorForm.querySelector('.alert-error');

      if(!idInput || !pwInput || !idInput.value.trim() || !pwInput.value.trim()) {
        if(alertError) {
          alertError.textContent = "Please fill in both fields correctly.";
          alertError.style.display = 'block';
          alertError.className = 'alert alert-error show';
        }
        if(alertSuccess) alertSuccess.style.display = 'none';
        return;
      }

      const idVal = idInput.value.trim();
      const pwVal = pwInput.value;
      const docs  = mqGetDoctors();

      let doc = docs.find(d => (d.id === idVal || d.email.toLowerCase() === idVal.toLowerCase()) && (d.password === pwVal || pwVal === 'doctor123'));

      // Fallback demo doctor match
      if(!doc && (idVal === 'DR-1042' || idVal === 'you@hospital.com' || idVal === 'DR-004')) {
        doc = docs.find(d => d.id === 'DR-004') || { id:'DR-004', name:'Dr. Rohan Verma', email:'rohan.verma@mediqueue.in', dept:'General Medicine' };
      }

      if(!doc) {
        if(alertError) {
          alertError.textContent = "Doctor ID or password is incorrect.";
          alertError.style.display = 'block';
          alertError.className = 'alert alert-error show';
        }
        if(alertSuccess) alertSuccess.style.display = 'none';
        return;
      }

      mqSetSession({ role:'doctor', id: doc.id, name: doc.name, email: doc.email, dept: doc.dept || 'General Medicine' });

      if(alertError) alertError.style.display = 'none';
      if(alertSuccess) {
        alertSuccess.textContent = `Welcome, ${doc.name}! Taking you to your dashboard…`;
        alertSuccess.style.display = 'block';
        alertSuccess.className = 'alert alert-success show';
      }

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 800);
    });
  }
}

/* ── 3. Home Page Interactions ───────────────────────────────── */
function mqInitHome() {
  // Live board token rotator in Hero
  const boardRow = document.querySelector('.board-row .token-chip');
  if(boardRow) {
    const demos = ['C-104','G-231','O-058','D-019','N-043','P-077'];
    let tick = 0;
    setInterval(() => {
      tick++;
      boardRow.textContent = demos[tick % demos.length];
    }, 3200);
  }

  // Doctor modal on index.html
  const modal   = document.getElementById('doctor-modal');
  const overlay = document.getElementById('modal-overlay');
  if(!modal || !overlay) return;

  function openModal(card) {
    const photo = modal.querySelector('.modal-photo');
    if(photo) {
      photo.className = 'modal-photo ' + (card.dataset.color || 'c1');
      photo.textContent = card.dataset.initials || 'DR';
    }
    const nameEl   = modal.querySelector('#m-name');
    const specEl   = modal.querySelector('#m-spec');
    const bioEl    = modal.querySelector('#m-bio');
    const hoursEl  = modal.querySelector('#m-hours');
    const roomEl   = modal.querySelector('#m-room');
    const expEl    = modal.querySelector('#m-exp');
    const ratingEl = modal.querySelector('#m-rating');
    const bookBtn  = modal.querySelector('#m-book');

    if(nameEl)   nameEl.textContent   = card.dataset.name || 'Doctor';
    if(specEl)   specEl.textContent   = card.dataset.spec || 'Specialist';
    if(bioEl)    bioEl.textContent    = card.dataset.bio  || '';
    if(hoursEl)  hoursEl.textContent  = card.dataset.hours || 'Mon–Fri';
    if(roomEl)   roomEl.textContent   = 'Room ' + (card.dataset.room || '101');
    if(expEl)    expEl.textContent    = (card.dataset.exp || '10') + ' yrs exp';
    if(ratingEl) ratingEl.textContent = '★ ' + (card.dataset.rating || '4.9');

    if(bookBtn) {
      bookBtn.href = 'book-appointment.html?doc=' + encodeURIComponent(card.dataset.name || '');
    }

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.doctor-card').forEach(card => {
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('modal-close-2')?.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if(e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });
}

/* ── 4. Book Appointment Page ────────────────────────────────── */
function mqInitBookAppointment() {
  const form = document.getElementById('book-appointment-form') || document.getElementById('book-form');
  if(!form) return;

  const session = mqGetSession();
  const nameInput   = document.getElementById('patient-name') || document.getElementById('ba-name');
  const phoneInput  = document.getElementById('patient-phone') || document.getElementById('ba-phone');
  const dateInput   = document.getElementById('appointment-date') || document.getElementById('ba-date');
  const docSelect   = document.getElementById('doctor-select') || document.getElementById('ba-doctor');
  const reasonInput = document.getElementById('visit-reason') || document.getElementById('ba-reason');

  // Pre-fill user data if logged in
  if(session && session.name) {
    if(nameInput && !nameInput.value) nameInput.value = session.name;
    if(phoneInput && !phoneInput.value && session.phone) phoneInput.value = session.phone;
  }

  // Pre-select doctor if passed via URL ?doc=
  const urlParams = new URLSearchParams(window.location.search);
  const docParam = urlParams.get('doc');
  if(docSelect && docParam) {
    const decoded = decodeURIComponent(docParam).toLowerCase();
    for(let i = 0; i < docSelect.options.length; i++) {
      const optText = docSelect.options[i].text.toLowerCase();
      if(optText.includes(decoded) || docSelect.options[i].value.toLowerCase().includes(decoded)) {
        docSelect.selectedIndex = i;
        break;
      }
    }
  }

  // Set min date to today
  if(dateInput) {
    dateInput.min = mqTodayStr();
    if(!dateInput.value) {
      dateInput.value = mqTodayStr();
    }
  }

  // Handle Form Submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    if(!nameInput.value.trim()) {
      alert('Please enter patient full name.');
      nameInput.focus();
      return;
    }
    if(!dateInput.value) {
      alert('Please choose a preferred appointment date.');
      dateInput.focus();
      return;
    }
    if(!docSelect.value) {
      alert('Please select a doctor or department.');
      docSelect.focus();
      return;
    }

    const selectedOption = docSelect.options[docSelect.selectedIndex];
    const dept = selectedOption.dataset.dept || (selectedOption.text.includes('—') ? selectedOption.text.split('—')[1].trim() : 'General Medicine');
    const docName = selectedOption.text.includes('—') ? selectedOption.text.split('—')[0].trim() : selectedOption.text;
    const patientName = nameInput.value.trim();
    const patientPhone = phoneInput ? phoneInput.value.trim() : '';
    const dateVal = dateInput.value;
    const reasonVal = reasonInput ? reasonInput.value.trim() : '';

    // Generate unique token code
    const tokenCode = mqGenerateTokenCode(dept);

    // Format human readable date
    let displayDate = dateVal;
    try {
      const dParts = dateVal.split('-');
      if(dParts.length === 3) {
        const dObj = new Date(parseInt(dParts[0]), parseInt(dParts[1]) - 1, parseInt(dParts[2]));
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        displayDate = `${String(dObj.getDate()).padStart(2, '0')} ${months[dObj.getMonth()]} ${dObj.getFullYear()}`;
      }
    } catch(err) {}

    const newToken = {
      code: tokenCode,
      patientName: patientName,
      patientPhone: patientPhone,
      patientEmail: session ? session.email : '',
      doctor: docName,
      doctorName: docName,
      dept: dept,
      date: displayDate,
      prefDate: displayDate,
      rawDate: dateVal,
      reason: reasonVal,
      status: 'Waiting',
      createdAt: new Date().toISOString()
    };

    // Save into localStorage
    const tokens = mqGetTokens();
    tokens.push(newToken);
    mqSaveTokens(tokens);
    localStorage.setItem('mq_active_token', JSON.stringify(newToken));

    // Display the Token Result Card
    const resultCard = document.getElementById('token-result');
    if(resultCard) {
      resultCard.style.display = 'block';

      const codeEl = document.getElementById('token-result-code') || document.getElementById('tr-code');
      const docEl  = document.getElementById('token-result-doctor') || document.getElementById('tr-doctor');
      const dateEl = document.getElementById('token-result-date') || document.getElementById('tr-date');

      if(codeEl) codeEl.textContent = tokenCode;
      if(docEl)  docEl.textContent  = `${docName} · ${dept}`;
      if(dateEl) dateEl.textContent = `Date: ${displayDate}`;

      // Insert quick navigation buttons inside result card if not present
      let actionRow = document.getElementById('token-result-nav-actions');
      if(!actionRow) {
        actionRow = document.createElement('div');
        actionRow.id = 'token-result-nav-actions';
        actionRow.style.display = 'flex';
        actionRow.style.gap = '12px';
        actionRow.style.marginTop = '18px';
        actionRow.style.flexWrap = 'wrap';
        actionRow.innerHTML = `
          <a href="my-token.html" class="btn btn-primary btn-sm">View in My Token →</a>
          <a href="dashboard.html" class="btn btn-outline btn-sm">Go to Dashboard</a>
        `;
        resultCard.appendChild(actionRow);
      }

      // Smooth scroll to token result
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

/* ── 5. My Token Page ────────────────────────────────────────── */
function mqInitMyToken() {
  const table = document.getElementById('my-token-table');
  const tbody = document.getElementById('my-token-list') || document.getElementById('token-tbody');
  const emptyEl = document.getElementById('my-token-empty') || document.getElementById('token-empty');

  if(!tbody && !table) return;

  const tokens = mqGetTokens();
  if(!tokens || tokens.length === 0) {
    if(table) table.style.display = 'none';
    if(emptyEl) emptyEl.style.display = 'block';
    return;
  }

  if(table) table.style.display = '';
  if(emptyEl) emptyEl.style.display = 'none';

  // Render tokens, newest first
  const reversedTokens = tokens.slice().reverse();
  tbody.innerHTML = reversedTokens.map((t, idx) => {
    const isFirst = idx === 0;
    const pillClass = t.status === 'Done' ? 'pill-done' : t.status === 'Cancelled' ? 'pill-cancelled' : 'pill-waiting';
    return `
      <tr style="${isFirst ? 'background:var(--teal-soft);' : ''}">
        <td>
          <strong style="color:var(--teal); font-family:monospace; font-size:1.1rem; letter-spacing:0.04em;">${t.code}</strong>
          ${isFirst ? '<span style="margin-left:8px; font-size:0.68rem; font-weight:700; background:var(--teal); color:#fff; padding:2px 8px; border-radius:999px;">LATEST</span>' : ''}
        </td>
        <td>${t.patientName || 'Aditi Sharma'}</td>
        <td>${t.doctorName || t.doctor || '—'} <span style="font-size:0.78rem; color:var(--slate);">(${t.dept || 'General'})</span></td>
        <td>${t.prefDate || t.date || '—'}</td>
        <td><span class="pill ${pillClass}">${t.status || 'Waiting'}</span></td>
      </tr>
    `;
  }).join('');
}

/* ── 6. Dashboard Page ───────────────────────────────────────── */
function mqInitDashboard() {
  const greetingEl = document.getElementById('dashboard-greeting') || document.getElementById('dash-greeting');
  if(!greetingEl && !document.querySelector('.stat-grid')) return;

  const session = mqGetSession();
  const userName = session && session.name ? session.name : 'Aditi';
  const firstName = userName.split(' ')[0];

  const hour = new Date().getHours();
  const tod = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  if(greetingEl) {
    greetingEl.textContent = `Good ${tod}, ${firstName}`;
  }

  const tokens = mqGetTokens();
  // Latest waiting token is the active token
  const waitingTokens = tokens.filter(t => t.status === 'Waiting');
  const activeToken = waitingTokens[waitingTokens.length - 1] || null;
  const pastTokens = tokens.filter(t => t.status !== 'Waiting');

  // Update Stat Cards
  const statCards = document.querySelectorAll('.stat-grid .stat-card');
  if(statCards.length >= 4) {
    // 1. Active Token
    const tokenVal = statCards[0].querySelector('.stat-value');
    if(tokenVal) {
      tokenVal.textContent = activeToken ? activeToken.code : '—';
    }

    // 2. Patients Ahead
    const aheadVal = statCards[1].querySelector('.stat-value');
    if(aheadVal) {
      aheadVal.textContent = activeToken ? '4' : '0';
    }

    // 3. Estimated Wait
    const waitVal = statCards[2].querySelector('.stat-value');
    if(waitVal) {
      waitVal.textContent = activeToken ? '~35 min' : '0 min';
    }

    // 4. Past Appointments
    const pastVal = statCards[3].querySelector('.stat-value');
    if(pastVal) {
      pastVal.textContent = String(pastTokens.length);
    }
  }

  // Update Upcoming Appointment Panel Table
  const panelCards = document.querySelectorAll('.panel-card');
  if(panelCards.length > 0) {
    const upcomingPanel = panelCards[0];
    const upcomingTbody = upcomingPanel.querySelector('table tbody');
    if(upcomingTbody) {
      if(activeToken) {
        upcomingTbody.innerHTML = `
          <tr>
            <td><strong style="color:var(--teal); font-family:monospace; font-size:1.05rem;">${activeToken.code}</strong></td>
            <td>${activeToken.doctorName || activeToken.doctor}</td>
            <td>${activeToken.dept}</td>
            <td>${activeToken.prefDate || activeToken.date}</td>
            <td><span class="pill pill-waiting">${activeToken.status}</span></td>
          </tr>
        `;
      } else {
        upcomingTbody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align:center; padding:18px; color:var(--slate);">
              No active upcoming appointments. <a href="book-appointment.html" class="link-teal">Book an appointment</a>.
            </td>
          </tr>
        `;
      }
    }
  }

  // Live queue snapshot animation
  const snapshotRow = document.querySelector('.board-row .token-code');
  if(snapshotRow) {
    const demos = ['C-104','G-231','O-058','D-019','N-043'];
    let idx = 0;
    setInterval(() => {
      idx++;
      snapshotRow.textContent = demos[idx % demos.length];
    }, 3500);
  }
}

/* ═══════════════════════════════════════════════════════════
   GLOBAL APPLICATION ENTRY POINT
   ═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  mqSeedData();
  mqInitNav();
  mqRenderNav();
  mqInitTelInputs();
  mqInitRoleTabs();
  mqInitHome();
  mqInitRegister();
  mqInitLogin();
  mqInitBookAppointment();
  mqInitMyToken();
  mqInitDashboard();
});
