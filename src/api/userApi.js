import BaseApi from "./baseApi";
import {AUTHEN, USER} from "./apiConstant";

class UserApi extends BaseApi {
  getMe() {
    return this.get("secure" + USER + "getMe");
  }

  logout() {
    return this.get("secure" + USER + "logout");
  }

  listPerson(param) {
    return this.post("secure" + USER + "list", param);
  }

  upload(request) {
    return this.post("secure" + USER + "upload-profile-image", request);
  }

  saveMe(param) {
    return this.post("secure" + USER + "save-me", param);
  }

  update(param) {
    return this.post("secure" + USER + "update", param);
  }

  storeUser(param) {
    return this.post("secure" + USER + "store-user", param);
  }

  resetPassword(param) {
    return this.post("secure" + USER + `reset-password/${param}`);
  }

  changePassword(body) {
    return this.post("secure" + USER + "change-password", body);
  }
}

export default UserApi;
