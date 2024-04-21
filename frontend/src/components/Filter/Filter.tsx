import React, { useEffect, useRef } from "react";
// import { members } from "../../utils/data/static";
import useTaskStore from "../../Zustand/taskStore";
import {
  Card,
  Checkbox,
  DatePicker,
  Select,
  SelectProps,
  Space,
  Tooltip,
} from "antd";
import useAuthStore from "../../Zustand/authStore";
import { dummyProfile } from "../../utils/strings";
import { taskPriorities } from "../Task/utils";

// separate out the type into types.ts
interface FilterType {
  dueDate: string[];
  tags: string[];
  members: string[];
  sortBy: string;
}
const Filter = () => {
  const tags = useTaskStore((state) => state.tags);

  const [showFilter, setShowFilter] = React.useState(false);
  const filterRef = useRef<HTMLDivElement>(null); // Ref for the filter card

  const [filterValues, setFilterValues] = React.useState<FilterType>({
    dueDate: [],
    tags: [],
    members: [],
    sortBy: "",
  });

  useEffect(() => {
    // Function to handle click outside of the filter card
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
    };

    // Add event listener when component mounts
    document.addEventListener("mousedown", handleClickOutside);
    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);

  useEffect(() => {
    // setFilterValues({
    //   dueDate: [],
    //   tag: [],
    //   member: [],
    // });
  }, [filterValues]);

  const tagOptions: SelectProps["options"] = tags
    .map((tag) => {
      return {
        label: tag,
        value: tag,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const priorities: SelectProps["options"] = taskPriorities.map((priority) => {
    return {
      label: priority,
      value: priority,
    };
  });
  const user = useAuthStore((state) => state.user);
  const allUsers = useAuthStore((state) => state.allUsers);
  const otherMembers = allUsers
    ?.filter((member) => member._id !== user?.userId)
    .sort((a, b) => a.name.localeCompare(b.name));

  const maxChar = 10;

  const handleFilterChange = (
    type: string,
    value?: string | string[]
  ): void => {
    if (type === "sortBy") {
      setFilterValues((prevFilterValues) => ({
        ...prevFilterValues,
        sortBy: value as string,
      }));
    } else if (type === "dueDate") {
      // due date can be type of number, need to handle it in different way
      setFilterValues((prevFilterValues) => ({
        ...prevFilterValues,
        dueDate: [...prevFilterValues.dueDate, value as string],
      }));
    } else if (type === "tag") {
      setFilterValues((prevFilterValues) => ({
        ...prevFilterValues,
        tag: value as string[],
      }));
    } else if (type === "member") {
      setFilterValues((prevFilterValues) => ({
        ...prevFilterValues,
        member: value as string[],
      }));
    }

    console.log("filterChange", type, value, filterValues);
  };

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
            width: 500,
            marginTop: "40px",
            backgroundColor: "#e8e6e6",
          }}
          ref={filterRef}
        >
          <div className="form-control flex flex-row text-xs">
            <div className="">
              <label className="cursor-pointer label text-gray-700" htmlFor="">
                Due Date
              </label>
              <Checkbox value="Today">Today</Checkbox>
              <Checkbox value="Tommorrow">Tommorrow</Checkbox>
              <Checkbox value="Overdue">Overdue</Checkbox>
              <DatePicker
                onChange={(value) =>
                  handleFilterChange("dueDate", value?.toString())
                }
              />
            </div>

            <div className="ml-3">
              <label className="cursor-pointer label text-gray-700" htmlFor="">
                Members
              </label>
              <Select
                mode="multiple"
                style={{ width: 150 }}
                placeholder="Select Members"
                onChange={(value: string[]) =>
                  handleFilterChange("member", value)
                }
                defaultValue={filterValues.members}
              >
                {otherMembers?.map((member: any) => {
                  const nameLen = member.name.length;
                  const name =
                    nameLen > maxChar
                      ? member.name.slice(0, maxChar) + "..."
                      : member.name;
                  return (
                    <Select.Option key={member._id} value={member._id}>
                      <Tooltip title={nameLen > maxChar ? member.name : ""}>
                        <div className="flex">
                          <img
                            src={member.picture ?? dummyProfile}
                            alt={member.name}
                            className="w-6 rounded-xl mr-2"
                          />
                          <span>{name}</span>
                        </div>
                      </Tooltip>
                    </Select.Option>
                  );
                })}
              </Select>

              <label className="cursor-pointer label text-gray-700" htmlFor="">
                Sort By
              </label>
              <Select
                style={{ width: 110 }}
                placeholder="Sort By"
                defaultValue={
                  filterValues.sortBy === "" ? undefined : filterValues.sortBy
                }
                onChange={(value: string) =>
                  handleFilterChange("sortBy", value)
                }
                optionLabelProp="label"
                options={priorities}
                optionRender={(option) => <Space>{option.label}</Space>}
              />
            </div>

            <div className="ml-8 mr-2">
              <label className="cursor-pointer label text-gray-700" htmlFor="">
                Tags
              </label>
              <Select
                mode="multiple"
                style={{ width: 110 }}
                placeholder="Select Tag"
                defaultValue={filterValues.tags}
                onChange={(value: string[]) => handleFilterChange("tag", value)}
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
