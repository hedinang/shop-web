import AuthApi from "./authApi";
import MailApi from "./mailApi";
import OrderApi from "./orderApi";
import UserApi from "./userApi";
import SimApi from "./simApi";
import ResourceApi from "./resourceApi";

const apiFactory = {
  authApi: new AuthApi(),
  userApi: new UserApi(),
  orderApi: new OrderApi(),
  mailApi: new MailApi(),
  simApi: new SimApi(),
  resourceApi: new ResourceApi(),
};

export default apiFactory;
