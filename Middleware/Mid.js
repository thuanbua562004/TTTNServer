const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client("827764849335-u758u0v853vi007gpsrib752jnbfqtao.apps.googleusercontent.com");

const Middleware = async (req, res, next) => {
    try {
        // Danh sách URL không cần kiểm tra token
        const listWhite = ["/user/login", "/user/register", "/", "/phone/phone", "/upload/uploadmultiple", "/chat/webhook"];
        if (listWhite.includes(req.originalUrl)) {
            return next();
        }
        if (req.originalUrl.startsWith("/phone/phone/")) {
            return next();
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

        if (!req.headers.authorization) {
            return res.status(403).send({ error: "No token provided." });
        }
        
        const token = req.headers.authorization.split(" ")[1];

        if (token.length > 500) {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: "827764849335-u758u0v853vi007gpsrib752jnbfqtao.apps.googleusercontent.com",
            });

        } else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "shhhhh");
            console.log("Local User:", decoded);
            req.user = decoded; 
        }

        return next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).send({ error: "Token expired or invalid." });
    }
};

module.exports = Middleware;
