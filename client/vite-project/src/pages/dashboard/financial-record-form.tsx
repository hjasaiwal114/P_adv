import { useState } from "react"; // Import useState hook from React
import { useUser } from "@clerk/clerk-react"; // Import useUser hook from Clerk
import { useFinancialRecords } from "../../contexts/financial-record-context"; // Import custom hook to access financial records context

// Define the FinancialRecordForm component
export const FinancialRecordForm = () => {
  // State variables to hold form input values
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  // Destructure addRecord function from useFinancialRecords context
  const { addRecord } = useFinancialRecords();

  // Destructure user object from useUser context
  const { user } = useUser();

  // Function to handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Create a new record object with form input values
    const newRecord = {
      userId: user?.id ?? "", // Use user ID if available, otherwise use an empty string
      date: new Date(), // Set current date
      description: description, // Use state variable for description
      amount: parseFloat(amount), // Convert amount to a number
      category: category, // Use state variable for category
      paymentMethod: paymentMethod, // Use state variable for payment method
    };

    // Add the new record using addRecord function from context
    addRecord(newRecord);

    // Clear form input fields
    setDescription("");
    setAmount("");
    setCategory("");
    setPaymentMethod("");
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {/* Form field for description */}
        <div className="form-field">
          <label>Description:</label>
          <input
            type="text"
            required
            className="input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {/* Form field for amount */}
        <div className="form-field">
          <label>Amount:</label>
          <input
            type="number"
            required
            className="input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        {/* Form field for category */}
        <div className="form-field">
          <label>Category:</label>
          <select
            required
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a Category</option>
            <option value="Food">Food</option>
            <option value="Rent">Rent</option>
            <option value="Salary">Salary</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {/* Form field for payment method */}
        <div className="form-field">
          <label>Payment Method:</label>
          <select
            required
            className="input"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Select a Payment Method</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
        {/* Submit button */}
        <button type="submit" className="button">
          Add Record
        </button>
      </form>
    </div>
  );
};
