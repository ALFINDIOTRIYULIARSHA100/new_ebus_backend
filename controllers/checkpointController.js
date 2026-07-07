const pool =
  require("../config/database");


// =====================================
// GET ALL CHECKPOINTS
// =====================================
exports.getAllCheckpoints =
async (req, res) => {

  try {

    const result =
      await pool.query(`
        SELECT *
        FROM checkpoints
        ORDER BY nama ASC
      `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};


// =====================================
// GET CHECKPOINT BY CITY
// =====================================
exports.getCheckpointsByCity =
async (req, res) => {

  try {

    const { cityId } =
      req.params;

    const result =
      await pool.query(`
        SELECT *
        FROM checkpoints
        WHERE city_id = $1
        ORDER BY nama ASC
      `, [cityId]);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};


// =====================================
// CREATE CHECKPOINT
// =====================================
exports.createCheckpoint =
async (req, res) => {

  try {

    const {
      nama,
      tipe,
      lat,
      lng,
      city_id
    } = req.body;

    const result =
      await pool.query(`
        INSERT INTO checkpoints
        (
          nama,
          tipe,
          lat,
          lng,
          city_id
        )
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *
      `,
      [
        nama,
        tipe,
        lat,
        lng,
        city_id
      ]);

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};


// =====================================
// UPDATE CHECKPOINT
// =====================================
exports.updateCheckpoint =
async (req, res) => {

  try {

    const { id } =
      req.params;

    const {
      nama,
      tipe,
      lat,
      lng,
      city_id
    } = req.body;

    const result =
      await pool.query(`
        UPDATE checkpoints
        SET
          nama = $1,
          tipe = $2,
          lat = $3,
          lng = $4,
          city_id = $5
        WHERE id = $6
        RETURNING *
      `,
      [
        nama,
        tipe,
        lat,
        lng,
        city_id,
        id
      ]);

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};


// =====================================
// DELETE CHECKPOINT
// =====================================
exports.deleteCheckpoint =
async (req, res) => {

  try {

    const { id } =
      req.params;

    await pool.query(`
      DELETE
      FROM checkpoints
      WHERE id = $1
    `, [id]);

    res.json({
      success: true,
      message:
        "Checkpoint berhasil dihapus"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};