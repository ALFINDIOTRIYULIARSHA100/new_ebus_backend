const pool = require("../config/database");

exports.getDriverDashboard = async (req, res) => {
  
  console.log(
        "USER ID MASUK = ",
        req.params.userId
    );

  try {

    const { userId } = req.params;

    const result = await pool.query(
      `
      SELECT

      u.id,

      u.email,

      d.id driver_id,

      d.driver_name,

      d.status driver_status,

      c.company_name,

      b.id bus_id,

      b.nomor_bus,

      b.plat_nomor,

      b.status bus_status,

      b.is_tracking,

      s.id schedule_id,

      s.tanggal_berangkat,

      s.jam_berangkat,

      r.nama_rute

      FROM users u

      JOIN drivers d
      ON d.user_id=u.id

      LEFT JOIN companies c
      ON c.id=d.company_id

      LEFT JOIN buses b
      ON b.driver_id=d.id

      LEFT JOIN schedules s
      ON s.bus_id=b.id

      LEFT JOIN routes r
      ON r.id=s.route_id

      WHERE u.id=$1

      ORDER BY s.id DESC

      LIMIT 1
      `,
      [userId]
    );

    if (result.rows.length == 0) {
      return res.status(404).json({
        success: false,
        message: "Driver tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};