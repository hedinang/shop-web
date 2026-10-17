import { Button, Card, Col, Modal, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import { MdOutlineAccessTime } from "react-icons/md";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import apiFactory from "../../api";
import { toast } from "react-toastify";
import winitechLogo from "../../assets/bid-icon.png";
import { sortBy } from "lodash";
import { IoShirt } from "react-icons/io5";
import Cookies from "js-cookie";
import { useInfoUser } from "../../store/UserStore";
import { role } from "../../config/Constant";
import { SideBarConversation } from "../../components/sideBar/SideBarConversation";
import { extractDay, formatTime } from "../../utils/formatTime";

const SummaryBid = ({ bid }) => {
  const { user } = useInfoUser();
  const navigate = useNavigate();

  const [isUpdating, setIsUpdating] = useState(false);
  const [doneItem, setDoneItem] = useState(false);

  const getBidStatusButotn = (bid) => {
    switch (bid?.donePage) {
      case Math.ceil(bid?.totalItem / 50):
        return (
          <Button className="text-[#2d7717] text-[18px]" disabled>
            Chuẩn bị
          </Button>
        );

      default:
        return (
          <Button
            className="text-[#2d7717] text-[18px]"
            onClick={() =>
              navigate(
                "/inside/bid/item-list/" + bid?.bidId + "/" + bid?.bidStatus
              )
            }
          >
            Xem trước
          </Button>
        );
    }
  };

  const syncBid = async () => {
    const result = await apiFactory.bidApi.syncBid(bid);
    if (result?.status === 200) {
      toast.success(
        `You are just syncronizing bid: ${bid?.bidId} - ${bid?.bidStatus}`
      );
      return;
    }

    toast.error(`You sync wrong bid: ${bid?.bidId} - ${bid?.bidStatus}`);
  };

  const stopSyncBid = async () => {
    const result = await apiFactory.bidApi.stopSyncBid({
      threadName: `bid-${bid?.bidId}-${bid?.bidStatus}`,
    });
    if (result?.status === 200) {
      toast.success(
        `You stop syncronizing bid: ${bid?.bidId} - ${bid?.bidStatus}`
      );
      return;
    }

    toast.error(
      `You stop syncronizing wrong bid: ${bid?.bidId} - ${bid?.bidStatus}`
    );
  };

  const deleteBid = async () => {
    const result = await apiFactory.bidApi.deleteBid({
      uniqueId: bid?.uniqueId,
    });
    if (result?.status === 200) {
      toast.success(`Delete bid successfully`);
    }
  };

  useEffect(() => {
    if (!bid?.bidStatus) return null;
    setIsUpdating(
      bid?.donePage !== 0 && Math.ceil(bid?.totalItem / 50) !== bid?.donePage
    );

    setDoneItem(
      bid?.donePage === 0
        ? bid?.totalItem
        : (Math.ceil(bid?.totalItem / 50) - bid?.donePage) * 50
    );
  }, [bid]);

  return (
    <Col
      xs={24}
      sm={12}
      md={8}
      lg={6}
      className="p-[10px]"
      key={`${bid?.bidId}-${bid?.bidStatus}`}
    >
      <Card hoverable>
        <div className="bid">
          {isUpdating ? <div className="bid-update">Cập nhật</div> : <></>}
          <div className="text-[20px] font-semibold">
            {bid?.bidId} - Thời gian đấu giá
          </div>
          {user?.role === "SUPER_ADMIN" && (
            <div className="flex justify-center gap-[10px]">
              <Button
                className="text-[#2d7717] text-[18px]"
                onClick={stopSyncBid}
              >
                stop sync
              </Button>
              <Button className="text-[#2d7717] text-[18px]" onClick={syncBid}>
                sync
              </Button>
              <Button
                className="text-[#2d7717] text-[18px]"
                onClick={deleteBid}
              >
                delete
              </Button>
            </div>
          )}
          <div className="flex justify-center gap-[10px] items-center">
            <MdOutlineAccessTime size={25} />
            <div>{extractDay(bid?.openTime)}</div>
            <div>{formatTime(bid?.openTime)}</div>
          </div>
          <div className="flex justify-center items-center gap-[10px]">
            <IoShirt size={20} color="#fccc14" />{" "}
            {`${doneItem} / ${bid?.totalItem}`}
          </div>
          <div className="flex justify-center">
            <img src={winitechLogo} className="h-[40px]" />
          </div>
          {user?.role !== role.CUSTOMER && (
            <a href={bid?.detailUrl} target="_blank" className="text-[blue]">
              Original link
            </a>
          )}
          {bid?.bidStatus !== "In session" ? (
            <div className="flex gap-[30px] justify-center">
              <div className="flex items-center">Xem trước: </div>
              <div>
                <div>{extractDay(bid?.startPreviewTime)} {bid?.startPreviewTime}</div>
                <div>~</div>
                <div>{extractDay(bid?.endPreviewTime)} {bid?.endPreviewTime}</div>
              </div>
            </div>
          ) : (
            <div className="h-[62px]"></div>
          )}
          <div>{getBidStatusButotn(bid)}</div>
        </div>
      </Card>
    </Col>
  );
};

const AdminBidList = () => {
  const { user } = useInfoUser();
  const navigate = useNavigate();
  const [bidList, setBidList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [threadList, setThreadList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenu, setIsMenu] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const result = await apiFactory.bidApi.list();

    if (result?.status !== 200) {
      toast.error("can not load bid list");
      return;
    }
    setIsLoading(false);

    const preparedBidList = result?.data
      ?.map((e) => {
        const [datePart, timePart] = e?.openTime?.split(" ");
        return {
          ...e,
          compareTime: new Date(`${datePart}T${timePart}`),
        };
      })
      ?.filter((e) => e?.compareTime > new Date());

    setBidList(sortBy(preparedBidList, "compareTime"));
  };

  const syncBidList = async () => {
    setIsLoading(true);
    const result = await apiFactory.bidApi.syncBidList();

    if (result?.status !== 200) {
      toast.error("can not load bid list");
      return;
    }
    setIsLoading(false);
  };

  const getThreadList = async () => {
    setIsLoading(true);
    const result = await apiFactory.bidApi.getThreadList();

    if (result?.status !== 200) {
      toast.error("can not load bid list");
      return;
    }

    setThreadList(result?.data);
    setIsModalOpen(true);
    setIsLoading(false);
  };

  const logout = async () => {
    await apiFactory.userApi.logout();
    Cookies.remove("access_token");
    navigate("/login");
  };

  const cancelModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bid-list">
      <div>
        <div className="text-[30px] p-[20px] text-center">
          Tài sản sắp được đấu giá
        </div>
        {/* <div className="absolute top-[20px] right-[10px]">
          <Button onClick={logout}>logout</Button>
        </div> */}
      </div>
      {user?.role === "SUPER_ADMIN" && (
        <div className="flex justify-center gap-[10px]">
          <Button
            className="text-[#2d7717] text-[18px]"
            onClick={getThreadList}
          >
            Get thread list
          </Button>
          <Button className="text-[#2d7717] text-[18px]" onClick={syncBidList}>
            Get bid list
          </Button>
        </div>
      )}
      <Row>
        {isLoading ? (
          <div className="w-full flex justify-center">
            <Spin />
          </div>
        ) : (
          bidList
            ?.filter((bid) => bid?.bidStatus)
            ?.map((bid) => (
              <SummaryBid bid={bid} key={`${bid?.bidId}-${bid?.bidStatus}`} />
            ))
        )}
      </Row>
      <Modal
        open={isModalOpen}
        footer={false}
        closeIcon={true}
        onCancel={cancelModal}
        centered
        // className="preview-image-wrap"
      >
        <div>Running thread list: </div>
        <div>
          {threadList?.map((th) => (
            <div key={th}>{th}</div>
          ))}
        </div>
      </Modal>
      <SideBarConversation
        // isExitGroup={isExitGroup}
        isOpen={isMenu}
        onClose={() => setIsMenu(false)}
      />
    </div>
  );
};
export { AdminBidList };
