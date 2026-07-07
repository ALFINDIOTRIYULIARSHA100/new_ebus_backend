const pool =
  require("../config/database");

exports.getSchedulesByCompany = async (req, res) => {
  try {

    const { companyId } = req.params;

    const result = await pool.query(`
      SELECT
        s.*,
        b.plat_nomor,
        r.nama_rute

      FROM schedules s

      LEFT JOIN buses b
      ON s.bus_id = b.id

      LEFT JOIN routes r
      ON s.route_id = r.id

      WHERE s.company_id = $1

      ORDER BY s.id DESC
    `,[companyId]);

    res.json({
      success: true,
      data: result.rows,
    });

  } catch(err) {

    console.log(err);

    res.status(500).json({
      success:false,
      message: err.message,
    });
  }
};

exports.createSchedule =
async (req,res)=>{
  try{
    console.log(req.body);
    const {
      company_id,
      bus_id,
      route_id,
      tanggal_berangkat,
      jam_berangkat,
      harga_tiket
    } = req.body;

    console.log(
        company_id,
        bus_id,
        route_id,
        tanggal_berangkat,
        jam_berangkat,
        harga_tiket
    );

    const result =
      await pool.query(
        `
        INSERT INTO schedules
        (
          company_id,
          bus_id,
          route_id,
          tanggal_berangkat,
          jam_berangkat,
          harga_tiket
        )

        VALUES($1,$2,$3,$4,$5,$6)

        RETURNING *
        `,
        [
          company_id,
          bus_id,
          route_id,
          tanggal_berangkat,
          jam_berangkat,
          harga_tiket
        ]
      );

    res.json({
      success:true,
      data: result.rows[0]
    });

  }catch(err){

    console.log(err);

    res.status(500).json({
      success:false,
      message: err.message
    });
  }
};


exports.updateSchedule =
async(req,res)=>{

  try{

    const {id}=req.params;

    const {
      tanggal_berangkat,
      jam_berangkat,
      harga_tiket
    } = req.body;

    const result =
      await pool.query(
        `
        UPDATE schedules

        SET
          tanggal_berangkat=$1,
          jam_berangkat=$2,
          harga_tiket=$3

        WHERE id=$4

        RETURNING *
        `,
        [
          tanggal_berangkat,
          jam_berangkat,
          harga_tiket,
          id
        ]
      );

    res.json({
      success:true,
      data: result.rows[0]
    });

  }catch(err){

    res.status(500).json({
      success:false,
      message: err.message
    });
  }
};


exports.deleteSchedule =
async(req,res)=>{

  try{

    const {id}=req.params;

    await pool.query(
      `
      DELETE FROM schedules
      WHERE id=$1
      `,
      [id]
    );

    res.json({
      success:true
    });

  }catch(err){

    res.status(500).json({
      success:false,
      message: err.message
    });
  }
};