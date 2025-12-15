const authMiddleware = (req, res, next) => {
    // allow access to auth routes (login/status) without session if applied globally
    // But better practice is to apply this middleware only to protected routes.
    // However, if applied globally, we must exclude public paths.
    
    // For now, let's assume this middleware is for PROTECTED routes.
    if (req.session && req.session.user) {
        console.log(`✅ User ${req.session.user.email} authenticated`);
        next();
    } else {
        console.log("⛔ Unauthorized Access Attempt");
        res.status(401).json({ message: "Unauthorized. Please login." });
    }
};

module.exports = authMiddleware;
