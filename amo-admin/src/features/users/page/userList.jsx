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
import DetailsComponent from "../../../components/DetailsComponent";

import { Button } from "reactstrap";
import RookieModal from "../../../components/rookiemodal/RookieModal";
import YesNoModal from "../../../components/rookiemodal/YesNoModal";
import { Link, useHistory } from "react-router-dom";
import Multiselect from "multiselect-react-dropdown";
import UserTable from "../components/UserTable";
import axiosClient from "../../../api/axiosClient";
import ReactPaginate from "react-paginate";
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

  const {
    users: UserList,
    userid: UserID,
    totalPages: UserTotalPages,
    currentPage: UserCurrentPage,
    totalItems: UsertotalItems,
    loading: UserLoading,
    listChange: ListChange,
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
  useEffect(() => {
    const collection = document.getElementsByClassName("option");
    for (let item of collection) {
      const newNode = document.createElement("label");
      newNode.innerHTML = item.textContent;
      item.replaceChild(newNode, item.childNodes[1]);
    }
  }, []);
  useEffect(() => {
    dispatch(
      getPagedUsersAsync({
        page: UserCurrentPage,
        limit: 5,
        type: Filter,
        name: SearchName,
        sort: SortBy,
        desc: Desc,
        id: UserID,
      })
    );
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
  const handlePageChange = (e) => {
    dispatch(onChangePage(e.selected + 1));
  };

  const handleDisableUser = async (id) => {
    setID(id);
    setUserInfor(null);
    const response = await axiosClient.get(`api/assignment/users/${id}`);
    try {
      if (response.length > 0) {
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
      if (e[0].desc !== Desc) {
        dispatch(setSort(e[0].id));
        dispatch(setDesc(e[0].desc));
      } else {
        dispatch(setSort(e[0].id));
        dispatch(setDesc(!e[0].desc));
      }
    }
  };
  const onSelect = (selectedList, selectedItem) => {
    dispatch(setFilter(selectedList.map((x) => x.key).join(" ")));
  };

  const onRemove = (selectedList, removedItem) => {
    dispatch(setFilter(selectedList.map((x) => x.key).join(" ")));
  };

  const onSearchSubmit = async (key, value) => {
    await dispatch(setSearch(key));
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

  const ConvertDate = (date) => {
    if (date) {
      const array = date.split("/");
      return array[1] + "/" + array[0] + "/" + array[2];
    }
  };

  const handleRowClick = (dataRow) => {
    const codeStaff =
      dataRow.codeStaff == null ? "Code unavailable" : dataRow.codeStaff;
    setUserInfor({
      "Staff Code": codeStaff,
      "Full Name": dataRow.fullName,
      "User Name": dataRow.userName,
      "Joined Date": ConvertDate(dataRow.joinedDate),
      "Birth Day": ConvertDate(dataRow.dateOfBirth),
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
              dispatch(onChangePageName("Manage User > Edit User"));
              history.push(`/manageuser/${row.original.id}`);
            }}
          />
          <Xcirclebtn
            onClick={() => {
              handleDisableUser(row.original.id);
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
            <Link
              className="btn-user-text"
              to="/manageuser/create"
              onClick={() =>
                dispatch(onChangePageName("Manage User > Create New User"))
              }
            >
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
          {/* <Pagination
            activePage={UserCurrentPage}
            itemsCountPerPage={5}
            totalItemsCount={UsertotalItems}
            pageRangeDisplayed={UserTotalPages}
            hideFirstLastPages={true}
            prevPageText="Previous"
            nextPageText="Next"
            onChange={(e) => handlePageChange(e)}
          /> */}
          <ReactPaginate
            nextLabel="Next"
            onPageChange={(e) => handlePageChange(e)}
            forcePage={UserCurrentPage - 1}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            pageCount={UserTotalPages}
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
          {userInfor ? <DetailsComponent list={userInfor} /> : ""}
        </RookieModal>
      )}
      <RookieModal
        title="Can not disable user"
        modalIsOpen={relateModalIsOpen}
        closeModal={closeRelateModal}
        customStyles={customStyles}
        isModalHeader={true}
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
