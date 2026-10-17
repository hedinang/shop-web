import {ADMIN, AUTHEN} from './apiConstant';
import BaseApi from './baseApi';

class AuthApi extends BaseApi {
  login(body) {
    return this.post("free" + AUTHEN + "login", body);
  }

  register(body) {
    return this.post(AUTHEN + "register", body);
  }

  logout() {
    return this.post(`${AUTHEN}/logout`, {},)
  }

  changePassword(body) {
    return this.post(AUTHEN + "/change-password", body);
  }
}

export default AuthApi;
