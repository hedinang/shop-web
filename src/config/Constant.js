import { FaUserPen } from "react-icons/fa6";
import { IoIosFolder } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { RiOrganizationChart } from "react-icons/ri";

export const keyMenuItem = {
  DASHBOARD: {
    key: "DASHBOARD",
    name: "Thống kê",
  },
  SONG_LIST: {
    key: "SONG_LIST",
    name: "Danh sách nhạc",
  },
  AUTHOR_LIST: {
    key: "AUTHOR_LIST",
    name: "Danh sách tác giả",
  },
  SALE_LIST: {
    key: "SALE_LIST",
    name: "Danh sách đã bán",
  },
  CATEGORY_LIST: {
    key: "CATEGORY_LIST",
    name: "Danh mục thể loại",
  },
  PRESENT_LIST: {
    key: "PRESENT_LIST",
    name: "Danh sách quà tặng",
  },
  CUSTOMER_LIST: {
    key: "CUSTOMER_LIST",
    name: "Danh sách khách hàng",
  },
  CHAT: {
    key: "CHAT",
    name: "Inbox",
  },
  ADMIN_LIST: {
    key: "ADMIN_LIST",
    name: "Danh sách admin",
  },
  LOG_OUT: {
    key: "LOG_OUT",
    name: "Thoát",
  },
  FUNCTION: {
    key: "FUNCTION",
    name: "Tính năng",
  },
};

export const MESSAGE_STATUS = {
  CREATE_GROUP: "CREATE_GROUP",
  RENAME_GROUP: "RENAME_GROUP",
  NEW_MEMBER: "NEW_MEMBER",
  TEXT: "TEXT",
  IMAGE: "IMAGE",
  FILE: "FILE",
  CHUNK: "CHUNK",
  REMOVE_MEMBER: "REMOVE_MEMBER",
  EXIT_GROUP: "EXIT_GROUP",
  UPDATE_ROLE_ADMIN: "UPDATE_ROLE_ADMIN",
  DELETE_GROUP: "DELETE_GROUP",
  UPDATE_GROUP_AVATAR: "UPDATE_GROUP_AVATAR",
  REMOVE_MESSAGE: "REMOVE_MESSAGE",
  SHARE_MESSAGE: "SHARE_MESSAGE",
  REACTION_MESSAGE: "REACTION_MESSAGE",
  VIDEO: "VIDEO",
  AUDIO: "AUDIO",
  RENAME_PERSONAL_GROUP: "RENAME_PERSONAL_GROUP",
  CREATE_PERSONAL: "CREATE_PERSONAL",
};

export const role = {
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
  CUSTOMER: "CUSTOMER",
};
export const FILE_STATUS = {
  PAUSE: "PAUSE",
  READY: "READY",
  CANCEL: "CANCEL",
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
};

export const notificationMessage = {
  setMessage: (userName, newGroupName) => {
    const content = userName + " changed the group name to " + newGroupName;
    return content;
  },

  exitGroup: (userName) => {
    const content = userName + " has left the group";
    return content;
  },
};

export const organizationType = {
  PERSON: "PERSON",
  INSTITUTION: "INSTITUTION",
};

export const conversationType = {
  PERSONAL: "PERSONAL",
  GROUP: "GROUP",
  NOTIFICATION: "NOTIFICATION",
  CREATE_NOTIFICATION: "CREATE_NOTIFICATION",
  CONVERSATION: "CONVERSATION",
  DRAFT: "DRAFT",
};

export const filterConversationByType = {
  PERSONAL: "PERSONAL",
  GROUP: "GROUP",
  UNREAD: "UNREAD",
  NOTIFICATION: "NOTIFICATION",
  ALL: "ALL",
};

export const filterTaskByTime = [
  {
    label: "To day",
    value: "TODAY",
  },
  {
    label: "Tomorrow",
    value: "TOMORROW",
  },
  {
    label: "This week",
    value: "THIS_WEEK",
  },
  {
    label: "This month",
    value: "THIS_MONTH",
  },
];
export const filterAlarmByType = [
  {
    label: "All",
    value: "ALL",
  },
  {
    label: "Unread",
    value: "UNREAD",
  },
  {
    label: "read",
    value: "READ",
  },
];

export const filterProjectByType = [
  {
    label: "All",
    value: "ALL",
  },
  {
    label: "Favorites",
    value: "FAVORITES",
  },
  {
    label: "Recently",
    value: "RECENTLY",
  },
];

export const CHATTING = {
  CONVERSATION_LIMIT: 15,
  MESSAGE_LIMIT: 15,
  MEMBER_LIMIT: 15,
};
export const PROJECT = {
  PROJECT_LIMIT: 10,
};
export const MY_TASK = {
  MY_TASK_LIMIT: 25,
};
export const ALARM = {
  MY_ALARM_LIMIT: 10,
};

export const tabSettings = {
  GENERAL_SETTINGS: "GENERAL_SETTINGS",
  CHANGE_PASSWORD: "CHANGE_PASSWORD",
  PRIVACY: "PRIVACY",
  THEME: "THEME",
  NOTIFICATION: "NOTIFICATION",
  MESSAGE: "MESSAGE",
  UTILITIES: "UTILITIES",
};

export const UNREAD_COUNT_MAX = 10;

export const typeConfirms = {
  KICK_MEMBERS: "KICK_MEMBERS",
  UPDATE_ROLE_ADMIN: "UPDATE_ROLE_ADMIN",
  CANCEL_PROJECT: "CANCEL_PROJECT",
  UPDATE_PROJECT: "UPDATE_PROJECT",
  DELETE_PROJECT: "DELETE_PROJECT",
};

export const MENU_WORK_MANAGEMENT = [
  // {
  //   key: "NEW_PROJECT",
  //   name: "New Project +",
  // },
  {
    key: "DASHBOARD",
    name: "Dashboard",
    icon: <MdDashboard size={25} color="#4db74d" />,
  },
  // {
  //   key: "BOARD",
  //   name: "Board",
  //   icon: <MdLibraryBooks size={25} color="#0091ff" />,
  // },
  // {
  //   key: "FILE",
  //   name: "File",
  //   icon: <IoIosFolder size={25} color="#fbbc04" />,
  // },
];

export const MENU_ADMIN_SETTING = [
  {
    key: "USER",
    name: "User",
    icon: <FaUserPen size={25} color="#1677ff" />,
  },
  {
    key: "ORGANIZATION",
    name: "Organization",
    icon: <RiOrganizationChart size={25} color="#4db74d" />,
  },
  {
    key: "SCHEDULE",
    name: "File",
    icon: <IoIosFolder size={25} color="#fbbc04" />,
  },
];

export const CODE_TYPE = {
  PROJECT_TYPE: "1001",
  PROGRESS_STEP: "1002",
  ROLE: "1003",
  AUTHORITY: "1004",
  PROPERTY: "1005",
  STAGE_WORKFLOW: "1006",
  WORK_ACTIVITY: "1007",
};

export const WORK_ACTIVITY_CODE = {
  ACTIVITY: "100701",
  ALARM: "100702",
  ISSUE: "100703",
};

export const USAGE_STATUS = {
  YES: "Y",
  NO: "N",
};

export const NOTIFICATION_STATUS = {
  YES: "Y",
  NO: "N",
};

export const TASK_ACTIVITY_TYPE = {
  COMMENT: "C",
  REPLY: "R",
};

export const KEY_MENU_WORK_MANAGEMENT = {
  NEW_PROJECT: "NEW_PROJECT",
  UPDATE_PROJECT: "UPDATE_PROJECT",
  DASHBOARD: "DASHBOARD",
  TIMELINE: "TIMELINE",
  CALENDAR: "CALENDAR",
  BOARD: "BOARD",
  FILE: "FILE",
};

export const KEY_MENU_ADMIN_SETTING = {
  SCHEDULE: "SCHEDULE",
  ORGANIZATION: "ORGANIZATION",
  USER: "USER",
};

export const AUTHORITY_CONFIG = {
  PROJECT: {
    ID: "M100200",
    LABEL: "Project",
  },
  TASK: {
    ID: "M100300",
    LABEL: "Task",
  },
  PROJECT_MANAGEMENT: {
    ID: "M100100",
    LABEL: "Project Management",
  },
};

export const COMMENT_HISTORY = {
  LIMIT: 10,
};

export const COMMENT = {
  PARENT_LIMIT: 10,
  CHILD_LIMIT: 5,
};

export const tabTypes = {
  ALL: "ALL",
  SHARE: "SHARE",
  UNREAD: "UNREAD",
  GROUP: "GROUP",
  PERSONAL: "PERSONAL",
  NOTIFICATION_RECEIVE: "NOTIFICATION_RECEIVE",
  NOTIFICATION_SEND: "NOTIFICATION_SEND",
  NOTIFICATION: "NOTIFICATION",
};

export const windowNames = {
  CONVERSATION_LIST: "CONVERSATION_LIST",
  SIDEBAR_CHAT: "SIDEBAR_CHAT",
  CONVERSATION_DETAIL: "CONVERSATION_DETAIL",
  PROJECT_LIST: "PROJECT_LIST",
  PROJECT_DETAIL: "PROJECT_DETAIL",
  TIMELINE: "TIMELINE",
  CALENDAR: "CALENDAR",
  CHAT_MENU: "CHAT_MENU",
  NOTIFICATION_DETAIL: "NOTIFICATION_DETAIL",
};

export const modalTypes = {
  REMOVE_MESSAGE: "REMOVE_MESSAGE",
};

export const ATTRIBUTE_CODE = {
  DATE: "100501",
  DATE_TIME: "100502",
  TEXT: "100503",
};

export const imagesTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/webp",
  "image/svg+xml",
  "image/x-icon",
  "image/tiff",
  "image/heic",
  "image/heif",
];

export const MAX_FILE_SIZE = 1024 * 1024 * 1024;
export const CHUNK_SIZE = 2 * 1024 * 1024;
export const exceedFiles = 24;
export const countryOptions = [
  { label: "Afghanistan", value: "AF" },
  { label: "Åland Islands", value: "AX" },
  { label: "Albania", value: "AL" },
  { label: "Algeria", value: "DZ" },
  { label: "American Samoa", value: "AS" },
  { label: "Andorra", value: "AD" },
  { label: "Angola", value: "AO" },
  { label: "Anguilla", value: "AI" },
  { label: "Antarctica", value: "AQ" },
  { label: "Antigua và Barbuda", value: "AG" },
  { label: "Argentina", value: "AR" },
  { label: "Armenia", value: "AM" },
  { label: "Aruba", value: "AW" },
  { label: "Úc", value: "AU" },
  { label: "Áo", value: "AT" },
  { label: "Azerbaijan", value: "AZ" },
  { label: "Bahamas", value: "BS" },
  { label: "Bahrain", value: "BH" },
  { label: "Bangladesh", value: "BD" },
  { label: "Barbados", value: "BB" },
  { label: "Belarus", value: "BY" },
  { label: "Bỉ", value: "BE" },
  { label: "Belize", value: "BZ" },
  { label: "Benin", value: "BJ" },
  { label: "Bermuda", value: "BM" },
  { label: "Bhutan", value: "BT" },
  { label: "Bolivia", value: "BO" },
  { label: "Bosnia và Herzegovina", value: "BA" },
  { label: "Botswana", value: "BW" },
  { label: "Bouvet Island", value: "BV" },
  { label: "Brazil", value: "BR" },
  { label: "British Indian Ocean Territory", value: "IO" },
  { label: "Brunei", value: "BN" },
  { label: "Bulgaria", value: "BG" },
  { label: "Burkina Faso", value: "BF" },
  { label: "Burundi", value: "BI" },
  { label: "Campuchia", value: "KH" },
  { label: "Cameroon", value: "CM" },
  { label: "Canada", value: "CA" },
  { label: "Cape Verde", value: "CV" },
  { label: "Cayman Islands", value: "KY" },
  { label: "Cộng hòa Trung Phi", value: "CF" },
  { label: "Chad", value: "TD" },
  { label: "Chile", value: "CL" },
  { label: "Trung Quốc", value: "CN" },
  { label: "Christmas Island", value: "CX" },
  { label: "Cocos Islands", value: "CC" },
  { label: "Colombia", value: "CO" },
  { label: "Comoros", value: "KM" },
  { label: "Congo", value: "CG" },
  { label: "Congo (DRC)", value: "CD" },
  { label: "Cook Islands", value: "CK" },
  { label: "Costa Rica", value: "CR" },
  { label: "Bờ Biển Ngà", value: "CI" },
  { label: "Croatia", value: "HR" },
  { label: "Cuba", value: "CU" },
  { label: "Curaçao", value: "CW" },
  { label: "Síp", value: "CY" },
  { label: "Cộng hòa Séc", value: "CZ" },
  { label: "Đan Mạch", value: "DK" },
  { label: "Djibouti", value: "DJ" },
  { label: "Dominica", value: "DM" },
  { label: "Cộng hòa Dominica", value: "DO" },
  { label: "Ecuador", value: "EC" },
  { label: "Ai Cập", value: "EG" },
  { label: "El Salvador", value: "SV" },
  { label: "Guinea Xích Đạo", value: "GQ" },
  { label: "Eritrea", value: "ER" },
  { label: "Estonia", value: "EE" },
  { label: "Eswatini", value: "SZ" },
  { label: "Ethiopia", value: "ET" },
  { label: "Falkland Islands", value: "FK" },
  { label: "Faroe Islands", value: "FO" },
  { label: "Fiji", value: "FJ" },
  { label: "Phần Lan", value: "FI" },
  { label: "Pháp", value: "FR" },
  { label: "French Guiana", value: "GF" },
  { label: "French Polynesia", value: "PF" },
  { label: "French Southern Territories", value: "TF" },
  { label: "Gabon", value: "GA" },
  { label: "Gambia", value: "GM" },
  { label: "Georgia", value: "GE" },
  { label: "Đức", value: "DE" },
  { label: "Ghana", value: "GH" },
  { label: "Gibraltar", value: "GI" },
  { label: "Hy Lạp", value: "GR" },
  { label: "Greenland", value: "GL" },
  { label: "Grenada", value: "GD" },
  { label: "Guadeloupe", value: "GP" },
  { label: "Guam", value: "GU" },
  { label: "Guatemala", value: "GT" },
  { label: "Guernsey", value: "GG" },
  { label: "Guinea", value: "GN" },
  { label: "Guinea-Bissau", value: "GW" },
  { label: "Guyana", value: "GY" },
  { label: "Haiti", value: "HT" },
  { label: "Heard Island và McDonald Islands", value: "HM" },
  { label: "Vatican", value: "VA" },
  { label: "Honduras", value: "HN" },
  { label: "Hong Kong", value: "HK" },
  { label: "Hungary", value: "HU" },
  { label: "Iceland", value: "IS" },
  { label: "Ấn Độ", value: "IN" },
  { label: "Indonesia", value: "ID" },
  { label: "Iran", value: "IR" },
  { label: "Iraq", value: "IQ" },
  { label: "Ireland", value: "IE" },
  { label: "Isle of Man", value: "IM" },
  { label: "Israel", value: "IL" },
  { label: "Ý", value: "IT" },
  { label: "Jamaica", value: "JM" },
  { label: "Nhật Bản", value: "JP" },
  { label: "Jersey", value: "JE" },
  { label: "Jordan", value: "JO" },
  { label: "Kazakhstan", value: "KZ" },
  { label: "Kenya", value: "KE" },
  { label: "Kiribati", value: "KI" },
  { label: "Triều Tiên", value: "KP" },
  { label: "Hàn Quốc", value: "KR" },
  { label: "Kosovo", value: "XK" },
  { label: "Kuwait", value: "KW" },
  { label: "Kyrgyzstan", value: "KG" },
  { label: "Lào", value: "LA" },
  { label: "Latvia", value: "LV" },
  { label: "Lebanon", value: "LB" },
  { label: "Lesotho", value: "LS" },
  { label: "Liberia", value: "LR" },
  { label: "Libya", value: "LY" },
  { label: "Liechtenstein", value: "LI" },
  { label: "Litva", value: "LT" },
  { label: "Luxembourg", value: "LU" },
  { label: "Macau", value: "MO" },
  { label: "Madagascar", value: "MG" },
  { label: "Malawi", value: "MW" },
  { label: "Malaysia", value: "MY" },
  { label: "Maldives", value: "MV" },
  { label: "Mali", value: "ML" },
  { label: "Malta", value: "MT" },
  { label: "Quần đảo Marshall", value: "MH" },
  { label: "Martinique", value: "MQ" },
  { label: "Mauritania", value: "MR" },
  { label: "Mauritius", value: "MU" },
  { label: "Mayotte", value: "YT" },
  { label: "Mexico", value: "MX" },
  { label: "Micronesia", value: "FM" },
  { label: "Moldova", value: "MD" },
  { label: "Monaco", value: "MC" },
  { label: "Mông Cổ", value: "MN" },
  { label: "Montenegro", value: "ME" },
  { label: "Montserrat", value: "MS" },
  { label: "Ma Rốc", value: "MA" },
  { label: "Mozambique", value: "MZ" },
  { label: "Myanmar", value: "MM" },
  { label: "Namibia", value: "NA" },
  { label: "Nauru", value: "NR" },
  { label: "Nepal", value: "NP" },
  { label: "Hà Lan", value: "NL" },
  { label: "New Caledonia", value: "NC" },
  { label: "New Zealand", value: "NZ" },
  { label: "Nicaragua", value: "NI" },
  { label: "Niger", value: "NE" },
  { label: "Nigeria", value: "NG" },
  { label: "Niue", value: "NU" },
  { label: "Norfolk Island", value: "NF" },
  { label: "Bắc Macedonia", value: "MK" },
  { label: "Northern Mariana Islands", value: "MP" },
  { label: "Na Uy", value: "NO" },
  { label: "Oman", value: "OM" },
  { label: "Pakistan", value: "PK" },
  { label: "Palau", value: "PW" },
  { label: "Palestine", value: "PS" },
  { label: "Panama", value: "PA" },
  { label: "Papua New Guinea", value: "PG" },
  { label: "Paraguay", value: "PY" },
  { label: "Peru", value: "PE" },
  { label: "Philippines", value: "PH" },
  { label: "Pitcairn", value: "PN" },
  { label: "Ba Lan", value: "PL" },
  { label: "Bồ Đào Nha", value: "PT" },
  { label: "Puerto Rico", value: "PR" },
  { label: "Qatar", value: "QA" },
  { label: "Réunion", value: "RE" },
  { label: "Romania", value: "RO" },
  { label: "Nga", value: "RU" },
  { label: "Rwanda", value: "RW" },
  { label: "Saint Barthélemy", value: "BL" },
  { label: "Saint Helena", value: "SH" },
  { label: "Saint Kitts và Nevis", value: "KN" },
  { label: "Saint Lucia", value: "LC" },
  { label: "Saint Martin", value: "MF" },
  { label: "Saint Pierre và Miquelon", value: "PM" },
  { label: "Saint Vincent và Grenadines", value: "VC" },
  { label: "Samoa", value: "WS" },
  { label: "San Marino", value: "SM" },
  { label: "Sao Tome và Principe", value: "ST" },
  { label: "Ả Rập Saudi", value: "SA" },
  { label: "Senegal", value: "SN" },
  { label: "Serbia", value: "RS" },
  { label: "Seychelles", value: "SC" },
  { label: "Sierra Leone", value: "SL" },
  { label: "Singapore", value: "SG" },
  { label: "Sint Maarten", value: "SX" },
  { label: "Slovakia", value: "SK" },
  { label: "Slovenia", value: "SI" },
  { label: "Quần đảo Solomon", value: "SB" },
  { label: "Somalia", value: "SO" },
  { label: "Nam Phi", value: "ZA" },
  { label: "South Georgia & South Sandwich Islands", value: "GS" },
  { label: "Nam Sudan", value: "SS" },
  { label: "Tây Ban Nha", value: "ES" },
  { label: "Sri Lanka", value: "LK" },
  { label: "Sudan", value: "SD" },
  { label: "Suriname", value: "SR" },
  { label: "Svalbard và Jan Mayen", value: "SJ" },
  { label: "Thụy Điển", value: "SE" },
  { label: "Thụy Sĩ", value: "CH" },
  { label: "Syria", value: "SY" },
  { label: "Đài Loan", value: "TW" },
  { label: "Tajikistan", value: "TJ" },
  { label: "Tanzania", value: "TZ" },
  { label: "Thái Lan", value: "TH" },
  { label: "Timor-Leste", value: "TL" },
  { label: "Togo", value: "TG" },
  { label: "Tokelau", value: "TK" },
  { label: "Tonga", value: "TO" },
  { label: "Trinidad và Tobago", value: "TT" },
  { label: "Tunisia", value: "TN" },
  { label: "Thổ Nhĩ Kỳ", value: "TR" },
  { label: "Turkmenistan", value: "TM" },
  { label: "Turks và Caicos Islands", value: "TC" },
  { label: "Tuvalu", value: "TV" },
  { label: "Uganda", value: "UG" },
  { label: "Ukraine", value: "UA" },
  { label: "Các Tiểu vương quốc Ả Rập Thống nhất", value: "AE" },
  { label: "Vương quốc Anh", value: "GB" },
  { label: "Hoa Kỳ", value: "US" },
  { label: "United States Minor Outlying Islands", value: "UM" },
  { label: "Uruguay", value: "UY" },
  { label: "Uzbekistan", value: "UZ" },
  { label: "Vanuatu", value: "VU" },
  { label: "Venezuela", value: "VE" },
  { label: "Việt Nam", value: "VN" },
  { label: "British Virgin Islands", value: "VG" },
  { label: "U.S. Virgin Islands", value: "VI" },
  { label: "Wallis và Futuna", value: "WF" },
  { label: "Western Sahara", value: "EH" },
  { label: "Yemen", value: "YE" },
  { label: "Zambia", value: "ZM" },
  { label: "Zimbabwe", value: "ZW" },
];