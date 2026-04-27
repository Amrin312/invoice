import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from 'moment';
import Button from "../../components/ui/Button";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader2, Plus, Sparkles } from "lucide-react";
import CreateWithAiModal from '../../components/invoices/CreateWithAiModal';
import ReminderModal from '../../components/invoices/ReminderModal';

const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusChangeLoading, setStatusChange] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAiModelOpen, setIsAiModelOpen] = useState(false);
  const [isReminderModelOpen, setIsReminderModelOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {

      try{
        const response = await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES);
        setInvoices(response.data.sort((a,b) => new Date(b.invoiceDate) - new Date(a.invoieDate)));
      }catch(err){
        setError('Failed to fetch invoices.');
        console.log(`Error: ${err.message}`);
      }finally{
        setLoading(false);
      }
    };

      fetchInvoices();

  },[]);

  const handleDelete = async (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setIsReminderModelOpen(true);
  }

  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => statusFilter === 'All' || invoice.status === statusFilter).filter(invoice => invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || invoice.billTo.clientName.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [invoices, searchTerm, statusFilter]);

  if(loading){
    return <div className="flex justify-center items-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  }

  return (
    <div className="space-y-6">
      <CreateWithAiModal isOpen={isAiModelOpen} onClose={() => setIsAiModelOpen(false)} />
      <ReminderModal isOpen={isReminderModelOpen} onClose={() => setIsReminderModelOpen(false)} invoiceId={selectedInvoiceId} />
        <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center gap-4 ">
          <div className="">
            <h1 className="text-2xl font-semibold text-slate-900">All Invoices</h1>
            <p className="text-sm text-slate-600 mt-1">Manage all your invoices in one place.</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setIsAiModelOpen(true)} icon={Sparkles}>Create with AI</Button>
            <Button onClick={() => navigate("/invoices/new")} icon={Plus}>Create Invoice</Button>

          </div>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
                <div className="flex-1">
                  <h3 className="txet-sm font-medium text-red-800 mb-1 ">Error</h3>
                  <p className="text-sm text-red-700">{ error }</p>
                </div>
            </div>
          </div>
        )}

        <div className=""></div>

    </div>
  )
}

export default AllInvoices