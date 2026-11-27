/**
 * THEATRON LUXURY CINEMA PLATFORM — MEMBER 4 (26I3113)
 * Offers & Privileges Controller: Filtering, Clipboard Promo Copy, Modals & Live Countdown
 */

const OFFERS_DATA = {
  "GOLD15": {
    code: "GOLD15",
    title: "15% Off Sovereign Gold Class Admissions",
    category: "tickets",
    badge: "Signature Promo",
    discount: "15% OFF",
    validThru: "December 31, 2026",
    eligibleTiers: "Gold Sovereign, Velvet Black",
    eligibleCinemas: "All Flagship Locations (Grand Palais, Mayfair, Knightsbridge)",
    terms: "Valid on all 2D, 3D, and IMAX 70mm Sovereign Recliner seats Monday through Thursday. Cannot be combined with group buyout rates. Maximum 4 tickets per transaction."
  },
  "VELVET25": {
    code: "VELVET25",
    title: "Velvet Season Premiere Pass: 25% Off Lounges",
    category: "lounges",
    badge: "Season Exclusive",
    discount: "25% OFF",
    validThru: "January 15, 2027",
    eligibleTiers: "All Sovereign Members",
    eligibleCinemas: "Mayfair Velvet Lounge & Grand Palais Salon",
    terms: "Applies to pre-screening Acoustic Velvet Lounge buyout reservations and private salon bookings. Includes complimentary welcome prosecco."
  },
  "TWINROMANCE": {
    code: "TWINROMANCE",
    title: "Twin Recliner Date Night Prestige Package",
    category: "tickets",
    badge: "Couples Special",
    discount: "20% OFF",
    validThru: "Ongoing Weekend Privilege",
    eligibleTiers: "Silver, Gold, Velvet Black",
    eligibleCinemas: "All Theatron Auditoriums",
    terms: "Includes 2 Royal Sovereign Recliner admissions, 1 Artisan Truffle Popcorn duo, and 2 craft beverages or mocktails."
  },
  "CHAMPAGNE20": {
    code: "CHAMPAGNE20",
    title: "Vintage Champagne & Shaved Truffle Concession",
    category: "dining",
    badge: "Gastronomy Privilege",
    discount: "20% OFF",
    validThru: "December 24, 2026",
    eligibleTiers: "Gold Sovereign, Velvet Black",
    eligibleCinemas: "Flagship In-Seat Dining Screenings",
    terms: "Valid on half-bottle or full-bottle Veuve Clicquot and Dom Pérignon cellar selections ordered in-seat via the mobile console."
  },
  "TRIPLEPOINTS": {
    code: "TRIPLEPOINTS",
    title: "Triple Loyalty Points Weekend Extravaganza",
    category: "members",
    badge: "Patron Accelerator",
    discount: "3X POINTS",
    validThru: "Every First Weekend of Month",
    eligibleTiers: "Gold Sovereign & Velvet Black Exclusives",
    eligibleCinemas: "All Box Offices & Concessions",
    terms: "Earn 300% standard loyalty points on all ticket purchases, gift certificates, and concessions. Automatically credited to patron wallet."
  },
  "CANNESCLASSIC": {
    code: "CANNESCLASSIC",
    title: "Cannes Laureates 30% All-Access Festival Pass",
    category: "events",
    badge: "Film Society",
    discount: "30% OFF",
    validThru: "November 30 - December 10, 2026",
    eligibleTiers: "All Members",
    eligibleCinemas: "Grand Palais Flagship Auditorium 3",
    terms: "Provides admission to any five archival 35mm and 70mm restored Cannes Palme d'Or winners. Includes commemorative printed program."
  },
  "STUDENTVIP": {
    code: "STUDENTVIP",
    title: "Academy & Conservatory Scholar Privilege",
    category: "tickets",
    badge: "Academic Honor",
    discount: "25% OFF",
    validThru: "Ongoing Monday - Wednesday",
    eligibleTiers: "Verified Student Sovereign Patrons",
    eligibleCinemas: "All Auditoriums (Matinee Only)",
    terms: "Valid for afternoon matinees prior to 17:00. Requires presentation of verified student or film conservatory identification."
  },
  "CAVIARLOUNGE": {
    code: "CAVIARLOUNGE",
    title: "Petrossian Caviar & Cocktail Hour Privilege",
    category: "dining",
    badge: "Culinary Salon",
    discount: "COMPLIMENTARY PAIRING",
    validThru: "Daily 17:00 - 19:00",
    eligibleTiers: "Velvet Black & Gold Sovereign",
    eligibleCinemas: "Mayfair Velvet Lounge Only",
    terms: "Receive complimentary Oscietra caviar blinis with the purchase of two signature handcrafted cinema cocktails."
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initOfferFiltering();
  initPromoCodeCopying();
  initOfferModalViewer();
  initWeekendSaleTimer();
  initPromoTesterWidget();
});

/* 1. INTERACTIVE CATEGORY FILTERING */
function initOfferFiltering() {
  const filterBtns = document.querySelectorAll('.offer-filter-btn');
  const offerCards = document.querySelectorAll('.offer-card-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      let visibleCount = 0;
      offerCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
          visibleCount++;
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });

      if (window.showTheatronToast) {
        window.showTheatronToast('Catalog Filtered', `Displaying ${visibleCount} privileges in "${btn.textContent.trim()}".`, 'info');
      }
    });
  });
}

/* 2. ONE-CLICK PROMO CODE COPYING */
function initPromoCodeCopying() {
  document.querySelectorAll('.btn-copy-code').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const code = btn.getAttribute('data-code') || 'GOLD15';

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
          handleCopySuccess(btn, code);
        }).catch(() => {
          fallbackCopyText(code, btn);
        });
      } else {
        fallbackCopyText(code, btn);
      }
    });
  });

  function fallbackCopyText(text, btn) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      handleCopySuccess(btn, text);
    } catch (err) {
      if (window.showTheatronToast) {
        window.showTheatronToast('Manual Copy', `Code: ${text}`, 'info');
      }
    }
    document.body.removeChild(textArea);
  }

  function handleCopySuccess(btn, code) {
    const originalText = btn.innerHTML;
    btn.innerHTML = `✓ COPIED!`;
    btn.classList.add('btn-gold');
    btn.classList.remove('btn-outline-gold');

    if (window.showTheatronToast) {
      window.showTheatronToast('Privilege Code Copied', `"${code}" copied to clipboard. Apply during checkout.`, 'success');
    }

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.classList.remove('btn-gold');
      btn.classList.add('btn-outline-gold');
    }, 2500);
  }
}

/* 3. OFFER DETAILS MODAL */
function initOfferModalViewer() {
  document.querySelectorAll('.btn-view-offer-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-code');
      const offer = OFFERS_DATA[code];
      if (!offer) return;

      document.getElementById('modal-offer-badge').textContent = offer.badge;
      document.getElementById('modal-offer-title').textContent = offer.title;
      document.getElementById('modal-offer-discount').textContent = offer.discount;
      document.getElementById('modal-offer-code-display').textContent = offer.code;
      document.getElementById('modal-offer-valid').textContent = offer.validThru;
      document.getElementById('modal-offer-tiers').textContent = offer.eligibleTiers;
      document.getElementById('modal-offer-cinemas').textContent = offer.eligibleCinemas;
      document.getElementById('modal-offer-terms').textContent = offer.terms;

      const modalCopyBtn = document.getElementById('modal-copy-promo-btn');
      if (modalCopyBtn) {
        modalCopyBtn.setAttribute('data-code', offer.code);
      }

      window.openTheatronModal('offer-details-modal');
    });
  });
}

/* 4. WEEKEND FLASH SALE COUNTDOWN */
function initWeekendSaleTimer() {
  const timer = document.getElementById('offer-sale-countdown');
  if (!timer) return;

  const target = new Date();
  target.setHours(target.getHours() + 48, 0, 0, 0);

  function tick() {
    const now = new Date().getTime();
    const diff = target.getTime() - now;

    if (diff <= 0) {
      timer.textContent = "00h 00m 00s";
      return;
    }

    const h = Math.floor((diff / (1000 * 60 * 60)));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    timer.textContent = `${h}h ${m < 10 ? '0' : ''}${m}m ${s < 10 ? '0' : ''}${s}s Remaining`;
  }

  tick();
  setInterval(tick, 1000);
}

/* 5. INTERACTIVE PROMO CODE TESTER WIDGET */
function initPromoTesterWidget() {
  const form = document.getElementById('promo-tester-form');
  const input = document.getElementById('test-promo-input');
  const resultBox = document.getElementById('promo-tester-result');

  if (!form || !input || !resultBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim().toUpperCase();
    if (!query) return;

    if (OFFERS_DATA[query]) {
      const match = OFFERS_DATA[query];
      resultBox.style.display = 'block';
      resultBox.style.borderColor = 'var(--gold-primary)';
      resultBox.innerHTML = `
        <div style="color: #4ade80; font-weight: 700; margin-bottom: 4px;">✓ PRIVILEGE VALIDATED: ${match.code}</div>
        <div style="color: var(--text-primary); font-size: 0.95rem;">${match.title} (${match.discount})</div>
        <div style="color: var(--text-muted); font-size: 0.8rem; margin-top: 4px;">Valid for: ${match.eligibleTiers}</div>
      `;
      window.showTheatronToast('Privilege Confirmed', `Code "${query}" is active and eligible.`, 'success');
    } else {
      resultBox.style.display = 'block';
      resultBox.style.borderColor = '#ef4444';
      resultBox.innerHTML = `
        <div style="color: #ef4444; font-weight: 700; margin-bottom: 4px;">✕ PRIVILEGE NOT FOUND</div>
        <div style="color: var(--text-muted); font-size: 0.85rem;">Code "${query}" is unrecognized or expired. Try "GOLD15" or "VELVET25".</div>
      `;
      window.showTheatronToast('Invalid Code', `Code "${query}" not recognized.`, 'warning');
    }
  });
}
