import React, { useState, useEffect } from "react";
import Multiselect from "multiselect-react-dropdown";
import Pagination from "react-js-pagination";
import ManageAssetTable from "../components/ManageAssetTable";
import assetApi from "../../../api/assetApi";
import { useSelector, useDispatch } from "react-redux";
import { onChangeParam } from "../assetSlice";
import SearchField from "react-search-field";
import { Button } from "reactstrap";
import { useHistory } from "react-router";
import { getAssetListAsync } from "../assetSlice";

const user = JSON.parse(localStorage.getItem("user"));

const initialFilter = {
  category: "",
  state: "0 1 2",
  keySearch: "",
  orderProperty: "UpdatedDate",
  direction: "none",
  location: user.profile.location,
  page: 1,
  limit: 5,
};

export const sortAssetByUpdatedDate = () => {
  initialFilter.direction = "DESC";
};

const ManageAsset = () => {
  const { assets } = useSelector((state) => state.asset);
  const [isRefresh, setIsRefresh] = useState(false);
  const [params, setparams] = useState(initialFilter);
  const [activePage, setActivePage] = useState();

  const history = useHistory();
  const dispatch = useDispatch();

  const onstateChange = (selectedList) => {
    // dispatch(
    //   onChangeParam({
    //     ...params,
    //     State: selectedList.map((x) => x.cat).join(" "),
    //   })
    // );
    setparams({
      ...params,
      state: selectedList.map((x) => x.cat).join(" "),
      page: 1,
    });
    setActivePage(1);
  };

  const oncategoryChange = (selectedList) => {
    // dispatch(
    //   onChangeParam({
    //     ...params,
    //     Category: selectedList.map((x) => x.key).join(" "),
    //   })
    // );
    setparams({
      ...params,
      category: selectedList.map((x) => x.key).join(" "),
      page: 1,
    });
    setActivePage(1);
  };

  const handlePageChange = (pageNumber) => {
    //dispatch(onChangeParam({ ...params, page: pageNumber }));
    setparams({ ...params, page: pageNumber });
    setActivePage(pageNumber);
  };

  const onSearchSubmit = (key, value) => {
    //dispatch(onChangeParam({ ...params, KeySearch: key }));
    setparams({ ...params, keySearch: key, page: 1 });
    setActivePage(1);
    //setparams({ ...params, page: pageNumber });
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
    <div>
      <div className="titleview">Asset List</div>
      <div id="filter-and-search-asset-grp" className="mb-2">
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
              onClick={() => history.push("/manageasset/createasset")}
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
          <Pagination
            activePage={activePage}
            itemsCountPerPage={5}
            totalItemsCount={assets.totalItems}
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

export default ManageAsset;
