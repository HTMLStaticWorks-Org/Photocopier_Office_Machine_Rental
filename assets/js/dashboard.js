document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.dashboard-sidebar');
  const toggle = document.getElementById('sidebar-toggle');
  const closeBtn = document.getElementById('sidebar-close');
  const scrim = document.getElementById('sidebar-scrim');

  // At 1024px and below the sidebar becomes an off-canvas drawer (see style.css)
  const DRAWER_BREAKPOINT = 1024;
  const isDrawer = () => window.innerWidth <= DRAWER_BREAKPOINT;

  const setDrawer = (open) => {
    if (!sidebar) return;
    sidebar.classList.toggle('open', open);
    if (scrim) {
      scrim.classList.toggle('open', open);
      scrim.hidden = !open;
    }
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(open));
      const icon = toggle.querySelector('i');
      if (icon) {
        icon.className = open ? 'ph ph-x' : 'ph ph-list';
      }
    }
    document.body.style.overflow = open ? 'hidden' : '';
  };

  if (toggle) {
    toggle.addEventListener('click', () => setDrawer(!sidebar.classList.contains('open')));
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', () => setDrawer(false));
  }
  if (scrim) {
    scrim.addEventListener('click', () => setDrawer(false));
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setDrawer(false);
  });

  // Snap the drawer shut when the viewport grows back to the two-pane layout
  window.addEventListener('resize', () => {
    if (!isDrawer()) setDrawer(false);
  });

  // Tab switching
  const navLinks = document.querySelectorAll('.dashboard-nav .dashboard-link');
  const sections = document.querySelectorAll('.dashboard-section');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      if (href.charAt(0) !== '#') return; // e.g. logout

      e.preventDefault();

      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      sections.forEach(sec => { sec.style.display = 'none'; });
      const target = document.getElementById(href.substring(1));
      if (target) {
        target.style.display = 'block';
        // Re-run the reveal animation for the panel that just came in
        target.classList.remove('in-view');
        void target.offsetWidth;
        target.classList.add('in-view');
      }

      if (isDrawer()) setDrawer(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Initial tab
  if (sections.length) {
    sections.forEach(sec => { sec.style.display = 'none'; });
    sections[0].style.display = 'block';
    sections[0].classList.add('in-view');
  }

  // Quick jump buttons (e.g. "Request Machine" on Overview)
  document.querySelectorAll('[data-jump-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-jump-tab');
      const targetLink = document.querySelector(`.dashboard-nav .dashboard-link[href="#${targetId}"]`);
      if (targetLink) targetLink.click();
    });
  });

  // Machine Rental Request Form (demo interaction)
  const reqForm = document.getElementById('machine-request-form');
  const reqFeedback = document.getElementById('machine-request-feedback');
  if (reqForm && reqFeedback) {
    reqForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const cat = document.getElementById('req-category').value || 'Office Machine';
      const qty = document.getElementById('req-qty').value || '1';
      reqFeedback.textContent = `Demo confirmation: Rental request for ${qty}x ${cat} logged (Ref #REQ-2026-412). Our dispatch team will confirm installation.`;
      reqFeedback.style.display = 'block';
      reqForm.reset();
    });
  }

  // Service Ticket Form (demo interaction)
  const svcForm = document.getElementById('service-ticket-form');
  const svcFeedback = document.getElementById('service-ticket-feedback');
  const svcTableBody = document.querySelector('#service-tickets-table tbody');
  if (svcForm && svcFeedback) {
    svcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const machineId = document.getElementById('svc-machine').value;
      const issue = document.getElementById('svc-issue').value.trim();
      if (!issue) return;

      const ticketNo = 'SR-' + Math.floor(8850 + Math.random() * 140);
      if (svcTableBody) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><strong>${ticketNo}</strong></td>
          <td>${machineId}</td>
          <td>${issue.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
          <td>Nov 17, 2026</td>
          <td>Dispatch Pending</td>
          <td><span class="pill pill-soft" style="color: var(--accent);">Open</span></td>
        `;
        svcTableBody.prepend(row);
      }
      svcFeedback.textContent = `Demo confirmation: Service ticket ${ticketNo} created for ${machineId}.`;
      svcFeedback.style.display = 'block';
      svcForm.reset();
    });
  }

  // Invoice PDF download buttons (demo interaction)
  const invNote = document.getElementById('invoice-download-note');
  document.querySelectorAll('.dash-download[data-invoice]').forEach(btn => {
    btn.addEventListener('click', () => {
      const inv = btn.getAttribute('data-invoice');
      if (invNote) {
        invNote.textContent = `Demo preview: ${inv}.pdf prepared for download.`;
        invNote.style.display = 'block';
      }
    });
  });
});
