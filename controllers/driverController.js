const pool = require("../config/database"); 

exports.getDriversByCompany = 
async (req, res) => { 
    try { 
        const { companyId } = req.params; 
        const result = await pool.query( 
            ` 
            SELECT * FROM 
            drivers WHERE 
            company_id = $1 
            ORDER BY id DESC 
            `, 
            [companyId] 
        ); 
        
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

exports.createDriver =
async (req, res) => {

    try {

        const {
            company_id,
            driver_name,
            kontak
        } = req.body;

        const result = await pool.query(
            `
            INSERT INTO drivers
            (
                company_id,
                driver_name,
                kontak,
                status
            )

            VALUES($1,$2,$3,$4)

            RETURNING *
            `,
            [
                company_id,
                driver_name,
                kontak,
                "Tersedia"
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

exports.updateDriver = 
async (req, res) => { 
    try { 
        const { id } = req.params; 
        const { 
            driver_name, 
            kontak, 
            status 
        } = req.body; 
        
        const result = await pool.query( 
            ` 
            UPDATE drivers 
            SET driver_name = $1, 
            kontak = $2, 
            status = $3 
            WHERE id = $4 
            
            RETURNING * 
            `, 
            [ 
                driver_name, 
                kontak, 
                status, 
                id 
            ] 
        ); 
        
        res.json({ 
            success: true, 
            data: result.rows[0] 
        }); 
    } catch (err) { 
        res.status(500).json({
            success: false,
            message: err.message 
        }); 
    } 
}; 
    
exports.deleteDriver = 
async (req, res) => { 
    try { 
        const { id } = req.params; 
        await pool.query( 
            ` 
            DELETE FROM drivers WHERE 
            id = $1 
            `, 
            [id] 
        ); 
        
        res.json({ 
            success: true 
        }); 
    } catch (err) { 
        
        res.status(500).json({ 
            success: false, 
            message: err.message 
        }); 
    } 
};