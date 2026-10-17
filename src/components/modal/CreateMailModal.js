import { LoadingOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Spin } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import apiFactory from "../../api";
import { useInfoUser } from "../../store/UserStore";
import { GeneralModal } from "./GeneralModal";

const CreateMailModal = ({
  isModalOpen,
  cancelModal,
  title,
  editingMail,
  setUserList,
  userList,
  isActive,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModalConfirmSave, setIsOpenModalConfirmSave] = useState(null);
  const { languageMap } = useInfoUser();
  const [user, setUser] = useState({
    ...editingMail,
  });

  const [form] = Form.useForm();

  const preventSubmitOnEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const onDelete = async () => {
    const result = await apiFactory.mailApi.delete({
      mailId: editingMail?.mailId,
    });

    if (result?.status !== 200) {
      toast.error(result?.message);
      return;
    }

    if (editingMail?.mailId) {
      let mailIndex = userList?.findIndex(
        (u) => u?.mailId === result?.data?.mailId
      );

      userList?.splice(mailIndex, 1);
      setUserList([...userList]);
    }
    cancelModal();
  };

  const onStore = async (request) => {
    const result = await apiFactory.mailApi.store({
      mailId: editingMail?.mailId,
      ...request,
    });

    if (result?.status !== 200) {
      toast.error(result?.message);
      return;
    }

    if (request?.status === "INACTIVE") {
      let mailIndex = userList?.findIndex(
        (u) => u?.userId === result?.data?.userId
      );
      userList?.splice(mailIndex, 1);
      setUserList([...userList]);
      cancelModal();
      return;
    }

    if (editingMail?.mailId) {
      let mailIndex = userList?.findIndex(
        (u) => u?.mailId === result?.data?.mailId
      );
      userList[mailIndex] = { ...result?.data };
    } else {
      userList = [{ ...result?.data }, ...userList];
    }
    setUserList([...userList]);
    cancelModal();
  };

  const handleConfirmCreateUser = async () => {
    // setIsOpenModalResetPW(false);
    form.submit();
  };

  const onFinish = async (values) => {
    setIsLoading(true);

    const formatValue = {
      ...values,
    };

    try {
      await onStore(formatValue);
    } catch (error) {
      console.error("Error fetching alarm list data:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
          name="address"
          label={languageMap?.["as.menu.user.update.email"] ?? "Adress"}
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
        {/* <Form.Item name="status" label="Status">
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
        </Form.Item> */}
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
              {editingMail
                ? languageMap?.["as.menu.user.update.btnUpdate"] ?? "Update"
                : languageMap?.["as.menu.user.update.btnCreate"] ?? "Create"}
            </Button>
            {editingMail && (
              <Button type="primary" className="bg-[red]" onClick={onDelete}>
                Delete
              </Button>
            )}
          </div>
        )}
      </Form>
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
export { CreateMailModal };
