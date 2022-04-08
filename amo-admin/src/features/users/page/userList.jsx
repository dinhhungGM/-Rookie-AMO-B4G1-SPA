import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPagedUsersAsync,
  onChangePage,
  disableUser,
  onListChange,
  setFilter,
  setSearch,
  setSort,
  setDesc,
} from "../userSlice";
import { onChangePageName } from "../../home/homeSlice";
import Editbtn from "../../../components/Button/Editbtn";
import SearchField from "react-search-field";
import Xcirclebtn from "../../../components/Button/Xcirclebtn";
import { Button } from "reactstrap";
import RookieModal from "../../../components/rookiemodal/RookieModal";
import YesNoModal from "../../../components/rookiemodal/YesNoModal";
import Pagination from "react-js-pagination";
import { Link, useHistory } from "react-router-dom";
import Multiselect from "multiselect-react-dropdown";
import UserTable from "../components/UserTable";
import { JsonTable } from "react-json-to-html";

export default function User() {
  const customStyles = {
    content: {
      top: "30%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  const Css = {
    jsonTr: {
      height: "25px",
    },
    jsonTd: {
      padding: "5px",
      borderSpacing: "2px",
      borderRadius: "5px",
    },
    rowSpacer: {
      height: "2px",
    },
    rootElement: {
      padding: "5px",
      borderSpacing: "2px",
      backgroundColor: "#FFFFFF",
      fontWeight: "bold",
      fontFamily: "Arial",
      borderRadius: "5px",
    },
    subElement: {
      padding: "5px",
      borderSpacing: "2px",
      backgroundColor: "#DDDDDD",
      fontWeight: "bold",
      fontFamily: "Arial",
      borderRadius: "5px",
    },
    dataCell: {
      borderSpacing: "2px",
      backgroundColor: "#FFFFFF",
      fontFamily: "Arial",
      borderRadius: "5px",
    },
  };
  const parseObjectToUrlQuery = (obj) => {
    const query = Object.keys(obj)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
      )
      .join("&");
    return "?" + query;
  };
  const {
    users: UserList,
    userid: UserID,
    totalPages: UserTotalPages,
    currentPage: UserCurrentPage,
    totalItems: UsertotalItems,
    loading: UserLoading,
    listChange: ListChange,
    isRelatetoAssignment: IsRelaToAssignment,
    filter: Filter,
    searchname: SearchName,
    sort: SortBy,
    desc: Desc,
  } = useSelector((state) => state.user);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [relateModalIsOpen, setRelateIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteIsOpen] = useState(false);
  const [userInfor, setUserInfor] = useState(null);
  const [Id, setID] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();
  console.log(JSON.parse(localStorage.getItem("user")));
  useEffect(() => {
    dispatch(
      getPagedUsersAsync(
        {
          page: UserCurrentPage,
          limit: 5,
          type: Filter,
          name: SearchName,
          sort: SortBy,
          desc: Desc,
          id: UserID,
        })
      
    );
    console.log(UserID);
  }, [
    dispatch,
    UserCurrentPage,
    ListChange,
    Filter,
    SearchName,
    SortBy,
    Desc,
    UserID,
  ]);
  const handlePageChange = (pageNumber) => {
    dispatch(onChangePage(pageNumber));
  };

  const handleDisableUser = async (id) => {
    setID(id);
    setUserInfor(null);
    try {
      //  dispatch(  checkUserIsRelatoAssignment(id))
      if (false) {
        openRelateModal();
      } else {
        openDeleteModal();
      }
    } catch (error) {
      console.log("Failed to get: ", error);
    }
  };
  const onSort = (e) => {
    if (e[0]) {
      if (e[0].desc != Desc) {
        dispatch(setSort(e[0].id));
        dispatch(setDesc(e[0].desc));
      } else {
        dispatch(setSort(e[0].id));
        dispatch(setDesc(!e[0].desc));
      }
      console.log(SortBy);
    } else {
      // dispatch(setSort(''))
      // dispatch(setDesc(false))
    }
  };
  const onSelect = (selectedList, selectedItem) => {
    dispatch(setFilter(selectedList.map((x) => x.key).join(" ")));
  };

  const onRemove = (selectedList, removedItem) => {
    dispatch(setFilter(selectedList.map((x) => x.key).join(" ")));
    console.log(Filter);
  };

  const onSearchSubmit = async (key, value) => {
    await dispatch(setSearch(key));
    console.log(SearchName);
  };
  const openDeleteModal = async () => {
    setDeleteIsOpen(true);
  };
  function closeDeleteModal() {
    closeModal();
    setDeleteIsOpen(false);
  }
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setUserInfor(null);
    setID(null);
    setIsOpen(false);
  }
  function openRelateModal() {
    setRelateIsOpen(true);
  }
  function closeRelateModal() {
    closeModal();
    setRelateIsOpen(false);
  }
  const handleConfirmDisableUser = async () => {
    try {
      await dispatch(disableUser(Id));
      await dispatch(onListChange());
    } catch (error) {
      console.log("Failed to post user: ", error);
    }
    closeDeleteModal();
  };

  const handleRowClick = (dataRow) => {
    const codeStaff =
      dataRow.codeStaff == null ? "Code unavailable" : dataRow.codeStaff;
    setUserInfor({
      "Staff Code": codeStaff,
      "Full Name": dataRow.fullName,
      "User Name": dataRow.userName,
      "Joined Date": dataRow.joinedDate,
      "Birth Day": dataRow.dateOfBirth,
      Location: dataRow.location,
      Gender: dataRow.gender,
      Type: dataRow.type,
    });
    openModal();
  };

  const columns = [
    {
      Header: "Staff Code",
      accessor: "codeStaff",
    },
    {
      Header: "Full Name",
      accessor: "fullName",
    },
    {
      Header: "Username",
      accessor: "userName",
    },
    {
      Header: "Joined Date",
      accessor: "joinedDate",
    },
    {
      Header: "Type",
      accessor: "type",
    },
    {
      Header: " ",
      Cell: ({ row }) => (
        <div className="rookie-group-btn">
          <Editbtn
            disabled={false}
            onClick={() => {
              dispatch(onChangePageName('Manage User > Edit User'));
              history.push(`/manageuser/${row.original.id}`);
            }}
          />
          <Xcirclebtn
            onClick={() => {
              handleDisableUser(row.original.id);
              console.log("abc");
            }}
            disabled={false}
          />
        </div>
      ),
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
        id="user-search-filter"
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
      >
        <Multiselect
          showArrow
          placeholder="Type"
          avoidHighlightFirstOption
          displayValue="cat"
          onKeyPressFn={function noRefCheck() {}}
          onRemove={(selectedList, selectedItem) =>
            onRemove(selectedList, selectedItem)
          }
          onSearch={function noRefCheck() {}}
          onSelect={(selectedList, selectedItem) =>
            onSelect(selectedList, selectedItem)
          }
          options={[
            {
              cat: "Staff",
              key: "Staff",
            },
            {
              cat: "Administrator",
              key: "Admin",
            },
          ]}
          showCheckbox
          closeOnSelect={false}
          style={{
            chips: {
              background: "red",
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
        <div id="user-search-filter__right">
          <SearchField
            placeholder="Search..."
            onSearchClick={(key, value) => onSearchSubmit(key, value)}
            onEnter={(key, value) => onSearchSubmit(key, value)}
            classNames="test-class rounded"
          />
          {"  "}
          <Button color="danger" id="add-user-btn">
            <Link className="btn-user-text" to="/manageuser/create" onClick={() => dispatch((onChangePageName("Manage User > Create New User")))}>
              Create new user
            </Link>
          </Button>
        </div>
      </div>

      {!UserLoading ? (
        <div>
          <UserTable
            columns={columns}
            data={UserList}
            onRowClick={(e) => handleRowClick(e)}
            onSort={(e) => {
              onSort(e);
            }}
          ></UserTable>
          <Pagination
            activePage={UserCurrentPage}
            itemsCountPerPage={5}
            totalItemsCount={UsertotalItems}
            pageRangeDisplayed={UserTotalPages}
            hideFirstLastPages={true}
            prevPageText="Previous"
            nextPageText="Next"
            onChange={(e) => handlePageChange(e)}
          />
        </div>
      ) : (
        <span>Loading...</span>
      )}

      {Id ? (
        <YesNoModal
          title={"Are You Sure?"}
          modalIsOpen={deleteModalIsOpen}
          closeModal={closeDeleteModal}
          customStyles={customStyles}
        >
          <div style={{ paddingTop: "10px", paddingBottom: "20px" }}>
            <p>Do you want to disable this user?</p>
            <Button color="danger" onClick={() => handleConfirmDisableUser()}>
              Disable
            </Button>
            <Button onClick={() => closeDeleteModal()} id="cancelUserBtn">
              Cancel
            </Button>
          </div>
        </YesNoModal>
      ) : (
        <RookieModal
          title={"User Details"}
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          customStyles={customStyles}
          isModalHeader={true}
        >
          {userInfor ? <JsonTable json={userInfor} css={Css} /> : ""}
        </RookieModal>
      )}
      <RookieModal
        title="Can not disable user"
        modalIsOpen={relateModalIsOpen}
        closeModal={closeRelateModal}
        customStyles={customStyles}
      >
        <div style={{ marginBottom: "27px", marginTop: "35px" }}>
          <p
            style={{
              marginBottom: "0px",
              marginTop: "15px",
              textAlign: "center",
            }}
          >
            There are valid assignment belonging to this user.
          </p>
          <p style={{ textAlign: "center" }}>
            Please close all assignments before disabling user.
          </p>
        </div>
      </RookieModal>
    </div>
  );
}
