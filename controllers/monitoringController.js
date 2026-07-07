const pool = require("../config/database");
const geolib = require("geolib");

exports.updateBusLocation =
async (req,res)=>{

  try{

    const {
      bus_id,
      latitude,
      longitude,
      speed
    } = req.body;

    const existing =
      await pool.query(
        `
        SELECT id
        FROM bus_locations
        WHERE bus_id=$1
        `,
        [bus_id]
      );

    if(existing.rows.length > 0){

      await pool.query(
        `
        UPDATE bus_locations

        SET
          latitude=$1,
          longitude=$2,
          speed=$3,
          updated_at=NOW()

        WHERE bus_id=$4
        `,
        [
          latitude,
          longitude,
          speed,
          bus_id
        ]
      );

    }else{

      await pool.query(
        `
        INSERT INTO bus_locations
        (
          bus_id,
          latitude,
          longitude,
          speed
        )

        VALUES($1,$2,$3,$4)
        `,
        [
          bus_id,
          latitude,
          longitude,
          speed
        ]
      );
    }

    // ==========================
    // CEK GEOFENCE
    // ==========================
    await checkGeofence(
      bus_id,
      parseFloat(latitude),
      parseFloat(longitude)
    );

    res.json({
      success:true
    });

  }catch(err){

    console.log(err);

    res.status(500).json({
      success:false,
      message:err.message
    });
  }
};

exports.getCompanyBusLocations =
async(req,res)=>{

  try{

    const {companyId}=req.params;

    const result =
      await pool.query(
        `
        SELECT
          bl.*,
          b.plat_nomor

        FROM bus_locations bl

        JOIN buses b
        ON bl.bus_id = b.id

        WHERE b.company_id=$1
        `,
        [companyId]
      );

    res.json({
      success:true,
      data: result.rows
    });

  }catch(err){

    res.status(500).json({
      success:false,
      message: err.message
    });
  }
};

async function checkGeofence( 
  busId, latitude, longitude 
) {
  // ambil semua terminal 
  const terminals = 
  await pool.query(` 
    SELECT 
    id, 
    nama_terminal, 
    lat, 
    lng 
    
    FROM terminals `
  );

  for (const terminal of terminals.rows) {

    console.log(
      "CEK TERMINAL:",
      terminal.nama_terminal
    );

    const inside =
      geolib.isPointWithinRadius(

        {
          latitude: latitude,
          longitude: longitude
        },

        {
          latitude: terminal.lat,
          longitude: terminal.lng
        },

        800
      );

    console.log(
      "HASIL:",
      inside
    );

    if (inside) {

      console.log(
        `BUS ${busId}
        MASUK TERMINAL
        ${terminal.nama_terminal}`
      );
    }
  }
}