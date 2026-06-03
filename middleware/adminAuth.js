//middleware/auth.js
function isAdmin(req, res, next) {
    // Check if admin is logged in and session is valid
    if (req.session && req.session.isAdmin && req.session.admin) {
        return next();
    }
    
    // For AJAX/API requests, return 403 JSON
    if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
        return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
    }
    
    // Otherwise redirect to admin login page
    res.redirect('/admin/login');
}

module.exports = { isAdmin };