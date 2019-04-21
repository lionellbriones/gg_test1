import { Request, Response } from "express";

export class CustomerController {

    getCustomer(req:Request, res:Response){
        res.json({
            message: "Hello World"
        });
    }

    storeCustomer(req:Request, res:Response) {
        const data = req.body;
        res.json(data);
    }

    updateCustomer(req:Request, res:Response) {
        const data = req.body;
        res.json(data);
    }
}