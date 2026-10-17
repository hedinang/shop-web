import { Button, Table } from "antd";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiFactory from "../../api";
import { CreateMailModal } from "../../components/modal/CreateMailModal";

const MailManagement = () => {
  const [mailSearch, setMailSearch] = useState({
    limit: 30,
    page: 1,
    search: {},
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMoreData, setIsLoadMoreData] = useState(true);
  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  const [isRemoveUserModal, setIsRemoveUserModal] = useState(false);
  const [selectedMail, setSelectedMail] = useState(null);
  const [mailList, setMailList] = useState([]);
  const columns = [
    {
      title: "mail id",
      dataIndex: "mailId",
      key: "mailId",
      width: 500,
    },
    {
      title: "address",
      dataIndex: "address",
      key: "address",
    },
  ];

  const rowClassName = (record) => {
    return record?.isNew ? "bg-[#ffe678]" : "";
  };

  const fetchMails = async () => {
    setIsLoading(true);
    const result = await apiFactory.mailApi.list(mailSearch);

    if (result?.status !== 200) {
      toast.error("can not load bid list");
      return;
    }

    setIsLoading(false);
    setMailList(result?.data);
  };

  const onAdd = () => {
    setIsOpenUserModal(true);
  };

  const onDoubleClick = (record) => {
    setSelectedMail(record);
    setIsOpenUserModal(true);
  };

  const getSelectedColor = (record) => {
    if (record?.userId === selectedMail?.userId) return "bg-red";
  };

  const cancelCreateModal = () => {
    setIsRemoveUserModal(false);
    setIsOpenUserModal(false);
    setSelectedMail(null);
  };

  const debouncedSetUsernameSearch = debounce((e) => {
    // scrollToTopTable();
    setIsLoadMoreData(true);
    setMailSearch({
      ...mailSearch,
      search: {
        ...mailSearch?.search,
        username: e?.target?.value,
      },
    });
  }, 500);

  useEffect(() => {
    fetchMails();
  }, [mailSearch]);

  return (
    <div>
      <div className="font-semibold text-[20px] pl-[16px] pt-[16px]  flex items-center">
        Mail
      </div>
      <div className="p-[16px]">
        <div className="user-list ">
          <div className="flex justify-between mb-[10px]">
            {/* <div className="flex justify-center items-center">
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
                  value={mailSearch?.search?.status === "ACTIVE"}
                  // style={{ zoom: isMobile && "0.7" }}
                  className="ml-2 w-[10px]"
                  onChange={(checked, e) => {
                    // scrollToTopTable();
                    setIsLoadMoreData(true);
                    setMailSearch({
                      ...mailSearch,
                      search: {
                        ...mailSearch?.search,
                        status: checked ? "ACTIVE" : "INACTIVE",
                      },
                      // limit: 30,
                      // skip: 0,
                    });
                  }}
                />
              </Popover>
            </div> */}
            <div />
            <Button
              className="ml-2"
              type="primary"
              onClick={onAdd}
              // style={{ zoom: isMobile && "0.9" }}
            >
              Create mail
            </Button>
          </div>
          <div className="">
            <Table
              columns={columns}
              dataSource={mailList}
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
        <CreateMailModal
          isModalOpen={isOpenUserModal}
          cancelModal={cancelCreateModal}
          title={selectedMail ? "Update mail" : "Create mail"}
          setUserList={setMailList}
          userList={mailList}
          editingMail={selectedMail}
          isActive={mailSearch?.isActive}
        />
      )}
    </div>
  );
};

export { MailManagement };
