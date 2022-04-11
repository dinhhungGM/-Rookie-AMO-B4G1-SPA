import React, { useState, useEffect } from "react";
import Multiselect from "multiselect-react-dropdown";
import Pagination from "react-js-pagination";
import ReturnRequestTable from "../components/ReturnRequestTable";
import { useSelector, useDispatch } from "react-redux";
import SearchField from "react-search-field";
import { Button, Input } from "reactstrap";
import { useHistory } from "react-router";
import { getReturnRequestListAsync } from "../returnRequestSlice";
import { onChangePageName } from "../../home/homeSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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

  const history = useHistory();
  const dispatch = useDispatch();

  const handleChangePageName = (pagename) => {
    //dispatch(onChangePageName(pagename));
  };

  const onstateChange = (selectedList) => {
    setparams({
      ...params,
      state: selectedList.map((x) => x.cat).join(" "),
      page: 1,
    });
    setActivePage(1);
  };

  const handlePageChange = (pageNumber) => {
    setparams({ ...params, page: pageNumber });
    setActivePage(pageNumber);
  };

  const onSearchSubmit = (key, value) => {
    setparams({ ...params, keySearch: key, page: 1 });
    setActivePage(1);
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
        Asset List
      </span>

      <div
        id="filter-and-search-asset-grp"
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
      >
        <div id="filter-and-search-asset-grp__filter">
          <Multiselect
            showArrow
            className="me-1"
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
          <Pagination
            activePage={activePage}
            itemsCountPerPage={5}
            totalItemsCount={returnRequests.totalItems}
            pageRangeDisplayed={5}
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
