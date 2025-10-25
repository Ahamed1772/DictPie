import jwt from 'jsonwebtoken'
import env from 'dotenv'
env.config()

const jsonWebtokenAndCookieParser = async(userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });

    res.cookie("jwt", token, {
      httpOnly: true, // prevents JavaScript access
      sameSite: "None",   // ✅ allows sending cookies cross-site
      secure: true,       // ✅ must be true for "None" to work (even in dev if using Chrome)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
}



export default jsonWebtokenAndCookieParser;