const pool = require("../config/database");

// ===================================
// GET ALL TICKETS
// ===================================
const getTickets = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT

        t.id,
        t.ticket_number,
        t.passenger_name,
        t.phone,
        t.seat_number,
        t.status,

        b.id AS bus_id,
        b.nomor_bus,
        b.plat_nomor,

        s.id AS schedule_id

      FROM tickets t

      JOIN buses b
      ON b.id = t.bus_id

      JOIN schedules s
      ON s.id = t.schedule_id

      ORDER BY t.id DESC
    `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

// ===================================
// GET TICKET BY ID
// ===================================
const getTicketById = async (req, res) => {

  try {

    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *

      FROM tickets

      WHERE id=$1
      `,
      [id]
    );

    if (result.rows.length == 0) {

      return res.status(404).json({

        success: false,

        message: "Ticket tidak ditemukan"

      });

    }

    res.json({

      success: true,

      data: result.rows[0]

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      message: err.message

    });

  }

};

// ===================================
// CREATE TICKET
// ===================================
const createTicket = async (req, res) => {

  try {

    const {

      passenger_name,
      phone,
      bus_id,
      schedule_id,
      seat_number

    } = req.body;

    // ==========================
    // Generate Ticket Number
    // ==========================

    const total =
      await pool.query(
        `
        SELECT COUNT(*) total

        FROM tickets
        `
      );

    const running =
      Number(total.rows[0].total) + 1;

    const year =
      new Date().getFullYear();

    const ticketNumber =
      `EBUS${year}${String(running).padStart(5, "0")}`;

    // ==========================

    const result =
      await pool.query(

        `
        INSERT INTO tickets
        (

          ticket_number,

          passenger_name,

          phone,

          bus_id,

          schedule_id,

          seat_number

        )

        VALUES

        ($1,$2,$3,$4,$5,$6)

        RETURNING *

        `,

        [

          ticketNumber,

          passenger_name,

          phone,

          bus_id,

          schedule_id,

          seat_number

        ]

      );

    res.json({

      success: true,

      data: result.rows[0]

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      message: err.message

    });

  }

};

// ===================================
// UPDATE TICKET
// ===================================
const updateTicket = async (req, res) => {

  try {

    const { id } = req.params;

    const {

      passenger_name,
      phone,
      bus_id,
      schedule_id,
      seat_number,
      status

    } = req.body;

    const result =
      await pool.query(

        `
        UPDATE tickets

        SET

        passenger_name=$1,

        phone=$2,

        bus_id=$3,

        schedule_id=$4,

        seat_number=$5,

        status=$6,

        updated_at=NOW()

        WHERE id=$7

        RETURNING *

        `,

        [

          passenger_name,

          phone,

          bus_id,

          schedule_id,

          seat_number,

          status,

          id

        ]

      );

    res.json({

      success: true,

      data: result.rows[0]

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      message: err.message

    });

  }

};

// ===================================
// DELETE TICKET
// ===================================
const deleteTicket = async (req, res) => {

  try {

    const { id } = req.params;

    await pool.query(

      `
      DELETE FROM tickets

      WHERE id=$1
      `,

      [id]

    );

    res.json({

      success: true,

      message: "Ticket berhasil dihapus"

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      message: err.message

    });

  }

};

module.exports = {

  getTickets,

  getTicketById,

  createTicket,

  updateTicket,

  deleteTicket

};