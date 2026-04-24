import { GoogleGenAI } from '@google/genai';
import Invoice from '../models/Invoice.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const parseInvoiceFromText = async (req, res) => {
    const { text } = req.body;

    if(!text) return res.status(400).json({message: "Text is required!"});

    try{
        const prompt = `You are an expert invoice data extraction AI. Analyze the following text and extract the relevant information to create an invoice. The output MUST be valid JSON object. 
        
        The JSON object should have the following structure:
        {
            "clientName": "String",
            "email": "String (if available)",
            "address": "String (if available)",
            "items": [
                        {
                            "name": "String",
                            "quantity": "Number",
                            "unitPrice": "Number",

                        }
                    ],
        }
            Here is the text to parse:
            --- TEXT START ---
            ${text}
            --- TEXT END ---

            extract the data and provide only the JSON Object.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });

        const responseText = response.text;

        if(typeof responseText !== 'string'){
            if(typeof response.text === 'function'){
                responseText = response.text();
            }else{
                throw new Error("Could not extract text from AI response"); 
            }
        }

        const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        const parsedData = JSON.parse(cleanedJson);

        res.status(201).json(parsedData)
    }catch(err){

        console.log(`Error: ${err.message}`);
        res.status(500).json({message: "Error parsing invoice text.", error: err.message});
    }
}

export const generateReminder = async (req, res) => {

    const { invoiceId } = req.body;

    if(!invoiceId) return res.status(400).json({message: "Invoice Id is required!"});

    try{
        const invoice = await Invoice.findById(invoiceId);
        
        if(!invoice){
            return res.status(404).json({message: "Invoice not found!"});
        }

        const prompt = `You are a professional and polite accounting assistant. Write a friendly reminder email to a client about an overdue or upcoming invice payment.
        
        Use the following details to personalize the email:
        - Client name: ${invoice.billTo.clientName}
        - Invoice Number: ${invoice.invoiceNumber}
        - Amount Due: ${invoice.total.toFixed()}
        - Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}

        The tone should be friendly but clear. Keep it concise. Start the email with "Subject:".
        `;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt
        });

        res.status(200).json({reminderText: response.text});
    
    }catch(err){

        console.log(`Error: ${err.message}`);
        res.status(500).json({message: "Error in generate reminder.", error: err.message});
    }
}

export const getDashboardSummary = async (req, res) => {

    try{
        const invoices = await Invoice.find({ user: req.user.id});

        if(invoices.length === 0){
            return res.status(200).json({insights: ["No Invoice data available to generate insights!"]});
        }

        //process and summarize data
        const totalInvoices = invoices.length;
        const paidInvoices = invoices.filter(inv => inv.status === 'paid');
        const unpaidInvoices = invoices.filter(inv => inv.status !== 'paid');
        const totalRevenue = paidInvoices.reduce((acc, curr) => acc + curr.total , 0);
        const totalOutstanding = unpaidInvoices.reduce((acc, curr) => acc + curr.total , 0);

        const dataSummary = `
        - Total number od invoices : ${totalInvoices}
        - Total paid Invoices: ${paidInvoices}
        - Total unpaid/pending Invoices: ${unpaidInvoices}
        - Total Revenue from paid invoices: ${totalRevenue.toFixed(2)}
        - Total outstanding amount from unpaid/pending Invoices: ${totalOutstanding.toFixed(2)}
        - Recent Invoices (last 5): ${invoices.slice(0,5).map(inv => `Invoice #${inv.invoiceNumber} for ${inv.total.toFixed(2)} with status ${inv.status}`).join(',')}
        `;

        const prompt = `
            You are a friendly and insightful financial analyst for a small business owner.
            Based on the following summary of their invoice data and provide 2-3 concise and actionable insights.
            Each insight should be a short string in a JSON array.
            The insights should be encouraging and helpful. Do not just repeat the data.
            For example, if there is a hight outstanding amount, suggest sending reminders. If revenue is hight be encouraging.
            
            Data summary:
            ${dataSummary}

            Return your response as a valid JSON object with a single key "insights" which is an array of strings.
            Example format: {"insights": ["Your revenue is looking strong this month", "You have 5 overdue invoices. Consider sending reminders to get paid faster."]} 
        `;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt
        });

        const responseText = response.text;
        const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        const parseData = JSON.parse(cleanedJson);

        res.status(200).json(parseData);

    }catch(err){

        console.log(`Error: ${err.message}`);
        res.status(500).json({message: "Error idashboard summary.", error: err.message});
    }
}