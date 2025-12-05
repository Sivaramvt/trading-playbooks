(function() {
    // Check if we are already on the login page to avoid infinite loops
    const path = window.location.pathname;
    const isLoginPage = path.endsWith('login.html');
    
    // Check authentication status
    const isAuthenticated = sessionStorage.getItem('trading_playbooks_auth') === 'true';

    if (!isAuthenticated && !isLoginPage) {
        // Store the current page to redirect back to after login
        sessionStorage.setItem('redirect_after_login', window.location.href);
        
        // Determine path to login.html
        // If we are in a subdirectory (like /playbooks/), we need to go up
        let loginPath = './login.html';
        if (path.includes('/playbooks/')) {
            loginPath = '../login.html';
        } else if (!path.endsWith('/') && !path.endsWith('index.html')) {
             // Handle other potential subdirectories if any, but for now this is safe
             // If we are at root /index.html, ./login.html works.
        }
        
        window.location.href = loginPath;
    }
})();

function attemptLogin(event) {
    event.preventDefault();
    const passwordInput = document.getElementById('password');
    const password = passwordInput.value;
    const errorMsg = document.getElementById('error-message');

    // Simple obfuscation (Base64). 
    // "trader" -> "dHJhZGVy"
    // You can change this password by changing the string below.
    // To generate a new one, open browser console and type: btoa('your_password')
    const correctHash = "dHJhZGVy"; 

    if (btoa(password) === correctHash) {
        sessionStorage.setItem('trading_playbooks_auth', 'true');
        
        // Redirect to previous page or index
        const redirect = sessionStorage.getItem('redirect_after_login');
        if (redirect && !redirect.endsWith('login.html')) {
            window.location.href = redirect;
        } else {
            // If no redirect stored, or it was login.html, go to index
            // We need to handle relative paths again if we are in a weird spot, 
            // but login.html is in root, so index is just ./index.html
            window.location.href = './index.html';
        }
    } else {
        errorMsg.classList.remove('hidden');
        passwordInput.classList.add('border-red-500');
        passwordInput.value = '';
    }
}
