const pool = require("../config/database");

exports.superAdminReport = async (req, res) => {
  try {

    // ==========================
    // SUMMARY
    // ==========================

    const totalUsers =
      await pool.query(
        "SELECT COUNT(*) total FROM users"
      );

    const totalCompanies =
      await pool.query(
        "SELECT COUNT(*) total FROM companies"
      );

    const totalDrivers =
      await pool.query(
        "SELECT COUNT(*) total FROM drivers"
      );

    const totalBuses =
      await pool.query(
        "SELECT COUNT(*) total FROM buses"
      );

    const totalSchedules =
      await pool.query(
        "SELECT COUNT(*) total FROM schedules"
      );

    const totalRoutes =
      await pool.query(
        "SELECT COUNT(*) total FROM routes"
      );

    // ==========================
    // ROLE
    // ==========================

    const roles =
      await pool.query(`
      SELECT
      role,
      COUNT(*) total

      FROM users

      GROUP BY role

      ORDER BY role
    `);

    // ==========================
    // COMPANY
    // ==========================

    const companies =
      await pool.query(`
      SELECT

      c.id,

      c.company_name,

      c.status,

      COUNT(DISTINCT d.id)
      total_driver,

      COUNT(DISTINCT b.id)
      total_bus,

      COUNT(DISTINCT r.id)
      total_route,

      COUNT(DISTINCT s.id)
      total_schedule

      FROM companies c

      LEFT JOIN drivers d
      ON d.company_id=c.id

      LEFT JOIN buses b
      ON b.company_id=c.id

      LEFT JOIN routes r
      ON r.company_id=c.id

      LEFT JOIN schedules s
      ON s.company_id=c.id

      GROUP BY
      c.id

      ORDER BY
      c.company_name
    `);

    // ==========================
    // DRIVER
    // ==========================

    const drivers =
      await pool.query(`
      SELECT

      d.*,

      c.company_name

      FROM drivers d

      LEFT JOIN companies c

      ON c.id=d.company_id

      ORDER BY d.id DESC
    `);

    // ==========================
    // BUS
    // ==========================

    const buses =
      await pool.query(`
      SELECT

      b.*,

      d.driver_name

      FROM buses b

      LEFT JOIN drivers d

      ON d.id=b.driver_id

      ORDER BY b.id DESC
    `);

    // ==========================
    // SCHEDULE
    // ==========================

    const schedules =
      await pool.query(`
      SELECT

      s.*,

      b.nomor_bus

      FROM schedules s

      LEFT JOIN buses b

      ON b.id=s.bus_id

      ORDER BY s.id DESC
    `);

    // ==========================
    // USER TERBARU
    // ==========================

    const latestUsers =
      await pool.query(`
      SELECT

      id,
      email,
      role,
      created_at

      FROM users

      ORDER BY created_at DESC

      LIMIT 10
    `);

    // ==========================
    // TRACKING BUS
    // ==========================

    const tracking =
      await pool.query(`
      SELECT

      nomor_bus,

      latitude,

      longitude,

      status,

      updated_at

      FROM buses

      WHERE
      latitude IS NOT NULL
    `);

    res.json({

      success: true,

      summary: {

        totalUsers:
          Number(totalUsers.rows[0].total),

        totalCompanies:
          Number(totalCompanies.rows[0].total),

        totalDrivers:
          Number(totalDrivers.rows[0].total),

        totalBuses:
          Number(totalBuses.rows[0].total),

        totalSchedules:
          Number(totalSchedules.rows[0].total),

        totalRoutes:
          Number(totalRoutes.rows[0].total),

      },

      roles:
        roles.rows,

      companies:
        companies.rows,

      drivers:
        drivers.rows,

      buses:
        buses.rows,

      schedules:
        schedules.rows,

      latestUsers:
        latestUsers.rows,

      tracking:
        tracking.rows,

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};