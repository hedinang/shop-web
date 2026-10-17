/* eslint-disable jsx-a11y/alt-text */
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Spin } from "antd";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiFactory from "../../api";
import { useInfoUser } from "../../store/UserStore";
import "./style.scss";
import winitechLogo from "../../assets/bid-icon.png";
import { verifiedAccessToken } from "../../utils/Utils";
import CryptoJS from "crypto-js";

const EXPIRY_TIME = process.env.REACT_APP_EXPIRY_TIME || "4";
const CHAT_WEB = process.env.REACT_APP_CHAT_WEB || "http://localhost:3000";
const SECRET_KEY_AUTH =
  process.env.SECRET_KEY_AUTH || "195c0ac1-0c44-49bc-8564-b35f50f54985";

function Login(props) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const { updateUser, updateLanguageMap } = useInfoUser();
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [form] = Form.useForm();

  const [data, setData] = useState({
    username: "",
    password: "",
  });

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
      
      navigate("/inside/bid/bid-list");
      // const encryptAuthData = CryptoJS.AES.encrypt(
      //   JSON.stringify(req),
      //   SECRET_KEY_AUTH
      // ).toString();

      // isRememberMe
      //   ? Cookies.set("auth", encryptAuthData)
      //   : Cookies.remove("auth");

      // if (!searchParams.get("callback")) {
      //   window.location.href = CHAT_WEB + "?token=" + result.data.token;
      // } else {
      //   window.location.href =
      //     searchParams.get("callback") + "?token=" + result.data.token;
      // }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const verifyAndNavigate = async () => {
    const accessToken = Cookies.get("access_token");
    const auth = Cookies.get("auth");

    try {
      const decryptedBytes = CryptoJS.AES.decrypt(auth, SECRET_KEY_AUTH);

      if (!decryptedBytes) {
        Cookies.remove("auth");
        return;
      }

      const decrypted = decryptedBytes.toString(CryptoJS.enc.Utf8);

      if (!decrypted || !decrypted?.trim()?.length === 0) {
        Cookies.remove("auth");
      }

      const decryptedObject = JSON.parse(decrypted);

      if (decryptedObject?.email && decryptedObject?.password) {
        form.setFieldsValue({
          username: decryptedObject.email || "",
          password: decryptedObject.password || "",
        });

        setIsRememberMe(true);
      } else {
        Cookies.remove("auth");
      }
    } catch (error) {}
    if (!(await verifiedAccessToken())) {
      if (!searchParams.get("callback")) {
        navigate("/login");
      } else {
        navigate("/login?callback=" + searchParams.get("callback"));
      }
    } else {
      if (!searchParams.get("callback")) {
        window.location.href = CHAT_WEB;
      } else {
        window.location.href =
          searchParams.get("callback") + "?token=" + accessToken;
      }
    }
  };

  useEffect(() => {
    verifyAndNavigate();
  }, []);

  return (
    <div className="login">
      <div className="img">
        <img src={winitechLogo} alt=""></img>
      </div>
      <div className="form">
        <Form
          form={form}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <div>
            <Form.Item
              name="username"
              label="Username"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input disabled={loading} />
            </Form.Item>
            <Form.Item
              className="mb-0"
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Required!",
                },
              ]}
            >
              <Input.Password disabled={loading} />
            </Form.Item>
            {/* <Checkbox
              className="mb-5 mt-1 flex justify-start"
              checked={isRememberMe}
              onChange={() => setIsRememberMe(!isRememberMe)}
            >
              Remember me
            </Checkbox> */}
            <Form.Item>
              <div className="login-button">
                {/* <Button className="bg-[#776d6d] text-[#f2f2f2]">
                  Forget password ?
                </Button> */}
                <Button
                  className="button  w-[100px] bg-[#0082d1] text-[#f2f2f2]"
                  htmlType="submit"
                >
                  {loading ? (
                    <Spin
                      indicator={
                        <LoadingOutlined style={{ fontSize: 24 }} spin />
                      }
                    />
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
            </Form.Item>
            {/* <div>
              Not a member ?{" "}
              <u
                className="text-[#0082d1] cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Signup
              </u>
            </div> */}
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
