const adminMiddleware = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        next();

    } catch (error) {
        console.error("Admin middleware error:", error);

        return res.status(500).json({
            success: false,
            message: "Authorization failed"
        });
    }
};

export default adminMiddleware;