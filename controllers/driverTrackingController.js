const pool = require("../config/database");

exports.getDriverTracking = async (req, res) => {
  try {

    const { busId } = req.params;

    /*
    ==========================
    BUS + DRIVER + COMPANY
    ==========================
    */

    const busResult = await pool.query(
      `
      SELECT

      b.id,
      b.nomor_bus,
      b.plat_nomor,
      b.status,
      b.is_tracking,

      d.id AS driver_id,
      d.driver_name,

      c.company_name

      FROM buses b

      LEFT JOIN drivers d
      ON d.id = b.driver_id

      LEFT JOIN companies c
      ON c.id = b.company_id

      WHERE b.id = $1
      `,
      [busId]
    );

    if (busResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bus tidak ditemukan"
      });
    }

    const bus = busResult.rows[0];

    /*
    ==========================
    ROUTE
    ==========================
    */

    const routeResult = await pool.query(
      `
      SELECT

      r.id,
      r.nama_rute,
      r.path,

      t1.nama_terminal AS start_name,
      t1.lat AS start_lat,
      t1.lng AS start_lng,

      t2.nama_terminal AS end_name,
      t2.lat AS end_lat,
      t2.lng AS end_lng

      FROM schedules s

      JOIN routes r
      ON r.id = s.route_id

      LEFT JOIN terminals t1
      ON t1.id = r.start_terminal_id

      LEFT JOIN terminals t2
      ON t2.id = r.end_terminal_id

      WHERE s.bus_id = $1

      LIMIT 1
      `,
      [busId]
    );

    let route = null;

    if (routeResult.rows.length > 0) {
      route = routeResult.rows[0];
    }

    /*
    ==========================
    CHECKPOINT
    ==========================
    */

    const checkpointResult = await pool.query(
      `
      SELECT

      cp.id,
      cp.nama,
      cp.lat,
      cp.lng

      FROM route_checkpoints rc

      JOIN checkpoints cp
      ON cp.id = rc.checkpoint_id

      WHERE rc.route_id = $1

      ORDER BY rc.id
      `,
      [route?.id ?? 0]
    );

    /*
    ==========================
    GPS TERAKHIR
    ==========================
    */

    const gpsResult = await pool.query(
      `
      SELECT

      latitude,
      longitude,
      speed,
      heading,
      accuracy,
      created_at

      FROM bus_locations

      WHERE bus_id = $1

      ORDER BY bus_locations.created_at DESC

      LIMIT 1
      `,
      [busId]
    );

    let gps = {
      latitude: 0,
      longitude: 0,
      speed: 0,
      heading: 0,
      accuracy: 0,
      created_at: null
    };

    if (gpsResult.rows.length > 0) {
      gps = gpsResult.rows[0];
    }

    res.json({

      success: true,

      data: {

        bus: {

          id: bus.id,

          nomor_bus: bus.nomor_bus,

          plat_nomor: bus.plat_nomor,

          status: bus.status,

          tracking: bus.is_tracking
        },

        driver: {

          id: bus.driver_id,

          nama: bus.driver_name
        },

        company: bus.company_name,

        route: route == null
            ? null
            : {

                id: route.id,

                nama: route.nama_rute,

                path: route.path ?? [],

                terminal_awal: {

                  nama: route.start_name,

                  lat: route.start_lat,

                  lng: route.start_lng
                },

                terminal_tujuan: {

                  nama: route.end_name,

                  lat: route.end_lat,

                  lng: route.end_lng
                },

                checkpoints: checkpointResult.rows
              },

        location: {

          lat: gps.latitude,

          lng: gps.longitude,

          speed: gps.speed,

          heading: gps.heading,

          accuracy: gps.accuracy,

          updated_at: gps.created_at
        }

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
========================================
START TRACKING
========================================
*/

exports.startTracking = async (req, res) => {

    try {

        const { driver_id } = req.body;

        await pool.query(
            `
            UPDATE buses
            SET is_tracking = true
            WHERE driver_id = $1
            `,
            [driver_id]
        );

        res.json({
            success: true,
            message: "Tracking dimulai",
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message,
        });

    }

};

/*
========================================
STOP TRACKING
========================================
*/

exports.stopTracking = async (req, res) => {

    try {

        const { driver_id } = req.body;

        await pool.query(
            `
            UPDATE buses
            SET is_tracking = false
            WHERE driver_id = $1
            `,
            [driver_id]
        );

        res.json({
            success: true,
            message: "Tracking dihentikan",
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message,
        });

    }

};

/*
========================================
UPDATE LOCATION
========================================
*/

exports.updateLocation = async (req, res) => {

    try {

        const {
            driver_id,
            latitude,
            longitude,
            speed,
            heading,
            accuracy,
        } = req.body;

        console.log("========== GPS MASUK ==========");
        console.log({
            driver_id,
            latitude,
            longitude,
            speed,
            heading,
            accuracy,
        });

        await pool.query(
            `
            INSERT INTO bus_locations
            (
                bus_id,
                latitude,
                longitude,
                speed,
                heading,
                accuracy,
                created_at
            )

            SELECT
                id,
                $2,
                $3,
                $4,
                $5,
                $6,
                NOW()

            FROM buses

            WHERE driver_id = $1
            `,
            [
                driver_id,
                latitude,
                longitude,
                speed,
                heading,
                accuracy,
            ]
        );

        res.json({
            success: true,
            message: "Lokasi berhasil diperbarui",
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message,
        });

    }

};