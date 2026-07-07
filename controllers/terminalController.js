const pool =
  require("../config/database");

exports.getTerminals =
async (req, res) => {

  try {

    const result =
      await pool.query(`
        SELECT *
        FROM terminals
        ORDER BY id DESC
      `);

    res.json({
      success: true,
      data: result.rows,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.createTerminal =
async (req, res) => {

  try {

    const {
      city_id,
      nama_terminal,
      alamat,
      lat,
      lng,
    } = req.body;

    const result =
      await pool.query(
        `
        INSERT INTO terminals
        (
          city_id,
          nama_terminal,
          alamat,
          lat,
          lng
        )
        VALUES
        (
          $1,$2,$3,$4,$5
        )
        RETURNING *
        `,
        [
          city_id,
          nama_terminal,
          alamat,
          lat,
          lng,
        ]
      );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateTerminal =
async (req, res) => {

  try {

    const { id } = req.params;

    const {
      city_id,
      nama_terminal,
      alamat,
      lat,
      lng,
    } = req.body;

    const result =
      await pool.query(
        `
        UPDATE terminals
        SET
          city_id = $1,
          nama_terminal = $2,
          alamat = $3,
          lat = $4,
          lng = $5
        WHERE id = $6
        RETURNING *
        `,
        [
          city_id,
          nama_terminal,
          alamat,
          lat,
          lng,
          id,
        ]
      );

    res.json({
      success: true,
      data: result.rows[0],
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteTerminal =
async (req, res) => {

  try {

    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM terminals
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      success: true,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};