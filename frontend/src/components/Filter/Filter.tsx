import React, { useEffect } from "react";
// import { members } from "../../utils/data/static";
import useTagStore from "../../Zustand/tagStore";
import { Card, Checkbox, Select, SelectProps, Space } from "antd";
import useAuthStore from "../../Zustand/authStore";

const Filter = () => {
  const tags = useTagStore((state) => state.tags);

  const [showFilter, setShowFilter] = React.useState(false);

  const [filterValues, setFilterValues] = React.useState({
    dueDate: [],
    tag: [],
    member: [],
  });

  useEffect(() => {
    // setFilterValues({
    //   dueDate: [],
    //   tag: [],
    //   member: [],
    // });
  }, [filterValues]);

  const tagOptions: SelectProps["options"] = tags.map((tag) => {
    return {
      label: tag,
      value: tag,
    };
  });

  const allUsers = useAuthStore((state) => state?.allUsers);
  const user = useAuthStore((state) => state.user);
  const otherMembers = allUsers?.filter(
    (member) => member._id !== user?.userId
  );

  const membersOptions: SelectProps["options"] = otherMembers?.map((user) => {
    return {
      key: user._id,
      label: user.name,
      value: user._id,
    };
  });

  return (
    <>
      <div
        onClick={() => setShowFilter(!showFilter)}
        className="font-bold flex flex-row justify-center items-center m-1 btn-sm w-20 rounded-md btn-primary hover:cursor-pointer"
      >
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
            />
          </svg>
        </div>
        <div className="ml-1 pr-1 text-sm uppercase">Filter</div>
      </div>
      {showFilter && (
        <Card
          title="Filter"
          className="absolute"
          bordered={false}
          style={{
            float: "left",
            width: 450,
            marginTop: "50px",
            backgroundColor: "#e8e6e6",
          }}
        >
          <div className="form-control flex flex-row text-xs">
            <div className="">
              <label className="cursor-pointer label text-gray-500" htmlFor="">
                Due Date
              </label>
              <Checkbox value="Today">Today</Checkbox>
              <Checkbox value="Tommorrow">Tommorrow</Checkbox>
              <Checkbox value="Overdue">Overdue</Checkbox>
            </div>

            <div className="ml-3">
              <label className="cursor-pointer label text-gray-500" htmlFor="">
                Members
              </label>
              <Select
                mode="multiple"
                style={{ width: 110 }}
                placeholder="Select Members"
                defaultValue={[]}
                // onChange={handleChange}
                optionLabelProp="label"
                options={membersOptions}
                optionRender={(member) => <Space>{member.label}</Space>}
              />
            </div>

            <div className="ml-8 mr-2">
              <label className="cursor-pointer label text-gray-500" htmlFor="">
                Tags
              </label>
              <Select
                mode="multiple"
                style={{ width: 110 }}
                placeholder="Select Tag"
                defaultValue={[]}
                // onChange={handleChange}
                optionLabelProp="label"
                options={tagOptions}
                optionRender={(option) => <Space>{option.label}</Space>}
              />
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default Filter;
