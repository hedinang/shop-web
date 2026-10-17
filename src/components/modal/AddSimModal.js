import {Button, Form, Input, Modal, Radio, Select, Spin, Tooltip, Upload} from "antd";
import "./style.scss";
import {useState} from "react";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {toast} from "react-toastify";
import apiFactory from "../../api";
import {useLayoutContext} from "../../context/LayoutContext";
import {IoAdd, IoCloseSharp} from "react-icons/io5";
import {v4 as uuidv4} from "uuid";
import {countryOptions} from "../../config/Constant";

const AddSimModal = ({onCancel, open}) => {
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    imgId: null, name: "", title: "", advantages: [], type: "", nation: "", brand: ""
  });

  const {verifiedAccessToken, updateMe} = useLayoutContext()
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const simRequest = {
        name: values?.name,
        title: values?.title,
        advantages: payload?.advantages?.map(ad => ad?.value),
        type: values?.type,
        brand: values?.brand,
        nation: values?.nation,
        // private List<DaySimRequest> daySimRequests;
      }

      const result = await apiFactory.simApi.create(simRequest);

      if (!result) return;

      if (result.status !== 200) {
        toast.error(result.message);
        return;
      }

      onCancel()
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const chooseFile = () => {
    // {
    //   return (
    //       <Upload
    //           listType="picture-card"
    //           fileList={[uploadFile]}
    //           onChange={handleChange}
    //           itemRender={(originNode, f) => {
    //             return (
    //                 <div className="custom-thumbnail">
    //                   <div className="file-thumbnail">
    //                     {getFileIcon(f.name)}
    //                     <span>
    //                 {f?.name?.length > 10
    //                     ? f?.name?.substring(0, 10) + "..."
    //                     : f?.name}
    //               </span>
    //                     <button className="delete-button" onClick={handleDelete}>
    //                       <MdDelete color="red" size={20} />
    //                     </button>
    //                   </div>
    //                 </div>
    //             );
    //           }}
    //       />
    //   );
    // }

    return (<Upload listType="picture-card" fileList={[]}
        // onChange={handleChange}
    >
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center">
          <PlusOutlined/>
          <span className="mt-1">Upload</span>
        </div>
      </div>
    </Upload>);
  }

  const onAddAdvantages = () => {
    setPayload(prev => ({
      ...prev, advantages: [...prev?.advantages, {
        uid: uuidv4()
      }]
    }));
  }

  const onMinusAdvantages = (advantage) => {
    setPayload(prev => {
      const closeIndex = prev?.["advantages"]?.findIndex(item => item?.uid === advantage?.uid)
      delete prev?.advantages[closeIndex];
      return {...prev}
    });
  }

  const onChangeAdvantage = (advantage, value) => {
    setPayload(prev => {
      const advantageIndex = payload?.advantages?.findIndex(ad => ad?.uid === advantage?.uid)
      if (advantageIndex === -1) return prev
      payload.advantages[advantageIndex].value = value?.target?.value
      return prev
    })
  }

  return (<Modal
      title={<div className="flex flex-col items-center text-[20px] gap-[20px]">
        Tạo sim
      </div>}
      open={open}
      // onCancel={onCancel}
      footer={null}
      closeIcon={null}
  >
    <div className="flex flex-col gap-[15px] mt-[30px]">
      <Form
          form={form}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
      >
        <Form.Item
            name="img"
            label={<div className="text-left w-[100px]">Ảnh</div>}
        >
          {chooseFile()}
        </Form.Item>
        <Form.Item
            name="name"
            label={<div className="text-left w-[100px]">Tên sim</div>}
            rules={[{
              required: true,
            },]}
        >
          <Input disabled={loading}/>
        </Form.Item>
        <Form.Item
            name="title"
            label={<div className="text-left w-[100px]">Mô tả</div>}
        >
          <Input disabled={loading}/>
        </Form.Item>
        <Form.Item
            name="advantages"
            label={<div className="text-left w-[100px]">Ưu điểm</div>}
        >
          <div className="flex flex-col items-center gap-[10px]">
            {payload?.advantages?.map(advantage => {
              return <div className="flex gap-[20px] w-[100%]">
                <Input onChange={(value) => onChangeAdvantage(advantage, value)}/>
                <button onClick={() => onMinusAdvantages(advantage)}><IoCloseSharp size={25}/></button>
              </div>
            })}
            <Tooltip
                placement="top"
                title="Thêm"
                color={"#0091ff"}
            >
              <button className="rounded-full p-2 bg-[#4db74d]"
                      onClick={() => onAddAdvantages()}
              >
                <IoAdd color="white"/>
              </button>
            </Tooltip>
          </div>
        </Form.Item>
        <Form.Item
            name="type"
            label={<div className="text-left w-[100px]">Loại sim</div>}
            rules={[{
              required: true, message: "Required!",
            },]}
        >
          <Radio.Group
              name="radiogroup"
              options={[{value: 'esim', label: 'Esim'}, {value: 'normal', label: 'Sim thường'},]}
          />
        </Form.Item>
        <Form.Item
            name="nation"
            label={<div className="text-left w-[100px]">Quốc gia</div>}
        >
          <Select
              placeholder="Chọn quốc gia"
              allowClear
              className="w-[200px]"
              //   value={searchOrder?.search?.category}
              //   onChange={(e) => onChangeFilter("category", e)}
              showSearch={{
                optionFilterProp: 'label'
              }}
              options={countryOptions}
          />
        </Form.Item>
        <Form.Item
            name="brand"
            label={<div className="text-left w-[100px]">Nhà mạng</div>}
        >
          <Select
              placeholder="Chọn nhà mạng"
              allowClear
              className="w-[200px]"
              //   value={searchOrder?.search?.category}
              //   onChange={(e) => onChangeFilter("category", e)}
              options={[
                {label: 'Viettel', value: 'viettel'},
                {label: 'Mobifone', value: 'mobifone'},
                {label: 'Vinaphone', value: 'vinaphone'}
              ]}
          />
        </Form.Item>
        <Form.Item>
          <div className="general-modal justify-center items-center gap-[20px]">
            {loading ? (<Spin
                indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}
            />) : <Button
                className="button bg-[#ff4d4f] text-[white]" htmlType="submit"
            >
              Tạo
            </Button>}
            <Button className="button bg-[#1677ff] text-[white]" onClick={onCancel}>
              Hủy
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  </Modal>);
};

export {AddSimModal};
