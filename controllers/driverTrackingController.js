const pool = require("../config/database");

/*
=========================================
GET TRACKING BUS
=========================================
*/

exports.getDriverTracking = async (req, res) => {
  try {
    const { busId } = req.params;

    const result = await pool.query(
      `
      SELECT

      b.id AS bus_id,
      b.nomor_bus,
      b.plat_nomor,
      b.status AS bus_status,
      b.is_tracking,

      d.id AS driver_id,
      d.driver_name,

      c.company_name,

      r.id AS route_id,
      r.nama_rute,
      r.path,

      t1.nama_terminal AS start_terminal,
      t1.lat AS start_lat,
      t1.lng AS start_lng,

      t2.nama_terminal AS end_terminal,
      t2.lat AS end_lat,
      t2.lng AS end_lng,

      cp.id AS checkpoint_id,
      cp.nama AS checkpoint_name,
      cp.lat AS checkpoint_lat,
      cp.lng AS checkpoint_lng,

      l.latitude,
      l.longitude,
      l.speed,
      l.heading,
      l.accuracy,
      l.created_at

      FROM buses b

      LEFT JOIN drivers d
      ON d.id = b.driver_id

      LEFT JOIN companies c
      ON c.id = b.company_id

      LEFT JOIN schedules s
      ON s.bus_id = b.id

      LEFT JOIN routes r
      ON r.id = s.route_id

      LEFT JOIN terminals t1
      ON t1.id = r.start_terminal_id

      LEFT JOIN terminals t2
      ON t2.id = r.end_terminal_id

      LEFT JOIN route_checkpoints rc
      ON rc.route_id = r.id

      LEFT JOIN checkpoints cp
      ON cp.id = rc.checkpoint_id

      LEFT JOIN LATERAL (

          SELECT *
          FROM bus_locations

          WHERE bus_id = b.id

          ORDER BY created_at DESC

          LIMIT 1

      ) l ON true

      WHERE b.id = $1
      `,
      [busId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data tracking tidak ditemukan"
      });
    }

    const first = result.rows[0];

    let path = [];

    try {
      path = first.path ? JSON.parse(first.path) : [];
    } catch (e) {
      path = [];
    }

    const checkpoints = result.rows
      .filter(item => item.checkpoint_id !== null)
      .map(item => ({
        id: item.checkpoint_id,
        nama: item.checkpoint_name,
        lat: Number(item.checkpoint_lat),
        lng: Number(item.checkpoint_lng),
      }));

    res.json({
      success: true,

      bus: {
        id: first.bus_id,
        nomor_bus: first.nomor_bus,
        plat_nomor: first.plat_nomor,
        status: first.bus_status,
        tracking: first.is_tracking
      },

      driver: {
        id: first.driver_id,
        nama: first.driver_name
      },

      company: first.company_name,

      route: {
        id: first.route_id,
        nama: first.nama_rute,
        path,

        terminal_awal: {
          nama: first.start_terminal,
          lat: Number(first.start_lat),
          lng: Number(first.start_lng),
        },

        terminal_tujuan: {
          nama: first.end_terminal,
          lat: Number(first.end_lat),
          lng: Number(first.end_lng),
        },

        checkpoints
      },

      location: {
        lat: Number(first.latitude),
        lng: Number(first.longitude),
        speed: Number(first.speed ?? 0),
        heading: Number(first.heading ?? 0),
        accuracy: Number(first.accuracy ?? 0),
        updated_at: first.created_at
      }
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

/*
=========================================
START TRACKING
=========================================
*/

exports.startTracking = async (req, res) => {

  try {

    const { driverId } = req.body;

    await pool.query(
      `
      UPDATE buses
      SET is_tracking = true
      WHERE driver_id = $1
      `,
      [driverId]
    );

    res.json({
      success: true,
      message: "Tracking dimulai"
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

/*
=========================================
STOP TRACKING
=========================================
*/

exports.stopTracking = async (req, res) => {

  try {

    const { driverId } = req.body;

    await pool.query(
      `
      UPDATE buses
      SET is_tracking = false
      WHERE driver_id = $1
      `,
      [driverId]
    );

    res.json({
      success: true,
      message: "Tracking dihentikan"
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

/*
=========================================
UPDATE LOCATION
=========================================
*/

exports.updateLocation = async (req, res) => {

  try {

    const {
      busId,
      latitude,
      longitude,
      speed,
      heading,
      accuracy,
    } = req.body;

    await pool.query(
      `
      INSERT INTO bus_locations
      (
        bus_id,
        latitude,
        longitude,
        speed,
        heading,
        accuracy
      )

      VALUES
      ($1,$2,$3,$4,$5,$6)
      `,
      [
        busId,
        latitude,
        longitude,
        speed,
        heading,
        accuracy
      ]
    );

    if (global.io) {

      global.io.emit("bus_location", {
        busId,
        latitude,
        longitude,
        speed,
        heading,
        accuracy
      });

    }

    res.json({
      success: true
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};