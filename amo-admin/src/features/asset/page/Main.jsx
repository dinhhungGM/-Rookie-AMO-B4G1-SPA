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
    orderProperty: "UpdatedDate",
    desc: true,
    page: 1,
    limit: 5,
};

const Main = () => {
    //const params = useSelector((state) => state.asset.params);

    const [Filterlist, setFilterlist] = useState();
    const [Assets, setAssets] = useState([]);
    const [isRefresh, setIsRefresh] = useState(false);
    const [Filter] = useState(initialFilter);
    const [params, setparams] = useState(initialFilter)

    const history = useHistory();

    //const dispatch = useDispatch();

    const onstateChange = (selectedList) => {
        // dispatch(
        //   onChangeParam({
        //     ...params,
        //     State: selectedList.map((x) => x.cat).join(" "),
        //   })
        // );
        setparams(
            {
                ...params,
                State: selectedList.map((x) => x.cat).join(" "), page: 1
            }
        );
        setActivePage(1);
    };

    const oncategoryChange = (selectedList) => {
        // dispatch(
        //   onChangeParam({
        //     ...params,
        //     Category: selectedList.map((x) => x.key).join(" "),
        //   })
        // );
        setparams(
            {
                ...params,
                Category: selectedList.map((x) => x.key).join(" "), page: 1
            }
        );
        setActivePage(1);
    };

    const [activePage, setActivePage] = useState();

    const handlePageChange = (pageNumber) => {
        //dispatch(onChangeParam({ ...params, page: pageNumber }));
        setparams({ ...params, page: pageNumber });
        setActivePage(pageNumber);
    };

    const onSearchSubmit = (key, value) => {
        //dispatch(onChangeParam({ ...params, KeySearch: key }));
        setparams({ ...params, KeySearch: key, page: 1 });
        setActivePage(1);
        //setparams({ ...params, page: pageNumber });
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
                const response = await assetApi.getAll();
                console.log(response);
                setAssets(response);
            } catch (error) {
                console.log("Failed to fetch asset list: ", error);
            }
        };
        //fetchFilterlist();
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
                        onKeyPressFn={function noRefCheck() { }}
                        onRemove={(selectedstateList, selectedItem) =>
                            onstateChange(selectedstateList, selectedItem)
                        }
                        onSearch={function noRefCheck() { }}
                        onSelect={(selectedstateList, selectedItem) =>
                            onstateChange(selectedstateList, selectedItem)
                        }
                        options={[
                            {
                                cat: "Assigned",
                                key: "Assigned",
                            },
                            {
                                cat: "Available",
                                key: "Available",
                            },
                            {
                                cat: "Notavailable",
                                key: "Not available",
                            },
                            {
                                cat: "WaitingForRecycl",
                                key: "Waiting For Recycle",
                            },
                            {
                                cat: "Recycled",
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
                                width: "175px",
                            },
                            searchBox: {
                                borderRadius: "5px",
                                width: "175px",
                                height: "auto",
                                background:
                                    "url(https://i.ibb.co/1mTS0k7/Capture.png) no-repeat right center",
                            },
                        }}
                    />
                    <Multiselect
                        placeholder="Filter by Category"
                        avoidHighlightFirstOption
                        hidePlaceholder
                        displayValue="cat"
                        onKeyPressFn={function noRefCheck() { }}
                        onRemove={(selectedList, selectedItem) => oncategoryChange(selectedList, selectedItem)}
                        onSearch={function noRefCheck() { }}
                        onSelect={(selectedList, selectedItem) => oncategoryChange(selectedList, selectedItem)}
                        options={[
                            {
                                cat: 'Person Computer',
                                key: 'PC'
                            },
                            {
                                cat: 'Monitor',
                                key: 'MO'
                            },
                              {
                                cat: 'Laptop',
                                key: 'LA'
                            }
                        ]}
                        showCheckbox
                        closeOnSelect={false}
                        style={{
                            chips: {
                                background: 'red'
                            },
                            multiselectContainer: {
                                'width': '175px',
                            },
                            searchBox: {
                                'borderRadius': '5px',
                                'width': '175px',
                                'height': 'auto',
                                'background':
                                    'url(https://i.ibb.co/1mTS0k7/Capture.png) no-repeat right center',
                            }
                        }}
                    />
                    {/*{Filterlist !== undefined && (*/}
                    {/*    <Multiselect*/}
                    {/*        placeholder="Filter by Category"*/}
                    {/*        avoidHighlightFirstOption*/}
                    {/*        hidePlaceholder*/}
                    {/*        displayValue="key"*/}
                    {/*        onKeyPressFn={function noRefCheck() { }}*/}
                    {/*        onRemove={(selectedList, selectedItem) =>*/}
                    {/*            oncategoryChange(selectedList, selectedItem)*/}
                    {/*        }*/}
                    {/*        onSearch={function noRefCheck() { }}*/}
                    {/*        onSelect={(selectedList, selectedItem) =>*/}
                    {/*            oncategoryChange(selectedList, selectedItem)*/}
                    {/*        }*/}
                    {/*        options={Filterlist.categoryList.map((category) => {*/}
                    {/*            return { cat: category.id, key: category.name };*/}
                    {/*        })}*/}
                    {/*        showCheckbox*/}
                    {/*        closeOnSelect={false}*/}
                    {/*        style={{*/}
                    {/*            chips: {*/}
                    {/*                background: "red",*/}
                    {/*            },*/}
                    {/*            multiselectContainer: {*/}
                    {/*                width: "150px",*/}
                    {/*            },*/}
                    {/*            searchBox: {*/}
                    {/*                borderRadius: "5px",*/}
                    {/*                width: "150px",*/}
                    {/*                height: "39px",*/}
                    {/*                background:*/}
                    {/*                    "url(https://i.ibb.co/1mTS0k7/Capture.png) no-repeat right center",*/}
                    {/*            },*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*)}*/}
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
                        listitem={Assets}
                        onRefresh={handleRefresh}
                        params={params}
                        setparams={setparams}
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

