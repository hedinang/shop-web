import {Avatar, Button, Image, Input, Modal, Spin, Upload} from "antd";
import "./style.scss";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {compressImage, getColorFromInitial} from "../../utils/Utils";
import {useLayoutContext} from "../../context/LayoutContext";
import {CiCamera} from "react-icons/ci";
import ImgCrop from "antd-img-crop";
import apiFactory from "../../api";
import {toast} from "react-toastify";
import {useSendingContext} from "../../context/global/SendingProvider";
import {LoadingOutlined} from "@ant-design/icons";
import {MdDelete} from "react-icons/md";
import {v4 as uuidv4} from "uuid";
import {createMultipartUpload, ensureBucketExists} from "../../api/originalStorageApi";
import {uploadFileWithUppy, uploadMultipartFile} from "../../api/storageApi";

const ProfileModal = ({isModalOpen, closeModal}) => {
  const {me, logout, setMe} = useLayoutContext();
  const {uploadFile} = useSendingContext()
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userEdit, setUserEdit] = useState({});
  const [isModalAvatarOpen, setIsModalAvatarOpen] = useState(false);
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState(null)
  const currentUploadRef = useRef(null);

  const showAvatarModal = () => {
    setIsModalAvatarOpen(true);
  };
  const closeAvatarModal = () => {
    setIsModalAvatarOpen(false);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      // openNotificationError(
      //     languageMap?.["error.onlyUpImg"] ?? "You can only upload image!",
      // );
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const handleUpload = async ({
                                file,
                                onProgress,
                                onSuccess,
                                onError,
                              }) => {
    try {
      setProgress(0);
      setStatus("UPLOADING");

      const result = await uploadMultipartFile({
        file,

        onProgress: ({percent}) => {
          setProgress(percent);

          onProgress?.({
            percent,
          });
        },
      });

      setProgress(100);
      setStatus("COMPLETED");

      const res = await apiFactory.userApi.upload({
        avatar: result?.location
      });

      if (res?.status === 200) {
        toast.success("Cập nhật avatar thành công")
        setMe(prev => ({...prev, avatar: result?.location}));
      }

      onSuccess?.(result);
    } catch (error) {
      setStatus("FAILED");
      onError?.(error);

      console.error("Upload thất bại:", error);
    }
  };

  const removeAvatar = async () => {
    const res = await apiFactory.userApi.upload({
      avatar: null,
    });

    if (res?.status === 200) {
      toast.success("Cập nhật avatar thành công")
      setMe(prev => ({...prev, avatar: null}));
    }
  }

  const genderAvatar = useMemo(() => {
    return (
        <>
          <Avatar
              style={
                  !me?.avatar && {
                    backgroundColor: getColorFromInitial(me?.name),
                    color: "white",
                  }
              }
              size={80}
              onClick={() => setIsPreview(true)}
              src={me?.avatar}
          >
            {!me?.avatar && me?.name}
          </Avatar>
          {me?.avatar && (
              <Image
                  wrapperStyle={{
                    display: "none",
                  }}
                  preview={{
                    visible: isPreview,
                    onVisibleChange: (visible) => setIsPreview(visible),
                  }}
                  src={me?.avatar}
              />
          )}
        </>
    );
  }, [me, isPreview]);

  const onCancel = () => {
    setUserEdit({name: me?.name, phone: me?.phone, email: me?.email});
  }

  const accept = async () => {
    const response = await apiFactory.userApi.update({
      userId: me?.userId,
      name: userEdit?.name,
      phone: userEdit?.phone,
      email: userEdit?.email,
    });

    if (response?.status === 200) {
      setMe(prev => ({
        ...prev,
        name: response?.data?.name,
        phone: response?.data?.phone,
        email: response?.data?.email
      }));
      toast.success("Cập nhật thành công")
    } else {
      toast.error("Cập nhật lỗi")
    }
  }

  const isEdit = useMemo(() => {
    return (userEdit?.name !== me?.name || userEdit?.phone !== me?.phone || userEdit?.email !== me?.email)
  }, [userEdit])


  useEffect(() => {
    setUserEdit({name: me?.name, phone: me?.phone, email: me?.email});

  }, [me])

  return (
      <Modal
          title="Thông tin cá nhân"
          open={isModalOpen}
          onCancel={closeModal}
          footer={[]}
      >
        <div className="flex flex-col gap-[10px]">
          <div className="flex items-center gap-[30px]">
            <div className="mt-3 font-semibold w-[130px]">
              Ảnh đại diện:
            </div>
            <div className="mt-3 flex gap-[20px]">
              <div className="relative">
                {genderAvatar}

                <ImgCrop rotationSlider>
                  <Upload
                      showUploadList={false}
                      beforeUpload={beforeUpload}
                      // onChange={handleUpload}
                      customRequest={handleUpload}
                  >
                    <button
                        type="button"
                        className="hover:!bg-[#d9d9d9] absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md cursor-pointer"
                    >
                      <CiCamera className="text-xl"/>
                    </button>
                  </Upload>
                </ImgCrop>

              </div>
              {me?.avatar && (
                  <button onClick={removeAvatar}>
                    <MdDelete size={20} color="#ef4444"/>
                  </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-[30px]">
            <div className="mt-3 font-semibold w-[140px]">Tên đăng nhập:</div>
            <div className="mt-3">{me?.username}</div>
          </div>

          <div className="flex items-center gap-[30px]">
            <div className="mt-3 font-semibold w-[125px]">Tên hiển thị:</div>
            <Input className="flex-1" value={userEdit?.name} onChange={(e) => {
              setUserEdit(prev => ({...prev, name: e.target.value}));
            }}/>
          </div>

          <div className="flex items-center gap-[30px]">
            <div className="mt-3 font-semibold w-[125px]">Số điện thoại:</div>
            <Input className="flex-1" value={userEdit?.phone} onChange={(e) => {
              setUserEdit(prev => ({...prev, phone: e.target.value}));
            }}/>
          </div>

          <div className="flex items-center gap-[30px]">
            <div className="mt-3  font-semibold w-[125px]">Địa chỉ email:</div>
            <Input className="flex-1" value={userEdit?.email} onChange={(e) => {
              setUserEdit(prev => ({...prev, email: e.target.value}));
            }}/>
          </div>
          {
              isEdit &&
              <div className="flex justify-center gap-[30px] pt-[20px]">
                {isLoading ? (
                        <Spin
                            indicator={
                              <LoadingOutlined style={{fontSize: 24}} spin/>
                            }
                        />
                    ) :
                    <Button
                        className="button bg-[#46ac40] text-[white] w-[100px]" onClick={accept}
                    >
                      Đồng ý sửa
                    </Button>
                }
                <Button className="button bg-[#f4511e] text-[white] w-[100px]"
                        onClick={onCancel}
                >
                  Hủy
                </Button>
              </div>
          }
        </div>
      </Modal>
  );
};

export {ProfileModal};
