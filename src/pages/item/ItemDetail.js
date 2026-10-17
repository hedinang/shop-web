import { Col, Row } from "antd";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import ZoomImage from "../../components/img/ZoomImage";
import { useItemContext } from "../../context/ItemContext";
import { toast } from "react-toastify";
import copy from "copy-to-clipboard";
import { FaCopy } from "react-icons/fa";

const ItemDetail = () => {
  const navigate = useNavigate();
  const { item, activeUrl, bid, setFullActiveUrl } = useItemContext();

  const generateImage = (img) => {
    const fillImg = img.replace(
      "https://resize.ecoauc.com",
      "https://assets.ecoauc.com"
    );

    return (
      <Col
        span={6}
        className="col-slide-item"
        onClick={() => setFullActiveUrl(img)}
        key={img}
      >
        <img src={fillImg} className="slide-item" />
      </Col>
    );
  };

  const onBackPage = () => {
    if (bid?.bidId) {
      navigate(`/item-list/${bid?.bidId}/${bid?.bidStatus}`);
    } else {
      navigate(`/bid-list`);
    }
  };

  const handleCopy = (itemId) => {
    try {
      const isSuccess = copy(itemId);
      if (!isSuccess) {
        toast.error("Chép mã sản phẩm lỗi !");
      } else {
        toast.success("Chép mã sản phẩm thành công");
      }
    } catch (error) {
      toast.error("Chép mã sản phẩm lỗi !");
    }
  };

  return (
    <div className="item-list">
      <div className="item-header">
        <div className="flex justify-center text-[20px] p-[5px] gap-[10px] mt-[60px]">
          <button onClick={onBackPage}>
            <IoArrowBackOutline size={25} />
          </button>
          <div className="flex gap-[10px] items-center">
            <div className="font-semibold">{item?.itemId}</div>
            <button
              onClick={() => handleCopy(item?.itemId)}
              className="height-[18px]"
            >
              <FaCopy size={20} color="#2a56b9" />
            </button>
          </div>
        </div>
        <div className="text-center p-[5px] font-semibold">{item?.title}</div>
        <div className="text-center p-[5px] font-semibold">
          {item?.description}
        </div>
      </div>

      <div className="content">
        <div className="content-left">
          <ZoomImage url={activeUrl} cssSize={"big"} />
          <Row>{item?.detailUrls?.map((img) => generateImage(img))}</Row>
        </div>
        <div className="content-right">
          <div>
            <span className="item-header-right">
              <div className="flex justify-center text-[20px] p-[5px] gap-[10px]">
                <button onClick={onBackPage}>
                  <IoArrowBackOutline size={25} />
                </button>
                <div className="flex gap-[10px] items-center">
                  <div className="font-semibold">{item?.itemId}</div>
                  <button
                    onClick={() => handleCopy(item?.itemId)}
                    className="height-[18px]"
                  >
                    <FaCopy size={20} color="#2a56b9" />
                  </button>
                </div>
              </div>
              <div className="text-center p-[5px] font-semibold">
                {item?.title}
              </div>
              <div className="text-center p-[5px] font-semibold">
                {item?.description}
              </div>
            </span>
            <div className="flex p-[5px]">
              <div className="w-[200px] font-semibold">Bid id</div>
              <div>{bid?.bidId}</div>
            </div>
            <div className="flex p-[5px]">
              <div className="w-[200px] font-semibold">Rank</div>
              <div>{item?.rank}</div>
            </div>
            <div className="flex p-[5px]">
              <div className="w-[200px] font-semibold">Starting price</div>
              <div>{item?.startPrice}</div>
            </div>
            <div className="flex p-[5px]">
              <div className="w-[200px] font-semibold">Branch</div>
              <div>{item?.branch}</div>
            </div>
            <div className="flex p-[5px]">
              <div className="w-[200px] font-semibold">Category</div>
              <div>{item?.category}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ItemDetail };
