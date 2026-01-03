import jwt from "jsonwebtoken";
const verifyJWT = (req, res, next) => {
    const authHeader = (req.headers.authorization || req.headers.Authorization);
    if (!authHeader || !authHeader.startsWith("Bearer"))
        return res.status(401).json({ message: "AuthHeader is required!" });
    const token = authHeader.split(" ")[1];
    if (!token)
        return res.status(401).json({ message: "Access Token is required!" });
    jwt.verify(token, process.env.ACCESS_TOKEN, (error, decoded) => {
        if (error)
            return res.status(403).json({ message: error.message });
        const payload = { id: decoded.id, email: decoded.email, };
        req.user = payload;
        next();
    });
};
export default verifyJWT;
