/**
 * THEATRON CINEMA LOUNGES — OFFERS & PRIVILEGES CONTROLLER
 * Category Filtering, Clipboard Copying, Offer Details Modal & FAQ Accordion
 */

(function () {
  'use strict';

  // --- 1. Offer Category Filtering ---
  function initOfferFiltering() {
    const tabButtons = document.querySelectorAll('.filter-tab-btn');
    const offerCards = document.querySelectorAll('.offer-card-item');

    if (!tabButtons.length || !offerCards.length) return;

    tabButtons.forEach((tab) => {
      tab.addEventListener('click', () => {
        const selectedCategory = tab.getAttribute('data-filter');

        // Update active tab state
        tabButtons.forEach((b) => b.classList.remove('active'));
        tab.classList.add('active');

        // Filter cards with smooth animation
        offerCards.forEach((card) => {
          const cardCategory = card.getAttribute('data-category');

          if (selectedCategory === 'all' || cardCategory === selectedCategory) {
            card.classList.remove('filtering-out');
            card.classList.add('filtering-in');
            card.style.display = '';
          } else {
            card.classList.add('filtering-out');
            card.classList.remove('filtering-in');
            setTimeout(() => {
              if (card.classList.contains('filtering-out')) {
                card.style.display = 'none';
              }
            }, 300);
          }
        });
      });
    });
  }

  // --- 2. Copy Promo Code Functionality ---
  function initCopyPromoCode() {
    const copyButtons = document.querySelectorAll('.btn-copy-code');

    copyButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const code = btn.getAttribute('data-code');
        if (!code) return;

        function handleSuccess() {
          const originalText = btn.textContent;
          btn.textContent = 'Copied!';
          btn.classList.add('copied');

          window.showToast(
            'Promo Code Copied',
            `Code ${code} copied to clipboard! Apply during ticket checkout.`,
            '🏷️'
          );

          setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('copied');
          }, 2500);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).then(handleSuccess).catch(() => {
            fallbackCopy(code, handleSuccess);
          });
        } else {
          fallbackCopy(code, handleSuccess);
        }
      });
    });

    function fallbackCopy(text, callback) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        callback();
      } catch (err) {
        console.warn('Clipboard copy fallback failed', err);
      }
      document.body.removeChild(textArea);
    }
  }

  // --- 3. Offer Details Modal ---
  function initOfferModal() {
    const modal = document.getElementById('offer-details-modal');
    if (!modal) return;

    const modalClose = modal.querySelector('.modal-close-btn');
    const modalTitle = modal.querySelector('.modal-offer-title');
    const modalCode = modal.querySelector('.modal-offer-code');
    const modalDiscount = modal.querySelector('.modal-offer-discount');
    const modalDesc = modal.querySelector('.modal-offer-desc');
    const modalValidity = modal.querySelector('.modal-offer-validity');
    const modalTerms = modal.querySelector('.modal-offer-terms');
    const modalRedeemBtn = modal.querySelector('#btn-modal-redeem');

    const detailTriggers = document.querySelectorAll('.btn-offer-details, .btn-redeem-offer');

    detailTriggers.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const title = btn.getAttribute('data-title') || 'Private Lounge Privilege';
        const code = btn.getAttribute('data-code') || 'GOLD15';
        const discount = btn.getAttribute('data-discount') || '15% Off Privilege';
        const desc = btn.getAttribute('data-desc') || 'Enjoy premium savings across luxury seats and artisan concessions.';
        const validity = btn.getAttribute('data-validity') || 'Valid until 31 Dec 2026';
        const terms = btn.getAttribute('data-terms') || 'Valid on all Royal Gold Recliners and flagship lounges. Cannot be combined with other offers.';

        if (modalTitle) modalTitle.textContent = title;
        if (modalCode) modalCode.textContent = code;
        if (modalDiscount) modalDiscount.textContent = discount;
        if (modalDesc) modalDesc.textContent = desc;
        if (modalValidity) modalValidity.textContent = validity;
        if (modalTerms) modalTerms.textContent = terms;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    if (modalRedeemBtn) {
      modalRedeemBtn.addEventListener('click', () => {
        const code = modalCode ? modalCode.textContent : 'GOLD15';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code);
        }
        closeModal();
        window.showToast('Privilege Activated', `Code ${code} activated for your next luxury booking!`, '★');
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // --- 4. FAQ Accordion ---
  function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item) => {
      const trigger = item.querySelector('.faq-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other FAQ items
        faqItems.forEach((other) => other.classList.remove('active'));

        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }

  // Initialize Offers Page
  document.addEventListener('DOMContentLoaded', () => {
    initOfferFiltering();
    initCopyPromoCode();
    initOfferModal();
    initFAQAccordion();
  });
})();
