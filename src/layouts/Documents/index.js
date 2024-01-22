import { useAuth } from "context/AuthContext";
import React, { useEffect, useRef, useState } from "react";
import { UsercategoryList } from "services";
import { Alert, Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { FormControl, Icon, Backdrop, Modal, Paper, Tooltip, Typography, Slide, Snackbar, Radio } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Grid } from "react-loader-spinner";
import { saveDocuments, uploadDocuments, deleteDocument } from "services";
import { pdfjs } from "react-pdf";
import { Link, useLocation } from "react-router-dom";
import { findUser } from "services";
import { updateDocument } from "services";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { getFamilyWithMembers } from "services";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { getDocumentDetails } from "services";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import NoDocumentsFoundImage from "assets/images/No_Documents_Found.webp";
import { DOCUIT_DOCUMENT_SCREEN } from 'utilities/strings';


const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    content: "none",
  },
}));


const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))

  (({ theme }) => ({
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, .05)"
        : "rgba(0, 0, 0, .03)",
    flexDirection: "row-reverse",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(90deg)",
    },
    "& .MuiAccordionSummary-content": {
      marginLeft: theme.spacing(1),
    },
  }));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

function arrayEquals(arr1, arr2) {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}

function Documents() {
  const { UserData, ListFamily, countSuccess, countUnSuccess } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [LifeData, setLifeData] = useState([]);
  const [targetCategory, setTargetCategory] = useState("");
  const [openMove, setopenMove] = useState(false);
  const [openAfterShare, setOpenAfterShare] = useState(false);
  const [catListdata, setcatListdata] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFile, setmoveSelect] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDocumentId, setDeleteDocumentId] = useState([]);
  const [selectedFamilies, setSelectedFamilies] = useState([]);
  // const [selectedMembers, setSelectedMembers] = useState({});
  const [familydata, setFamilydata] = useState([]);
  const [uploadFile, setUploadFile] = useState({});

  // Sharedocuments
  const [openShare, setopenShare] = useState(false);
  const [FamilyListWithMembers, setFamilyListWithMembers] = useState([]);
  const [FamilyMembers, setFamilyMembers] = useState([]);
  const [docDetails, setDocDetails] = useState([]);
  let [expandedFamilies, setExpandedFamilies] = useState([]);
  let [selectedFamilyIds, setSelectedFamilyIds] = useState([]);
  let [unselectedfamilyIds, setUnselectedFamilyIds] = useState([]);
  let [addMembers, setAddMembers] = useState([]);
  let [revokeMembers, setRevokeMembers] = useState([]);
  const [memberData, setMembersData] = useState([]);

  // snackbar.
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");

  const location = useLocation();
  const category = location.state?.category;
  const currentCategory = category.categoryId;
  console.log("props", location);
  const userId = UserData?.id;

  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

  // useref for Image uplaod
  const inputFileRef = useRef();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    transition: "transform 0.3s cubic-bezier(0.2, 1, 0.0, 0.0)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 20,
    borderRadius: 5,
    border: "none",
    p: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  useEffect(() => {
    fetchData();
    handleShareDoc();
  }, [userId, category]);

  const fetchData = (async () => {
    try {
      const categoryId = category.categoryId;
      console.log("categoryIds >>>>", category);
      const values = { userId, categoryId };

      const { data } = await UsercategoryList(values);
      console.log("data Usercategory : ", data);
      if (data.status === "SUCCESS") {
        setLifeData(data?.response?.documentDetailsList);
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  });

  const handleFileChange = async (event) => {
    let files;
    try {
      setIsLoading(true);
      console.log("function called");
      files = Object.values(event.target.files);
      console.log("Selected files", files);

      if (!files || files.length === 0) {
        throw new Error("No files selected. Please choose PDF files.");
      }

      let validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
      // console.log("filterList:: ::::::::", validFiles);
      let invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);
      // console.log("invalidFiles:: ::::::::", invalidFiles);

      if (validFiles && validFiles.length !== 0 && files.length <= 5) {
        for (let index = 0; index < validFiles.length; index++) {
          await handleUploadDocument(validFiles[index], (validFiles.length - 1 === index), invalidFiles, validFiles.length);
        }
      }
      else if (validFiles.length === 0 && invalidFiles !== 0) {
        throw new Error(`Unable to upload ${invalidFiles.length} document${invalidFiles.length > 1 ? 's' : ''} because file size exceeds 5MB.`);
      }

      else {
        throw new Error(DOCUIT_DOCUMENT_SCREEN.document_filesize_warning);
      }
    }
    catch (error) {
      console.error(error.message ?? DOCUIT_DOCUMENT_SCREEN.document_upload_error);
      handleSnackbarOpen(error.message ?? DOCUIT_DOCUMENT_SCREEN.document_upload_error, 'error');
      setIsLoading(false);
    }
  };

  const handleUploadDocument = async (uploadfile, lastFileIndex, invalidFiles, validfilesLength) => {
    try {
      const bodyFormData = new FormData();
      bodyFormData.append(`file`, uploadfile);
      console.log("bodyformdata for file", bodyFormData);

      const { data } = await uploadDocuments(userId, bodyFormData);

      if (data) {
        const params = {
          documentDetails: [
            {
              documentName: data.fileName,
              documentUrl: data.documentUrl,
              documentSize: data.size,
              documentType: data.fileType,
            },
          ],
          categoryId: category.categoryId,
          uploadedBy: userId,
        };

        const documentSave = await saveDocuments(params);

        if (documentSave.status === 200 && documentSave?.data?.response) {
          const responseData = documentSave?.data?.response[0];
          const { id, documentName, documentSize, documentType, url } =
            responseData;

          const documentDetails = {
            documentId: id,
            documentName,
            documentSize,
            documentType,
            url,
          };
          countSuccess();
          setLifeData((prevLifeData) => [...prevLifeData, documentDetails]);
          console.log("uploadData", [...LifeData, documentDetails]);
          fetchData();
          setOpenAfterShare(true);
          localStorage.setItem('uploadApiSuccess', 'true')

          if (lastFileIndex) {
            console.log("documentDetails'.'.'.'.'.'.'.'.", documentDetails);
            setUploadFile(documentDetails);
            handleSnackbarOpen(`${validfilesLength} document${validfilesLength > 1 ? 's' : ''} uploaded successfully`, 'success');
            fetchData();
            setOpenAfterShare(true);

            if (invalidFiles?.length !== 0) {
              setTimeout(() => {
                handleSnackbarOpen(`Unable to upload ${invalidFiles.map(item => `'${item.name}'`).join(', ')} due to size exceeding 5MB.`, 'warning');
              }, 3000)
            }
          }
        }
      }

    }
    catch (error) {
      console.error(error.message ?? "File upload error, retry");
      handleSnackbarOpen(error.message ?? DOCUIT_DOCUMENT_SCREEN.document_upload_error, 'error');
      countUnSuccess();
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleAfterUpload = () => {
    setOpenAfterShare(false);
    console.log('selectedFile>>>>>>>>>>>', uploadFile)
    handleShare(uploadFile);
    setopenShare(true);

  }

  const handleClose = () => {
    setopenMove(false);
    setopenShare(false);
    setOpenAfterShare(false);
    setopenShare("");
  };

  const handleMove = async (item) => {
    setIsLoading(true);
    if (!item || !targetCategory) {
      handleSnackbarOpen(DOCUIT_DOCUMENT_SCREEN.document_move_selectfile_error, 'error');
      return;
    } else {
      try {
        const userId = UserData?.id;
        const params = {
          familyId: [
            // item.familyId
          ],
          documentId: item.documentId,
          categoryId: targetCategory,
          revokeAccess: [],
          provideAccess: [],
          documentName: item.documentName,
          updatedBy: userId,
        };

        const { data } = await updateDocument(params);
        console.log('updateDocument"""""":', data);
        if (data.status === 'SUCCESS') {
          setopenMove(false);
          setTimeout(() => {
            setIsLoading(false);
            handleSnackbarOpen(DOCUIT_DOCUMENT_SCREEN.document_move_success, 'success');
          }, 1000);
          fetchData();
        }
      } catch (error) {
        console.error("Error Upload Docs:", error);
        setTimeout(() => {
          setIsLoading(false);
          handleSnackbarOpen(DOCUIT_DOCUMENT_SCREEN.document_move_error, 'error');
        }, 1000);
      }
    }
  }

  const handleMovePop = async (item) => {
    console.log("item>>>>>>>>>sas", item.documentId);
    setopenMove(true);
    setmoveSelect(item.documentId);
    setTargetCategory("");
    try {
      const userId = UserData?.id;
      const { data } = await findUser(userId);
      if (data?.response?.categoryDetails) {
        console.log('findUserdata', data)
        const extractedData = data.response.categoryDetails.map((categoryDetails) => ({
          categoryId: categoryDetails.categoryId,
          categoryName: categoryDetails.categoryName,
          fileCount: categoryDetails.fileCount
        }));
        countSuccess();
        localStorage.setItem('moveApiSuccess', 'true');
        setcatListdata(extractedData);
      }
    } catch (err) {
      console.error("API call failed:", err);
      countUnSuccess();
    }
  }
  console.log("LifeData::", LifeData);

  const handleDelete = async (documentId) => {
    try {
      setIsLoading(true);
      console.log("Item>>>", documentId);
      const DocumentId = documentId.documentId;
      const { data } = await deleteDocument(DocumentId);
      if (data) {
        countSuccess();
        localStorage.setItem('deleteApiSuccess', 'true');
        const lifedata = LifeData.filter((card) => card.documentId !== DocumentId)
        setLifeData(lifedata)
        console.log("lifes", lifedata);
        setTimeout(() => {
          setIsLoading(false);
          handleSnackbarOpen(DOCUIT_DOCUMENT_SCREEN.document_delete_success, 'success');
        }, 1000);

      }
    } catch (err) {
      console.error("Error Upload Docs:", err);
    } finally {
      setDeleteDialogOpen(false);
      setDeleteDocumentId(null);
    }
  };

  const handleViewPdf = (docDetails) => {
    const pdfUrl = docDetails.documentUrl;
    window.open(pdfUrl, "_blank");
  };

  const handleDownloadPDF = (docDetails) => {
    const PDFurl = docDetails.documentUrl;
    // console.log("PDFURL", PDFurl);
    const documentName = docDetails.documentName;
    fetch("https://cors-anywhere.herokuapp.com/" + PDFurl, {
      method: "GET",
      headers: {
        "Content-Type": "application/pdf",
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));

        const link = document.createElement("a");
        link.href = url;
        link.download = documentName;

        document.body.appendChild(link);

        link.click();

        link.parentNode.removeChild(link);
      });
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    // If the text is longer than maxLength, truncate and add ellipsis
    return `${text.slice(0, maxLength)}...`;
  };
  console.log("ListFamily???", ListFamily);


  // Get the saved document details to update document details (i.e) To share or unshare etc.,
  const getDocumentDetailsById = async (document) => {
    // console.log('getDocumentDetails==========>>.><<<<>>><///', document.documentId)
    try {
      let response = await getDocumentDetails(document.documentId);
      console.log('response==>getDocumentDetails_____))____)_)_)_)))_', (response.data))
      if (response.data.code === 200) {
        let memberIdArray = response.data.response.memberIds;
        setAddMembers(memberIdArray);
        setMembersData(memberIdArray);
        // console.log(">>>>>>>1>>>>>", memberIdArray);
        setFamilydata([...new Set(response.data.response.sharedDetails.map(item => item.member.family.id))])
        console.log(familydata);
        setSelectedFamilyIds([
          ...new Set(
            response.data.response.sharedDetails
              .filter((filterItem) => filterItem.user.id !== userId)
              .map((item) => item.member.family.id)
          ),
        ]);

      }
    } catch (error) {
      console.error("Error in listFamilyMembers:", error);

    }
    finally {
      setIsLoading(false);
    }
  };
  console.log("this is revoked>>>>>>>>", revokeMembers);

  // SHAREDOCS
  const handleShare = async (docDetails) => {
    console.log("docDetails::::::::::::", docDetails);
    setopenShare(true);
    setDocDetails(docDetails);
    try {
      getDocumentDetailsById(docDetails);
      const { data } = await getFamilyWithMembers(userId);
      console.log(" getDocumentDetailsById???????????", data);
      if (data.status === "SUCCESS") {
        const getFamilyWithMembers = data.response.familyListWithMembers.map(
          (familyListWithMembers) => ({
            id: familyListWithMembers.id,
            name: familyListWithMembers.name,
            membersList: familyListWithMembers.membersList.map((member) => ({
              id: member.id,
              inviteStatus: member.inviteStatus,
              status: member.status,
              user: {
                id: member.user.id,
                name: member.user.name,
                phone: member.user.phone,
              },
            })),
          })
        );
        setFamilyListWithMembers(getFamilyWithMembers);

        const allFamilyMembers = data.response.familyListWithMembers.reduce(
          (members, family) => {
            return members.concat(family.membersList);
          }, []);
        const familyMembers = allFamilyMembers.map((member) => ({
          id: member.id,
          name: member.user.name,
          phone: member.user.phone,
        }));
        setFamilyMembers(familyMembers);
        try {
          const documentId = docDetails.documentId;
          const { data } = await getDocumentDetails(documentId);
          if (data.status === "SUCCESS") {
            console.log("getDocumentDetailsAPIIIIIIIIIIIII", data);
          }
        } catch (error) {
          console.error("Error while getDocumentDetails", error);
        }
      }
    } catch (error) {
      console.error("Error while ListFamilyMembers", error);
    }
  };

  console.log(FamilyMembers);

  const openDeleteDialog = (documentId) => {
    setDeleteDocumentId(documentId);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteDocumentId(null);
  };

  const formatDate = (dateString) => {
    const documentDate = new Date(dateString);
    const day = documentDate.getDate();
    const month = documentDate.toLocaleString("en-US", { month: "long" });
    const year = documentDate.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const handleFamilyChange = (familyIndex, familyDetail) => () => {
    // Toggle the selected family
    const isSelected = selectedFamilies.includes(familyIndex);
    setSelectedFamilies((prevSelected) => isSelected ? prevSelected.filter((index) => index !== familyIndex) : [...prevSelected, familyIndex]);
    // Update unselectedFamilyIds based on the checkbox state
    setUnselectedFamilyIds((prevUnselected) => isSelected ? [...prevUnselected, familyIndex] : prevUnselected.filter((index) => index !== familyIndex))

    // Assuming you have some state to track expanded families
    const newExpandedFamilies = [...expandedFamilies];

    if (isExpanded) {
      // If the Accordion is expanded, add the familyIndex to the list
      newExpandedFamilies.push(familyIndex);
    } else {
      // If the Accordion is collapsed, remove the familyIndex from the list
      const indexToRemove = newExpandedFamilies.indexOf(familyIndex);
      if (indexToRemove !== -1) {
        newExpandedFamilies.splice(indexToRemove, 1);
      }
    }
    // Update the state to reflect the changes
    setExpandedFamilies(newExpandedFamilies);
  };

  const handleMemberChange = (familyIndex, memberId, familyDetail) => (e) => {
    let membersList = familyDetail.membersList.filter(
      (filterItem) => filterItem.user.id !== userId
    );
    console.log('membersList', membersList, addMembers);

    if (addMembers.includes(`${memberId}`)) {
      console.log("this if is called 1", "handleMemberChange");

      setAddMembers((prev) =>
        prev.filter((filterItem) => filterItem !== memberId)
      );

      let value = memberData.filter((itm) => itm.id !== `${memberId}`);

      if (value.includes(`${memberId}`)) {
        console.log("if this is called members are revoked", "handleMemberChange");

        setRevokeMembers((prevRevokeMembers) => [
          ...prevRevokeMembers,
          `${memberId}`,
        ]);

        setSelectedFamilyIds((prev) =>
          prev.filter((selectedFamilyId) => selectedFamilyId !== familyDetail.id)
        );
        setUnselectedFamilyIds((prev) => [...prev, familyDetail.id]);
      }

      console.log(">>>>>>>>>", value, value.length);

      if (value.length === 0 && selectedFamilyIds.includes(familyDetail.id)) {
        console.log("this if is called 3", "handleMemberChange", familyDetail.id);

        setSelectedFamilyIds((prev) =>
          prev.filter((selectedFamilyId) => selectedFamilyId !== familyDetail.id)
        );
        setUnselectedFamilyIds((prev) => [...prev, familyDetail.id]);

        setRevokeMembers((prev) =>
          prev.filter((filterItem) => filterItem !== memberId)
        );
      }

      let isCheckWholeFamily = membersList.length && membersList.every((memberItem) => addMembers.includes(memberItem.id));

      if (isCheckWholeFamily) {
        setSelectedFamilyIds((prev) => [...prev, familyDetail.id]);
        setUnselectedFamilyIds((prev) => prev.filter((unSelectedFamilyId) => unSelectedFamilyId !== familyDetail.id));
      }
    }
    else {
      console.log("this else is called", "handleMemberChange");

      addMembers = [...addMembers, `${memberId}`];
      setAddMembers(addMembers);

      setRevokeMembers((prev) =>
        prev.filter((filterItem) => filterItem !== memberId)
      );

      let isCheckWholeFamily =
        membersList.length &&
        membersList.every((memberItem) => addMembers.includes(memberItem.id));

      if (isCheckWholeFamily) {
        setSelectedFamilyIds((prev) => [...prev, familyDetail.id]);
        setUnselectedFamilyIds((prev) => prev.filter((unSelectedFamilyId) => unSelectedFamilyId !== familyDetail.id));
      }

      if (!selectedFamilyIds.includes(familyDetail.id)) {
        setSelectedFamilyIds((prev) => [...prev, familyDetail.id]);
        setUnselectedFamilyIds((prev) => prev.filter((unSelectedFamilyId) => unSelectedFamilyId !== familyDetail.id))
        setRevokeMembers((prev) =>
          prev.filter((filterItem) => filterItem !== memberId)
        );
      }
    }
  };

  const isFamilySelected = (familyIndex) => {
    return selectedFamilies.includes(familyIndex);
  };


  const handleCheckboxChange = (familyDetail) => {
    let membersList = familyDetail.membersList.filter(
      (filterItem) => filterItem.user.id !== userId
    );
    console.log('membersList', membersList, addMembers)
    // let isCheckWholeFamily =
    //   membersList.length &&
    //   membersList.every((memberItem) => addMembers.includes(memberItem.id));
    let memberIds = familyDetail.membersList.map((item) => item.id);

    if (selectedFamilyIds.includes(familyDetail.id)) {
      // Family is selected, unselect it.
      const updatedFamilyIds = selectedFamilyIds.filter((id) => id !== familyDetail.id);
      const removedFamilyIds = selectedFamilyIds.filter((id) => !updatedFamilyIds.includes(id));
      const updatedMemberIds = addMembers.filter((memberId) => !memberIds.includes(memberId));
      const removedMemberIds = addMembers.filter((memberId) => !updatedMemberIds.includes(memberId));

      setAddMembers(updatedMemberIds);
      setSelectedFamilyIds(updatedMemberIds);
      setUnselectedFamilyIds(removedMemberIds)
      setRevokeMembers((prevRevokeMembers) => [...prevRevokeMembers, ...memberIds,]);
      setSelectedFamilyIds(updatedFamilyIds);
      setUnselectedFamilyIds(removedFamilyIds);
    } else {
      // Family is not selected, select it
      let updatedFamilyIds = [...selectedFamilyIds, familyDetail.id];
      const removedFamilyIds = selectedFamilyIds.filter((id) => !updatedFamilyIds.includes(id));
      let updatedMemberIds = [...addMembers, ...memberIds];

      setSelectedFamilyIds(updatedFamilyIds);
      setUnselectedFamilyIds(removedFamilyIds);
      setAddMembers(updatedMemberIds);
      setAddMembers((prev) => (prev = [...prev, ...memberIds]));
      setRevokeMembers((prevRevokeMembers) =>
        prevRevokeMembers.filter((memberId) => !memberIds.includes(memberId))
      );
    }
  };

  console.log("unSelectedFamilyIds.....", unselectedfamilyIds);

  const handleShareDoc = async () => {
    try {
      const userId = UserData?.id;
      const uniqueFamilyIdsSet = new Set([...selectedFamilyIds, ...unselectedfamilyIds]);
      const uniqueFamilyIds = [...uniqueFamilyIdsSet];
      const uniqueAddMembers = [...new Set(addMembers)];
      const uniqueRevokembers = [...new Set(revokeMembers)];
      console.log("uniqueFamilyIds..........", uniqueFamilyIds);
      console.log("revokemembers........", revokeMembers, uniqueRevokembers);
      console.log("addMembers........", addMembers, uniqueAddMembers);
      console.log("docdetialskkssssss", docDetails);
      const params = {
        familyId: uniqueFamilyIds,
        documentId: docDetails.documentId,
        categoryId: targetCategory,
        revokeAccess: uniqueRevokembers,
        provideAccess: uniqueAddMembers,
        documentName: docDetails.documentName,
        updatedBy: userId,
      };
      console.log("params>>>>>>>>>>", params);
      const { data } = await updateDocument(params);
      console.log('updateDocument"""""":', data);
      if (data.status === "SUCCESS") {
        setopenShare(false);
        console.log("data-----updateDocument", data);
      }
    } catch (err) {
      console.error("Error Upload Docs:", err);
      setIsLoading(false);
    }
  };

  const handleSnackbarOpen = (message, type) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
  };

  const handleButtonClick = () => {
    if (inputFileRef.current === 1) {
      console.log("click triggered>>>>>>>>>>>", inputFileRef.current)
      inputFileRef.current.click();
    }
  };

  return (
    <DashboardLayout className="mainContent">
      <DashboardNavbar />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={7000}
        onClose={() => setSnackbarOpen(false)}
        TransitionComponent={(props) => <Slide {...props} direction="left" />}
      >
        <Alert
          severity={snackbarType === "success" ? "success" : snackbarType === "error" ? "error" : "warning"}
          sx={{
            width: "100%",
            color: "#ffffff",
            backgroundColor: snackbarType === "success" ? "#236925" : snackbarType === "error" ? "#b92525" : "#ED6C02"
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <div className="addbtn card-head">
        {console.log("category.categoryNamee>>>>", category.categoryName)}

        <h2>{category.categoryName}</h2>

        <Button
          className="btnfamilylist"
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={handleButtonClick}
        > <input
            style={{ display: "none" }}
            ref={inputFileRef}
            id="file-upload"
            type="file"
            accept="application/pdf"
            multiple
            onChange={(e) => handleFileChange(e)}
          /> Upload Files
        </Button>

      </div>

      <Dialog open={openAfterShare} onClose={handleClose}>
        <DialogTitle>{DOCUIT_DOCUMENT_SCREEN.document_dialog_title}</DialogTitle>
        <DialogContent>{DOCUIT_DOCUMENT_SCREEN.document_sharepopup_content}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAfterUpload}>Share</Button>
        </DialogActions>
      </Dialog>

      {LifeData.length === 0 ? (
        <Card sx={{ minWidth: '100%', minHeight: '50vh', textAlign: 'center', alignItems: 'center' }}>
          <div style={{ margin: 'auto' }}>
            <img style={{ maxHeight: 100, maxWidth: 100 }} src={NoDocumentsFoundImage} alt='No_Documents_Found_Image' />
            <h2>{DOCUIT_DOCUMENT_SCREEN.document_nodocs_head}</h2>
            <span>
              {DOCUIT_DOCUMENT_SCREEN.document_nodocs_msg}
            </span>
          </div>
        </Card>
      ) : (
        <>
          <Modal
            open={openShare}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <FormControl
                sx={{
                  width: "100%",
                  overflowY: "auto",
                  maxHeight: "80vh",
                  "::-webkit-scrollbar": { width: "10%" },
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "20px",
                  }}
                >
                  <h3>Share Document</h3>
                  {!arrayEquals(addMembers, memberData) && (
                    <Button
                      variant="contained"
                      style={{ color: "white" }}
                      onClick={handleShareDoc}
                    >
                      Share
                    </Button>
                  )}
                </div>
                <div>
                  {FamilyListWithMembers.map((item, familyIndex) => (
                    <>
                      <div key={familyIndex}>
                        {/* {console.log('FamilyListwithMembers<<<<<<<<<<<', FamilyListwithMembers, selectedFamilyIds)} */}
                        <Accordion
                          onClick={(setIsExpanded)}
                          expanded={isFamilySelected(familyIndex)}
                          onChange={handleFamilyChange(familyIndex)}
                        >
                          <AccordionSummary
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <Typography>{item.name}</Typography>
                              <Typography>
                                {item.membersList &&
                                  item.membersList.length > 0 &&
                                  item.membersList.some(
                                    (member) => member.user.id !== userId
                                  ) && (
                                    <Checkbox
                                      key={item.id}
                                      type="checkbox"
                                      value={item.name}
                                      checked={
                                        item.membersList &&
                                        Array.isArray(item.membersList) &&
                                        item.membersList.length > 0 &&
                                        item.membersList
                                          .filter(
                                            (filterItem) =>
                                              filterItem.user.id !== UserData.id
                                          )
                                          .every((member) =>
                                            addMembers.includes(member.id)
                                          )
                                      }
                                      onChange={() =>
                                        handleCheckboxChange(item)
                                      }
                                    />
                                  )}
                              </Typography>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <div>
                              {item.membersList
                                .filter(
                                  (filterItem) =>
                                    filterItem.user.id !== UserData.id
                                )
                                .map((member, memberIndex) => (
                                  <div
                                    key={memberIndex}
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      flexDirection: "row-reverse",
                                    }}
                                  >
                                    <Checkbox
                                      type="checkbox"
                                      checked={addMembers.includes(member.id)}
                                      onChange={handleMemberChange(
                                        familyIndex,
                                        member.id,
                                        item
                                      )}
                                    />
                                    <p style={{ marginLeft: 25 }}>
                                      {member.user.name}
                                    </p>
                                  </div>
                                ))}
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    </>
                  ))}
                </div>
              </FormControl>
            </Box>
          </Modal>
          {LifeData.length > 0 && (
            <Box>
              <Modal
                open={openMove}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  {LifeData.map((item, index) => (
                    <>
                      {item.documentId === selectedFile && (
                        <div key={index}>
                          <div>File name: {item.documentName}</div>
                          {catListdata.map((category) => (
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                              key={category.categoryId}
                            >
                              <Radio
                                type="radio"
                                value={category.categoryId}
                                checked={targetCategory === category.categoryId}
                                onChange={() =>
                                  setTargetCategory(category.categoryId)
                                }
                                style={{
                                  display:
                                    currentCategory === category.categoryId
                                      ? "none"
                                      : "flex",
                                }}
                              />
                              <p
                                style={{
                                  display:
                                    currentCategory === category.categoryId
                                      ? "none"
                                      : "flex",
                                }}
                              >
                                {category.categoryName}
                              </p>
                            </div>
                          ))}
                          {console.log("target?????", targetCategory)}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              paddingTop: "20px",
                            }}
                          >
                            <Button
                              variant="contained"
                              style={{ color: "white" }}
                              onClick={() => handleMove(item)}
                            >
                              Move
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  ))}
                </Box>
              </Modal>
            </Box>
          )}

          {isLoading && (
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={isLoading}
            >
              <Grid color='#FCC600' />
            </Backdrop>
          )}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead style={{ display: "contents" }}>
                <TableRow>
                  <TableCell align="justify">Name</TableCell>
                  <TableCell align="center">Size</TableCell>
                  <TableCell align="center">Owner</TableCell>
                  <TableCell align="center">Created At</TableCell>
                  <TableCell align="center">Share</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {LifeData.map((item, index) => (
                  <TableRow key={index}>
                    {console.log("Tableeeeeeeee", item)}
                    <TableCell align="justify">{truncateText(item.documentName, 40)}</TableCell>
                    <TableCell align="center">
                      {item.documentSize >= 1024 * 1024
                        ? `${(item.documentSize / (1024 * 1024)).toFixed(1)}MB`
                        : item.documentSize >= 1024
                          ? `${(item.documentSize / 1024).toFixed(1)}KB`
                          : `${item.documentSize} Bytes`}
                    </TableCell>
                    <TableCell align="center">{item.uploadedByName}</TableCell>
                    <TableCell align="center">
                      {formatDate(item.createdDate)}
                    </TableCell>
                    <TableCell align="center">
                      {item.sharedBy === null ? (
                        <p>No</p>
                      ) : (
                        <>
                          <p>Yes</p>
                        </>
                      )}
                    </TableCell>
                    <TableCell
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {userId === item.uploadedBy ? (
                        <Tooltip
                          title="Move Document"
                          sx={{ m: 1, cursor: "pointer" }}
                          placement="top"
                        >
                          <Icon onClick={() => handleMovePop(item)}>
                            drive_file_move
                          </Icon>
                        </Tooltip>
                      ) : (
                        <span style={{ paddingLeft: "33px" }}></span>
                      )}
                      {userId === item.uploadedBy && (
                        <Tooltip
                          title="Share Document"
                          sx={{ m: 1, cursor: "pointer" }}
                          placement="top"
                        >
                          <Icon onClick={() => handleShare(item)}>share</Icon>
                        </Tooltip>
                      )}
                      <Tooltip title="Download Document" placement="top">
                        <Link
                          href={item.documentUrl}
                          download={item.documentName}
                          target="_blank"
                          style={{
                            color: "#212121",
                            display: "flex",
                            textDecoration: "none",
                            margin: "10px",
                          }}
                          rel="noreferrer"
                        >
                          {" "}
                          <Icon
                            onClick={(e) => {
                              e.preventDefault();
                              handleDownloadPDF(item);
                            }}
                          >
                            download_for_offline
                          </Icon>
                        </Link>
                      </Tooltip>

                      <Tooltip
                        title="View Document"
                        sx={{ m: 1, cursor: "pointer" }}
                        placement="top"
                      >
                        <Icon onClick={() => handleViewPdf(item)}>
                          visibility
                        </Icon>
                      </Tooltip>
                      {userId === item.uploadedBy && (
                        <Tooltip
                          title="Delete Document"
                          sx={{ m: 1, cursor: "pointer" }}
                          placement="top"
                        >
                          <Icon onClick={() => openDeleteDialog(item)}>
                            delete
                          </Icon>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
                  <DialogTitle>{DOCUIT_DOCUMENT_SCREEN.document_delete_dialog}</DialogTitle>
                  <DialogContent>
                    {DOCUIT_DOCUMENT_SCREEN.document_delete_content}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={closeDeleteDialog}>Cancel</Button>
                    <Button onClick={() => handleDelete(deleteDocumentId)}>
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </DashboardLayout>
  );
}
export default Documents;