import { Empty } from "antd";
import React from "react";

const NoData = ({ name }: { name: string }) => {
  return (
    <div className="flex justify-center mb-4">
      <Empty
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        imageStyle={{ height: 60 }}
        description={<span className="text-white">No {name}</span>}
      ></Empty>{" "}
    </div>
  );
};

export default NoData;
