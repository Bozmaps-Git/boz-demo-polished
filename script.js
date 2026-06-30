/* ============================================================
   Polished — vanilla JS. No dependencies.
   Features: nav, service menu+filter, booking, gallery+lightbox,
             gift voucher, reviews, scroll-reveal.
   ============================================================ */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Footer year ---------- */
  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  var burger = $('#hamburger');
  var nav = $('#primary-nav');
  function closeNav() {
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  }
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
  }

  /* ---------- FEATURE A: Service menu + price + filter ---------- */
  var SERVICES = [
    { id:'classic-mani', cat:'manicure', emoji:'💅', name:'Classic Manicure', desc:'Shape, cuticle care, buff and a glossy polish of your choice.', price:24, mins:35 },
    { id:'lux-mani', cat:'manicure', emoji:'🌸', name:'Luxe Spa Manicure', desc:'Exfoliating scrub, warm-mitt mask and extended hand massage.', price:34, mins:50, tag:'Loved' },
    { id:'biab', cat:'gel', emoji:'✨', name:'BIAB Builder Gel', desc:'Builder-in-a-bottle overlay for strength and a natural mirror shine.', price:42, mins:60, tag:'Bestseller' },
    { id:'gel-mani', cat:'gel', emoji:'💖', name:'Gel Manicure', desc:'Long-lasting gel colour that stays chip-free for up to three weeks.', price:32, mins:45 },
    { id:'soak-off', cat:'gel', emoji:'🛁', name:'Gel Soak-Off & Tidy', desc:'Gentle removal of existing gel plus a nourishing cuticle treatment.', price:14, mins:20 },
    { id:'classic-pedi', cat:'pedicure', emoji:'🦶', name:'Classic Pedicure', desc:'Soak, file, callus smooth and polish to leave feet sandal-ready.', price:30, mins:45 },
    { id:'lux-pedi', cat:'pedicure', emoji:'🌷', name:'Pamper Pedicure', desc:'Hot-stone massage, sugar scrub and a hydrating foot mask.', price:44, mins:65, tag:'Loved' },
    { id:'full-set', cat:'extension', emoji:'💎', name:'Acrylic Full Set', desc:'Custom-shaped extensions tailored to your length and lifestyle.', price:48, mins:90 },
    { id:'gel-x', cat:'extension', emoji:'🤍', name:'Gel-X Extensions', desc:'Lightweight soft-gel tips for a flexible, natural-feel full set.', price:52, mins:90, tag:'New' },
    { id:'infill', cat:'extension', emoji:'🔧', name:'Extension Infill', desc:'Refresh and rebalance your existing set after two to three weeks.', price:34, mins:60 },
    { id:'art-simple', cat:'art', emoji:'🎨', name:'Nail Art — per nail', desc:'Hand-painted detail, from dainty hearts to chrome French tips.', price:3, mins:5 },
    { id:'art-full', cat:'art', emoji:'🌈', name:'Full Art Set', desc:'Ten nails of bespoke art — bring a reference or trust the artist.', price:25, mins:40, tag:'Statement' }
  ];

  var menuList = $('#menu-list');
  function fmtPrice(p) { return p % 1 === 0 ? '£' + p : '£' + p.toFixed(2); }
  function renderMenu(filter) {
    if (!menuList) return;
    menuList.innerHTML = '';
    SERVICES.filter(function (s) { return filter === 'all' || s.cat === filter; })
      .forEach(function (s) {
        var li = document.createElement('li');
        li.className = 'menu-item';
        li.innerHTML =
          '<span class="mi-emoji" aria-hidden="true">' + s.emoji + '</span>' +
          '<div class="mi-body">' +
            '<p class="mi-title">' + s.name + (s.tag ? ' <span class="tag">' + s.tag + '</span>' : '') + '</p>' +
            '<p class="mi-desc">' + s.desc + '</p>' +
            '<p class="mi-meta">⏱ ' + s.mins + ' min</p>' +
          '</div>' +
          '<span class="mi-price">' + fmtPrice(s.price) + '</span>';
        menuList.appendChild(li);
      });
  }
  renderMenu('all');

  $$('[data-filter]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('[data-filter]').forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      renderMenu(btn.getAttribute('data-filter'));
    });
  });

  /* ---------- Populate booking <select> from services ---------- */
  var bService = $('#b-service');
  if (bService) {
    SERVICES.forEach(function (s) {
      var o = document.createElement('option');
      o.value = s.id;
      o.textContent = s.name + ' — ' + fmtPrice(s.price) + ' (' + s.mins + ' min)';
      bService.appendChild(o);
    });
  }

  /* ---------- FEATURE B: Booking flow ---------- */
  var bDate = $('#b-date');
  if (bDate) {
    var today = new Date();
    var iso = today.toISOString().split('T')[0];
    bDate.min = iso;
    bDate.value = iso;
  }

  function setError(field, errEl, show) {
    if (show) { field.setAttribute('aria-invalid', 'true'); errEl.hidden = false; }
    else { field.removeAttribute('aria-invalid'); errEl.hidden = true; }
  }
  var ukPhone = /^(0\d{9,10}|\+44\d{9,10})$/;

  var bookForm = $('#booking-form');
  if (bookForm) {
    bookForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      var svc = $('#b-service'), date = $('#b-date'), slot = $('#b-slot'),
          name = $('#b-name'), phone = $('#b-phone');

      setError(svc, $('#err-service'), !svc.value); if (!svc.value) ok = false;
      var dateBad = !date.value || date.value < date.min;
      setError(date, $('#err-date'), dateBad); if (dateBad) ok = false;
      setError(slot, $('#err-slot'), !slot.value); if (!slot.value) ok = false;
      setError(name, $('#err-name'), !name.value.trim()); if (!name.value.trim()) ok = false;
      var phoneBad = !ukPhone.test(phone.value.replace(/\s/g, ''));
      setError(phone, $('#err-phone'), phoneBad); if (phoneBad) ok = false;

      if (!ok) {
        var firstBad = $('[aria-invalid="true"]', bookForm);
        if (firstBad) firstBad.focus();
        return;
      }

      var svcName = SERVICES.filter(function (s) { return s.id === svc.value; })[0].name;
      var d = new Date(date.value + 'T00:00:00');
      var nice = d.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long' });
      var panel = $('#booking-success');
      $('#booking-summary').textContent =
        'Thanks ' + name.value.trim().split(' ')[0] + '! We\'ve pencilled in ' + svcName +
        ' on ' + nice + ' at ' + slot.value + '. We\'ll text ' + phone.value + ' to confirm.';
      panel.hidden = false;
      panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      panel.focus && panel.setAttribute('tabindex', '-1');
      panel.focus();
    });
  }

  /* ---------- FEATURE C: Gallery + filter + lightbox ---------- */
  var GALLERY = [
    { seed:'pol-chrome1', style:'chrome', cap:'Silver chrome mirror tips' },
    { seed:'pol-french1', style:'french', cap:'Soft baby-pink French' },
    { seed:'pol-floral1', style:'floral', cap:'Hand-painted daisy accents' },
    { seed:'pol-min1', style:'minimal', cap:'Milky nude with a single line' },
    { seed:'pol-glit1', style:'glitter', cap:'Champagne ombré glitter' },
    { seed:'pol-chrome2', style:'chrome', cap:'Iridescent cat-eye chrome' },
    { seed:'pol-french2', style:'french', cap:'Coloured micro-French tips' },
    { seed:'pol-floral2', style:'floral', cap:'Pressed-flower wildflower set' },
    { seed:'pol-min2', style:'minimal', cap:'Sheer jelly almond nails' },
    { seed:'pol-glit2', style:'glitter', cap:'Disco silver full-glitter' },
    { seed:'pol-chrome3', style:'chrome', cap:'Lilac aura chrome blush' },
    { seed:'pol-min3', style:'minimal', cap:'Matte taupe square shorts' }
  ];

  var gGrid = $('#gallery-grid');
  var current = []; // filtered, in display order

  function imgUrl(seed, w, h) { return 'https://picsum.photos/seed/' + seed + '/' + w + '/' + h; }

  function renderGallery(filter) {
    if (!gGrid) return;
    gGrid.innerHTML = '';
    current = GALLERY.filter(function (g) { return filter === 'all' || g.style === filter; });
    current.forEach(function (g, i) {
      var li = document.createElement('li');
      li.innerHTML =
        '<button class="g-btn" type="button" data-index="' + i + '" aria-label="View ' + g.cap + ', open larger preview">' +
          '<img src="' + imgUrl(g.seed, 400, 400) + '" width="400" height="400" loading="lazy" alt="' + g.cap + '" />' +
          '<span class="g-cap">' + g.cap + '</span>' +
        '</button>';
      gGrid.appendChild(li);
    });
  }
  renderGallery('all');

  $$('[data-gfilter]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('[data-gfilter]').forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      renderGallery(btn.getAttribute('data-gfilter'));
    });
  });

  // Lightbox
  var lb = $('#lightbox'), lbImg = $('#lb-img'), lbCap = $('#lb-cap');
  var lbIndex = 0, lastFocus = null;

  function openLightbox(i) {
    lbIndex = i;
    lastFocus = document.activeElement;
    showLb();
    lb.hidden = false;
    $('#lb-close').focus();
    document.addEventListener('keydown', lbKeys);
  }
  function showLb() {
    var g = current[lbIndex];
    lbImg.src = imgUrl(g.seed, 900, 900);
    lbImg.alt = g.cap;
    lbCap.textContent = g.cap;
  }
  function closeLightbox() {
    lb.hidden = true;
    document.removeEventListener('keydown', lbKeys);
    if (lastFocus) lastFocus.focus();
  }
  function nextLb(dir) {
    lbIndex = (lbIndex + dir + current.length) % current.length;
    showLb();
  }
  function lbKeys(e) {
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') nextLb(1);
    else if (e.key === 'ArrowLeft') nextLb(-1);
    else if (e.key === 'Tab') { e.preventDefault(); } // simple focus trap: keep focus in dialog
  }

  if (gGrid) {
    gGrid.addEventListener('click', function (e) {
      var btn = e.target.closest('.g-btn');
      if (btn) openLightbox(parseInt(btn.getAttribute('data-index'), 10));
    });
  }
  if (lb) {
    $('#lb-close').addEventListener('click', closeLightbox);
    $('#lb-next').addEventListener('click', function () { nextLb(1); });
    $('#lb-prev').addEventListener('click', function () { nextLb(-1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
  }

  /* ---------- FEATURE D: Gift voucher ---------- */
  var vForm = $('#voucher-form');
  var vAmountEls = $$('input[name="amount"]');
  var vpAmount = $('#vp-amount'), vpMsg = $('#vp-msg');

  function selectedAmount() {
    var sel = vAmountEls.filter(function (r) { return r.checked; })[0];
    return sel ? sel.value : '40';
  }
  // live preview
  vAmountEls.forEach(function (r) {
    r.addEventListener('change', function () { vpAmount.textContent = '£' + selectedAmount(); });
  });
  var vMsgInput = $('#v-msg');
  if (vMsgInput) {
    vMsgInput.addEventListener('input', function () {
      vpMsg.textContent = vMsgInput.value.trim() || 'Because you deserve a little gloss.';
    });
  }

  function genCode() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var out = [];
    for (var b = 0; b < 3; b++) {
      var block = '';
      for (var i = 0; i < 4; i++) block += chars[Math.floor(Math.random() * chars.length)];
      out.push(block);
    }
    return 'PMCR-' + out.join('-');
  }
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (vForm) {
    vForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      var to = $('#v-to'), email = $('#v-email');
      setError(to, $('#err-vto'), !to.value.trim()); if (!to.value.trim()) ok = false;
      var emailBad = !emailRe.test(email.value);
      setError(email, $('#err-vemail'), emailBad); if (emailBad) ok = false;
      if (!ok) { var fb = $('[aria-invalid="true"]', vForm); if (fb) fb.focus(); return; }

      var code = genCode();
      $('#vp-code').textContent = code;
      $('#voucher-code-out').textContent = code;
      var panel = $('#voucher-success');
      panel.hidden = false;
      panel.setAttribute('tabindex', '-1');
      panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      panel.focus();

      var copyBtn = $('#copy-code');
      copyBtn.onclick = function () {
        var done = function () { copyBtn.textContent = 'Copied ✓'; setTimeout(function(){ copyBtn.textContent = 'Copy code'; }, 1800); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).then(done).catch(done);
        } else { done(); }
      };
    });
  }

  /* ---------- FEATURE E: Reviews wall ---------- */
  var REVIEWS = [
    { name:'Aisha R.', stars:5, when:'2 weeks ago', text:'Best BIAB in Manchester, hands down. Three weeks on and not a single chip. The chrome finish is unreal.' },
    { name:'Megan T.', stars:5, when:'1 month ago', text:'Booked a pamper pedi before a wedding and left feeling like royalty. The hot-stone massage alone is worth it.' },
    { name:'Priya S.', stars:5, when:'3 weeks ago', text:'The nail art here is next level. Brought a Pinterest screenshot and they nailed it (pun intended).' },
    { name:'Chloe W.', stars:4, when:'1 week ago', text:'Lovely gel mani and gorgeous studio. Knocked one star only because they were running 10 mins behind, but they kept me topped up with tea.' },
    { name:'Jess M.', stars:5, when:'2 months ago', text:'Gel-X extensions feel so light I forget I\'m wearing them. Friendly, spotless and dead easy to book online.' },
    { name:'Hannah B.', stars:5, when:'5 days ago', text:'My go-to NQ salon now. The 7-day gloss guarantee is real, they sorted a tiny lift no quibbles.' }
  ];

  function starRow(n) {
    var s = '';
    for (var i = 0; i < 5; i++) s += i < n ? '★' : '☆';
    return s;
  }
  var rGrid = $('#reviews-grid');
  if (rGrid) {
    REVIEWS.forEach(function (r) {
      var li = document.createElement('li');
      li.className = 'review-card';
      var initials = r.name.split(' ').map(function (p) { return p[0]; }).join('').slice(0, 2);
      li.innerHTML =
        '<p class="stars" aria-label="' + r.stars + ' out of 5 stars">' + starRow(r.stars) + '</p>' +
        '<p class="review-text">“' + r.text + '”</p>' +
        '<div class="review-who">' +
          '<span class="avatar" aria-hidden="true">' + initials + '</span>' +
          '<span><span class="review-name">' + r.name + '</span><br>' +
          '<span class="review-meta">' + r.when + '</span></span>' +
        '</div>';
      rGrid.appendChild(li);
    });
  }

  /* ---------- Scroll reveal ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = $$('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  }
})();
