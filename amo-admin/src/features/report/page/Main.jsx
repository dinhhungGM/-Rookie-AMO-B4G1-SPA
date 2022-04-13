import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import ReactTable from "../../../components/ReactTable"
import { getReportListAsync } from "../reportSlice";

export default function User() {
    const dispatch = useDispatch();
    const {loading, reports} = useSelector((state) => state.report);
    useEffect(() => {
        dispatch(getReportListAsync());
    }, []);

    const columns = [
        {
            Header: "Category",
            accessor: "name",
        },
        {
            Header: "Total",
            accessor: "total",
        },
        {
            Header: "Assigned",
            accessor: "assigned",
        },
        {
            Header: "Available",
            accessor: "available",
        },
        {
            Header: "Not available",
            accessor: "notAvailable",
        },
        {
            Header: "Waiting for recycling",
            accessor: "waitingForRecycling",
        },
        {
            Header: "Recycled",
            accessor: "recycled",
        },

    ];

    return (
        <div id="user-listing" style={{ paddingTop: "50px" }}>
            <span
                style={{
                    color: "red",
                    fontFamily: "Segoe UI, Arial",
                    fontStyle: "normal",
                    fontWeight: "bold",
                    fontSize: "20px",
                }}
            >
                User List{" "}
            </span>
            <div
                style={{ paddingTop: "10px", paddingBottom: "10px" }}
                className="text-end"
            >
                <Button color="danger" id="add-user-btn btn-user-text">
                    Export
                </Button>
            </div>

            {!loading ? (
                <div>
                    <ReactTable
                        columns={columns}
                        data={reports}
                        onHeaderClick={() => { }}
                        onRowClick={() => { }}
                        scrollable={false}
                    ></ReactTable>
                </div>
            ) : (
                <span>Loading...</span>
            )}
        </div>
    );
}
