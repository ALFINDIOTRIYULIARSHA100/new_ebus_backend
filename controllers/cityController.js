const pool = require("../config/database");

exports.getCitiesByProvince = async (req, res) => {
  try {
    const { provinceId } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM cities
      WHERE province_id = $1
      ORDER BY nama_kota ASC
      `,
      [provinceId]
    );

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