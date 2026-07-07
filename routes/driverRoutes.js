const express = require("express"); 
const router = express.Router(); 

const { 
    getDriversByCompany, 
    createDriver, 
    updateDriver, 
    deleteDriver 
} = require("../controllers/driverController"); 

router.get( 
    "/company/:companyId", 
    getDriversByCompany ); 
    
router.post( 
    "/", 
    createDriver 
); 

router.put( 
    "/:id", 
    updateDriver 
); 

router.delete( 
    "/:id", 
    deleteDriver 
); 

module.exports = router;