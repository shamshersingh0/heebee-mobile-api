const express = require('express');

const webposRouting = require('./webpos.routing');
const kitchenRouting = require('./kitchen.routing');
const baristaRouting = require('./barista.routing');
const adminRouting = require('./admin.routing');
const serverRouting = require('./server.routing');
const customerRouting = require('./customer.routing');
const addproductRouting = require('../controllers/addproduct.routing');
const adminPermissionsRouting = require('./admin.permissions.routing');

const router = express.Router();

router.use('/webpos', webposRouting);
router.use('/kitchen', kitchenRouting);
router.use('/barista',baristaRouting);
router.use('/server',serverRouting);
router.use('/customer',customerRouting);
router.use('/admin',adminRouting);
router.use('/add_product',addproductRouting);
router.use('/admin_permissions',adminPermissionsRouting);
module.exports = router;
