import React, { useState, useEffect } from "react";
import Multiselect from "multiselect-react-dropdown";
import ManageAssetTable from "../components/ManageAssetTable";
import { useSelector, useDispatch } from "react-redux";
import SearchField from "react-search-field";
import { Button } from "reactstrap";
import { useHistory } from "react-router";
import { getAssetListAsync } from "../assetSlice";
import { onChangePageName } from "../../home/homeSlice";
import ReactPaginate from "react-paginate";
const user = JSON.parse(localStorage.getItem("user"));

const initialFilter = {
  category: "",
  state: "0 1 2",
  keySearch: "",
  orderProperty: "Code",
  direction: "ASC",
  location: user.profile.location,
  page: 1,
  limit: 5,
};

export const sortAssetByUpdatedDate = () => {
  initialFilter.direction = "DESC";
  initialFilter.orderProperty = "UpdatedDate";
};

const ManageAsset = () => {
  const { assets } = useSelector((state) => state.asset);
  const [isRefresh, setIsRefresh] = useState(false);
  const [params, setparams] = useState(initialFilter);
  const [activePage, setActivePage] = useState();

  const history = useHistory();
  const dispatch = useDispatch();

  const handleChangePageName = (pagename) => {
    dispatch(onChangePageName(pagename));
  };

  const onstateChange = (selectedList) => {
    setparams({
      ...params,
      state: selectedList.map((x) => x.cat).join(" "),
      page: 1,
    });
    setActivePage(0);
  };

  const oncategoryChange = (selectedList) => {
    setparams({
      ...params,
      category: selectedList.map((x) => x.key).join(" "),
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
    dispatch(getAssetListAsync(params));
  }, [isRefresh, params, dispatch]);

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
        Asset List{" "}
      </span>
      <div
        id="filter-and-search-asset-grp"
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
      >
        <div id="filter-and-search-asset-grp__filter">
          <Multiselect
            showArrow
            selectedValues={[
              {
                cat: "0",
                key: "Available",
              },
              {
                cat: "1",
                key: "Not available",
              },
              {
                cat: "2",
                key: "Assigned",
              },
            ]}
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
                key: "Available",
              },
              {
                cat: "1",
                key: "Not available",
              },
              {
                cat: "2",
                key: "Assigned",
              },
              {
                cat: "3",
                key: "Waiting for recycling",
              },
              {
                cat: "4",
                key: "Recycled",
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
          <Multiselect
            showArrow
            placeholder="Filter by Category"
            avoidHighlightFirstOption
            displayValue="cat"
            onKeyPressFn={function noRefCheck() {}}
            onRemove={(selectedList, selectedItem) =>
              oncategoryChange(selectedList, selectedItem)
            }
            onSearch={function noRefCheck() {}}
            onSelect={(selectedList, selectedItem) =>
              oncategoryChange(selectedList, selectedItem)
            }
            options={[
              {
                cat: "Person Computer",
                key: "PC",
              },
              {
                cat: "Monitor",
                key: "MO",
              },
              {
                cat: "Laptop",
                key: "LA",
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
          <div>
            <Button
              className="btn btn-danger"
              onClick={() => {
                handleChangePageName("Manage Asset > Create Asset");
                history.push("/manageasset/createasset");
              }}
            >
              Create new asset
            </Button>
          </div>
        </div>
      </div>

      {assets !== undefined && (
        <>
          <ManageAssetTable
            listitem={assets.items}
            onRefresh={handleRefresh}
            params={params}
            setparams={setparams}
          ></ManageAssetTable>
          <ReactPaginate
            nextLabel="Next"
            onPageChange={(e) => handlePageChange(e)}
            forcePage={activePage}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            pageCount={assets.totalPages}
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

export default ManageAsset;
