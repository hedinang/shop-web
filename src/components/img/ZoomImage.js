import { Image } from "antd";
import React, { useRef, useState } from "react";
import "./style.scss";

export default function ZoomImage({ url, cssSize }) {
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [offset, setOffset] = useState({ left: 0, top: 0 });

  const handleMouseEnter = () => {
    setOpacity(1); // Hiển thị phóng to
  };

  const handleMouseLeave = () => {
    setOpacity(0); // Ẩn phóng to
    setOffset({ left: 0, top: 0 }); // Đặt lại vị trí về ban đầu
  };

  const handleMouseMove = (e) => {
    const imageRect = imageRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const xRatio =
      (imageRect.width - containerRect.width) / containerRect.width;
    const yRatio =
      (imageRect.height - containerRect.height) / containerRect.height;

    const left = Math.max(
      Math.min(e.pageX - containerRect.left, containerRect.width),
      0
    );
    const top = Math.max(
      Math.min(e.pageY - containerRect.top, containerRect.height),
      0
    );

    setOffset({
      left: left * -xRatio,
      top: top * -yRatio,
    });
  };

  return (
    <div
      className={`${cssSize === "small" ? "container-small" : "container-big"}`}
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={() => setIsModalOpen(true)}
    >
      <img
        ref={imageRef}
        className={`${cssSize === "small" ? "image-small" : "image-big"} ${opacity ? "zoomed" : ""}`}
        alt="zoom"
        src={url}
        style={{
          transform: `translate(${offset.left}px, ${offset.top}px) scale(${opacity ? 2 : 1})`,
        }}
      />
      <Image
        className={`${!isModalOpen && "hidden"}`}
        src={url}
        preview={{
          visible: isModalOpen,
          onVisibleChange: (visible, prevVisible) => setIsModalOpen(false),
        }}
      />
    </div>
  );
}
