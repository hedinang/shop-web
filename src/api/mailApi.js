import { MAIL } from "./apiConstant";
import BaseApi from "./baseApi";

class MailApi extends BaseApi {
  list(param) {
    return this.post(`${MAIL}/list`, param);
  }

  store(param) {
    return this.post(`${MAIL}/store`, param);
  }

  delete(param) {
    return this.post(`${MAIL}/delete`, param);
  }
}
export default MailApi;
