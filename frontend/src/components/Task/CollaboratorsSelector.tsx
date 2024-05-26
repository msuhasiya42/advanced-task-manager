import React from "react";
import { Select, Row, Col, Avatar } from "antd";
import useAuthStore from "../../Store/authStore";
import { Collaborator } from "./Types/types";
import { lightColors } from "./utils";

const { Option } = Select;

interface CollaboratorsSelectorProps {
  collaborators: Collaborator[];
  setCollaborators: (collaborators: Collaborator[]) => void;
  canEdit: boolean;
}

const CollaboratorsSelector = ({ collaborators, setCollaborators, canEdit }: CollaboratorsSelectorProps) => {
  const { allUsers, user } = useAuthStore();

  const handleUserChange = (selectedUsers: string[]) => {
    const newCollaborators = selectedUsers.map(userId => {
      const existingCollaborator = collaborators.find(collab => collab.user._id === userId);
      const permission: 'read' | 'edit' | 'admin' = existingCollaborator?.permissionType ?? 'read';
      return existingCollaborator ?? {
        user: {
          _id: userId,
          name: allUsers?.find(user => user._id === userId)?.name,
          picture: allUsers?.find(user => user._id === userId)?.picture,
        }, permissionType: permission
      };
    });
    setCollaborators(newCollaborators);
  };

  const handlePermissionChange = (userId: string, permissionType: 'read' | 'edit' | 'admin') => {
    const updatedCollaborators = collaborators.map(collab =>
      collab.user._id === userId ? { ...collab, permissionType } : collab
    );
    setCollaborators(updatedCollaborators);
  };

  return (
    <div>
      <Select
        mode="multiple"
        allowClear
        placeholder="Select collaborators"
        value={collaborators?.length > 0 ? collaborators.map(collab => collab.user._id) : []}
        onChange={handleUserChange}
        style={{ width: "100%" }}
        disabled={!canEdit || collaborators.some((collab) => collab.user._id === user?._id)}
      >
        {allUsers?.map(u => (
          <Option key={u._id} value={u._id} disabled={u._id === user?._id}>
            <span className="flex">
              <img
                src={u.picture}
                alt={u.name}
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  marginRight: "8px",
                }}
              />
              {u.name}{u._id === user?._id ? "(You)" : ""}
            </span>
          </Option>
        ))}
      </Select>

      {/* show collaborators list */}
      <div style={{ marginTop: "16px" }}>
        {collaborators?.length > 0 && collaborators.map((collab, index) => (
          <Row key={collab.user._id} className="mt-2 ml-1 p-2 items-center rounded-md" style={{ backgroundColor: lightColors[index % lightColors.length] }}
          >
            <Col span={12}>
              <span className="flex items-center">
                <Avatar
                  src={allUsers?.find(user => user._id === collab.user._id)?.picture}
                  alt={collab.user.name}
                  className="rounded-full m-2 border-blue-500 "
                />
                <p>
                  {allUsers?.find(user => user._id === collab.user._id)?.name} {user?._id === collab.user._id ? "(You)" : ""}
                </p>
              </span>
            </Col>
            <Col span={12}>
              <Select
                disabled={!canEdit || user?._id === collab.user._id}
                value={collab.permissionType}
                onChange={value => handlePermissionChange(collab.user._id, value)}
                className="w-full"
              >
                <Option value="read">Read</Option>
                <Option value="edit">Edit</Option>
              </Select>
            </Col>
          </Row>
        ))}
      </div>
    </div>
  );
};

export default CollaboratorsSelector;
