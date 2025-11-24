// api/data.js
const { fetchAndParseData } = require("./utils");
const jwt = require("jsonwebtoken");

// Simple middleware to verify the teacher session token
function verifyToken(req) {
  const token = req.headers["x-teacher-session"];
  if (!token) return false;
  try {
    jwt.verify(token, process.env.SESSION_SECRET);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = async (req, res) => {
  // 1. Check for teacher authentication first
  const isAuthenticated = verifyToken(req);

  try {
    const { headers, data } = await fetchAndParseData();

    // 2. Handle summary request (for initial student view load)
    if (req.query.summary === "true") {
      const coreHeaders = [
        "ល.រ",
        "ID",
        "ឈ្មោះខ្មែរ",
        "ឈ្មោះអង់គ្លេស",
        "ភេទ",
        "បន្ទប់",
        "មុខវិជ្ជា",
        "ជំនាញ",
      ];
      // Send only required info for initial load (headers and total count)
      return res.status(200).json({
        headers: headers,
        data: [], // Do not send student data
        totalStudents: data.length,
      });
    }

    // 3. Handle full data request (Teacher authenticated only)
    if (!isAuthenticated) {
      // If fetching full data but not authorized, deny access
      return res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized access to full data. Login required.",
        });
    }

    return res.status(200).json({
      headers: headers,
      data: data,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API Data Error:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error during data retrieval.",
      });
  }
};
