(() => {
  'use strict';

  /**
   * Resolves the confirmed booking from localStorage and persists it without duplicates.
   * @returns {{ booking: object, allBookings: Array<object> }}
   */
  function resolveAndSaveBooking() {
    const T = window.Theatron;
    const rawStoredList = T.readStorage(T.STORAGE_KEYS.BOOKINGS);
    const bookings = Array.isArray(rawStoredList) ? rawStoredList : [];
    const latestRaw = T.readStorage(T.STORAGE_KEYS.LATEST);
    const hasLatest = Boolean(latestRaw && typeof latestRaw === 'object');

    const confirmedBooking = T.normalizeBooking(hasLatest ? latestRaw : {}, {
      existingBookings: bookings,
      useDefaultDining: !hasLatest,
    });
    confirmedBooking.status = 'CONFIRMED';

    // Stamp resolved ID back on theatron_latest_booking so page refreshes stay idempotent.
    T.writeStorage(T.STORAGE_KEYS.LATEST, confirmedBooking);

    // Append to theatron_bookings only if this booking ID does not already exist.
    const alreadyExists = bookings.some((entry) => entry && entry.id === confirmedBooking.id);
    if (!alreadyExists) {
      bookings.unshift(confirmedBooking);
      T.writeStorage(T.STORAGE_KEYS.BOOKINGS, bookings);
    }

    return { booking: confirmedBooking, allBookings: bookings };
  }

  function initConfirmationPage() {
    const T = window.Theatron;
    const { booking, allBookings } = resolveAndSaveBooking();

    const ticketEl = document.getElementById('digital-ticket');
    T.populateTicketCard(ticketEl, booking);
    T.updateNavbarState(allBookings, booking.patron);

    const printBtn = document.getElementById('print-pass-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initConfirmationPage);
})();
