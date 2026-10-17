import BaseApi from "./baseApi";
import {USER} from "./apiConstant";

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

  listUsers(param) {
    return this.listPerson(param);
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

  createUser(param) {
    return this.storeUser(param);
  }

  updateUser(param) {
    return this.update(param);
  }

  deleteUser(param) {
    return this.updateUser({
      ...param,
      status: "DELETED",
    });
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
