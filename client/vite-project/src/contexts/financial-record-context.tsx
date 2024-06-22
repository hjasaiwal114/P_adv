import { useUser } from  "@clerk/clerk-react";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

// Define FinancialRecord interface 
export interface FinancialRecord{
    _id?: string;
    userId: string;
    date: Date;
    description: string;
    amount: number;
    category: string;
    paymentMethod: string;
} 

// Define the context type
interface FinacialRecordsContextType {
    records: FinancialRecord[];
    addRecord: (record: FinancialRecord) => void;
    updateRecord: (id: string, newRecord: FinancialRecord) => void;
    deleteRecord: (id: string) => void;
}

// Create the context
export const FinancialRecordsContext = createContext<
    FinacialRecordsContextType | undefined
>(undefined);

// FinancialRecordsProvider component
export const FinacialRecordsProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [records, setRecords] = useState<FinancialRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { user } = useUser();

    const fetchRecords = useCallback(async () => {
        if (!user) return;
        try {
            const response = await fetch(
                `http://localhost:3001/financial-records/getAllByUserID/${user.id}`
            );
            if (response.ok) {
                const data: FinancialRecord[] = await response.json();
                setRecords(data);
            }   else {
                console.error("Failed to fetch records");
            }
        } catch (err) {
          console.error("Error fetching records:", err);
        } finally {
          setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchRecords();
        }
    }, [user, fetchRecords]);

    const addRecord = useCallback(async (record: FinancialRecord) => {
        try {
            const response = await fetch("http://localhost:3001/financial-records", {
                method: "POST",
                body: JSON.stringify(record),
                headers: {
                    "Content-Type": "appplication/json",
                },
            });

            if (response.ok) {
                const newRecord: FinancialRecord = await response.json();
                setRecords((prev) => [...prev, newRecord]);
            } else {
                console.error("Failed to add record");
            }
        } catch (err) {
            console.error("Error adding record");
        }
    }, []);

    const updateRecord = useCallback(async (id: string, newRecord: FinancialRecord) => {
        try {
            const response = await fetch (
                `http://localhost:3001/financial-records/${id}`,
                {
                    method: "PUT",
                    body: JSON.stringify(newRecord),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                const updatedRecord: FinancialRecord  = await response.json();
                setRecords((prev) => 
                    prev.map((record) => (record._id === id ? updatedRecord: record))
                );
            } else {
                console.log("Failed to update record");
            }
        } catch (err) {
            console.error("Error updating record:", err);
        }
    }, []);

    const deleteRecord = useCallback(async (id: string) => {
        try {
            const response = await fetch(
                `http://localhost:3001/financial-records/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                setRecords((prev) => prev.filter((record) => record._id !== id));
            } else {
                console.error("Failed to delete record");
            }
        } catch (err) {
            console.error("Error deleting record:", err);
        }
    }, []);

    return (
        <FinancialRecordsContext.Provider
            value={{ records, addRecord, updateRecord, deleteRecord }}
        >
            {loading? <div>Loading ...</div>: children}
        </FinancialRecordsContext.Provider>
    );
};

// custom hook to use the financial reocrd context
export const useFinancialRecords = () => {
    const context = useContext(FinancialRecordsContext);

    if (!context) {
        throw new Error(
            "useFinancialRecords must be used within a FinancialRecordsProvider"
        );
    }

    return context;
};