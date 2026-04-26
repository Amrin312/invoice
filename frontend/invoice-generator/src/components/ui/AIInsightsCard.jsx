import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths";
import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";


const AIInsightsCard = () => {
    const [insights, setInsights] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
           try{
                const response = await axiosInstance.get(API_PATHS.AI.GET_DASHBOARD_SUMMARY);
                setInsights(response.data.insights || []);
           }catch(err){
                console.log(`Error : ${err.message}`);
                setInsights([]);
           }finally{
                setIsLoading(false);
           }
        };

        fetchInsights();
    }, []);
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm shadow-gray-100">
        <div className="flex items-center mb-4">
            <Lightbulb className="w-6 h-6 text-yellow-500 mr-3" />
            <h2 className="text-lg font-semibold text-slate-900">AI Insights</h2>
        </div>
        {
            isLoading ? (
                <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </div>
            ) : (
                <ul className="space-y-3 list-disc list-inside text-slate-600 ml-3">
                    {
                        insights.map((insight, index) => (
                            <li className="text-sm " key={index}>{ insight }</li>
                        ))
                    }
                </ul>
            )
        }
    </div>
  )
}

export default AIInsightsCard