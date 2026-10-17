import {Dropdown, Input} from "antd";
import {IoCartSharp, IoSearchOutline} from "react-icons/io5";
import {MdAccountCircle, MdPhone} from "react-icons/md";
import {useNavigate} from "react-router-dom";
import "./style.scss";
import {useCartContext} from "../../context/CartContext";
import Search from "antd/es/input/Search";
import {useState} from "react";
import {LoginModal} from "../modal/LoginModal";
import {useLayoutContext} from "../../context/LayoutContext";
import {ProfileModal} from "../modal/ProfileModal";
import {getViewUrl} from "../../api/originalStorageApi";
import {role} from "../../config/Constant";

const MeDropdown = ({}) => {
  const {me, logout} = useLayoutContext()
  const [isModalProfileOpen, setIsModalProfileOpen] = useState(false);

  const openProfileModal = async () => {
    setIsModalProfileOpen(true);
  }

  const closeProfilerModal = () => {
    setIsModalProfileOpen(false);
  }

  const options = [
    {
      key: "profile",
      label: <button
          onClick={openProfileModal}
      >
        Thông tin tài khoản
      </button>
    },
    {
      key: "setting",
      label: "Cài đặt",
    },
    {
      key: "logout",
      label: <button
          onClick={logout}
      >
        Đăng xuất
      </button>
    },
  ];

  return <div>
    <Dropdown
        menu={{
          items: options,
          // onClick: handleMenuClick,
        }}
        placement="bottomLeft"
        trigger={["hover"]}
    >
      <button
          // icon={<DashOutlined />}
          type="text"
          size="small"
          onClick={(e) => e?.stopPropagation?.()}
      >
        {me?.name}
      </button>
    </Dropdown>

    {isModalProfileOpen && (
        <ProfileModal
            closeModal={closeProfilerModal}
            isModalOpen={isModalProfileOpen}
        />
    )}
  </div>
}

export const Header = () => {
  const navigate = useNavigate();

  const {orderList} = useCartContext();
  const {me} = useLayoutContext()
  const [isOpenLogin, setIsOpenLogin] = useState(false);

  const generateLabel = (text, key) => (
      <button
          onClick={(e) => {
            e.stopPropagation();
            handleMenuClick(key);
          }}
      >
        {text}
      </button>
  );

  const conversationOption = [
    {
      key: "vn",
      label: generateLabel("sim việt nam", "vn"),
      children: [
        {
          key: "viettel",
          label: generateLabel("sim việt nam", "vn"),
        },
        {
          key: "vina",
          label: generateLabel("sim việt nam", "vn"),
        },
        {
          key: "mobile",
          label: generateLabel("sim việt nam", "vn"),
        },
      ],
    },
    {
      key: "hk",
      label: generateLabel("sim hong kong", "hk"),
    },
    {
      key: "tw",
      label: generateLabel("sim đài loan", "tw"),
    },
  ];

  const handleMenuClick = (e) => {
    navigate(`/sim/search/${e}`);
  };

  const cancelLogin = () => {
    setIsOpenLogin(false);
  }


  return (
      <>
        <div className="topbar-1">
          <button className="logo" onClick={() => navigate("/nation-list")}>
            SIMBADINH.COM
          </button>

          <Input
              placeholder={
                "Bạn tìm gì..."
              }
              className="max-w-[500px] min-w-[200px]"
              prefix={<IoSearchOutline size={15}/>}
              allowClear
          />

          <button
              className="flex items-center gap-[1px]"
              onClick={() => navigate("/cart")}
          >
            <IoCartSharp size={18}/>
            <div>Giỏ hàng</div>
            <div>({orderList.length})</div>
          </button>

          <div className="flex items-center gap-[1px]">
            <MdPhone size={18}/>
            <div>0975896865</div>
          </div>
          {me ? <MeDropdown/> :
              <button className="flex items-center gap-[1px]" onClick={() => setIsOpenLogin(true)}>
                <MdAccountCircle size={18}/>
                <div>Đăng nhập</div>
              </button>}
        </div>

        <div className="topbar-2">
          <button onClick={() => navigate("/nation-list")}>Trang chủ</button>
          <div>Tin tức</div>
          {/*<Dropdown*/}
          {/*    menu={{*/}
          {/*      items: conversationOption,*/}
          {/*      onClick: handleMenuClick,*/}
          {/*    }}*/}
          {/*    placement="bottomLeft"*/}
          {/*    trigger={["hover"]}*/}
          {/*>*/}
          {/*  <button*/}
          {/*      // icon={<DashOutlined />}*/}
          {/*      type="text"*/}
          {/*      size="small"*/}
          {/*      onClick={(e) => e?.stopPropagation?.()}*/}
          {/*  >*/}
          {/*    Danh mục sim*/}
          {/*  </button>*/}
          {/*</Dropdown>*/}
          <div>Khuyến mãi</div>
          <div>Chính sách</div>
          {([role.ADMIN, role.SUPER_ADMIN].includes(me?.role)) && (
              <button onClick={() => navigate("/users")}>Danh sách user</button>
          )}
        </div>

        {isOpenLogin && <LoginModal open={isOpenLogin} onCancel={cancelLogin}/>}
      </>
  );
};
