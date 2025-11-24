// Vercel Serverless Function (This code is secure and runs on the server)
// We use process.env to securely access the credentials configured in Vercel settings.

// Vercel Environment Variables:
// Set these securely in your Vercel Project Settings:
// - TEACHER_USERNAME = "Leang"
// - TEACHER_PASSWORD = "2504"

export default (req, res) => {
  // Check if the request method is POST
  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
    return;
  }

  // Get credentials from the request body
  const { username, password } = req.body;

  // Get secure credentials from Vercel Environment Variables
  const SECURE_USERNAME = process.env.TEACHER_USERNAME;
  const SECURE_PASSWORD = process.env.TEACHER_PASSWORD;

  if (!SECURE_USERNAME || !SECURE_PASSWORD) {
    // This is a safety check in case env vars are missing
    console.error(
      "Authentication credentials are not configured in Vercel Environment Variables."
    );
    res
      .status(500)
      .json({
        success: false,
        message: "Server Configuration Error. Please contact admin.",
      });
    return;
  }

  // Perform secure comparison
  if (username === SECURE_USERNAME && password === SECURE_PASSWORD) {
    // SUCCESS
    res.status(200).json({
      success: true,
      message: "Login successful!",
    });
  } else {
    // FAILURE
    res
      .status(401)
      .json({
        success: false,
        message: "ឈ្មោះអ្នកប្រើ ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ។",
      });
  }
};
