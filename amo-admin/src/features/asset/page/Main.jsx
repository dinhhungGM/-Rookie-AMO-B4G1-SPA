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

const initialFilter = {
  categoryId: "",
  state: "",
  keySearch: "",
  orderProperty: "",
  desc: true,
  page: 1,
  limit: 5,
};

const Main = () => {
  const params = useSelector((state) => state.asset.params);

  const [Filterlist, setFilterlist] = useState();
  const [Assets, setAssets] = useState();
  const [isRefresh, setIsRefresh] = useState(false);
  const [Filter] = useState(initialFilter);

  const history = useHistory();

  const dispatch = useDispatch();

  const onstateChange = (selectedList) => {
    dispatch(
      onChangeParam({
        ...params,
        State: selectedList.map((x) => x.cat).join(" "),
      })
    );
    console.log(selectedList);
  };

  const oncategoryChange = (selectedList) => {
    dispatch(
      onChangeParam({
        ...params,
        Category: selectedList.map((x) => x.key).join(" "),
      })
    );
    console.log(selectedList);
  };

  const [activePage, setActivePage] = useState();

  const handlePageChange = (pageNumber) => {
    dispatch(onChangeParam({ ...params, page: pageNumber }));
    setActivePage(pageNumber);
  };

  const onSearchSubmit = (key, value) => {
    dispatch(onChangeParam({ ...params, KeySearch: key }));
  };

  const handleRefresh = () => {
    setIsRefresh(!isRefresh);
  };

  useEffect(() => {
    const fetchFilterlist = async () => {
      try {
        const response = await assetApi.getFilter();
        setFilterlist(response);
      } catch (error) {
        console.log("Failed to fetch asset list: ", error);
      }
    };
    const fetchAssetList = async () => {
      try {
        console.log(params);
        const response = await assetApi.find(params);
        console.log(response);
        setAssets(response);
      } catch (error) {
        console.log("Failed to fetch asset list: ", error);
      }
    };
    fetchFilterlist();
    fetchAssetList(Filter);
  }, [isRefresh, Filter, params]);

  return (
    <div>
      <div className="titleview">Asset List</div>
      <div id="filter-and-search-asset-grp">
        <div id="filter-and-search-asset-grp__filter">
          <Multiselect
            placeholder="Filter by State"
            avoidHighlightFirstOption
            hidePlaceholder
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
                  key: "Not Available",
                },
                {
                    cat: "2",
                    key: "Assigned",
                },
                {
                    cat: "3",
                    key: "Waiting",
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
                background: "red",
              },
              multiselectContainer: {
                width: "150px",
              },
              searchBox: {
                borderRadius: "5px",
                width: "150px",
                height: "39px",
              },
            }}
          />
          {Filterlist !== undefined && (
            <Multiselect
              placeholder="Filter by Category"
              avoidHighlightFirstOption
              hidePlaceholder
              displayValue="key"
              onKeyPressFn={function noRefCheck() {}}
              onRemove={(selectedList, selectedItem) =>
                oncategoryChange(selectedList, selectedItem)
              }
              onSearch={function noRefCheck() {}}
              onSelect={(selectedList, selectedItem) =>
                oncategoryChange(selectedList, selectedItem)
              }
              options={Filterlist.categoryList.map((category) => {
                return { cat: category.id, key: category.name };
              })}
              showCheckbox
              closeOnSelect={false}
              style={{
                chips: {
                  background: "red",
                },
                multiselectContainer: {
                  width: "150px",
                },
                searchBox: {
                  borderRadius: "5px",
                  width: "150px",
                  height: "39px",
                },
              }}
            />
          )}
        </div>
        <div id="filter-and-search-asset-grp__search-and-btn">
          <SearchField
            placeholder="Search..."
            onSearchClick={(key, value) => onSearchSubmit(key, value)}
            onEnter={(key, value) => onSearchSubmit(key, value)}
            classNames="test-class"
          />
          <Button
            className="btn btn-danger"
            onClick={() => history.push("/manageasset/createasset")}
          >
            Create new asset
          </Button>
        </div>
      </div>

      {Assets !== undefined && (
        <>
          <ManageAssetTable
            listitem={Assets.items}
            onRefresh={handleRefresh}
          ></ManageAssetTable>
          <Pagination
            activePage={activePage}
            itemsCountPerPage={5}
            totalItemsCount={Assets.totalItems}
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
