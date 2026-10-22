import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import "./nationList.scss";
import ReactCountryFlag from "react-country-flag";
import viettel from "../../assets/network-operator/viettel.png";
import vina from "../../assets/network-operator/vina.png";
import mobilephone from "../../assets/network-operator/mobilephone.png"
import truemobile from "../../assets/network-operator/truemobile.png";
import mtel from "../../assets/network-operator/mtel.svg";
import mts from "../../assets/network-operator/mts.png";
import {Card, Col, Row, Tooltip} from "antd";

const countries = [
  {key: "VN", value: "Vietnam"},
  {key: "JP", value: "Japan"},
  {key: "US", value: "United States"},
  {key: "KR", value: "South Korea"},
  {key: "EU", value: "Europe"},
]

const popularNetworkOperator = [
  {
    key: "viettel",
    icon: viettel
  },
  {
    key: "vinaphone",
    icon: vina
  },
  {
    key: "mobilephone",
    icon: mobilephone
  },
  {
    key: "truemobile",
    icon: truemobile
  },
  {
    key: "mtel",
    icon: mtel
  },
  {
    key: "mts",
    icon: mts
  },
]

const banners = [
  {
    img: "https://sim4g.com/uploads/202408/x59uh5d1-Blue-And-White-Modern-Travel-Vlog-YouTube-Thumbnail.jpg",
  },
  {
    img: "https://sim4g.com/uploads/202408/cx0jqd6s-wifi-690-300.jpg",
  },
  {
    img: "https://sim4g.com/uploads/202408/14ifjjj7-banner-home-left-1.png",
  },
];

const products = [
  {
    name: "eSim du lịch Multi-region Europe",
    price: "75.000 đ – 3.625.000 đ",
    img: "https://sim4g.com/uploads/202506/508xoi7v.jpg",
  },
  {
    name: "eSim du lịch Đài Loan Taiwan",
    price: "70.000 đ – 1.585.000 đ",
    img: "https://hico.vn/uploads/202506/ol1kjo4r.jpg",
  },
  {
    name: "eSim du lịch Đông Nam Á",
    price: "70.000 đ – 3.080.000 đ",
    img: "https://sim4g.com/uploads/202510/pruzokor.jpg",
  },
  {
    name: "eSIM Du Lịch Mỹ",
    price: "75.000 đ – 2.170.000 đ",
    img: "https://sim4g.com/uploads/202506/9vn3r179.jpg",
  },
  {
    name: "eSim du lịch Ả Rập Xê Út",
    price: "85.000 đ – 3.655.000 đ",
    img: "https://sim4g.com/uploads/202506/f0sf6c1x.jpg",
  },
  {
    name: "eSim du lịch Nhật Bản",
    price: "90.000 đ – 2.500.000 đ",
    img: "https://hico.vn/uploads/202506/ol1kjo4r.jpg",
  },
];

const NationList = () => {
  const navigate = useNavigate();

  const [bannerIndex, setBannerIndex] = useState(0);
  const [productIndex, setProductIndex] = useState(0);

  const nextBanner = () => {
    setBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextProduct = () => {
    setProductIndex((prev) => (prev + 1) % products.length);
  };

  const prevProduct = () => {
    setProductIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const getVisibleProducts = () => {
    return Array.from({length: 5}, (_, i) => {
      return products[(productIndex + i) % products.length];
    });
  };

  const getVisibleBanners = () => {
    return Array.from({length: 1}, (_, i) => {
      return banners[(bannerIndex + i) % banners.length];
    });
  };

  return (
      <div className="page">
        <main className="container">
          <section className="content">
            <div className="flex flex-col items-center gap-[20px] mt-[20px]">
              <div className="flex text-[#f4511e] font-semibold ">Popular eSIM destinations</div>
              <div className="flex gap-[20px]">
                {countries.map(country =>
                    <Tooltip key={country.key} title={country.value}>
                      <button
                          type="button"
                          aria-label={`Browse eSIM packages for ${country.value}`}
                          onClick={() => navigate(`/product/${country.key}`)}
                          className="rounded-full border border-[#ef4444] w-[48px] h-[48px] flex justify-center items-center bg-white cursor-pointer"
                      >
                        <ReactCountryFlag countryCode={country.key} svg style={{width: 28, height: 28}}/>
                      </button>
                    </Tooltip>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-[20px] mt-[50px]">
              <Row>
                {popularNetworkOperator?.map(network =>
                    <Col span={4} className="p-[20px] flex justify-center ">
                      <img src={network?.icon} className="h-[30px] w-auto"/>
                    </Col>
                )}
              </Row>
            </div>
            <Row gutter={[16, 16]} className="mt-[30px]">
              <Col xs={24} sm={12} md={12} lg={6} className="flex justify-center">
                <Card
                    hoverable
                    variant="borderless"
                    className="w-[260px]"
                    cover={
                      <img
                          draggable={false}
                          alt="example"
                          src="https://mobimatter.com/static/images/storeimag.webp"
                      />
                    }
                >
                  <div className="font-semibold text-center">Instant delivery & ready to use</div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={12} lg={6} className="flex justify-center">
                <Card
                    hoverable
                    variant="borderless"
                    className="w-[260px]"
                    cover={
                      <img
                          draggable={false}
                          alt="example"
                          src="https://mobimatter.com/static/images/storeimag2.webp"
                      />
                    }
                >
                  <div className="font-semibold text-center">Best value for money</div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={12} lg={6} className="flex justify-center">
                <Card
                    hoverable
                    variant="borderless"
                    className="w-[260px]"
                    cover={
                      <img
                          draggable={false}
                          alt="example"
                          src="https://mobimatter.com/static/images/storeimag3.webp"
                      />
                    }
                >
                  <div className="font-semibold text-center">Global coverage</div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={12} lg={6} className="flex justify-center">
                <Card
                    hoverable
                    variant="borderless"
                    className="w-[260px]"
                    cover={
                      <img
                          draggable={false}
                          alt="example"
                          src="	https://mobimatter.com/static/images/storeimag4.webp"
                      />
                    }
                >
                  <div className="font-semibold text-center">Wide selection</div>
                </Card>
              </Col>
            </Row>
          </section>
        </main>
      </div>
  );
};

export {NationList};
