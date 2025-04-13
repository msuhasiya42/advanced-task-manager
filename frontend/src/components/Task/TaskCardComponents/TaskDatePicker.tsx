import React from "react";
import { Badge, DatePicker, Popover } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface TaskDatePickerProps {
    dueDate: string;
    showDatePicker: boolean;
    setShowDatePicker: (value: boolean) => void;
    getDateColor: () => "success" | "error" | "warning" | "processing";
    indianTime: string;
    done: boolean;
    isPastDue: boolean;
    handleDateChange: (date: dayjs.Dayjs | null, dateString: string) => void;
    editAccessToCurrentUser: boolean;
}

/**
 * Component for displaying and editing the task due date
 */
const TaskDatePicker: React.FC<TaskDatePickerProps> = ({
    dueDate,
    showDatePicker,
    setShowDatePicker,
    getDateColor,
    indianTime,
    done,
    isPastDue,
    handleDateChange,
    editAccessToCurrentUser,
}) => {
    const datePickerContent = (
        <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            style={{ padding: '12px', backgroundColor: '#1f2937', borderRadius: '8px' }}
        >
            <DatePicker
                onChange={handleDateChange}
                defaultValue={dayjs(dueDate)}
                allowClear={false}
                format="YYYY-MM-DD"
                className="dark-datepicker"
                style={{
                    backgroundColor: '#374151',
                    color: 'white',
                    borderColor: '#4B5563',
                    borderRadius: '6px',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                }}
                popupStyle={{
                    backgroundColor: '#1f2937',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
                }}
                autoFocus
            />
        </div>
    );

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <Popover
                content={datePickerContent}
                trigger="click"
                open={showDatePicker}
                onOpenChange={(visible) => {
                    setShowDatePicker(visible);
                    // Reset event handlers when popover closes
                    if (!visible) {
                        setTimeout(() => {
                            const datePickerDropdown = document.querySelector('.ant-picker-dropdown');
                            if (datePickerDropdown) {
                                datePickerDropdown.remove();
                            }
                        }, 100);
                    }
                }}
                overlayStyle={{ zIndex: 1050 }}
                destroyTooltipOnHide
            >
                <Badge
                    status={getDateColor()}
                    text={
                        <button
                            className={`text-xs flex items-center ${done ? 'text-green-400' : isPastDue ? 'text-red-400' : 'text-gray-400'} hover:text-white transition-colors disabled:opacity-50`}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (editAccessToCurrentUser) {
                                    setShowDatePicker(true);
                                }
                            }}
                            disabled={!editAccessToCurrentUser}
                        >
                            <CalendarOutlined className="mr-1" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            {indianTime}
                        </button>
                    }
                />
            </Popover>
        </div>
    );
};

export default TaskDatePicker; 