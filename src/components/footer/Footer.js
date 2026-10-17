import { Col, Row } from "antd";
import "./style.scss";

export const Footer = () => {
  // absolute bottom-0
  return (
    <Row className="bg-[white]  w-full">
      <Col sm={0} md={0} xl={5} />
      <Col sm={24} md={12} xl={7} className="left-footer w-full">
        <div className="flex gap-[2px]">
          <div>Điện thoại:</div>
          <span className="font-semibold text-[#2a56b9]">0975896865</span>
        </div>
        <div className="flex gap-[2px]">
          <div>Email:</div>
          <span className="font-semibold text-[#2a56b9]">dung@gmail.com</span>
        </div>
      </Col>
      <Col sm={24} md={12} xl={7} className="right-footer w-full">
        <div>© 2026-2027. Toàn bộ bản quyền thuộc</div>
        <span className="font-semibold text-[#2a56b9]">simbadinh.com</span>
      </Col>
      <Col sm={0} md={0} xl={5} />
    </Row>
  );
};
