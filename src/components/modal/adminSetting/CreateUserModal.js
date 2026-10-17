import { LoadingOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Modal, Select, Spin } from "antd";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useInfoUser } from "../../../store/UserStore";
import apiFactory from "../../../api";
import { role } from "../../../config/Constant";
import { GeneralModal } from "../GeneralModal";

const CreateUserModal = ({
  isModalOpen,
  cancelModal,
  title,
  editingUser,
  setUserList,
  userList,
  isActive,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModalResetPW, setIsOpenModalResetPW] = useState(null);
  const [isOpenModalConfirmSave, setIsOpenModalConfirmSave] = useState(null);
  const { languageMap } = useInfoUser();
  const [user, setUser] = useState({
    ...editingUser,
    // roleCode: editingUser ? editingUser?.roleCode : "NORMAL",
    // birthday: editingUser?.birthday ? dayjs(editingUser?.birthday) : null,
  });

  const [form] = Form.useForm();

  const preventSubmitOnEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const onStore = async (request) => {
    const result = await apiFactory.userApi.storeUser({
      ...request,
      userId: editingUser?.userId,
    });

    if (result?.status !== 200) {
      toast.error(result?.message);
      return;
    }

    if (request?.status === "INACTIVE") {
      let userIndex = userList?.findIndex(
        (u) => u?.userId === result?.data?.userId
      );
      userList?.splice(userIndex, 1);
      setUserList([...userList]);
      cancelModal();
      return;
    }

    if (editingUser?.userId) {
      let userIndex = userList?.findIndex(
        (u) => u?.userId === result?.data?.userId
      );
      userList[userIndex] = { ...result?.data };
    } else {
      userList = [{ ...result?.data }, ...userList];
    }
    setUserList([...userList]);
    cancelModal();
  };

  const handleResetPassword = async () => {
    try {
      const rs = await apiFactory.userApi.resetPassword(user?.userId);

      if (rs?.status === 200) {
        toast.success("Reset password was successful");
      } else {
        toast.success("Reset password unsuccessfully");
      }
    } catch (error) {
      console.error("Error reset password:", error);
    }

    setIsOpenModalResetPW(false);
  };

  const handleConfirmCreateUser = async () => {
    setIsOpenModalResetPW(false);
    form.submit();
  };

  const onFinish = async (values) => {
    if (!values?.username?.trim()) {
      toast.warn("Please enter userId");
      return;
    }

    if (!values?.name?.trim()) {
      toast.warn("Please enter Name");
      return;
    }

    setIsLoading(true);

    const formatValue = {
      ...values,
      userId: values?.userId?.trim(),
      name: values?.name?.trim(),
    };

    try {
      await onStore(formatValue);
    } catch (error) {
      console.error("Error fetching alarm list data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const optionsRoleCode = useMemo(
    () => [
      {
        value: role.CUSTOMER,
        label: role.CUSTOMER,
      },
      {
        value: role.ADMIN,
        label: role.ADMIN,
      },
      // {
      //   value: role.SUPER_ADMIN,
      //   label: role.SUPER_ADMIN,
      // },
    ],
    [editingUser]
  );

  return (
    <Modal
      width="500px"
      open={isModalOpen}
      footer={false}
      closeIcon={false}
      onCancel={cancelModal}
      //   title={languageMap?.["modal.labelManagement.title"] ?? "Label management"}
      title={title}
      closable={true}
    >
      <Form
        onFinish={onFinish}
        autoComplete="off"
        layout="horizontal"
        form={form}
        onKeyDown={preventSubmitOnEnter}
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 20,
        }}
        initialValues={user}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[
            {
              required: true,
              message: "Required!",
            },
            {
              pattern: /^[A-Za-z0-9-]+$/,
              message:
                languageMap?.["as.menu.user.message.requiredUserId"] ??
                "Only letters, numbers, and hyphens (-) are allowed!",
            },
          ]}
          normalize={(value) => (value ? value.toUpperCase() : "")}
        >
          <Input maxLength={30} type="text" />
        </Form.Item>
        <Form.Item
          name="name"
          label={languageMap?.["as.menu.user.update.name"] ?? "Name"}
          rules={[
            {
              required: true,
              message:
                languageMap?.["as.menu.user.message.required"] ?? "Required!",
            },
          ]}
          normalize={(value) => (value ? value.toUpperCase() : "")}
        >
          <Input maxLength={30} type="text" />
        </Form.Item>
        <Form.Item
          name="email"
          label={languageMap?.["as.menu.user.update.email"] ?? "Email"}
          rules={[
            {
              message:
                languageMap?.["as.menu.user.message.requiredEmail"] ?? "Email!",
              type: "email",
            },
          ]}
        >
          <Input maxLength={50} type="text" />
        </Form.Item>
        <Form.Item
          name="phone"
          label={languageMap?.["as.menu.user.update.phone"] ?? "Phone"}
        >
          <Input maxLength={30} type="text" />
        </Form.Item>
        <Form.Item
          name="role"
          label={languageMap?.["as.menu.user.update.role"] ?? "Role"}
        >
          <Select size={"middle"} options={optionsRoleCode} />
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Select
            size={"middle"}
            options={[
              {
                value: "ACTIVE",
                label: "Active",
              },
              {
                value: "INACTIVE",
                label: "Inactive",
              },
            ]}
          />
        </Form.Item>
        {isLoading ? (
          <div className="flex justify-center mt-[10px]">
            <Spin
              indicator={<LoadingOutlined className="loader-icon" spin />}
            />
          </div>
        ) : (
          <div className="flex gap-[10px] justify-center mt-[10px]">
            <Button type="primary" className="bg-[grey]" onClick={cancelModal}>
              {languageMap?.["as.menu.user.update.btnCancel"] ?? "Cancel"}
            </Button>
            <Button type="primary" className="bg-[#4db74d]" htmlType="submit">
              {editingUser
                ? languageMap?.["as.menu.user.update.btnUpdate"] ?? "Update"
                : languageMap?.["as.menu.user.update.btnCreate"] ?? "Create"}
            </Button>
            <Button
              type="primary"
              className="bg-[#4096FF]"
              onClick={() => setIsOpenModalResetPW(true)}
            >
              {languageMap?.["as.menu.user.update.btnResetPassword"] ??
                "Reset password"}
            </Button>
          </div>
        )}
      </Form>
      {isOpenModalResetPW && (
        <GeneralModal
          title={
            languageMap?.["as.menu.user.resetPassword"] ??
            "You want to confirm reset password"
          }
          onCancel={() => setIsOpenModalResetPW(false)}
          open={isOpenModalResetPW}
          onConfirm={handleResetPassword}
        />
      )}
      {isOpenModalConfirmSave && (
        <GeneralModal
          title={
            languageMap?.["as.menu.user.confirmExists"] ??
            "This user already exists in the system. Do you want to add or edit this user?"
          }
          onCancel={() => setIsOpenModalConfirmSave(false)}
          open={isOpenModalConfirmSave}
          onConfirm={handleConfirmCreateUser}
        />
      )}
    </Modal>
  );
};
export { CreateUserModal };
