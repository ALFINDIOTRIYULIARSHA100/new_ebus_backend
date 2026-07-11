const pool = require("../config/database");
const geolib = require("geolib");

exports.updateRouteIndex =
async (busId, latitude, longitude) => {

    try {

        /*
        ==========================
        AMBIL ROUTE AKTIF
        ==========================
        */

        const result = await pool.query(
            `
            SELECT

            r.path

            FROM schedules s

            JOIN routes r
            ON r.id = s.route_id

            WHERE

            s.bus_id = $1

            AND s.status='Aktif'

            LIMIT 1
            `,
            [busId]
        );

        if(result.rows.length == 0){

            return;

        }

        const path =
            result.rows[0].path;

        if(!path || path.length == 0){

            return;

        }

        let nearestIndex = 0;

        let nearestDistance = Number.MAX_VALUE;

        /*
        ==========================
        CARI TITIK TERDEKAT
        ==========================
        */

        for(let i=0;i<path.length;i++){

            const point = path[i];

            const distance =
                geolib.getDistance(

                    {
                        latitude,
                        longitude
                    },

                    {
                        latitude: Number(point.lat),
                        longitude: Number(point.lng)
                    }

                );

            if(distance < nearestDistance){

                nearestDistance = distance;

                nearestIndex = i;

            }

        }

        /*
        ==========================
        UPDATE DATABASE
        ==========================
        */

        await pool.query(

            `
            UPDATE buses

            SET

            route_index = $1

            WHERE id = $2
            `,

            [

                nearestIndex,

                busId

            ]

        );

        console.log(
            "ROUTE INDEX =",
            nearestIndex
        );

    }

    catch(err){

        console.log(err);

    }

};