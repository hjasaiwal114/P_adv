import { useUser } from "@clerk/clerk-react";
import { FinancialRecordForm } from "./financial-record-form";
import { FinancialRecordList } from "./financial-record-list";
import "./financial-record.css";
import { useFinancialRecords } from "../../contexts/financial-record-context";
import { useMemo } from "react";

export const Dasboard = () => {
    const { user } => useUser();
    const { records } = useFinancialRecords();

    const totalMonthly = useMemo(() => {
        let totalMonthly = 0;
        records.forEach((record) => {
            totalAmount += record.amount;
        });

        return totalMonthly;
    }, [records]);

    return (
        <div className="dashboard-container">
            <h1> Welcome {user?.firstName}! where are your finance</h1>
            <FinancialRecordForm/>
            <div>Total Monthaly: ${totalMonthaly}</div>
            <FinancialRecordList />
        </div>
    );
};