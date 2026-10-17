import { LeftOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiFactory from "../../api";
import { tabSettings } from "../../config/Constant";
import { useInfoUser } from "../../store/UserStore";
import "./style.scss";
import copy from "copy-to-clipboard";

const SettingsModal = ({ onCancel, open }) => {
  const { user, languageMap, updateUser, updateLanguageMap } = useInfoUser();
  const [tabNumb, setTabNumb] = useState(null);
  const [isLeftSide, setIsLeftSide] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isHasPermissionNotifications, setIsHasPermissionNotifications] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const changeLanguage = async (value) => {
    const params = {
      language: value,
      phone: user?.phone,
      mood: user?.mood,
    };
    const me = await apiFactory.userApi.saveMe(params);

    if (me?.status === 200) {
      updateUser(me?.data?.user);
      updateLanguageMap(me?.data?.languageMap);
    } else {
      toast.error(me?.message);
      updateUser(null);
    }
  };

  const switchTab = (value) => {
    setTabNumb(value);
    setIsLeftSide(false);
  };

  const handleClickLeftSide = () => {
    setIsLeftSide(true);
    setTabNumb(null);
  };

  const handleClickRightSide = () => {
    setIsLeftSide(false);
  };

  const onFinish = async () => {
    setLoading(true);
    try {
      const request = {
        currentPassword,
        newPassword,
      };

      const result = await apiFactory.authApi.changePassword(request);
      if (!result) return;

      if (result.status === 200) {
        toast.success("Change password success");
        onCancel();
      } else if (result.status === 500) {
        return toast.error(result.message);
      } else {
        return toast.error(result.message);
      }
    } catch (error) {
      console.error("Error fetching change password data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLinkBrowserNotification = () => {
    const userAgent = navigator.userAgent.toLowerCase();

    let browserNotificationLink = "";

    if (userAgent.includes("firefox")) {
      browserNotificationLink = "about:config";
    } else if (userAgent.includes("samsungbrowser")) {
      browserNotificationLink = "samsung://browser-settings";
    } else if (userAgent.includes("opera") || userAgent.includes("opr")) {
      browserNotificationLink = "opera://settings/content/notifications";
    } else if (userAgent.includes("edge")) {
      browserNotificationLink = "edge://settings/content/notifications";
    } else if (userAgent.includes("chrome")) {
      browserNotificationLink = "chrome://settings/content/notifications";
    } else if (userAgent.includes("safari")) {
      browserNotificationLink = "";
    }
    return browserNotificationLink;
  };

  const openNotificationSettings = (link) => {
    const isSuccess = copy(link);

    if (isSuccess) {
      toast.success(
        `${
          languageMap?.["modal.generalSettings.settingsNotificationAlert"] ??
          "Please paste the following link into your browser"
        }: \n${link}`
      );
    }
  };

  useEffect(() => {
    if ("Notification" in window) {
      setIsHasPermissionNotifications(Notification.permission === "granted");
    }
  }, []);

  const onChangePermissionNotifications = async () => {
    const permission = await Notification.requestPermission();
    setIsHasPermissionNotifications(permission === "granted");
  };

  const renderComponentTab = () => {
    const linkBrowserNotification = getLinkBrowserNotification();

    switch (tabNumb) {
      // case tabSettings.GENERAL_SETTINGS: {
      //   return (
      //     <div>
      //       <div className="py-2">
      //         <div>
      //           <div className="settings-right-titles">
      //             {languageMap?.["modal.generalSettings.languageTitle"] ??
      //               "Language"}
      //           </div>
      //           <div className="settings-note-text mt-1">
      //             {languageMap?.["modal.generalSettings.languageSubTitle"] ??
      //               "Change the system language"}
      //           </div>
      //         </div>
      //         <div className="flex flex-row bg-white rounded-[15px] mt-[20px] pt-[15px] pr-[15px] pb-[15px] pl-[15px] items-center">
      //           <div>
      //             <span className="settings-option-content">
      //               {languageMap?.["modal.generalSettings.changeLanguage"] ??
      //                 "Change language"}
      //             </span>
      //           </div>
      //           <div className="ml-auto">
      //             <div className="relative inline-block">
      //               <select
      //                 value={user?.language}
      //                 onChange={(e) => changeLanguage(e.target.value)}
      //                 className="appearance-none bg-white rounded-lg border border-gray-300 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500"
      //               >
      //                 <option value="kr">Korean</option>
      //                 <option value="us">English</option>
      //                 <option value="vn">Vietnamese</option>
      //               </select>
      //               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      //                 <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
      //                   <path d="M10 12l-6-6 1.5-1.5L10 9l4.5-4.5L16 6l-6 6z" />
      //                 </svg>
      //               </div>
      //             </div>
      //           </div>
      //         </div>
      //       </div>
      //       <div className="py-2">
      //         <div>
      //           <div className="settings-right-titles">
      //             {languageMap?.["modal.generalSettings.notificationTitle"] ??
      //               "Notification"}
      //           </div>
      //         </div>
      //         <div className="flex flex-row bg-white rounded-[15px] mt-[20px] pt-[15px] pr-[15px] pb-[15px] pl-[15px] items-center">
      //           <div>
      //             <span className="settings-option-content">
      //               {languageMap?.[
      //                 "modal.generalSettings.changeReceiveMessageNotifications"
      //               ] ?? "Receive message notifications"}
      //             </span>
      //           </div>
      //           <div className="ml-auto">
      //             <div className="relative inline-block">
      //               <Switch
      //                 checked={isHasPermissionNotifications}
      //                 onChange={onChangePermissionNotifications}
      //               />
      //             </div>
      //           </div>
      //         </div>
      //         {!isHasPermissionNotifications && (
      //           <div className="ml-1">
      //             <div className="settings-note-text mt-3">
      //               {languageMap?.[
      //                 "modal.generalSettings.contentReceiveMessageNotifications"
      //               ] ??
      //                 "You have declined notification permission. You can change the settings in your browser."}
      //             </div>
      //             {linkBrowserNotification?.length > 0 && (
      //               <div className="settings-note-text mt-1">
      //                 <button
      //                   onClick={() =>
      //                     openNotificationSettings(linkBrowserNotification)
      //                   }
      //                   className="italic underline"
      //                 >
      //                   {languageMap?.[
      //                     "modal.generalSettings.clickContentReceiveMessageNotifications"
      //                   ] ??
      //                     "You can click here to go to the notification settings link for your browser."}
      //                 </button>
      //               </div>
      //             )}
      //           </div>
      //         )}
      //       </div>
      //     </div>
      //   );
      // }
      case tabSettings.CHANGE_PASSWORD: {
        return (
          <div className="py-2">
            <div>
              <div className="settings-right-titles">
                {languageMap?.["modal.changePassword.tabName"] ??
                  "Change password"}
              </div>
              <div className="settings-note-text mt-1">
                {languageMap?.["modal.changePassword.subTitle"] ??
                  "Change the account password"}
              </div>
            </div>
            <div className="flex flex-row bg-white rounded-[15px] mt-[20px] p-[15px] items-center">
              <div className="w-[100%]">
                <Form name="change_password" className="" onFinish={onFinish}>
                  <p className="mb-2">
                    <strong>
                      {languageMap?.["modal.changePassword.note"] ?? "Note"}:
                    </strong>{" "}
                    {languageMap?.["modal.changePassword.subTitleForm"] ??
                      "The new password is different from the old password!"}
                  </p>
                  <div className="border-b-2 border-gray-300 mb-3">
                    <div className="mb-2">
                      <label
                        className="text-gray-700 font-bold"
                        htmlFor="current_password"
                      >
                        {languageMap?.["modal.changePassword.lblCurrentPass"] ??
                          "Current Password"}
                      </label>
                    </div>
                    <div>
                      <Form.Item
                        name="current_password"
                        rules={[
                          {
                            required: true,
                            message:
                              languageMap?.[
                                "modal.changePassword.plsCurrentPass"
                              ] ?? "Please input your current password!",
                          },
                        ]}
                      >
                        <Input.Password
                          id="current_password"
                          placeholder={
                            languageMap?.[
                              "modal.changePassword.enterCurrentPass"
                            ] ?? "Enter your current password"
                          }
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="mb-2">
                    <label
                      className="text-gray-600 font-bold mb-2"
                      htmlFor="new_password"
                    >
                      {languageMap?.["modal.changePassword.lblNewPass"] ??
                        "New Password"}
                    </label>
                  </div>
                  <div className="mb-3">
                    <Form.Item
                      name="new_password"
                      rules={[
                        {
                          required: true,
                          message:
                            languageMap?.["modal.changePassword.plsNewPass"] ??
                            "Please input your new password!",
                        },
                      ]}
                    >
                      <Input.Password
                        id="new_password"
                        placeholder={
                          languageMap?.["modal.changePassword.enterNewPass"] ??
                          "Enter your new password"
                        }
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </Form.Item>
                  </div>
                  <div className="mb-2">
                    <label
                      className="text-gray-600 font-bold mb-2"
                      htmlFor="confirm_new_password"
                    >
                      {languageMap?.["modal.changePassword.lblConfirmPass"] ??
                        "Confirm Password"}
                    </label>
                  </div>
                  <div className="mb-3">
                    <Form.Item
                      name="confirm_new_password"
                      rules={[
                        {
                          required: true,
                          message:
                            languageMap?.[
                              "modal.changePassword.plsConfirmPass"
                            ] ?? "Please confirm your new password!",
                        },
                      ]}
                    >
                      <Input.Password
                        id="confirm_new_password"
                        placeholder={
                          languageMap?.[
                            "modal.changePassword.enterConfirmPass"
                          ] ?? "Confirm your new password"
                        }
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </Form.Item>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      className="font-bold font-[16px] "
                      type="primary"
                      htmlType="submit"
                      disabled={
                        !currentPassword.trim() ||
                        !newPassword.trim() ||
                        !confirmPassword.trim() ||
                        newPassword !== confirmPassword ||
                        currentPassword === newPassword
                      }
                    >
                      {languageMap?.["modal.changePassword.save"] ?? "Save"}
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        );
      }
      default: {
        return <></>;
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setTabNumb(tabSettings.CHANGE_PASSWORD);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      closeIcon={true}
      width={800}
      title={
        <>
          <div className="flex flex-row">
            {!isLeftSide && (
              <a className="btn-back-to-settings" onClick={handleClickLeftSide}>
                <LeftOutlined />
              </a>
            )}
            <div className="ml-3">
              <span className="settings-title">
                {languageMap?.["modal.settings.title"] ?? "Settings"}
              </span>
            </div>
          </div>
        </>
      }
      titleFontSize={24}
      className="mb-5"
    >
      <div className="desktop">
        <div className="list-group">
          <div className="list-group-column pr-4">
            <ul className="mt-5">
              {/* <li
                className={
                  tabNumb === tabSettings.GENERAL_SETTINGS ? "tab-active" : ""
                }
                onClick={() => {
                  switchTab(tabSettings.GENERAL_SETTINGS);
                  handleClickRightSide();
                }}
              >
                <SettingOutlined className="items-center pr-2" />
                <span className="settings-left-titles">
                  {languageMap?.["modal.generalSettings.tabName"] ??
                    "General settings"}
                </span>
              </li> */}

              <li
                className={
                  tabNumb === tabSettings.CHANGE_PASSWORD ? "tab-active" : ""
                }
                onClick={() => {
                  switchTab(tabSettings.CHANGE_PASSWORD);
                  handleClickRightSide();
                }}
              >
                <SettingOutlined className="items-center pr-2" />
                <span className="settings-left-titles">
                  {languageMap?.["modal.changePassword.tabName"] ??
                    "Change password"}
                </span>
              </li>
            </ul>
          </div>
          <div className="list-group-column p-5" key={tabNumb}>
            {tabNumb && renderComponentTab()}
          </div>
        </div>
      </div>
      <div className="mobile">
        <div className="list-group">
          <div
            className={
              isLeftSide
                ? "block list-group-column"
                : "hidden list-group-column"
            }
          >
            <ul className="mt-5">
              <li
                className={
                  tabNumb === tabSettings.GENERAL_SETTINGS ? "tab-active" : ""
                }
                onClick={() => switchTab(tabSettings.GENERAL_SETTINGS)}
              >
                <SettingOutlined className="items-center pr-2" />
                <span className="settings-left-titles">
                  {languageMap?.["modal.generalSettings.tabName"] ??
                    "General settings"}
                </span>
              </li>
              <li
                className={
                  tabNumb === tabSettings.CHANGE_PASSWORD ? "tab-active" : ""
                }
                onClick={() => switchTab(tabSettings.CHANGE_PASSWORD)}
              >
                <SettingOutlined className="items-center pr-2" />
                <span className="settings-left-titles">
                  {languageMap?.["modal.changePassword.tabName"] ??
                    "Change password"}
                </span>
              </li>
            </ul>
          </div>
          <div
            className={
              isLeftSide
                ? "hidden list-group-column mt-5 pt-10 ml-5"
                : "block list-group-column p-3"
            }
            key={tabNumb}
          >
            {tabNumb && renderComponentTab()}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { SettingsModal };
