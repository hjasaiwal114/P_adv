import { useMemo, useState } from "react";
import {
  FinancialRecord,
  useFinancialRecords,
} from "../../contexts/financial-record-context";
import { useTable, Column, CellProps, Row } from "react-table";

// Interface for EditableCell props
interface EditableCellProps extends CellProps<FinancialRecord> {
  updateRecord: (rowIndex: number, columnId: string, value: any) => void;
  editable: boolean;
}

// EditableCell component
const EditableCell: React.FC<EditableCellProps> = ({
  value: initialValue, // Initial value of the cell
  row, // The current row data
  column, // The current column data
  updateRecord, // Function to update the record
  editable, // Whether the cell is editable
}) => {
  const [isEditing, setIsEditing] = useState(false); // State to track if the cell is in edit mode
  const [value, setValue] = useState(initialValue); // State to track the cell's value

  // Function to handle blur event
  const onBlur = () => {
    setIsEditing(false); // Exit edit mode
    updateRecord(row.index, column.id, value); // Update the record with the new value
  };

  return (
    <div
      onClick={() => editable && setIsEditing(true)} // Enable editing on click if the cell is editable
      style={{ cursor: editable ? "pointer" : "default" }} // Change cursor style if the cell is editable
    >
      {isEditing ? ( // If the cell is in edit mode, render an input field
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)} // Update the cell value on input change
          autoFocus
          onBlur={onBlur} // Handle blur event
          style={{ width: "100%" }} // Set input width to 100%
        />
      ) : typeof value === "string" ? ( // Otherwise, display the cell value as text
        value
      ) : (
        value.toString()
      )}
    </div>
  );
};

// FinancialRecordList component
export const FinancialRecordList = () => {
  const { records, updateRecord, deleteRecord } = useFinancialRecords(); // Get records and functions from context

  // Function to update a specific cell in the record
  const updateCellRecord = (rowIndex: number, columnId: string, value: any) => {
    const id = records[rowIndex]?._id; // Get the record ID
    updateRecord(id ?? "", { ...records[rowIndex], [columnId]: value }); // Update the record with the new value
  };

  // Columns definition
  const columns: Array<Column<FinancialRecord>> = useMemo(
    () => [
      {
        Header: "Description",
        accessor: "description",
        Cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        Header: "Payment Method",
        accessor: "paymentMethod",
        Cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={false} // Date is not editable
          />
        ),
      },
      {
        Header: "Delete",
        id: "delete",
        Cell: ({ row }) => (
          <button
            onClick={() => deleteRecord(row.original._id ?? "")} // Delete record on button click
            className="button"
          >
            Delete
          </button>
        ),
      },
    ],
    [records] // Dependency array to recompute columns when records change
  );

  // Set up table properties using useTable hook
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: records,
    });

  return (
    <div className="table-container">
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((hg) => (
            <tr {...hg.getHeaderGroupProps()}>
              {hg.headers.map((column) => (
                <th {...column.getHeaderProps()}> {column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, idx) => {
            prepareRow(row); // Prepare the row for rendering
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}> {cell.render("Cell")} </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
