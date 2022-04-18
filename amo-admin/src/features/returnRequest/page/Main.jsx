import React, { useState, useEffect } from "react";
import Multiselect from "multiselect-react-dropdown";
import ReturnRequestTable from "../components/ReturnRequestTable";
import { useSelector, useDispatch } from "react-redux";
import SearchField from "react-search-field";
import { Input } from "reactstrap";
import { getReturnRequestListAsync } from "../returnRequestSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactPaginate from "react-paginate";
const user = JSON.parse(localStorage.getItem("user"));

const initialFilter = {
  state: "",
  returnDate: null,
  keySearch: "",
  orderProperty: "Code",
  direction: "ASC",
  location: user.profile.location,
  page: 1,
  limit: 5,
};

export const sortAssetByUpdatedDate = () => {
  initialFilter.orderProperty = "UpdatedDate";
  initialFilter.direction = "DESC";
};

const Main = () => {
  const { returnRequests } = useSelector((state) => state.returnRequest);
  const [isRefresh, setIsRefresh] = useState(false);
  const [params, setparams] = useState(initialFilter);
  const [activePage, setActivePage] = useState();

  const dispatch = useDispatch();

  const onstateChange = (selectedList) => {
    setparams({
      ...params,
      state: selectedList.map((x) => x.cat).join(" "),
      page: 1,
    });
    setActivePage(0);
  };

  const handlePageChange = (e) => {
    setparams({ ...params, page: e.selected + 1 });
    setActivePage(e.selected);
  };

  const onSearchSubmit = (key, value) => {
    setparams({ ...params, keySearch: key, page: 1 });
    setActivePage(0);
  };
  const handleReturnDateOnClick = (value) => {
    ///console.log(new Date(value).toISOString());
    if (value === null) {
      setparams({ ...params, returnDate: null });
    } else {
      setparams({ ...params, returnDate: value });
    }
  };
  const handleRefresh = () => {
    setIsRefresh(!isRefresh);
  };
  useEffect(() => {
    const collection = document.getElementsByClassName("option");
    for (let item of collection) {
      const newNode = document.createElement("label");
      newNode.innerHTML = item.textContent;
      item.replaceChild(newNode, item.childNodes[1]);
    }
  }, []);
  useEffect(() => {
    dispatch(getReturnRequestListAsync(params));
  }, [isRefresh, params, dispatch]);
  return (
    <div style={{ paddingTop: "50px" }}>
      <span
        style={{
          color: "red",
          fontFamily: "Segoe UI, Arial",
          fontStyle: "normal",
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        Request List
      </span>

      <div
        id="filter-and-search-asset-grp"
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
      >
        <div id="filter-and-search-asset-grp__filter">
          <Multiselect
            showArrow
            placeholder="Filter by State"
            avoidHighlightFirstOption
            displayValue="key"
            onKeyPressFn={function noRefCheck() {}}
            onRemove={(selectedstateList, selectedItem) =>
              onstateChange(selectedstateList, selectedItem)
            }
            onSearch={function noRefCheck() {}}
            onSelect={(selectedstateList, selectedItem) =>
              onstateChange(selectedstateList, selectedItem)
            }
            options={[
              {
                cat: "0",
                key: "Completed",
              },
              {
                cat: "1",
                key: "Waiting for Returning",
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
            placeholderText="Returned Date"
            selected={params.returnDate}
            onChange={(value) => handleReturnDateOnClick(value)}
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
          id="filter-and-search-asset-grp__search-and-btn"
          className="d-flex"
        >
          <div>
            <SearchField
              placeholder="Search..."
              onSearchClick={(key, value) => onSearchSubmit(key, value)}
              onEnter={(key, value) => onSearchSubmit(key, value)}
              classNames="search-field-asset me-1 h-auto"
              style={{
                "*": {
                  height: "auto",
                },
              }}
            />
          </div>
        </div>
      </div>

      {returnRequests !== undefined && (
        <>
          <ReturnRequestTable
            listitem={returnRequests.items}
            onRefresh={handleRefresh}
            params={params}
            setparams={setparams}
          ></ReturnRequestTable>
          <ReactPaginate
            forcePage={activePage}
            nextLabel="Next"
            onPageChange={(e) => handlePageChange(e)}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            pageCount={returnRequests.totalPages}
            previousLabel="Previous"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
            renderOnZeroPageCount={null}
          />
        </>
      )}
    </div>
  );
};

export default Main;
