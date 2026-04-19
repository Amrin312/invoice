import mongoose from "mongoose";
import Invoice from '../models/invoiceModel.js';
import { getAuth } from "@clerk/express";


const API_BASE = "http://localhost:4000";

function computeTotals(items = [], taxPercentage = 0) {
    const safe = Array.isArray(items) ? items.filter(Boolean) : [];

    const subTotal = safe.reduce((acc, curr) => acc + (Number(curr.qnt || 0) * Number(curr.unitPrice || 0)), 0);

    const tax = (subTotal * Number(taxPercentage || 0)) / 100;

    const total = subTotal + tax;

    return { subTotal, tax, total }
}

function parseItemsField(val){
    if(!val) return [];
    if(Array.isArray(val)) return val;

    if(typeof val === 'string'){
        try{
            return JSON.parse(val);
        }catch(err){
            return []
        }
    }

    return val;
}

function isObjectIdString(val){
    return typeof val === "string" && /^[0-9a-fA-F]{24}$/.test(val);
}

function uploadedFilesToUrls(req){
    const urls = {};
    if(!req.files) return urls;

    const mapping = {
        logoName: "logoDataUrl",
        stampName: "stampDataUrl",
        signatureNameMeta: "signatureDataUrl",
        logo: "logoDataUrl",
        stamp: "stampDataUrl",
        signature: "signatureDataUrl"
    };
}