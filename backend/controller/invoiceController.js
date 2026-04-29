import Invoice from "../models/Invoice.js";

const calculateTotal = (items) => {

    let subTotal = 0;
    let taxTotal = 0;
    
    items.forEach(item => {
        subTotal += item.unitPrice * item.quantity;
        taxTotal += ((item.unitPrice * item.quantity) * (item.taxPercent || 0)) / 100;
    });

    const total = subTotal + taxTotal;

    return {subTotal, taxTotal, total}
}

export const createInvoice = async (req, res) => {
    try{
        const user = req.user;

        const {
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms
        } = req.body;

        const {subTotal, taxTotal,total } = calculateTotal(items);

         const invoice = new Invoice({
            user,
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms,
            subTotal,
            taxTotal,
            total
         });

         await invoice.save();

         res.status(201).json({invoice});

    }catch(err){
        res.status(401).json({message: "Error creating invoice", error: err.message});
    }
}


export const getInvoices = async (req, res) => {

    try{
        const invoices = await Invoice.find({user: req.user.id}).populate("user", "name email");

        // if(invoices.user.toString() !== req.user.id){
        //     return res.status(401).json()({message: "Not Authorized."});
        // }

        res.json(invoices);

    }catch(err){
        res.status(401).json({message: "Error fetching invoice", error: err.message});
    }

}

export const getInvoiceById = async (req, res) => {

    try{
        const invoice = await Invoice.findById(req.params.id).populate("user", "name email");

        if(!invoice){
            res.status(404).json({message: "Invoice not found!"});
        }

        if(invoice.user._id.toString() !== req.user.id){
            return res.status(401).json({message: 'Not Authorized'});
        }

        res.status(201).json(invoice);

    }catch(err){
        res.status(401).json({message: "Error fetching invoice", error: err.message});
    }

}

export const updateInvoice = async (req, res) => {

    try{

        const {
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            status,
            paymentTerms
        } = req.body;

        const {subTotal, taxTotal,total } = calculateTotal(items);

        const updateInvoice = await Invoice.findByIdAndUpdate(req.params.id, {
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            status,
            paymentTerms,
            subTotal,
            taxTotal,
            total
        });

        if(!updateInvoice){
            res.status(404).json({message: "Invoice not found"});
        }

        res.status(201).json(updateInvoice);

    }catch(err){
        res.status(401).json({message: "Error updating invoice", error: err.message});
    }

}

export const deleteInvoice = async (req, res) => {

    try{
        const invoice = await Invoice.findByIdAndDelete(req.params.id);

        if(!invoice){
            res.status(404).json({message: "Invoice not found"});
        }

        res.status(201).json({message: "Invoice deleted!"})
    }catch(err){
        res.status(401).json({message: "Error deleting invoice", error: err.message});
    }

}