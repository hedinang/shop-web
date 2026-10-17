import { Avatar } from "antd";
import { getAvatar, getColor, getColorFromInitial } from "../../utils/Utils";

const CustomAvatar = ({ person }) => {
  return (
    <div className="relative">
      <Avatar
        style={{
          backgroundColor: getColorFromInitial(
            person?.name?.[0] || person?.username?.[0]
          ),
          color: getColor(person?.name?.[0] || person?.username?.[0]),
        }}
        size={40}
        src={person?.avatar ? getAvatar(person) : null}
      >
        {person?.name?.[0] || person?.username?.[0]}
      </Avatar>
      {person?.online ? <div className="online"></div> : <></>}
    </div>
  );
};
export { CustomAvatar };
