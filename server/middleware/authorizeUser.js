const authorizeRoles = (...allowedRoles) => {

    return (req, res, next) => {

        if (!allowedRoles.includes(req.user.role)) {
            console.log(req.user);
console.log(allowedRoles);
console.log("USER FROM TOKEN:", req.user);
            return res.status(403).json({
                message: "Access denied  - you do not meet the permissions to access this resource. Please contact a staff member for assistance."
            });
        }

        next();
    };
};

module.exports = authorizeRoles;