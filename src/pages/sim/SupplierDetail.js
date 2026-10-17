import {Button, Divider, InputNumber, Select, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {IoArrowBackSharp, IoCheckmarkCircle} from "react-icons/io5";
import {useCartContext} from "../../context/CartContext";
import {MdDelete, MdModeEdit, MdPhoneEnabled} from "react-icons/md";
import {useNavigate, useParams} from "react-router-dom";
import {typeConfirms} from "../../config/Constant";
import {GrUserAdmin} from "react-icons/gr";
import apiFactory from "../../api";

const SupplierDetail = () => {
  const navigate = useNavigate();
  const {simId} = useParams();

  const {orderList, setOrderList} = useCartContext();

  const [supplier, setSupplier] = useState({
    id: 3,
    name: "Sim 3",
    title: "eSim du lịch châu âu 38 nước - Europe C, dùng full mạng xã hội, Nhận QR Ngay | Hico",
    img: "https://sim4g.com/uploads/202510/2hz5fejn.jpg",
    advantages: ["Tặng ngay 500GB Data tốc độ cao mỗi tháng vào đầu chu kỳ", "Sử dụng hết 500GB trong tháng sẽ dừng truy cập", "Sim chỉ vào mạng, không hỗ trợ nghe gọi, nhắn tin", "Mua sim 1 lần không phát sinh cước", "Sim 3 in1: Có thể lắp đặt vào nhiều loại máy, không cần cắt sim", "Hỗ trợ làm Esim, đăng ký chính chủ", "Sim sử dụng toàn quốc không giới hạn",],
    priceList: [{
      time: 1, pack: "500MB", unit: 150000,
    }, {
      time: 1, pack: "1GB", unit: 200000,
    }, {
      time: 7, pack: "500MB", unit: 150000,
    }, {
      time: 30, pack: "500MB", unit: 150000,
    },],
  });

  const [isOpenEditModal, setIsOpenEditModal] = useState(false)

  const [cart, setCart] = useState({
    time: null, pack: null, unit: 0, quantity: 1, price: 0
  });

  const onChangeTime = (value) => {
    setCart(prev => {
      if (prev?.pack) {
        const p = supplier.priceList.find((item) => {
          return item.time === value && item.pack === prev.pack;
        });

        return {
          ...prev, time: value, unit: p?.unit, price: p?.unit * prev?.quantity
        }
      }

      return {...prev, time: value}
    })
  };

  const onChangePackage = (value) => {
    setCart(prev => {
      if (prev?.time) {
        const p = supplier.priceList.find((item) => {
          return item.pack === value && item.time === prev.time;
        });

        return {
          ...prev, pack: value, unit: p?.unit, price: p?.unit * prev?.quantity
        }
      }

      return {...prev, pack: value}
    })
  };

  const onChangeQuantity = (value) => {
    setCart((prev) => {
      return {...prev, quantity: value, price: prev?.unit * value}
    });
  };

  const sharedProps = {
    mode: "spinner", min: 1, onChange: onChangeQuantity, style: {width: 150},
  };

  const addToCart = () => {
    setOrderList((prev) => {
      const index = prev.findIndex((item) => item.id === supplier.id);
      if (index !== -1) {
        prev[index] = {
          id: supplier?.id,
          name: supplier?.name,
          title: supplier?.title,
          time: cart?.time,
          pack: cart?.pack,
          price: cart?.price,
          quantity: cart?.quantity,
          unit: cart?.unit
        }
        return [...prev];
      }

      return [...prev, {
        id: supplier?.id,
        name: supplier?.name,
        title: supplier?.title,
        time: cart?.time,
        pack: cart?.pack,
        price: cart?.price,
        quantity: cart?.quantity,
        unit: cart?.unit
      },];
    });
  };

  const fetchSupplierDetail = async () => {
    const sim = await apiFactory.simApi.getSim(simId)
  }

  useEffect(() => {
    if (!orderList?.length) return

    const s = orderList?.find(order => order?.id === supplier?.id);
    setCart({time: s?.time, pack: s?.pack, unit: s?.unit, quantity: s?.quantity, price: s?.price});
  }, [])

  useEffect(() => {
    fetchSupplierDetail()
  }, [simId])

  return <div className="flex flex-col items-center h-[765px]">
    <div className="flex gap-[10px] items-center text-xl font-semibold text-center py-[20px]">
      <button onClick={() => navigate(-1)}>
        <IoArrowBackSharp size={24}/>
      </button>
      <div>{supplier?.title}</div>
    </div>
    <div className="flex gap-[50px]">
      <img
          src={supplier.img}
          alt={supplier.name}
          className="w-[470px] h-[470px] object-cover"
      />

      <div>
        <div className="text-[#ea5626] text-[23px] mb-[10px] text-center font-semibold">
          {/* {supplier?.price.toLocaleString()} VND */}
        </div>
        {supplier?.advantages?.map((item, index) => {
          return (<div className="flex items-center gap-2" key={index}>
            <IoCheckmarkCircle color="#3fb846"/>
            <div>{item}</div>
          </div>);
        })}

        <div className="flex items-center gap-[5px] mt-[30px]">
          <div>Thời gian</div>
          <Select
              placeholder="Chọn thời gian"
              allowClear
              className="w-[200px]"
              value={cart?.time}
              onChange={onChangeTime}
              options={[{value: 1, label: "1 ngày"}, {value: 7, label: "7 ngày"}, {value: 30, label: "30 ngày"},]}
          />
        </div>

        <div className="flex items-center gap-[5px] mt-[30px]">
          <div>Gói cước</div>
          <Select
              placeholder="Chọn gói cước"
              allowClear
              className="w-[200px]"
              value={cart?.pack}
              onChange={onChangePackage}
              options={[{value: "500MB", label: "500MB/ Ngày"}, {value: "1GB", label: "1GB/ Ngày"}, {
                value: "2GB",
                label: "2GB/ Ngày"
              },]}
          />
        </div>

        <div className="flex items-center gap-[5px] mt-[30px]">
          <div>Số lượng còn trong kho:</div>
          <div className="text-[#fc7119]">100</div>
        </div>

        <div className="flex gap-[100px] mt-[30px]">
          <div className="flex flex-col w-[150px] gap-[5px]">
            <div>Giá bán</div>
            <div className="text-[#ea5626]">
              {cart?.price?.toLocaleString()} ₫
            </div>
          </div>

          <div className="flex flex-col w-[150px] gap-[5px]">
            <div>Số lượng muốn mua</div>
            <InputNumber
                {...sharedProps}
                placeholder="Outlined"
                value={cart?.quantity}
                onChange={onChangeQuantity}
            />
          </div>
        </div>

        <div className="flex gap-[100px] mt-[30px]">
          <Button className="bg-[#fc7119] text-white w-[150px]"
                  onClick={addToCart} disabled={!cart?.pack || !cart?.time}>
            Thêm giỏ hàng
          </Button>
          <Button
              className="bg-[#0098fc] text-white w-[150px]"
              onClick={addToCart} disabled={!cart?.pack || !cart?.time}>
            Mua ngay
          </Button>
        </div>
      </div>

      <div className="flex gap-[50px]">
        <div className="w-[270px] rounded border border-gray-300 bg-white px-3 py-4 text-sm">
          <h2 className="text-center text-xl font-bold text-orange-600">
            TƯ VẤN MUA HÀNG
          </h2>
          <Divider/>
          <div className="flex items-center gap-3">
            <div className="relative text-green-500">
              <MdPhoneEnabled/>
            </div>
            <p>
              <span className="font-bold text-blue-500">0392200524</span>
              <span> (8:30 - 21:00)</span>
            </p>
          </div>
          <Divider/>
          <div className="flex items-center gap-3">
            <div className="relative text-green-500">
              <MdPhoneEnabled/>
            </div>
            <p>
              <span className="font-bold text-blue-500">0392200524</span>
              <span> (19:00 - 23:00)</span>
            </p>
          </div>
          <Divider/>
          <p className="text-blue-500">
            Số 43, Ngõ 159 Pháo Đài Láng, phường Láng, Tp Hà Nội
          </p>
          <Divider/>
          <p className="leading-6">
            Hỗ trợ giao hàng hỏa tốc nhận trong ngày
          </p>
        </div>
        <div className="flex flex-col gap-[50px] mt-[50px]">
          <Tooltip
              placement="top"
              title="Chỉnh sửa"
              color={"#0091ff"}
          >
            <button className="rounded-full p-2 bg-[#fc7119]" onClick={() => setIsOpenEditModal(true)}><MdModeEdit
                color="white"/></button>
          </Tooltip>
          <Tooltip
              placement="top"
              title="Xóa"
              color={"#0091ff"}
          >
            <button className="rounded-full p-2 bg-[red]"><MdDelete color="white"/></button>
          </Tooltip>
        </div>
      </div>
    </div>


  </div>
};

export {SupplierDetail};
