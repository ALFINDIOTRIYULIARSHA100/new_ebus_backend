const pool = require("../config/database");

exports.updateProgress =
async (busId) => {

    try {

        /*
        ==========================
        BUS
        ==========================
        */

        const busResult =
        await pool.query(
            `
            SELECT

            route_index

            FROM buses

            WHERE id=$1
            `,
            [busId]
        );

        if(busResult.rows.length == 0){

            return;

        }

        const routeIndex =
            busResult.rows[0].route_index ?? 0;

        /*
        ==========================
        PATH
        ==========================
        */

        const routeResult =
        await pool.query(
            `
            SELECT

            r.path

            FROM schedules s

            JOIN routes r
            ON r.id=s.route_id

            WHERE

            s.bus_id=$1

            AND s.status='Aktif'

            LIMIT 1
            `,
            [busId]
        );

        if(routeResult.rows.length == 0){

            return;

        }

        const path =
            routeResult.rows[0].path;

        const totalPoint =
            path.length;

        if(totalPoint == 0){

            return;

        }

        /*
        ==========================
        HITUNG %
        ==========================
        */

        const progress =
            Number(
                (
                    routeIndex /
                    totalPoint
                ) * 100
            ).toFixed(2);

        /*
        ==========================
        UPDATE BUS
        ==========================
        */

        await pool.query(
            `
            UPDATE buses

            SET

            progress=$1

            WHERE id=$2
            `,
            [
                progress,
                busId
            ]
        );

        console.log(
            "PROGRESS =",
            progress
        );

    }

    catch(err){

        console.log(err);

    }

};