const pool = require("../config/database");

// =====================================
// Update Lokasi Driver
// =====================================
exports.updateLocation = async (req, res) => {

    try {

        const {
            driver_id,
            latitude,
            longitude,
            speed,
            heading,
            accuracy
        } = req.body;

        await pool.query(
            `
            INSERT INTO locations
            (
                driver_id,
                latitude,
                longitude,
                speed,
                heading,
                accuracy,
                created_at
            )

            VALUES
            (
                $1,$2,$3,$4,$5,$6,NOW()
            )
            `,
            [
                driver_id,
                latitude,
                longitude,
                speed,
                heading,
                accuracy
            ]
        );

        await pool.query(
            `
            UPDATE buses

            SET

            latitude=$1,
            longitude=$2,
            speed=$3,
            heading=$4,
            is_tracking=true,
            updated_at=NOW()

            WHERE driver_id=$5
            `,
            [
                latitude,
                longitude,
                speed,
                heading,
                driver_id
            ]
        );

        res.json({

            success:true,

            message:"Lokasi berhasil diperbarui"

        });

    } catch(err){

        console.log(err);

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

// =====================================
// Lokasi Bus Terakhir
// =====================================
exports.getBusLocation = async(req,res)=>{

    try{

        const {busId}=req.params;

        const result = await pool.query(

            `
            SELECT

            id,
            nomor_bus,
            latitude,
            longitude,
            speed,
            heading,
            updated_at

            FROM buses

            WHERE id=$1
            `,
            [busId]
        );

        res.json({

            success:true,

            data:result.rows[0]

        });

    }catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

// =====================================
// Histori Lokasi
// =====================================
exports.getLocationHistory = async(req,res)=>{
    try{
        const {driverId}=req.params;

        const result=await pool.query(
            `
            SELECT *
            FROM locations
            WHERE driver_id=$1
            ORDER BY created_at DESC
            LIMIT 100
            `,
            [driverId]
        );

        res.json({
            success:true,
            data:result.rows
        });

    }catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });
    }
};

global.io.emit(
    "locationUpdate",
    {
        busId,
        latitude,
        longitude,
        speed,
        heading,
        accuracy,
    },
);