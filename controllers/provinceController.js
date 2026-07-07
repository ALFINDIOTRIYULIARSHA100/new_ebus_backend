const pool = require("../config/database");

exports.getProvinces = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM provinces
      ORDER BY nama_provinsi ASC
    `);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};