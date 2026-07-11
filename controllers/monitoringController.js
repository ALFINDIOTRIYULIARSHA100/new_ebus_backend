const pool = require("../config/database");
const geolib = require("geolib");
const geofenceService = require("../services/geofenceService");

const {
  checkBusGeofence
} = require("../services/geofenceService");

/*
=====================================
UPDATE LOKASI BUS (WEB)
=====================================
*/
exports.updateBusLocation = async (req, res) => {
  try {

    const {
      bus_id,
      latitude,
      longitude,
      speed,
      heading,
      accuracy
    } = req.body;

    const existing = await pool.query(
      `
      SELECT id
      FROM bus_locations
      WHERE bus_id = $1
      `,
      [bus_id]
    );

    if (existing.rows.length > 0) {

      await pool.query(
        `
        UPDATE bus_locations

        SET
          latitude = $1,
          longitude = $2,
          speed = $3,
          heading = $4,
          accuracy = $5,
          updated_at = NOW()

        WHERE bus_id = $6
        `,
        [
          latitude,
          longitude,
          speed,
          heading,
          accuracy,
          bus_id
        ]
      );

    } else {

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
          updated_at
        )

        VALUES
        (
          $1,$2,$3,$4,$5,$6,NOW()
        )
        `,
        [
          bus_id,
          latitude,
          longitude,
          speed,
          heading,
          accuracy
        ]
      );

    }

    /*
    Update posisi bus
    */

    await pool.query(
      `
      UPDATE buses

      SET

      latitude=$1,
      longitude=$2,
      updated_at=NOW()

      WHERE id=$3
      `,
      [
        latitude,
        longitude,
        bus_id
      ]
    );

    /*
    Geofence
    */

    await checkBusGeofence(
        bus_id,
        parseFloat(latitude),
        parseFloat(longitude)
    );

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

/*
=====================================
AMBIL BUS PER COMPANY
=====================================
*/

exports.getCompanyBusLocations =
async (req, res) => {

  try {

    const { companyId } = req.params;

    const result =
      await pool.query(
        `
        SELECT

        bl.*,

        b.plat_nomor,
        b.nomor_bus,
        b.status,
        b.is_tracking

        FROM bus_locations bl

        JOIN buses b
        ON bl.bus_id = b.id

        WHERE b.company_id = $1

        ORDER BY b.id
        `,
        [companyId]
      );

    res.json({

      success: true,

      data: result.rows

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message: err.message

    });

  }

};