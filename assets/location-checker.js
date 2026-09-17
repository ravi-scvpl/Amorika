/**
 * Location Checker & Delivery Validation Logic - Amoraki
 * Handles Delhi NCR eligibility validation and session storage.
 */

(function() {
  'use strict';

  // Delhi NCR PIN Code prefix ranges (11xxxx for Delhi, 12xxxx/20xxxx for NCR)
  const DELHI_NCR_PIN_PREFIXES = ['110', '121', '122', '201'];

  window.AmorakiLocation = {
    getSelectedLocation: function() {
      return sessionStorage.getItem('amoraki_delivery_location');
    },

    setSelectedLocation: function(loc) {
      sessionStorage.setItem('amoraki_delivery_location', loc);
    },

    isEligible: function(location, pincode) {
      if (location && ['delhi', 'noida', 'gurgaon', 'faridabad', 'ghaziabad'].includes(location.toLowerCase())) {
        return true;
      }
      if (pincode && pincode.length === 6) {
        const prefix = pincode.substring(0, 3);
        return DELHI_NCR_PIN_PREFIXES.includes(prefix);
      }
      return false;
    },

    init: function() {
      const overlay = document.getElementById('LocationModalOverlay');
      const closeBtn = document.getElementById('CloseLocationModal');
      const submitBtn = document.getElementById('SubmitLocationBtn');
      const locationSelect = document.getElementById('DeliveryLocationSelect');
      const pincodeInput = document.getElementById('DeliveryPincodeInput');
      const promptState = document.getElementById('LocationPromptState');
      const unserviceableState = document.getElementById('LocationUnserviceableState');
      const backBtn = document.getElementById('BackToLocationPrompt');

      if (!overlay) return;

      // Close modal events
      const closeModal = function() {
        overlay.style.display = 'none';
        overlay.setAttribute('aria-hidden', 'true');
      };

      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeModal();
      });

      if (backBtn) {
        backBtn.addEventListener('click', function() {
          unserviceableState.style.display = 'none';
          promptState.style.display = 'block';
        });
      }

      // Submit location verification
      if (submitBtn) {
        submitBtn.addEventListener('click', function() {
          const loc = locationSelect ? locationSelect.value : '';
          const pin = pincodeInput ? pincodeInput.value.trim() : '';

          if (!loc && !pin) {
            alert('Please select a delivery location or enter a PIN code.');
            return;
          }

          if (loc === 'others') {
            promptState.style.display = 'none';
            unserviceableState.style.display = 'block';
            return;
          }

          const eligible = window.AmorakiLocation.isEligible(loc, pin);
          if (eligible) {
            window.AmorakiLocation.setSelectedLocation(loc || pin);
            closeModal();
            
            // If callback pending (e.g. from CTA click), trigger it
            if (window.AmorakiLocation.onApprovedCallback) {
              window.AmorakiLocation.onApprovedCallback();
              window.AmorakiLocation.onApprovedCallback = null;
            }
          } else {
            promptState.style.display = 'none';
            unserviceableState.style.display = 'block';
          }
        });
      }
    },

    promptIfNeeded: function(onApproved) {
      const currentLoc = this.getSelectedLocation();
      if (currentLoc) {
        if (onApproved) onApproved();
        return;
      }
      this.onApprovedCallback = onApproved;
      const overlay = document.getElementById('LocationModalOverlay');
      if (overlay) {
        overlay.style.display = 'flex';
        overlay.setAttribute('aria-hidden', 'false');
      } else if (onApproved) {
        onApproved();
      }
    }
  };

  document.addEventListener('DOMContentLoaded', function() {
    window.AmorakiLocation.init();
  });
})();
