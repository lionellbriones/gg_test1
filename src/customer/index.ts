import { Router } from "express";
import { CustomerController } from "./customer.controller";
const router = Router();
const customerController = new CustomerController();

router.get('', customerController.getCustomer);

router.post('', customerController.storeCustomer);

router.patch('', customerController.updateCustomer);

export const customer = router;