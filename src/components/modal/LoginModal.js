import {Button, Checkbox, Form, Input, Modal, Spin} from "antd";
import Cookies from "js-cookie";
import "./style.scss";
import {useState} from "react";
import logo from "../../assets/logo.png";
import {LoadingOutlined} from "@ant-design/icons";
import {toast} from "react-toastify";
import apiFactory from "../../api";
import {useLayoutContext} from "../../context/LayoutContext";

const LoginModal = ({onCancel, open}) => {
  const [loading, setLoading] = useState(false);
  const [isRememberMe, setIsRememberMe] = useState(false);

  const {verifiedAccessToken, updateMe} = useLayoutContext()
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const req = {
        username: values.username.trim(),
        password: values.password.trim(),
      };

      const result = await apiFactory.authApi.login(req);

      if (!result) return;

      if (result.status !== 200) {
        toast.error(result.message);
        return;
      }

      toast.success("Login success");
      Cookies.set("access_token", result.data.token);
      onCancel()
      await verifiedAccessToken(updateMe)
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (<Modal
      title={<div className="flex flex-col items-center text-[20px] gap-[20px]">
        <img src={logo}/>
        <div>Đăng nhập</div>
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
            name="username"
            label={<div className="text-left w-[100px]">Tên đăng nhập</div>}
            rules={[{
              required: true,
            },]}
        >
          <Input disabled={loading}/>
        </Form.Item>
        <Form.Item
            className="mb-0"
            name="password"
            label={<div className="text-left w-[100px]">Mật khẩu</div>}
            rules={[{
              required: true, message: "Required!",
            },]}
        >
          <Input.Password disabled={loading}/>
        </Form.Item>
        <Checkbox
            className="mb-5 mt-1 flex justify-start"
            checked={isRememberMe}
            onChange={() => setIsRememberMe(!isRememberMe)}
        >
          Remember me
        </Checkbox>
        <Form.Item>
          <div className="general-modal justify-center items-center gap-[20px]">
            {loading ? (
                    <Spin
                        indicator={
                          <LoadingOutlined style={{fontSize: 24}} spin/>
                        }
                    />
                ) :
                <Button
                    className="button bg-[#ff4d4f] text-[white]" htmlType="submit"
                >
                  Đăng nhập
                </Button>
            }
            <Button className="button bg-[#1677ff] text-[white]" onClick={onCancel}>
              Hủy
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  </Modal>);
};

export {LoginModal};
