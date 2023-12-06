/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */


// @mui material components
import Icon from "@mui/material/Icon";
import { IconButton, Input } from "@mui/material";

// DocuIt React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import Switch from '@mui/material/Switch';
import { AnimatedIconButton, AnimatedIconEditButton } from "./AnimatedIconButton";

export default function useProjectsTableData(rows, updateCategory, handleSave, handleEditRow, handleCancel, tempRowData, editingId, setEditingId, images) {

  const Category = ({ id, image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" variant="rounded" />
      <Input autoFocus={editingId === id} required={true} disableUnderline={editingId !== id} readOnly={editingId !== id} value={editingId === id ? tempRowData?.categoryName : name} sx={{ marginLeft: 1, fontWeight: 'bold', width:'350px' }} onChange={updateCategory}/>
    </MDBox>
  )

  const prepareRow = ({ id, categoryName, categoryImage, status, handleEdit, isNew }, index) => {

    return {
      categoryName: <Category id={id} image={categoryImage} editingId={editingId} name={categoryName} />,
      status: (
        <MDTypography component="a" href="#" color="text"
        >
          <Switch checked={status} color="success"/>
        </MDTypography>
      ),
      action: editingId === id ? (
        <MDBox display="flex" gap={0}>
          <AnimatedIconButton>
            <IconButton onClick={() => {
              handleSave(id);
            }}>
              <Icon fontSize="large" color="success">done</Icon>
            </IconButton>
          </AnimatedIconButton>
          <AnimatedIconButton>
            <IconButton onClick={() => handleCancel(id)}>
              <Icon fontSize="large" color="error">cancel</Icon>
            </IconButton>
          </AnimatedIconButton>
        </MDBox>
      ) : (
        <AnimatedIconEditButton>
          <IconButton onClick={() => handleEditRow(id, { categoryName, categoryImage, status, isNew: false })}>
            <Icon fontSize="large" color="secondary">edit_note</Icon>
          </IconButton>
        </AnimatedIconEditButton>
      ),
    }
  }

  console.count('rendering projectTableData')

  return {
    columns: [
      { Header: "category name", accessor: "categoryName", width: "30%", align: "left" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "Edit", accessor: "action", align: "center" },
    ],
    rows: rows?.length ? rows.map(prepareRow) : []
  }
};



