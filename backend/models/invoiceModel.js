import mongoose from 'mongoose'

const ItemSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    qnt: {
        type: Number,
        required: true,
        default: 1
    }, 
    unitPrice: {
        type: Number,
        required: true,
        default: 0
    },
}, {
    _id: false
});

const InvoiceSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true,
        index: true
    },
    invoiceNumber: {
        type: String,
        required: true,
        index: true
    },
    issueDate: {
        type: String,
        required: true
    },
    dueDate: {
        type: String,
        default: ''
    },

    //business info
    fromBusinessName: {
        type: String,
        default: ''
    },
    fromEmail: {
        type: String,
        default: ''
    },
    fromAddress: {
        type: String,
        default: ''
    },
    fromPhone: {
        type: String,
        default: ''
    },
    fromGst: {
        type: String,
        default: ''
    },

    //client info

    client: {
        name:{
            type: String,
            default: ''
        },
        email:{
            type: String,
            default: ''
        },
        address: {
            type: String,
            default: ''
        },
        phone: {
            type: String,
            default: ''
        }
    },

    currency: {
        type: String,
        default: 'INR'
    },

    status: {
        type: String,
        enum: ['draft', 'unpaid', 'paid', 'overdue'],
        default: 'draft'
    },

    //assets handling
    logoDataUrl: {
        type: String,
        default: null
    },
    stampDataUrl: {
        type: String,
        default: null
    },
    signatureDataUrl: {
        type: String,
        default: null
    },

    signatureName: { type: String, default: "" },
    signatureTitle: { type: String, default: "" },

    TaxPercent: { type: Number, default: 18 },

    subTotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },

}, 
{
    timestamps: true
});

const Invoice = mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);
export default Invoice;