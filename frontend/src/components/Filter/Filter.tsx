import React, { useEffect } from "react";
import useTaskStore from "../../Store/taskStore";
import {
  Button,
  Checkbox,
  DatePicker,
  Select,
  SelectProps,
  Space,
  Tooltip,
  message,
} from "antd";
import { dateOptions, priorityOptions, statusOptions } from "../Task/utils";
import { FilterType } from "../Task/Types/types";
import {
  CalendarOutlined,
  FlagOutlined,
  CheckCircleOutlined,
  TagOutlined,
  CheckOutlined,
  CloseOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import dayjs from "dayjs";
import { userAPI } from "../../Api";
import useAuthStore from "../../Store/authStore";
import { useMutation } from "react-query";

interface FilterProps {
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
}

export const initialFilterValue: FilterType = {
  dueDateShortCuts: [],
  dueDate: "",
  tags: [],
  priority: "",
  status: [],
};

const Filter: React.FC<FilterProps> = ({ setShowFilter }) => {
  const tags = useTaskStore((state) => state.tags);

  const { updateFilter, filter } = useTaskStore();
  const userId = useAuthStore((state) => state?.user?._id);

  // here first check value from store backend if be null/store null then take initial value
  const [filterValues, setFilterValues] = React.useState<FilterType>(
    filter ?? initialFilterValue
  );

  useEffect(() => {
    updateFilter(filterValues);
  }, [filterValues]);

  const tagOptions: SelectProps["options"] = tags
    .map((tag) => ({
      label: (
        <span>
          <span
            style={{
              display: "inline-block",
              width: "12px",
              height: "12px",
              backgroundColor: tag.color,
              marginRight: "8px",
            }}
          />
          {tag.name}
        </span>
      ),
      value: tag.name,
    }))
    .sort((a, b) => a.label.props.children[1].localeCompare(b.label.props.children[1]));

  const handleFilterChange = (
    type: string,
    value?: string | string[]
  ): void => {
    if (type === "priority") {
      setFilterValues((prevFilterValues) => ({
        ...prevFilterValues,
        priority: value as string,
      }));
    } else if (type === "status") {
      setFilterValues((prevFilterValues) => ({
        ...prevFilterValues,
        status: value as string[],
      }));
    } else if (type === "dueDate") {
      // due date can be type of number, need to handle it in different way
      setFilterValues((prevFilterValues) => ({
        ...prevFilterValues,
        dueDate: value as string,
      }));
    } else if (type === "tag") {
      setFilterValues((prevFilterValues) => ({
        ...prevFilterValues,
        tags: value as string[],
      }));
    } else if (type === "member") {
      setFilterValues((prevFilterValues) => ({
        ...prevFilterValues,
        member: value as string[],
      }));
    }
  };

  const onChange = (checkedValues: CheckboxValueType[]) => {
    setFilterValues((prevFilterValues) => ({
      ...prevFilterValues,
      dueDateShortCuts: checkedValues,
    }));
  };

  const saveFilterMutation = useMutation(
    () => userAPI.updateFilter(userId ?? "", JSON.stringify(filterValues)),
    {
      onSuccess: () => {
        message.success("Filter saved");
        setShowFilter(false);
      },
      onError: () => {
        message.error("Failed to save filter. Please try again.");
        setShowFilter(false);
      }
    }
  );

  const saveFilter = () => {
    saveFilterMutation.mutate();
  };

  const resetFilter = () => {
    setFilterValues(initialFilterValue);
    message.success("Filter reset");
  };

  return (
    <div className="p-4">
      <div className="flex flex-row gap-4">
        <div>
          <label className="block mt-2 font-medium text-gray-700">
            <CalendarOutlined className="mr-1" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> Due Date
          </label>
          <Checkbox.Group
            className="flex flex-col gap-2 mt-1"
            options={dateOptions}
            value={filterValues.dueDateShortCuts}
            onChange={onChange}
          />
          <DatePicker
            className="mt-2"
            value={
              filterValues.dueDate === "" || filterValues.dueDate === undefined
                ? undefined
                : dayjs(filterValues.dueDate)
            }
            onChange={(value) =>
              handleFilterChange("dueDate", value ? value.toString() : "")
            }
            allowClear
          />
        </div>
        <div>
          <div>
            <label className="block mt-2 mb-1 font-medium text-gray-700">
              <FlagOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> Priority
            </label>
            <Select
              style={{ width: 110 }}
              placeholder="Priority"
              value={filterValues.priority}
              onChange={(value: string) =>
                handleFilterChange("priority", value)
              }
              optionLabelProp="label"
              options={priorityOptions}
              optionRender={(option) => <Space>{option.label}</Space>}
            />
          </div>
          <div className="w-full mt-4">
            <label className="block font-medium mb-1 text-gray-700">
              <CheckCircleOutlined className="mr-1" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              Status
            </label>
            <Select
              mode="multiple"
              style={{ width: 110 }}
              placeholder="Select Status"
              value={filterValues.status}
              onChange={(value: string[]) =>
                handleFilterChange("status", value)
              }
              optionLabelProp="label"
              options={statusOptions}
              optionRender={(option) => <Space>{option.label}</Space>}
            />
          </div>
          <div className="w-full mt-4">
            <label className="block mb-1 font-medium text-gray-700">
              <TagOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> Tag
            </label>
            <Select
              mode="multiple"
              style={{ width: 110 }}
              placeholder="Select Tag"
              value={filterValues.tags}
              onChange={(value: string[]) => handleFilterChange("tag", value)}
              optionLabelProp="label"
              options={tagOptions}
              optionRender={(option) => <Space>{option.label}</Space>}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-4 gap-2">
        <div>
          <Tooltip title="Reset Filter">
            <Button
              shape="circle"
              disabled={
                JSON.stringify(filterValues) ===
                JSON.stringify(initialFilterValue)
              }
              icon={<UndoOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              onClick={resetFilter}
            ></Button>
          </Tooltip>
        </div>
        <div className="flex gap-2">
          <Button icon={<CheckOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} onClick={saveFilter}></Button>
          <Button
            onClick={() => setShowFilter(false)}
            className="text-red-400"
            icon={<CloseOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
