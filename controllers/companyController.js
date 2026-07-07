const pool = require("../config/database");
const bcrypt = require("bcrypt");

// =====================================
// GET COMPANY BY ID
// =====================================
exports.getCompanyById = async (req, res) => {

  try {

    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        company_name,
        alamat,
        email,
        telepon,
        website,
        status

      FROM companies

      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Company tidak ditemukan"
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


// =====================================
// UPDATE COMPANY
// =====================================
exports.updateCompany = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      company_name,
      alamat,
      email,
      telepon,
      website
    } = req.body;

    const result = await pool.query(
      `
      UPDATE companies
      SET
      company_name=$1,
      alamat=$2,
      email=$3,
      telepon=$4,
      website=$5
      WHERE id=$6
      RETURNING *
      `,
      [
        company_name,
        alamat,
        email,
        telepon,
        website,
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

// =====================================
// UPDATE COMPANY
// =====================================
exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      oldPassword,
      newPassword
    } = req.body;

    const result = await pool.query(
      `
      SELECT password
      FROM users
      WHERE company_id = $1
      AND role = 'admin_company'
      `,
      [id]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Admin tidak ditemukan"
      });
    }

    const user = result.rows[0];

    const valid =
      await bcrypt.compare(
        oldPassword,
        user.password
      );

    if (!valid) {

      return res.status(400).json({
        success: false,
        message: "Password lama salah"
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    await pool.query(
      `
      UPDATE users

      SET password = $1

      WHERE company_id = $2
      AND role = 'admin_company'
      `,
      [
        hashedPassword,
        id
      ]
    );

    res.json({
      success: true,
      message: "Password berhasil diubah"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message
     });
    }
  };
  

  // =====================================
  // GET ALL COMPANIES
  // =====================================
  exports.getCompanies = async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT
          id,
          company_name,
          alamat,
          email,
          telepon,
          website,
          status
        FROM companies
        ORDER BY id DESC
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

  // =====================================
  // CREATE COMPANY + ADMIN ACCOUNT
  // =====================================
  exports.createCompany = async (req, res) => {
    try {
      const {
        company_name,
        alamat,
        email,
        telepon,
        website
      } = req.body;

      const companyResult =
        await pool.query(
        `
        INSERT INTO companies
        (
          company_name,
          alamat,
          email,
          telepon,
          website,
          status
        )

        VALUES($1,$2,$3,$4,$5,$6)

        RETURNING *
        `,
        [
          company_name,
          alamat,
          email,
          telepon,
          website,
          "Aktif"
        ]
      );

      const finalCompany =
        companyResult.rows[0];

      const password =
        await bcrypt.hash(
          "123456",
          10
        );

      await pool.query(
        `
        INSERT INTO users
        (
          company_id,
          nama,
          email,
          password,
          role
        )

        VALUES($1,$2,$3,$4,$5)
        `,
        [
          finalCompany.id,
          company_name,
          email,
          password,
          "admin_company"
        ]
      );

      res.json({
        success: true,
        data: finalCompany
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  };

  // =====================================
  // DELETE COMPANY
  // =====================================
  exports.deleteCompany = async (req, res) => {

    try {

      const { id } = req.params;

      await pool.query(
        `
        DELETE FROM companies
        WHERE id = $1
        `,
        [id]
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

  // =====================================
  // RESET PASSWORD ADMIN COMPANY
  // =====================================
  exports.resetAdminPassword =
  async (req, res) => {

    try {

      const { id } = req.params;

      const hashedPassword =
        await bcrypt.hash(
          "123456",
          10
        );

      await pool.query(
        `
        UPDATE users

        SET password = $1

        WHERE company_id = $2
        AND role = 'admin_company'
        `,
        [
          hashedPassword,
          id
        ]
      );

      res.json({
        success: true,
        message:
          "Password berhasil direset"
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  };