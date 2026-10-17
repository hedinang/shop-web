import { Button, Input, Popconfirm, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiFactory from "../../api";
import { CreateUserModal } from "../../components/modal/adminSetting/CreateUserModal";

const UserManagement = () => {
  const [username, setUsername] = useState("");
  const [statusFilter, setStatusFilter] = useState("ACTIVE");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const result = await apiFactory.userApi.listUsers({
          limit: 30,
          page: 1,
          search: {
            username: username.trim() || null,
            status: statusFilter,
          },
        });

        if (result?.status !== 200) {
          throw new Error(result?.message || "Could not load user list");
        }

        if (isMounted) {
          setUserList(result?.data?.items || []);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(error?.message || "Could not load user list");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, [username, statusFilter]);

  const openCreateModal = () => {
    setSelectedUser(null);
    setIsOpenUserModal(true);
  };

  const closeUserModal = () => {
    setIsOpenUserModal(false);
    setSelectedUser(null);
  };

  const markUserDeleted = async (user) => {
    try {
      const result = await apiFactory.userApi.deleteUser(user);

      if (result?.status !== 200) {
        throw new Error(result?.message || "Could not delete user");
      }

      setUserList((currentUsers) =>
        currentUsers.filter((currentUser) => currentUser.userId !== user.userId)
      );
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error(error?.message || "Could not delete user");
    }
  };

  const columns = [
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
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
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, user) => (
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setSelectedUser(user);
              setIsOpenUserModal(true);
            }}
          >
            Edit
          </Button>
          {user.status !== "DELETED" && (
            <Popconfirm
              title="Delete this user?"
              okText="Delete"
              cancelText="Cancel"
              onConfirm={() => markUserDeleted(user)}
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Danh sách user</h1>
        <Button type="primary" onClick={openCreateModal}>
          Thêm user
        </Button>
      </div>

      <div className="mb-3 flex gap-2">
        <Input
          allowClear
          className="max-w-xs"
          placeholder="Tìm theo username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <Select
          value={statusFilter}
          className="w-36"
          onChange={setStatusFilter}
          options={[
            { value: "ACTIVE", label: "Active" },
            { value: "INACTIVE", label: "Inactive" },
            { value: "DELETED", label: "Deleted" },
          ]}
        />
      </div>

      <Table
        rowKey="userId"
        columns={columns}
        dataSource={userList}
        loading={isLoading}
        pagination={{ pageSize: 30 }}
      />

      {isOpenUserModal && (
        <CreateUserModal
          isModalOpen={isOpenUserModal}
          cancelModal={closeUserModal}
          title={selectedUser ? "Cập nhật user" : "Thêm user"}
          setUserList={setUserList}
          editingUser={selectedUser}
          statusFilter={statusFilter}
        />
      )}
    </div>
  );
};

export { UserManagement };
