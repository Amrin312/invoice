import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance.js';
import { DollarSign, FileText, Loader2 } from 'lucide-react';
import { API_PATHS } from '../../utils/apiPaths.js';

const Dashboard = () => {

  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalPaid: 0,
    totalUnpaid: 0
  });

  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try{
        const response = await axiosInstance.get(
          API_PATHS.INVOICE.GET_ALL_INVOICES
        );

        const invoices = response.data;

        const totalInvoices = invoices.length;
        const totalPaid = invoices.filter(inv => inv.status === 'Paid').reduce((acc, curr) => acc + curr.total,0);
        const totalUnpaid = invoices.filter(inv => inv.status !== 'Paid').reduce((acc, curr) => acc + curr.total,0);

        setStats({totalInvoices, totalPaid, totalUnpaid});
        setRecentInvoices(invoices.sort((a,b) => new Date(b.invoiceDate) - new Date(a.invoiceDate)).slice(0,5));

      }catch(err){
        console.log(`Failed to fetch dashboard data: ${err.message}`);
        
      }finally{
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const statsData = [
    {
      icon: FileText,
      label: "Total Invoices",
      value: stats.totalInvoices,
      color: "blue"
    },
    {
      icon: DollarSign,
      label: "Total Paid",
      value: `${stats.totalPaid.toFixed(2)}`,
      color: "emerald"
    },
    {
      icon: DollarSign,
      label: "Total Unpaid",
      value: `${stats.totalUnpaid.toFixed(2)}`,
      color: "red"
    },
  ];

  const colorClasses = {
    blue: {bg: "bg-blue-100", text: "text-blue-600"},
    emerald: {bg: "bg-emerald-100", text: "text-emerald-600"},
    red: {bg: "bg-red-100", text: "text-red-600"}
  };

  if(loading){
    return(
      <div className='flex justify-center items-center h-96'>
        <Loader2 className='w-8  h-8 animate-spin text-blue-600' />
      </div>
    );
  }

  

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard