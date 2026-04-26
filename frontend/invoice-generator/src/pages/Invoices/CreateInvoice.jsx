import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import moment from "moment";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const CreateInvoice = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [formData, setFormData] = useState(existingInvoice || {
    invoiceNumber: '',
    invoiceDate: new Date().toDateString().split("T")[0],
    dueDate: '',
    billFrom: {
      businessName: user?.businessName || '',
      email: user?.email || '',
      address: user?.address || '',
      phone: user?.phone || '',
    },
    billTo: {
      clientName: "", email: '', address: '', phone: ''
    },
    items: [{ name: '', quantity: 1, unitPrice: 0, textPercentage: 0 }],
    notes: '',
    paymentTerms: "Net 15"
  });

  const [loading, setLoading] = useState(false);
  cosnt [isGeneratingNUmber, setIsGeneratingNumber] = useState(!existingInvoice);

  useEffect(() => {
    const aiData = location.state?.aiData;

    if(aiData){
      setFormData(prev => ({
        ...prev,
        billTo: {
          clientName: aiData.clientName || '',
          email: aiData.email || '',
          address: aiData.address || '',
          phone: aiData.phone || ''
        },
        items: aiData.items || [{ name: "", quantity: 1, unitPrice: 0, taxPercent: 0 }],
      }));
    }

    
  }, []);



  return (
    <div>CreateInvoice</div>
  )
}

export default CreateInvoice