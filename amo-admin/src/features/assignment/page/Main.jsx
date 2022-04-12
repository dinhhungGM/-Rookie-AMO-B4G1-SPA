import Multiselect from "multiselect-react-dropdown";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Pagination from "react-js-pagination";
import { Link } from "react-router-dom";
//import { useDispatch } from 'react-redux';
import SearchField from "react-search-field";
import { Button, Input } from "reactstrap";
// import assignmentApi from '../../../api/assignmentApi';
import AssignmentTable from "../components/AssignmentTable";
import { onChangePageName } from "../../home/homeSlice";
import { useHistory } from "react-router-dom";
import { getListAssignment, setFilter, setParams } from "../assignmentSlice";

const Main = () => {
  const {
    loading: Loading,
    assignments: Assignment,
    totalPages: TotalPages,
    totalItems: TotalItems,
    params: Params,
  } = useSelector((state) => state.assignment);

  const [isRefresh, setisRefresh] = useState(false);

  useEffect(() => {
    const collection = document.getElementsByClassName("option");
    for (let item of collection) {
      const newNode = document.createElement("label");
      newNode.innerHTML = item.textContent;
      item.replaceChild(newNode, item.childNodes[1]);
    }
  }, []);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getListAssignment(Params));
  }, [dispatch, Params, isRefresh]);
  const history = useHistory();

  const handleAssignedDateOnClick = (value) => {
    if (value == null) {
      dispatch(setParams({ key: "AssignedDate", value: null }));
    } else {
      dispatch(setParams({ key: "AssignedDate", value: new Date(value) }));
    }
  };

  const handlePageChange = (pageNumber) => {
    dispatch(setParams({ key: "Page", value: pageNumber }));
  };

  const onSelect = (selectedList, selectedItem) => {
    dispatch(setFilter({ value: selectedList.map((x) => x.key).join(" ") }));
  };

  const onRemove = (selectedList, removedItem) => {
    dispatch(setFilter({ value: selectedList.map((x) => x.key).join(" ") }));
  };

  const onSearchSubmit = (key, value) => {
    dispatch(setParams({ key: "KeySearch", value: key }));
  };
  const handleonRefresh = () => {
    setisRefresh(!isRefresh);
  };

  return (
    <div id="user-listing" style={{ paddingTop: "50px" }}>
      <div
        className="titleview"
        style={{
          color: "red",
          fontFamily: "Segoe UI, Arial",
          fontStyle: "normal",
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        Assignment List
      </div>
      <div id="user-search-filter">
        <div
          className="user-search-filter-select"
          style={{ paddingTop: "10px", paddingBottom: "10px" }}
        >
          <Multiselect
            placeholder="Filter by State"
            avoidHighlightFirstOption
            hidePlaceholder
            displayValue="cat"
            onRemove={(selectedList, selectedItem) =>
              onRemove(selectedList, selectedItem)
            }
            onSelect={(selectedList, selectedItem) =>
              onSelect(selectedList, selectedItem)
            }
            options={[
              {
                cat: "Waiting Accept",
                key: "1",
              },
              {
                cat: "Accepted",
                key: "0",
              },
            ]}
            showCheckbox
            closeOnSelect={false}
            style={{
              chips: {
                display: "none",
              },
              multiselectContainer: {
                width: "175px",
              },
              searchBox: {
                borderRadius: "5px",
                width: "175px",
                height: "auto",
              },
            }}
          />
          <DatePicker
            placeholderText="Assigned Date"
            selected={Params.AssignedDate}
            onChange={(value) => handleAssignedDateOnClick(value)}
            wrapperClassName="assign-date-filter"
            customInput={<Input />}
            isClearable
            dateFormat="dd/MM/yyyy"
            className="calendar-icon"
            clearButtonTitle="Clear"
            clearButtonClassName="clear-date-button"
          />
        </div>
        <div
          id="user-search-filter__right"
          style={{ paddingTop: "10px", paddingBottom: "10px" }}
        >
          <SearchField
            placeholder="Search..."
            onSearchClick={(key, value) => onSearchSubmit(key, value)}
            onEnter={(key, value) => onSearchSubmit(key, value)}
            classNames="test-class"
          />
          {"  "}
          <Button color="danger" id="add-assignment-btn">
            <Link
              className="btn-user-text"
              onClick={() => {
                dispatch(
                  onChangePageName("Manage Assignment > Create New Assignment"),
                );
                history.push("/manageassignment/create");
              }}
            >
              Create New Assignment
            </Link>
          </Button>
        </div>
      </div>
      {Assignment && (
        <>
          <AssignmentTable
            listitem={Assignment}
            onRefresh={handleonRefresh}
            setParams={true}
            Params={Params}
          />
          <Pagination
            activePage={Params.Page}
            itemsCountPerPage={10}
            totalItemsCount={TotalItems}
            pageRangeDisplayed={TotalPages}
            hideFirstLastPages={true}
            prevPageText="Previous"
            nextPageText="Next"
            onChange={(e) => handlePageChange(e)}
          />
        </>
      )}
    </div>
  );
};

export default Main;
