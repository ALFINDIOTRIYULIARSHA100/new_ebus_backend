const pool = require("../config/database");
const bcrypt = require("bcrypt");

exports.loginUser = async (
  req,
  res
) => {

  try {

    const {
      email,
      password,
      device
    } = req.body;

    console.log("LOGIN REQUEST:");
    console.log(email);
    console.log(device);

    const result =
      await pool.query(

      `
      SELECT *
      FROM users
      WHERE LOWER(email)
      =
      LOWER($1)
      `,
      [email]
    );

    console.log(result.rows);

    if (
      result.rows.length === 0
    ) {

      return res.status(401).json({
        success: false,
        message:
          "Email tidak ditemukan"
      });
    }

    const user =
      result.rows[0];

    let isMatch = false;

    if (
      password === user.password
    ) {

      isMatch = true;
    }

    else if (
      user.password.startsWith("$2")
    ) {

      isMatch =
        await bcrypt.compare(
          password,
          user.password
        );
    }

    if (!isMatch) {

      return res.status(401).json({
        success: false,
        message:
          "Password salah"
      });
    }

    const role =
      user.role
          .toLowerCase();

    if (
      device === "mobile" &&
      (
        role === "super_admin" ||
        role === "admin_perusahaan"
      )
    ) {

      return res.status(403).json({
        success: false,
        message:
          "Role ini hanya untuk Web"
      });
    }

    if (
      device === "web" &&
      (
        role === "driver" ||
        role === "penumpang"
      )
    ) {

      return res.status(403).json({
        success: false,
        message:
          "Role ini hanya untuk Mobile"
      });
    }

    res.json({
      success: true,

      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        company_id: user.company_id,
        profile_image: user.profile_image,
      }
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({

      success: false,

      message:
          err.message,
    });
  }
};