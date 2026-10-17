import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Typography,
} from "antd";
import {useMemo, useState} from "react";
import {useCartContext} from "../../context/CartContext";
import {useNavigate} from "react-router-dom";
import {CloseOutlined} from "@ant-design/icons";
import {IoCartSharp} from "react-icons/io5";

const {Text, Title} = Typography;

const sharedProps = {
  mode: "spinner",
  min: 1,
  // onChange: onChangeQuantity,
  style: {width: 150},
};

const Item = ({item}) => {
  const navigate = useNavigate();
  const {setOrderList} = useCartContext();

  const onRemove = () => {
    setOrderList(prev => {
      return prev.filter(order => order?.id !== item?.id);
    });
  }

  return (
      <div className="flex gap-[10px] py-[20px] items-center">
        <button
            onClick={() => onRemove(item?.id)}
        ><CloseOutlined className="text-[18px] text-[#f4511e]"/></button>
        <button>
          <img
              onClick={() => navigate(`/sim/supplier/${item?.id}`)}
              src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=120&h=120&fit=crop"
              alt="esim"
              className="w-[70px] h-[70px] object-cover"
          />
        </button>
        <div className="w-[300px] flex flex-col gap-[10px]">
          <button className="text-left text-[14px] text-[#288ad6]"
                  onClick={() => navigate(`/sim/supplier/${item?.id}`)}>{item?.title}</button>

          <div className="text-[14px] text-[grey]">30N 500MB/ NGÀY</div>
        </div>

        <div className="flex flex-col gap-[10px]">
          <div className="flex gap-[5px]">
            <div className="w-[100px]">Giá bán</div>
            <div className="text-[#ea5626]">{item?.price.toLocaleString()} ₫</div>
          </div>

          <div className="flex gap-[5px]">
            <div className="w-[100px]">Số lượng</div>
            <InputNumber
                {...sharedProps}
                placeholder="Outlined"
                value={item?.quantity}
                // onChange={onChangeQuantity}
            />
          </div>
        </div>
      </div>
  );
};

const OrderList = () => {
  const navigate = useNavigate();
  const {orderList, setOrderList} = useCartContext();
  const [qty, setQty] = useState(3);

  const [supplier, setSupplier] = useState({
    id: 3,
    name: "Sim 3",
    title:
        "eSim du lịch châu âu 38 nước - Europe C, dùng full mạng xã hội, Nhận QR Ngay | Hico",
    price: 150000,
    img: "https://sim4g.com/uploads/202510/2hz5fejn.jpg",
    advantages: [
      "Tặng ngay 500GB Data tốc độ cao mỗi tháng vào đầu chu kỳ",
      "Sử dụng hết 500GB trong tháng sẽ dừng truy cập",
      "Sim chỉ vào mạng, không hỗ trợ nghe gọi, nhắn tin",
      "Mua sim 1 lần không phát sinh cước",
      "Sim 3 in1: Có thể lắp đặt vào nhiều loại máy, không cần cắt sim",
      "Hỗ trợ làm Esim, đăng ký chính chủ",
      "Sim sử dụng toàn quốc không giới hạn",
    ],
  });

  const [cart, setCart] = useState({
    quantity: 1,
    price: supplier.price * 1,
  });

  const onChangeQuantity = (value) => {
    setCart({quantity: value, price: supplier.price * value});
  };


  const price = 500000;

  const total = useMemo(() => qty * price, [qty]);

  const formatVND = (value) =>
      new Intl.NumberFormat("vi-VN").format(value) + " đ";

  return (
      <div className="justify-center items-center flex flex-col min-h-[765px]">
        <div className="justify-center items-center flex flex-col bg-[white] my-[10px] p-[20px]">
          {orderList?.map((item) => (
              <Item key={item.id} item={item}/>
          ))}

          {
              !orderList?.length &&
              <div className="flex flex-col items-center gap-[10px]">
                <IoCartSharp size={85} color="#f4511e"/>
                <h2 className="text-black text-[20px] font-[800px]">Giỏ hàng của bạn đang trống</h2>
                <div className="text-[#adb5bd]">Hãy khám phá các sản phẩm tuyệt vời của chúng tôi</div>
                <Button shape="round" className="w-[250px] bg-[#26af58] text-white text-[18px] h-[50px]"
                        onClick={() => navigate(-1)}>← Tiếp tục mua sắm</Button>
              </div>
          }

          <Divider/>

          {/* <div className="voucher-section">
          <Text className="voucher-title">
            <TagsOutlined /> Phiếu ưu đãi
          </Text>

          <div className="voucher-form">
            <Input placeholder="Mã ưu đãi" />
            <Button type="primary">Áp dụng</Button>
          </div>
        </div>

        <Divider /> */}

          {
              orderList?.length > 0 &&
              <>
                <div className="flex justify-between w-full">
                  <div className="font-bold">Tổng</div>
                  <div className="text-[#ea5626]">{formatVND(total)}</div>
                </div>
                <Divider/>
              </>

          }


          <div className="flex flex-col items-center gap-[20px]">
            <div>Đăng nhập để quản lý đơn hàng!</div>

            <div size={16} className="flex gap-[10px]">
              <Button className="w-[150px]" type="primary" shape="round">
                Đăng ký
              </Button>
              <Button className="w-[150px]" type="primary" shape="round">
                Đăng nhập
              </Button>
            </div>
          </div>

          {orderList?.length > 0 &&
              <>
                <Divider/>
                <div className="quick-order">
                  <Title level={5}>ĐẶT HÀNG NHANH KHÔNG CẦN ĐĂNG KÝ</Title>

                  <Radio.Group defaultValue="anh" className="gender-group">
                    <Radio value="anh">Anh</Radio>
                    <Radio value="chi">Chị</Radio>
                  </Radio.Group>

                  <Form layout="vertical">
                    <Row gutter={12}>
                      <Col span={12}>
                        <Form.Item>
                          <Input placeholder="Họ và tên"/>
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item>
                          <Input placeholder="Số điện thoại"/>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item>
                      <Input placeholder="Email (nhận mã eSim, thông tin đơn hàng)"/>
                    </Form.Item>

                    <Form.Item>
                      <Input placeholder="Địa chỉ nhận hàng (Không bắt buộc)"/>
                    </Form.Item>

                    <Form.Item>
                      <Input placeholder="Yêu cầu khác (không bắt buộc)"/>
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        className="submit-btn"
                    >
                      ĐẶT HÀNG NHANH
                    </Button>
                  </Form>
                </div>
              </>
          }
        </div>
      </div>
  );
};

export {OrderList};
