import {Col, Row, Select, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {IoAdd} from "react-icons/io5";
import {AddSimModal} from "../../components/modal/AddSimModal";
import apiFactory from "../../api";
import {useLayoutContext} from "../../context/LayoutContext";

const SimList = () => {
  const navigate = useNavigate();
  const {me} = useLayoutContext();
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);

  const [supplierList, setSupplierList] = useState([]);

  const fetchSimList = async () => {
    const response = await apiFactory.simApi.list({
      limit: 5,
      page: 1,
      search: {}
    })

    if (response?.status === 200) {
      setSupplierList(response?.data)
    }
  }

  useEffect(() => {
    fetchSimList()
  }, [])

  return (
      <div className="flex flex-col justify-center mt-[20px]">
        {/* criteria */}
        {["SUPER_ADMIN", "ADMIN"]?.includes(me?.role) &&
            <Row>
              <Col span="24" className="flex flex-col items-center gap-[5px] p-[10px]">
                <Tooltip
                    placement="top"
                    title="Thêm"
                    color={"#0091ff"}
                >
                  <button className="rounded-full p-2 bg-[#4db74d]" onClick={() => setIsOpenAddModal(true)}>
                    <IoAdd color="white"/>
                  </button>
                </Tooltip>
              </Col>
            </Row>}

        <Row>
          <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={6} className="flex flex-col items-center gap-[5px] p-[10px]">
            <div>Châu lục</div>
            <Select
                placeholder="Chọn châu lục"
                allowClear
                className="w-[200px]"
                //   value={searchOrder?.search?.category}
                //   onChange={(e) => onChangeFilter("category", e)}
                options={[
                  {value: "asia", label: "Châu Á"},
                  {value: "europe", label: "Châu Âu"},
                  {value: "africa", label: "Châu Phi"},
                  {value: "north-america", label: "Châu Bắc Mỹ"},
                  {value: "south-america", label: "Châu Nam Mỹ"},
                  {value: "oceania", label: "Châu Đại Dương"},
                ]}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={6} className="flex flex-col items-center gap-[5px] p-[10px]">
            <div>Quốc gia</div>
            <Select
                placeholder="Chọn quốc gia"
                allowClear
                className="w-[200px]"
                //   value={searchOrder?.search?.category}
                //   onChange={(e) => onChangeFilter("category", e)}
                options={[
                  {value: "vn", label: "Việt Nam"},
                  {value: "us", label: "Mỹ"},
                  {value: "jp", label: "Nhật Bản"},
                  {value: "kr", label: "Hàn Quốc"},
                  {value: "fr", label: "Pháp"},
                  {value: "de", label: "Đức"},
                ]}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={6} className="flex flex-col items-center gap-[5px] p-[10px]">
            <div>Nhà mạng</div>
            <Select
                placeholder="Chọn nhà mạng"
                allowClear
                className="w-[200px]"
                //   value={searchOrder?.search?.category}
                //   onChange={(e) => onChangeFilter("category", e)}
                options={[
                  {value: "viettel", label: "Viettel"},
                  {value: "mobifone", label: "Mobifone"},
                  {value: "vinaphone", label: "Vinaphone"},
                ]}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={6} className="flex flex-col items-center gap-[5px] p-[10px]">
            <div>Sắp xếp</div>
            <Select
                placeholder="Chọn sắp xếp"
                allowClear
                className="w-[200px]"
                //   value={searchOrder?.search?.category}
                //   onChange={(e) => onChangeFilter("category", e)}
                options={[
                  {value: "increase", label: "Giá thấp đến cao"},
                  {value: "decrease", label: "Giá cao đến thấp"},
                ]}
            />
          </Col>
        </Row>

        <Row className="px-[200px] mt-[20px] min-h-[565px]">
          {supplierList?.map((supplier) => (
              <Col className="flex flex-col items-center" key={supplier.id} md={24} lg={12} xl={8} xxl={6}>
                <button
                    className="flex flex-col justify-center items-center p-[10px] gap-[10px]"
                    onClick={() => {
                      navigate(`/sim/supplier/${supplier?.id}`);
                    }}
                >
                  <img
                      src={supplier?.img ? supplier?.img : 'https://sim4g.com/uploads/202601/j4iehn8c.jpg'}
                      alt={supplier?.name}
                      className="w-[275px] h-[275px] object-cover"
                  />
                  <div className="w-[200px]">{supplier?.title}</div>
                  <b className="text-[#ea5626]">
                    {supplier?.price?.toLocaleString()} VND
                  </b>
                </button>
              </Col>
          ))}
        </Row>

        {isOpenAddModal && <AddSimModal open={isOpenAddModal} onCancel={() => setIsOpenAddModal(false)}/>}
      </div>
  );
};

export {SimList};
