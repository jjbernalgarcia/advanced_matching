<script>
(function() {
  window.dataLayer = window.dataLayer || []; // Ensure dataLayer is initialized
  var emailFieldEventListenerAdded = false; // Flag to check if the event listener has been added
  var dataLayerEventFired = false; // Flag to ensure dataLayer push happens only once
  var attemptCount = 0; // Initialize attempt counter
  var maxAttempts = 5; // Maximum number of attempts

  function sha256(message) {
    console.log('Starting SHA-256 hashing.');
    var msgBuffer = new TextEncoder().encode(message);
    return crypto.subtle.digest('SHA-256', msgBuffer).then(function(hashBuffer) {
      console.log('SHA-256 hash generated.');
      var hashArray = Array.from(new Uint8Array(hashBuffer));
      var hashHex = hashArray.map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
      console.log('Converted hash to hex string.');
      return hashHex;
    }).catch(function(error) {
      console.error('Error hashing message with SHA-256:', error);
    });
  }

  function handleEmailEvent() {
    console.log('Email event triggered.');
    var emailValue = this.value;
    if (emailValue && !dataLayerEventFired) { // Check if email value is present and dataLayer event hasn't fired
      console.log('Email value obtained:', emailValue);
      sha256(emailValue).then(function(hashedEmail) {
        if (hashedEmail) {
          console.log('Setting cookie with hashed email.');
          setCookie('em', hashedEmail); // Change cookie name to 'em'
          if (!dataLayerEventFired) { // Ensure this block runs only once
            console.log('Pushing event to dataLayer.');
            window.dataLayer.push({
              'event': 'em', // Change dataLayer event name to 'em'
              'hashedEmail': hashedEmail
            });
            dataLayerEventFired = true; // Set the flag to true after pushing to dataLayer
          }
        } else {
          console.log('Hashed email is null. Check the hashing process.');
        }
      }).catch(function(error) {
        console.error('Error handling email event:', error);
      });
    }
  }
  //modify the elementId
  function attemptToAddEventListeners() {
    if (!emailFieldEventListenerAdded && attemptCount < maxAttempts) {
      var emailField = document.getElementById('modify_me');
      if (emailField) {
        console.log('Email field found.');
        emailField.addEventListener('blur', handleEmailEvent);
        emailField.addEventListener('change', handleEmailEvent);
        emailFieldEventListenerAdded = true;
      } else {
        console.log('Email field not found, attempt #' + (attemptCount + 1) + '. Retrying...');
        attemptCount++;
        setTimeout(attemptToAddEventListeners, 500);
      }
    } else if (attemptCount >= maxAttempts) {
      console.log('Maximum attempt limit reached. Stopping retries.');
    }
  }

  attemptToAddEventListeners();

  function setCookie(name, value) {
    try {
      console.log('Setting cookie: ' + name);
      document.cookie = name + '=' + (value || '') + '; path=/';
    } catch (error) {
      console.error('Error setting cookie:', error);
    }
  }
})();
</script>
