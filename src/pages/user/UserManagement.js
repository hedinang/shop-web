import { Button, Input, Popover, Switch, Table } from "antd";
import { useEffect, useState } from "react";
import { FiTrash } from "react-icons/fi";
import { toast } from "react-toastify";
import apiFactory from "../../api";
import { CreateUserModal } from "../../components/modal/adminSetting/CreateUserModal";
import { debounce } from "lodash";

const UserManagement = () => {
  const [userSearch, setUserSearch] = useState({
    limit: 30,
    page: 1,
    search: {
      username: null,
      status: "ACTIVE",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMoreData, setIsLoadMoreData] = useState(true);
  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  const [isRemoveUserModal, setIsRemoveUserModal] = useState(false);
  const [removingUserId, setRemovingUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isOpenModalResetPW, setIsOpenModalResetPW] = useState(null);
  const [userList, setUserList] = useState([]);
  const columns = [
    {
      title: "UserId",
      dataIndex: "userId",
      key: "userId",
      width: "300px",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    // {
    //   title: "Action",
    //   dataIndex: "action",
    //   key: "action",
    //   width: "100px",
    //   render: (text, record) =>
    //     record?.isActive ? (
    //       <Button
    //         className="bg-[#e00d0d] text-[white]"
    //         onClick={() => {
    //           setIsRemoveUserModal(true);
    //           setRemovingUserId(record?.userId);
    //         }}
    //         icon={<FiTrash className="text-[18px]" />}
    //       />
    //     ) : null,
    // },
  ];

  const rowClassName = (record) => {
    return record?.isNew ? "bg-[#ffe678]" : "";
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    const result = await apiFactory.userApi.listPerson(userSearch);

    if (result?.status !== 200) {
      toast.error("can not load bid list");
      return;
    }

    setIsLoading(false);
    setUserList(result?.data?.items);
  };

  const onAdd = () => {
    setIsOpenUserModal(true);
  };

  const onDoubleClick = (record) => {
    setSelectedUser(record);
    setIsOpenUserModal(true);
  };

  const getSelectedColor = (record) => {
    if (record?.userId === selectedUser?.userId) return "bg-red";
  };

  const cancelCreateModal = () => {
    setIsRemoveUserModal(false);
    setIsOpenUserModal(false);
    setSelectedUser(null);
  };

  const debouncedSetUsernameSearch = debounce((e) => {
    // scrollToTopTable();
    setIsLoadMoreData(true);
    setUserSearch({
      ...userSearch,
      search: {
        ...userSearch?.search,
        username: e?.target?.value,
      },
    });
  }, 500);

  useEffect(() => {
    fetchUsers();
  }, [userSearch]);

  return (
    <div>
      <div className="font-semibold text-[20px] pl-[16px] pt-[16px]  flex items-center">
        User
      </div>
      <div className="p-[16px]">
        <div className="user-list ">
          <div className="flex justify-between mb-[10px]">
            <div className="flex justify-center items-center">
              <Popover
                //   content={languageMap?.["as.menu.user.placeHolderSearch"] ?? "Search user code, username, email"}
                trigger="hover"
              >
                <Input
                  className="w-full mr-2"
                  placeholder={
                    // languageMap?.["as.menu.user.placeHolderSearch"] ??
                    "Search username, email"
                  }
                  onChange={(e) => debouncedSetUsernameSearch(e)}
                  allowClear
                />
              </Popover>
              <Popover
                //   content={userSearch?.isActive ? languageMap?.["as.menu.user.btnActive"] ?? "Active" : languageMap?.["as.menu.user.btnInactive"] ?? "Inactive"}
                trigger="hover"
              >
                <Switch
                  value={userSearch?.search?.status === "ACTIVE"}
                  // style={{ zoom: isMobile && "0.7" }}
                  className="ml-2 w-[10px]"
                  onChange={(checked, e) => {
                    // scrollToTopTable();
                    setIsLoadMoreData(true);
                    setUserSearch({
                      ...userSearch,
                      search: {
                        ...userSearch?.search,
                        status: checked ? "ACTIVE" : "INACTIVE",
                      },
                      // limit: 30,
                      // skip: 0,
                    });
                  }}
                />
              </Popover>
            </div>
            <Button
              className="ml-2"
              type="primary"
              onClick={onAdd}
              // style={{ zoom: isMobile && "0.9" }}
            >
              Create User
            </Button>
          </div>
          <div className="">
            <Table
              columns={columns}
              dataSource={userList}
              pagination={false}
              loading={isLoading}
              size={"middle"}
              className="max-h-[1000px]"
              rowClassName={rowClassName}
              onRow={(record, index) => ({
                onDoubleClick: (e) => onDoubleClick(record),
                className: getSelectedColor(record),
                // ref: index === userList?.length - 1 ? lastRecordRef : null,
              })}
              // scroll={
              //   isMobile
              //     ? {
              //         x: 700,
              //         y: 420,
              //       }
              //     : {
              //         x: 1000,
              //         y: 700,
              //       }
              // }
            />
          </div>
        </div>
      </div>

      {isOpenUserModal && (
        <CreateUserModal
          isModalOpen={isOpenUserModal}
          cancelModal={cancelCreateModal}
          title={selectedUser ? "Update user" : "Create User"}
          setUserList={setUserList}
          userList={userList}
          editingUser={selectedUser}
          setIsOpenModalResetPW={setIsOpenModalResetPW}
          isActive={userSearch?.isActive}
        />
      )}
    </div>
  );
};

export { UserManagement };
