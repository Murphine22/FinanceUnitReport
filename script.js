// Real-time Clock
function updateClock() {
    const now = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const dateStr = now.toLocaleDateString(undefined, options);
    const timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const mainClock = document.getElementById('clock');
    if (mainClock) mainClock.textContent = `${dateStr} | ${timeStr}`;
  }
  setInterval(updateClock, 1000);
  updateClock();
  
  // Navbar Digital Clock (syncs with main clock)
  function updateNavbarClock() {
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const timeStr = now.toLocaleTimeString(undefined, options);
    const clockElem = document.getElementById('navbar-clock');
    if (clockElem) clockElem.textContent = timeStr;
  }
  setInterval(updateNavbarClock, 1000);
  updateNavbarClock();
  
  // Dark Mode Toggle (works for both navbar and main)
  const html = document.documentElement;
  function setDarkMode(on) {
    if (on) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
  // Initial theme
  if (localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    setDarkMode(true);
  }
  const navbarDarkToggle = document.getElementById('navbar-darkToggle');
  if (navbarDarkToggle) {
    navbarDarkToggle.addEventListener('click', () => {
      setDarkMode(!html.classList.contains('dark'));
    });
  }
  
  // Expenses Dropdown
  const expensesBtn = document.getElementById('expensesBtn');
  const expensesDropdown = document.getElementById('expensesDropdown');
  let expensesOpen = false;
  if (expensesBtn && expensesDropdown) {
    expensesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      expensesOpen = !expensesOpen;
      expensesDropdown.classList.toggle('show', expensesOpen);
      expensesBtn.classList.toggle('underline', expensesOpen);
    });
    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!expensesBtn.contains(e.target) && !expensesDropdown.contains(e.target)) {
        expensesDropdown.classList.remove('show');
        expensesBtn.classList.remove('underline');
        expensesOpen = false;
      }
    });
  }
  
  // Organogram Dropdowns
  document.querySelectorAll('.org-card[data-org]').forEach(card => {
    card.addEventListener('click', function(e) {
      e.stopPropagation();
      // Close all dropdowns first
      document.querySelectorAll('.org-card[data-org]').forEach(c => {
        if (c !== card) {
          const id = c.getAttribute('data-org');
          document.getElementById('org-' + id).classList.remove('show');
        }
      });
      // Toggle this one
      const id = card.getAttribute('data-org');
      const dropdown = document.getElementById('org-' + id);
      dropdown.classList.toggle('show');
    });
    // Keyboard accessibility
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
  // Close organogram dropdowns on outside click
  document.addEventListener('click', function(e) {
    document.querySelectorAll('.org-card[data-org]').forEach(card => {
      const id = card.getAttribute('data-org');
      document.getElementById('org-' + id).classList.remove('show');
    });
  });
  
  // Pie Chart for Financial Overview
  window.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('financePieChart').getContext('2d');
    const isDark = document.documentElement.classList.contains('dark');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [
          'Amount Brought Forward',
          'Inflow',
          'Outflow',
          'Net Balance',
          'Others'
        ],
        datasets: [{
          data: [
            1282657, // Amount Brought Forward
            624400,  // Inflow
            225000,  // Outflow
            1682057, // Net Balance
            1500000  // Others: Uniform Donation
          ],
          backgroundColor: [
            '#6366f1', // Indigo
            '#22c55e', // Green
            '#eab308', // Yellow
            '#3b82f6', // Blue
            '#ec4899'  // Pink
          ],
          borderColor: [
            '#fff',
            '#fff',
            '#fff',
            '#fff',
            '#fff'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1200,
          easing: 'easeOutBounce'
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: isDark ? '#fff' : '#222',
              font: { size: 16, weight: 'bold' }
            }
          },
          tooltip: {
            enabled: true,
            backgroundColor: isDark ? '#22223b' : '#fff',
            titleColor: isDark ? '#fff' : '#222',
            bodyColor: isDark ? '#fff' : '#222',
            borderColor: '#6366f1',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                let label = context.label || '';
                let value = context.parsed;
                if (label === 'Others') {
                  return `${label}: ₦1,500,000 + $500`;
                }
                return `${label}: ₦${value.toLocaleString()}`;
              }
            }
          }
        }
      }
    });
  });
  
  // Marquee (bi-directional) animation for the navbar title
  (function() {
    const marquee = document.getElementById('marquee-title');
    if (!marquee) return;
    let direction = 1;
    let pos = 0;
    let max = 0;
    let reqId;
    function animate() {
      if (!marquee.parentElement) return;
      const outer = marquee.parentElement;
      const outerWidth = outer.offsetWidth;
      const innerWidth = marquee.scrollWidth;
      max = outerWidth - innerWidth - 32; // 32px padding
      if (max > 0) max = 0;
      pos += direction * 1.2;
      if (pos > 0) {
        pos = 0;
        direction = -1;
      } else if (pos < max) {
        pos = max;
        direction = 1;
      }
      marquee.style.transform = `translateX(${pos}px)`;
      reqId = requestAnimationFrame(animate);
    }
    animate();
    window.addEventListener('resize', () => {
      pos = 0;
      direction = 1;
    });
  })();