var regionArray = Array();
var mrfieldArray = Array();
var notrequired = Array();
var validdates = 'Y';
var flag = 0;
var level2approverflag;
var Object_Created_On;
var Object_Created_By;
var Object_Modified_On;
var Object_Modified_By;
var glob_invokedFromDataBrowser;
var user_chk_avblty;
var edit_flag;
var invokedFromDataBrowser;
var ddCurrentUserName;
var showEditIcon = true;
//var APPLIES_TO_LNK_NOT_REQ = '';
var APPLIES_TO_SECTION_LINK = [];
var IS_PREVIEW_DOWNLOADING = false;


var level2ApproverRequired = 'Y';


var parvalue = '';
var grcReportDiv;
var grcHyperLinkDiv;
var dispToolbar;


var addItemImage = Array();
var orbArray = Array();

var links = Array();
var orbRptTitleArr = Array();
var orbRelTypeArr = Array();
var orbRelIDArr = Array();
var orbFormTtlArr = Array();
var orbDispLinkArr = Array();
var AddOrb;

var addItemImage_C = Array();
var orbArray_C = Array();
var links_C = Array();
var orbRptTitleArr_C = Array();
var orbRelTypeArr_C = Array();
var orbRelIDArr_C = Array();
var orbFormTtlArr_C = Array();
var orbDispLinkArr_C = Array();
var AddOrb_C;


function showToolbar() {
    var editDisabled = false;
    edit_flag = 'Y';
    invokedFromDataBrowser = false;
    if (dispToolbar != 'N') {
        F.activateToolBar();
    }



    if (typeof(F.getFormParameter("edit_flag")) != 'undefined') {
        edit_flag = F.getFormParameter("edit_flag");
        invokedFromDataBrowser = true;
    }



    if (invokedFromDataBrowser) {
        checkUserInOrgs();
    }


    if (accessCode != 99) {

        if (edit_flag != "Y" || accessCode == 2) {
            editDisabled = true;
        }
    }

    if ((F.getFormParameter("flag") == 3) && (F.DD_OBJECT_TYPE.read() == 'MS_GRC_KPI_KRI_DEFINITION')) {
        edit_flag = 'Y';
        invokedFromDataBrowser = true;
        F.disableAll();
    }

    if ((F.DD_OBJECT_TYPE.read() === "MS_GRC_KPI_KRI_DATA_ENTRY") && (invokedFromDataBrowser)) {
        invokedFromDataBrowser = true;
        editDisabled = true;
    }

    F.log("edit_flag  = " + edit_flag);
    F.log("accessCode =  " + accessCode);
    F.log("editDisabled = " + editDisabled);
    F.log("invokedfromDB = " + invokedFromDataBrowser);

    var reportToRunLater = F.getReportId("Comments History");
    F.log(reportToRunLater);


    var reportsMenu = [];
    for (var i = 0; i < relRepNameArr.length; i++) {
        if (relRepNameArr[i].length !== 0 && relRepNameArr[i] == '$changeHistoryReport') {
            reportsMenu.push({
                metricid: relRepMetricArr[i],
                reportid: relRepArr[i],
                text: relRepNameArr[i],
                handler: function(rep) {
                    getReport(rep.metricid, rep.reportid);
                }
            });
        }
    }


    var saveMenu = [];
    saveMenu.push({
        iconCls: 'msai_toolsavenew',
        xtype: 'button',
        id: 'msai_toolsave',
        hidden: editDisabled || (invokedFromDataBrowser),
        tooltip: {

            text: "$formToolbarsavenewText",
            title: "$formToolbarsavenewTitle",
            xtype: "quicktip"
        },
        handler: function() {
            checknsave();
        }
    });

    saveMenu.push({
        iconCls: 'msai_toolsavedraftandclose',
        xtype: 'button',
        id: 'msai_toolsavedraftandclose',
        hidden: editDisabled || invokedFromDataBrowser,
        tooltip: {
            text: "Saves the content and closes the form without processing it to the next step",
            title: "Save Draft &amp; Close",
            xtype: "quicktip"
        },
        handler: function() {
            checknsaveclose();
        }
    });
    var myConfiguration = [{
        iconCls: 'msai_tooldefault',
        xtype: 'button',
        id: 'msai_tooldefault',
        hidden: editDisabled || (!invokedFromDataBrowser),
        tooltip: {

            text: "$formToolbarDefaultText",
            title: "$formToolbarDefaultTitle",
            xtype: "quicktip"
        },
        handler: function() {
            editForm();
        }
    }, {
        iconCls: 'msai_toolsubmitnew',
        xtype: 'button',
        id: 'msai_toolsubmitnew',
        hidden: editDisabled || (invokedFromDataBrowser),
        width: 30,
        tooltip: {
            text: "$formToolbarSubmitNewText",
            title: "$formToolbarSubmitNewTitle",
            xtype: "quicktip"
        },
        handler: function() {
            checknsubmit();
        }
    }, {
        iconCls: 'msai_toolsavenew',
        xtype: 'button',
        id: 'msai_toolsavenew',
        hidden: editDisabled || (invokedFromDataBrowser),
        tooltip: {
            text: "$formToolbarSaveNewText",
            title: "$formToolbarSaveNewTitle",
            xtype: "quicktip"
        },
        handler: function() {
            formchecknsave();
        }
    }, {
        iconCls: 'msai_toolsavedraftandclose',
        xtype: 'button',
        id: 'msai_toolsavedraftandclose',
        hidden: editDisabled || (invokedFromDataBrowser),
        width: 30,
        tooltip: {
            text: "$formToolbarSaveDraftAndCloseText",
            title: "$formToolbarSaveDraftAndCloseTitle",
            xtype: "quicktip"
        },
        handler: function() {
            formchecknsaveclose();
        }
    }, {
        iconCls: 'msai_toolreports',
        menu: reportsMenu,
        tooltip: {
            text: "$formToolbarReportsText",
            title: "$formToolbarReportsTitle",
            xtype: "quicktip"
        },
        handler: function() {}
    }, {
        iconCls: 'msai_toolcancelnew',
        xtype: 'button',
        id: 'msai_toolcancelnew',
        hidden: false,
        tooltip: {
            text: "$formToolbarCancelNewText",
            title: "$formToolbarCancelNewTitle",
            xtype: "quicktip"
        },
        handler: function() {
            goConfirmCancel();
        }
    }];

    F.toolBar.setupControls(myConfiguration);
    if (dispToolbar != 'N') {
        F.toolBar.show();
        addBPMIcon();
    }

    showEditIcon = !(editDisabled || (!invokedFromDataBrowser));

    glob_invokedFromDataBrowser = invokedFromDataBrowser;
}

function callForm(id, procId) {
    var paramone = SERVLET_URL + "Pushinfolet?id=" + id + "&submit_back=no&flag=1";

    if (procId) {
        paramone = paramone + '&proc=' + procId;

    }
    window.parent.location = paramone + '&bare=' + encodeURIComponent(top.window.top.previousPage);
}

function formchecknsaveclose() {
    /* if (APPLIES_TO_LNK_NOT_REQ != undefined && APPLIES_TO_LNK_NOT_REQ != '') {
        F.APPLIES_TO_LINK_NOT_REQ.write(null);
        APPLIES_TO_LNK_NOT_REQ = F.APPLIES_TO_LINK_NOT_REQ.read();
    } */
    if (F.SEC.getRowCount() > 1 || F.SECTION_TITLE_SEC.read(1) != '')
        F.SEC.persistTree();
    checknsaveclose();
}

function formchecknsave() {
    /* if (APPLIES_TO_LNK_NOT_REQ != undefined && APPLIES_TO_LNK_NOT_REQ != '') {
        F.APPLIES_TO_LINK_NOT_REQ.write(null);
        APPLIES_TO_LNK_NOT_REQ = F.APPLIES_TO_LINK_NOT_REQ.read();
    } */
    if (F.SEC.getRowCount() > 1 || F.SECTION_TITLE_SEC.read(1) != '')
        F.SEC.persistTree();

    checknsave();
}

function disableMrow(mRow, flag) {

    mRow.onAddRow = function() {
        return false;

    };
    mRow.onDeleteRow = function() {
        return false;

    };


    if (flag == 'SHOW') {
        mRow.showFirstPage();
    } else {
        mRow.makeEmpty();
        mRow.showFirstPage();

    }

    for (var row in mRow.rows()) {
        mRow.disableRow(row);

    }

    mRow.afterPageLoad = function(startRow, endRow) {
        for (i = startRow; i <= endRow; i++) {
            mRow.disableRow(i);

        }
    };

}

function enableMrow(mRow, flag) {


    mRow.onAddRow = function() {
        return true;

    };
    mRow.onDeleteRow = function() {
        return true;

    };
    if (flag == 'SHOW') {
        mRow.showFirstPage();
    } else {
        mRow.makeEmpty();
        mRow.showFirstPage();

    }

    for (var row in mRow.rows()) {
        mRow.enableRow(row);

    }
}


function callUpdateTitle() {

    if (F.OBJECT_ID.read() == 'NONE' && F.OBJECT_NAME.read() === "") {

        F.toolBar.updateTitle(F.getTitle() + ': ' + htmlEncode(F.OBJECT_NAME.read().substring(0, 104)) + ' []');

    } else {


        F.log(F.OBJECT_NAME.read().substring(0, 104) + ' [' + F.OBJECT_ID.read() + ']');
        F.toolBar.updateTitle(F.getTitle() + ': ' + htmlEncode(F.OBJECT_NAME.read().substring(0, 104)) + ' [' + F.OBJECT_ID.read() + ']');


    }
}

function showHideParent() {
    if (F.OBJECT_LEVEL.read() === "1" || F.OBJECT_LEVEL.read() === "") {
        F.OBJECT_PARENT.makeNotRequired().hide();
    } else {
        F.OBJECT_PARENT.makeRequired().show();
    }
}


function disableMultiRows() {
    if (regionArray.length !== 0) {
        for (i = 0; i < regionArray.length; i++) {
            if (typeof(mrfieldArray[i]) !== "undefined" && mrfieldArray[i].read(1) !== "") {
                disableMrow(regionArray[i], 'SHOW');
            } else {
                disableMrow(regionArray[i], 'DONTSHOW');
            }
        }
    }
}


function enableMultiRows() {
    if (regionArray.length !== 0) {
        for (v = 0; v < regionArray.length; v++) {

            F.log('mrfield array' + mrfieldArray[v]);



            if (typeof(mrfieldArray[v]) != "undefined" && mrfieldArray[v].read(1) !== "") {


                enableMrow(regionArray[v], 'SHOW');
            } else {
                F.log('dont show');

                enableMrow(regionArray[v], 'DONTSHOW');
            }
        }

    }
}


function disableCommonFields() {

    F.OBJECT_NAME.disable();
    if (F.DESCRIPTION) {
        F.DESCRIPTION.disable();
    }
    F.VALID_FROM.disable();
    F.VALID_UNTIL.disable();
    F.OWNER_ORGANIZATIONS.disable();
    F.OWNERS.disable();
    F.RESTRICT_ACCESS_TO.disable();
    F.LEVEL_1_APPROVER.disable();
    disableMultiRows();
}



function enableCommonFields() {

    F.OBJECT_NAME.enable();
    if (F.DESCRIPTION && F.DD_OBJECT_TYPE.read() != 'MS_GRC_QUESTION_PROCEDURE') {
        F.DESCRIPTION.enable();
    }
    F.VALID_FROM.enable();
    F.VALID_UNTIL.enable();
    F.OWNER_ORGANIZATIONS.enable();
    F.OWNERS.enable();
    F.RESTRICT_ACCESS_TO.enable();
    F.LEVEL_1_APPROVER.enable();
    enableMultiRows();

}


function editForm() {


    if (F.getFormParameter("edit_flag") == "N" && F.getFormParameter('spiflg') == '1') {
        alert("$SPI_Alert06");
    }

    if ((F.getFormParameter("edit_flag") == "Y") || (F.getFormParameter("flag") == "3")) {

        if (accessCode == 2) {
            F.log("Object cannot be edited due to Security Check Fail.");
        } else {
            callForm(F.getFormParameter("id"), F.getFormParameter("proc"));


        }
    } else {

        if (F.getFormParameter('spiflg') != '1') {
            alert("$SPI_Alert01");
        }
    }
}


function setReqForComments() {
    if (F.OBJECT_ACTION.read() == 'CNCL' || F.OBJECT_ACTION.read() == 'REQ_CLR') {
        F.ACTION_COMMENTS.makeRequired();
    } else {
        F.ACTION_COMMENTS.makeNotRequired();

    }
}



F.level2Approvercheck = function() {

    F.log(F.VALID_UNTIL.read());
    if (F.LEVEL_2_APPROVER.read() !== "" && F.LEVEL_1_APPROVER.read() === "") {
        alert("$SPI_Alert02");
        level2approverflag = 'N';
        return false;
    } else {
        level2approverflag = 'Y';
        return true;
    }
};



F.regionPkeycheck = function() {


    for (var i = 0; i < regionArray.length; i++) {

        var cnt = regionArray[i].getRowCount();
        F.log('number of records in ' + regionArray[i] + ' = ' + cnt);

        for (var j = 1; j <= cnt; j++) {

            if (mrpkeyArray[i].read(j) === "") {
                mrpkeyArray[i].write('NONE', j);
            }
        }
    }
};

function validate_start_and_end_date(check_dt, cre_dt) {
    var ret_value = '1';

    var my_chk_date = new Date(check_dt);
    var my_cre_date = new Date(cre_dt);

    var ed_month = my_chk_date.getMonth();
    var ed_date = my_chk_date.getDate();
    var ed_year = my_chk_date.getYear();

    var curr_month = my_cre_date.getMonth();
    var curr_date = my_cre_date.getDate();
    var curr_year = my_cre_date.getYear();

    if (ed_year > curr_year) {
        ret_value = '-1';
    } else {
        if (ed_year == curr_year) {
            if (ed_month > curr_month) {
                ret_value = '-1';
            } else {
                if (ed_month == curr_month) {
                    if (ed_date > curr_date) {
                        ret_value = '-1';
                    }
                }
            }
        }
    }

    return ret_value;
}

function msgbox(txt, msgType) {

    alert(txt);

}

function msgbox1(txt, msgType) {
    var iconType = Ext.MessageBox.WARNING;
    if (msgType) {
        iconType = msgType;
    }
    Ext.Msg.show({
        title: '$relationship_alert',
        msg: txt,
        minWidth: 200,
        buttons: Ext.Msg.OK,
        icon: iconType
    });

}

function addBPMIcon() {
    if (F.DD_OBJECT_TYPE.read() == "MS_GRC_PROCESS") {
        Ext.Ajax.request({
            url: 'Bpmservlet/ajax/InfoletData',
            method: 'POST',
            params: {
                infoletname: 'MS_APPS_BPM'
            },
            success: function(response, options) {
                for (var i = 0; i < F.toolBar.configuration.length; i++) {
                    if (F.toolBar.configuration[i].id == 'msai_toolbpmdesigner') {
                        F.toolBar.configuration[i].hidden = false;
                        F.toolBar.configuration[i].handler = function() {
                            fnBPMDesigner(response.responseText);
                        };
                    }
                }
                top.setActiveToolbar(F.toolBar.configuration);
            }
        });
    }
}

function fnBPMDesigner(infoletId) {
    var queryStringObj = Ext.urlDecode(window.location.search.substring(1));
    var allowRedirect = true;
    if (!queryStringObj.edit_flag) {
        allowRedirect = false;

        Ext.Msg.show({
            title: 'Confirm',
            msg: 'Do you want to save the changes?',
            buttons: Ext.Msg.YESNOCANCEL,
            fn: grcSaveResult,
            icon: Ext.MessageBox.QUESTION
        });
    }
    if (allowRedirect) {
        fnRedirect(infoletId);
    }

    function grcSaveResult(btn) {
        if (btn == 'yes') {
            checknsave();
            fnRedirect(infoletId);
        } else if (btn == 'no') {
            fnRedirect(infoletId);
        } else if (btn == 'cancel') {
            goCancel();
        }
    }

    function fnRedirect(infoletId) {
        F.getObject('main_container').style.visibility = 'hidden';
        var objectId = F.OBJECT_ID.read();
        var objectName = F.OBJECT_NAME.read();
        var objectType = F.DD_OBJECT_TYPE.read();
        var objectInfoletId = F.getInfoletId();
        var objectLevel = F.OBJECT_LEVEL.read();
        var objectEditFlag = F.getFormParameter("edit_flag");
        var objectInstId = F.getFormParameter("instid");
        var objectProcId = F.getFormParameter("proc");
        var formmode = (!queryStringObj.edit_flag) ? "edit" : 'view';
        objectName = escape(objectName);
        var objectDrillDown = queryStringObj.OBJECT_DRILLDOWN;
        var paramone = SERVLET_URL + '/Pushinfolet?flag=1&id=' + infoletId + '&OBJECT_ID=' + objectId + '&OBJECT_NAME=' + objectName + '&OBJECT_TYPE=' + objectType + '&OBJECT_ACCESS_CODE=' + accessCode + '&OBJECT_FORM_ID=' + objectInfoletId + '&OBJECT_FORM_MODE=' + formmode + '&OBJECT_LEVEL=' + objectLevel + '&OBJECT_EDIT_FLAG=' + objectEditFlag + '&OBJECT_INST_ID=' + objectInstId + '&OBJECT_PROC_ID=' + objectProcId;
        if (objectDrillDown == 'Y')
            paramone = paramone + "&OBJECT_DRILLDOWN=" + objectDrillDown;
        window.location = paramone + '&bare=' + encodeURIComponent(top.window.top.previousPage);
    }
}

function at_submit() {

    F.toolBar.hideControls();
}

function afterFormSave() {
    F.toolBar.showControls();
}

function checkUserInOrgs() {
    if (F.CHECK_USER_IN_ORGS) {
        F.log('Inside check_user_in_orgs');
        var values_in_dd;
        values_in_dd = document.getElementById('id' + F.CHECK_USER_IN_ORGS.getSequence()).options.length - 1;
        F.log('values_in_dd ' + values_in_dd);
        if ((F.OBJECT_ID.read() !== "") && (F.DD_CURRENT_USER_NAME.read() !== "SYSTEMI")) {
            if (values_in_dd >= 1) {
                F.OWNER_ORGANIZATIONS.enable();
            } else {
                F.OWNER_ORGANIZATIONS.disable();
            }
        }
    }
}

function approvercheck() {
    if (accessCode == 4) {
        F.disableAll();
        F.OBJECT_ACTION.enable();
        F.ACTION_COMMENTS.enable();
    }
}

function restrictedaccess() {
    if (accessCode == 5) {
        F.OWNER_ORGANIZATIONS.disable();
    }
}


function GRC_OnLoad() {
    F.DD_OBJECT_TYPE.callInfolet();
    if (F.DD_OBJECT_TYPE != 'MS_GRC_EXCEPTION') {
        F.OBJECT_NAME.setFocus();
    }

    if (F.DD_OBJECT_TYPE.read() != 'MS_GRC_REFERENCE') {
        relationshipLink();
    }


    parvalue = F.getFormParameter('emd');

    F.log("location.href.indexOf('wrapper=no')" + location.href.indexOf('wrapper=no'));
    F.log("edit_flag  = " + edit_flag);
    F.log("accessCode =  " + accessCode);
    F.log("invokedfromDB = " + glob_invokedFromDataBrowser);

    displaytoolbar();


    if (parvalue != '3')
        callUpdateTitle();




    InitiateNewObject();



    status_updation();



    if (parvalue != '3') {
        showHideComments();
    }

    objectCreationInfo();

    objectModificationInfo();


    if (F.DD_OBJECT_TYPE.read() != 'MS_SPI_RELATED_DOCUMENTS') {
        getConfigParams();
    }
    restrictedaccess();

    defaultRestriction();

    enableMultiRows();

    if (F.ORB) {
        includeORB();
    }
}


function status_updation() {
    F.OBJ_STATUS_TEMP.write('');
    F.OBJ_STATUS_TEMP.write(F.OBJ_STATUS.read());

    if (F.DD_CURRENT_STAGE.read() == 'NONE' || F.DD_CURRENT_STAGE.read() === "")
        F.OBJ_STATUS_TEMP.write('NEW');

    var cstage = F.DD_CURRENT_STAGE.read();
    var ostatus = F.PLAN_STATUS.read();
    var fparam = F.getFormParameter("edit_flag");

    if ((cstage == 'CREATE_EDIT' || cstage == 'PUBLISH') && ((ostatus == 'ACT') || (ostatus == 'INACT')) && !glob_invokedFromDataBrowser)

    {
        F.OBJ_STATUS_TEMP.write('MOD');
    }

    F.OBJ_STATUS_TEMP.callInfolet();
}


function GRC_OnSubmit() {



    var retvalue;

    retvalue = InvokeUserCheck();
    if (!retvalue)
        return retvalue;

    setReqForComments();
    F.regionPkeycheck();

    retvalue = F.level2Approvercheck();
    if (!retvalue)
        return retvalue;
    retvalue = datevaliditycheck();

    return retvalue;
}

function objectCreationInfo() {
    var Object_Created_By;
    var date = new Date();
    var d = date.getDate();
    var day = (d < 10) ? '0' + d : d;
    var m = date.getMonth() + 1;
    var month = (m < 10) ? '0' + m : m;
    var yy = date.getYear();
    var year = (yy < 1000) ? yy + 1900 : yy;

    if (F.PLAN_STATUS.read() == 'NEW' && F.OBJ_CREATED_BY.read() === "") {
        //F.OBJ_CREATED_ON.writeValue(month + "/" + day + "/" + year,month + "/" + day + "/" + year);
        Object_Created_By = F.DD_CURRENT_USER_NAME.read();
        //F.OBJ_CREATED_BY.writeValue(Object_Created_By,Object_Created_By);

    } else
        return;
}

function objectModificationInfo() {
    var Object_Modified_By;
    var date = new Date();
    var d = date.getDate();
    var day = (d < 10) ? '0' + d : d;
    var m = date.getMonth() + 1;
    var month = (m < 10) ? '0' + m : m;
    var yy = date.getYear();
    var year = (yy < 1000) ? yy + 1900 : yy;

    if (F.DD_CURRENT_STAGE.read() == 'CREATE_EDIT' && F.PLAN_STATUS.read() == 'NEW') {
        //F.OBJ_MODIFIED_ON.writeValue(month + "/" + day + "/" + year,month + "/" + day + "/" + year);
        Object_Modified_By = F.DD_CURRENT_USER_NAME.read();

        //F.OBJ_MODIFIED_BY.writeValue(Object_Modified_By,Object_Modified_By);        
    } else
        return;


}


function clarificationcheck() {
    if ((F.DD_CURRENT_STAGE.read() == 'L1_APPROVE' || F.DD_CURRENT_STAGE.read() == 'L2_APPROVE') && (accessCode == 4) && (F.OBJECT_ACTION.read() == 'R')) {
        for (i = 0; i < notrequired.length; i++) {
            notrequired[i].makeNotRequired();
        }
    }
}

function getConfigParams() {


    if (F.OWN_APP_CONFIG_TEMP.read() === "")
        F.OWN_APP_CONFIG_TEMP.write(F.OWN_APP_CONFIG.read());
    if (F.OWN_APP_CONFIG_TEMP.read() == '1') {
        F.LEVEL_1_APPROVER.hide();
        F.LEVEL_2_APPROVER.hide();
    } else if (F.OWN_APP_CONFIG_TEMP.read() == '2') {
        F.LEVEL_2_APPROVER.hide();
    }

}

function showHideComments() {

    if (

        (F.OBJECT_ID.read() == 'NONE') ||
        (F.OBJECT_ID.read() === "")
    ) {
        var divelem = getReportDiv(F.HDN_CMNT_HIST_RPT_NAME.read());
        if (divelem) divelem.style.display = 'none';
    }
}

function InitiateNewObject() {
    if (F.DD_CURRENT_STAGE.read() === "" && F.OBJECT_ID.read() === "") {

        F.OBJECT_ID.write('NONE');
        F.DD_CURRENT_STAGE.write('NONE');
        valueisthere(F.DD_CURRENT_STAGE.getSequence());

    }
}

function datevaliditycheck() {
    if ((F.VALID_FROM.read() !== "" && F.VALID_UNTIL.read() !== "") && (validate_start_and_end_date(F.VALID_FROM.read(), F.VALID_UNTIL.read()) === -1)) {
        alert("$SPI_Alert03");
        return false;
    } else {
        return true;
    }
}

function InvokeUserCheck() {

    if (F.OWNER_ORGANIZATIONS.read() !== "" && F.OBJECT_ACTION.read() !== "" && F.OBJECT_ACTION != 'CNCL') {
        F.OBJECT_ID.callInfolet();
        user_chk_avblty = F.CHECK_USER_AVAIL.read();

    }
    if (user_chk_avblty == 1)
        return true;
    else {
        switch (user_chk_avblty) {
            case 1:
                return true;
            case '-1':
                alert("$SPI_Alert04");
                return false;
            case '-2':
                alert("$SPI_Alert05");
                return false;
            default:
                return true;

        }
    }
}

function defaultRestriction() {
    if (F.RESTRICT_ACCESS_TO.read() === "") {
        F.RESTRICT_ACCESS_TO.write('N');

    }
}

function displaytoolbar() {
    if (location.href.indexOf('wrapper=no') < 1) {
        showToolbar();
    }
    if (parvalue == '3') {
        F.disableAll();
        disableMultiRows();
        F.OBJECT_ACTION.disable();
    }
}


function getReportLinkId() {
    var className = 'msai_attached_report_name';
    var hasClassName = new RegExp("(?:^|\\s)" + className + "(?:$|\\s)");
    var allElements = document.getElementsByTagName("span");
    var results = [];
    var element;
    for (var i = 0;
        (element = allElements[i]) !== null; i++) {
        var elementClass = element.className;
        if (elementClass && elementClass.indexOf(className) != -1 && hasClassName.test(elementClass)) {
            results[element.innerHTML] = element.parentNode;
            F.log('*element.innerHTML*' + element.innerHTML);
        }
    }
    return results;
}


function getReportDiv(repId) {
    grcReportDiv = grcReportDiv || getReportLinkId();
    for (var i in grcReportDiv) {
        if (repId == i) return grcReportDiv[i];
    }
    return false;
}



function getHyperLinkId() {
    var className = 'msai_hyperlink';
    var hasClassName = new RegExp("(?:^|\\s)" + className + "(?:$|\\s)");
    F.log('+hasClassName+' + hasClassName);
    var allElements = document.getElementsByTagName("A");
    F.log('+allElements+' + allElements);
    var results = [];
    var element;
    for (var i = 0;
        (element = allElements[i]) != null; i++) {
        var elementClass = element.className;
        if (elementClass && elementClass.indexOf(className) != -1 && hasClassName.test(elementClass)) {
            results[element.innerHTML] = element.parentNode;
            F.log('+element.innerHTML+' + element.innerHTML);
        }
    }
    return results;
}


function getHyperLinkDiv(repId) {
    grcHyperLinkDiv = grcHyperLinkDiv || getHyperLinkId();
    F.log('+grcHyperLinkDiv+' + grcHyperLinkDiv);
    for (var i in grcHyperLinkDiv) {
        F.log('+i+' + i);
        F.log('+repId+' + repId);
        if (repId == i) return grcHyperLinkDiv[i];
    }
    return false;
}


function includeORB() {
    Ext.onReady(extReady);

    var mrDivId = 'MSAI_MULTI_DIV_' + F.ORB.getID();
    F.getObject(mrDivId).style.display = 'none';

    if (F.REL_SOURCE_ID.read() === "") {
        F.REL_SOURCE_ID.write('NONE');
        F.REL_INST_ID.write('NONE', 1);
        F.REL_SOURCE_OBJECT_ID.write('NONE');
    }
    orbArray = F.ORB_RPT_NAME.read().split(",");

    var OrgEntry;
    for (var i = 1; i <= F.ORB.getRowCount(); i++) {
        if (F.NATURE_OF_RELATIONSHIP) {
            var ObjExists;

            ObjExists = '';

            if (F.ADDITIONAL_COLUMN1.readLov(i) !== "") {
                ObjExists = 'Objective Type: ';
            }


            OrgEntry = [decodeHtmlContent(F.TGT_OBJ_TYPE.read(i)),
                F.TGT_OBJ_NAME.read(i),
                F.TGT_OBJ_ID.read(i),
                decodeHtmlContent(F.REL_COMMENTS.read(i)),
                F.REL_VALID_FROM.read(i),
                F.REL_VALID_UNTIL.read(i),
                i,
                F.SELF_REL_TYPE.read(i),
                F.CAUSE_CONSEQUENCE.readValue(i),
                F.STAKE_HOLDERS.readLov(i),
                F.ORB_KEY_RISK.readValue(i),
                F.APPLICABLE_TO.read(i),
                F.ADDITIONAL_DETAILS.read(i),
                F.ORB_FORM_URL.read(i),
                F.NATURE_OF_RELATIONSHIP.read(i),
                F.NATURE_OF_REL_PTOA.read(i),
                F.TYPE_OF_OWNER.read(i),
                F.ADDITIONAL_COLUMN1.readLov(i),
                ObjExists,
                F.ADDITIONAL_COLUMN3.read(i)
            ];


        } else {

            OrgEntry = [decodeHtmlContent(F.TGT_OBJ_TYPE.read(i)),
                F.TGT_OBJ_NAME.read(i),
                F.TGT_OBJ_ID.read(i),
                decodeHtmlContent(F.REL_COMMENTS.read(i)),
                F.REL_VALID_FROM.read(i),
                F.REL_VALID_UNTIL.read(i),
                i,
                F.SELF_REL_TYPE.read(i),
                F.CAUSE_CONSEQUENCE.readValue(i),
                F.STAKE_HOLDERS.readLov(i),
                F.ORB_KEY_RISK.readValue(i),
                F.APPLICABLE_TO.read(i),
                F.ADDITIONAL_DETAILS.read(i),
                F.ORB_FORM_URL.read(i),
                '',
                '',
                '',
                '',
                '', F.ADDITIONAL_COLUMN3.read(i)
            ];
        }
        relArr.push(OrgEntry);
        relStore.loadData(relArr);

    }
}

/*function show_report_risk()
{
  #foreach ($report in $reports)
    #if (${report.name} == 'Add Risk(s)')
       getReport($report.metricId,$report.reportId);
    #end
 #end
}*/

var addObjId;

function showHideAddObject() {


    if (F.CONFIGURED_OBJECT_TYPES.read() === "") {
        F.getObject(addObjId).style.display = "none";

    } else {
        F.getObject(addObjId).style.display = "";

    }

}



function ROG_dup_chk() {
    for (i = 1; i <= F.ROG.getRowCount(); i++) {

        if (!F.ROG.isMarkedForDeletion(i)) {

            for (var m1 = 1; m1 <= F.ROG.getRowCount(); m1++) {

                if (!F.ROG.isMarkedForDeletion(m1)) {

                    if ((F.ROG_DUMMY_PK.read(m1) != F.ROG_DUMMY_PK.read(i)) && (m1 != i) && (F.ROG_RELATION_TYPE.read(m1) == F.ROG_RELATION_TYPE.read(i)) && (F.ROG_ORGANIZATION.read(m1) == F.ROG_ORGANIZATION.read(i))) {
                        if (F.ROG_DUMMY_PK.read(i) !== "") {
                            alert('The Organization: ' + F.ROG_ORGANIZATION.readValue(m1) + '\nType: ' + F.ROG_RELATION_TYPE.readValue(m1) + '\nRow: ' + F.ROG_DUMMY_PK.readValue(m1) + '\nhas already been selected.Please select a different organisation or remove duplicate row.');
                            return false;

                        }
                    }
                }
            }
        }
    }
}

var dupMRow2DArr = Array();
var dupMRow2DValArr = Array();
var dupMRowAlertArr = Array();
var dupregionArr = Array();
var dupPKeyArr = Array();

function dupMRowChk() {
    for (REGidx = 0; REGidx < dupregionArr.length; REGidx++) {
        for (i = 1; i <= dupregionArr[REGidx].getRowCount(); i++) {
            if (!dupregionArr[REGidx].isMarkedForDeletion(i)) {
                for (m1 = 1; m1 <= dupregionArr[REGidx].getRowCount(); m1++) {
                    if (!dupregionArr[REGidx].isMarkedForDeletion(m1)) {
                        if ((m1 != i)) {
                            var eqCnt;
                            eqCnt = dupMRow2DArr[REGidx].length;
                            var tmpalert;
                            tmpalert = dupMRowAlertArr[REGidx];

                            for (mr2Didx = 0; mr2Didx < dupMRow2DArr[REGidx].length; mr2Didx++) {
                                if (dupMRow2DArr[REGidx][mr2Didx].read(m1) != dupMRow2DArr[REGidx][mr2Didx].read(i)) {
                                    eqCnt = eqCnt - 1;
                                }

                                if ((tmpalert.indexOf(dupMRow2DValArr[REGidx][mr2Didx] + '.dispval') > 0) || (tmpalert.indexOf(dupMRow2DValArr[REGidx][mr2Didx] + '.val') > 0)) {
                                    tmpalert = tmpalert.split(dupMRow2DValArr[REGidx][mr2Didx] + '.dispval').join(dupMRow2DArr[REGidx][mr2Didx].readValue(i));
                                    tmpalert = tmpalert.split(dupMRow2DValArr[REGidx][mr2Didx] + '.val').join(dupMRow2DArr[REGidx][mr2Didx].read(i));
                                    tmpalert = tmpalert.split('ROWNUM').join(m1);

                                }

                            }

                            if ((eqCnt == dupMRow2DArr[REGidx].length) && eqCnt !== 0) {

                                alert(tmpalert);
                                return false;
                            }
                        }
                    }
                }
            }
        }
    }
    return true;
}

function hideShowFormFields(hideShowFields, flag)

{
    for (var i = 0; i < hideShowFields.length; i++) {
        if (flag == 'Y') {
            eval(hideShowFields[i]).hide();
        } else {
            eval(hideShowFields[i]).show();
        }

    }


}


function IsNumeric(strString1, lenStr) {

    var strString = eval(strString1).read();

    var strValidChars = "0123456789";
    var strChar;
    var blnResult = true;


    if (strString.length > lenStr && (lenStr.toString()).length > 0) {

        eval(strString1).write("");
        eval(strString1).setFocus();
        return false;


    }


    for (i = 0; i < strString.length && blnResult; i++) {
        strChar = strString.charAt(i);
        if (strValidChars.indexOf(strChar) == -1) {
            eval(strString1).write("");
            eval(strString1).setFocus();
            return false;
        }
    }
    return blnResult;
}


function writeLinks() {
    var html = "";

    for (var j = 0; j < orbRelTypeArr.length; j++) {
        if (isAddInAppliesToSec(orbRelTypeArr[j]) && !isDataAlreadyPresent(APPLIES_TO_SECTION_LINK, orbRelTypeArr[j])) {
            if ((edit_flag == 'N') || ((edit_flag == 'Y') && (!invokedFromDataBrowser))) {
                sections[0].links[sections[0].links.length] = '<a href=\"javascript:viewORBRptFromGrid(' + j + ')\" style="text-decoration:underline">' + orbDispLinkArr[j] + '</a>';
                APPLIES_TO_SECTION_LINK[APPLIES_TO_SECTION_LINK.length] = orbRelTypeArr[j];
            } else {
                sections[0].links[sections[0].links.length] = '<a href=\"\" </a>';
            }
        }
    }

    for (var i = 0; i < sections.length; i++) {
        var section = sections[i];
        if ((edit_flag == 'N') || ((edit_flag == 'Y') && (!invokedFromDataBrowser))) {
            html += section.heading + section.links.join(" | ");
        } else {
            html += section.links.join(" ");
        }
    }
    F.getObject(AddOrb).innerHTML = html;
}

function relationshipLink() {
    orbArray = F.ORB_RPT_NAME.read().split(",");

    orbRelTypeArr = [];
    orbRptTitleArr = [];
    orbDispLinkArr = [];
    addItemImage = [];
    orbRelIDArr = [];
    orbFormTtlArr = [];

    for (i = 0; i < orbArray.length; i++) {
        orbRelTypeArr[i] = orbArray[i].substring(0, orbArray[i].indexOf("^*^"));
        orbRptTitleArr[i] = orbArray[i].substring(orbArray[i].indexOf("^*^") + 3, orbArray[i].indexOf("$#$"));
        orbDispLinkArr[i] = orbArray[i].substring(orbArray[i].indexOf("$#$") + 3, orbArray[i].indexOf("@#@"));
        addItemImage[i] = orbArray[i].substring(orbArray[i].indexOf("@#@") + 3, orbArray[i].indexOf("%#%"));
        orbRelIDArr[i] = orbArray[i].substring(orbArray[i].indexOf("%#%") + 3, orbArray[i].indexOf("&#&"));
        orbFormTtlArr[i] = orbArray[i].substring(orbArray[i].indexOf("&#&") + 3);

        sections = [{
            heading: '<span class="asep">${Add}: </span>',
            links: []
        }];
    }
    writeLinks();
    setTimeout(function() {
        writeLinks();
        APPLIES_TO_SECTION_LINK = [];
    }, 0);
}

function isAddInAppliesToSec(linkType) {
    return returnEmptyIfNull(linkType) !== ""; //&& APPLIES_TO_LNK_NOT_REQ.indexOf(linkType) === -1;
}

function returnEmptyIfNull(value) {
    try {
        if (value === undefined || value === null) {
            return "";
        } else {
            if (!isNaN(value)) {
                return value.toString();
            } else {
                return trimString(value);
            }
        }
    } catch (err) {
        logData(err);
    }
    return value;
}


function trimString(inputValue) {
    var trimValue = inputValue;
    try {
        trimValue = inputValue.replace(/^(\s*\S.*\S)(\s*)$(?!\n)/m, "$1").replace(/^(\s*)(?=\S)/m, "");
    } catch (err) {
        logData("error while trimming:" + err);
    }
    return trimValue;
}

function logData(data) {
    if (window.console) console.log(data);
}


function isDataAlreadyPresent(arrayObj, dataToAdd) {
    var isExist = false;
    if (arrayObj.indexOf(dataToAdd) !== -1) {
        isExist = true;
    }
    return isExist;
}

function relationshipLink_C(currRowAdd) {
    orbArray_C = F.ORB_RPT_NAME.read().split(",");
    orbRelTypeArr_C = [];
    orbRptTitleArr_C = [];
    orbDispLinkArr_C = [];
    addItemImage_C = [];
    orbRelIDArr_C = [];
    orbFormTtlArr_C = [];

    for (i = 0; i < orbArray_C.length; i++) {
        orbRelTypeArr_C[i] = orbArray_C[i].substring(0, orbArray_C[i].indexOf("^*^"));
        orbRptTitleArr_C[i] = orbArray_C[i].substring(orbArray_C[i].indexOf("^*^") + 3, orbArray_C[i].indexOf("$#$"));
        orbDispLinkArr_C[i] = orbArray_C[i].substring(orbArray_C[i].indexOf("$#$") + 3, orbArray_C[i].indexOf("@#@"));

        addItemImage_C[i] = orbArray_C[i].substring(orbArray_C[i].indexOf("@#@") + 3, orbArray_C[i].indexOf("%#%"));

        orbRelIDArr_C[i] = orbArray_C[i].substring(orbArray_C[i].indexOf("%#%") + 3, orbArray_C[i].indexOf("&#&"));
        orbFormTtlArr_C[i] = orbArray_C[i].substring(orbArray_C[i].indexOf("&#&") + 3);
    }
    sections_C = [{
        heading: '<span class="asep">${Add}: </span>',
        links: []
    }];

    writeLinks_C(currRowAdd);
    setTimeout(writeLinks_C, 0);

}

function writeLinks_C(currRowAdd) {
    var html = "";
    var counter = 0;
    for (var j = 0; j < orbRelTypeArr_C.length; j++) {
        if ((edit_flag == 'N') || ((edit_flag == 'Y') && (!invokedFromDataBrowser))) {
            if (j === 9) {
                sections_C[0].links[counter] = '<br><a href=\"javascript:getContentORBReport(\'' + orbRptTitleArr_C[j] + '\')\" style="text-decoration:underline">' + orbDispLinkArr[j] + '</a>';
                counter++;
            } else {
                sections_C[0].links[counter] = '<a href=\"javascript:getContentORBReport(\'' + orbRptTitleArr_C[j] + '\')\" style="text-decoration:underline">' + orbDispLinkArr[j] + '</a>';
                counter++;
            }
        } else {
            sections_C[0].links[counter] = '<a href=\"\" </a>';
            counter++;
        }

    }

    for (var i = 0; i < sections_C.length; i++) {
        var section = sections_C[i];
        if ((edit_flag == 'N') || ((edit_flag == 'Y') && (!invokedFromDataBrowser))) {
            html += section.heading + section.links.join(" | ");
        } else {
            html += section.links.join(" ");
        }
    }
    AddOrb_C = 'MSAI_619_' + currRowAdd;
    if (document.getElementById(AddOrb_C)) document.getElementById(AddOrb_C).innerHTML = html;

}


function viewORBRptFromGrid(idx) {
    conf_itmDispVal = orbFormTtlArr[idx];
    conf_itmObjTyp = orbRelTypeArr[idx];
    conf_itmStorVal = orbRelIDArr[idx];

    F.CONFIGURED_OBJECT_TYPES.write(orbRelIDArr[idx]);
    F.CONFIGURED_OBJECT_TYPES.writeLov(orbFormTtlArr[idx]);
    var objType = F.CONFIGURED_OBJECT_TYPES.readValue();
    objType = decodeHtmlContent(objType);

    for (var i = 0; i < relRepNameArr.length; i++) {
        if (decodeHtmlContent(relRepNameArr[i]) == orbRptTitleArr[idx]) {
            getReport(relRepMetricArr[i], relRepArr[i]);
        }
    }
}

function trimString(inputValue) {
    var trimValue = inputValue;
    try {
        trimValue = inputValue.replace(/^(\s*\S.*\S)(\s*)$(?!\n)/m, "$1").replace(/^(\s*)(?=\S)/m, "");
    } catch (err) {
        logData("error while trimming:" + err);
    }
    return trimValue;
}


function logData(data) {
    if (window.console) console.log(data);
}


function displayErrorMsg(errorMsg) {

    if (trimString(errorMsg).lastIndexOf("JSONTYPE") == 0) {
        showErrorMessageFromJson('$error', errorMsg.split("JSONTYPE->")[1]);
    } else {
        showErrorBox('$error', errorMsg);
    }
}

function showErrorMessageFromJson(title, errorMsg) {
    var errorMsgObj = JSON.parse(errorMsg);
    var msg = "";
    for (k = 0; k < errorMsgObj.length; k++) {
        msg += errorMsgObj[k] + "<br/>";
    }
    showErrorBox(title, msg);
}


var messageBoxRef = null;
var messageBoxMinWidth = 300;

function showErrorBox(titleMsg, message) {
    messageBoxRef = Ext.MessageBox.show({
        title: titleMsg,
        msg: message,
        minWidth: messageBoxMinWidth,

        buttons: Ext.MessageBox.OK,
        icon: Ext.MessageBox.ERROR
    });
}

/**
function to show loading dialog box.
*/
function showLoadingDialog(msgToShow) {
    messageBoxRef = Ext.MessageBox.show({
        title: "$pleasewait",
        msg: msgToShow,
        progressText: 'Initializing...',
        minWidth: messageBoxMinWidth,
        wait: true,
        closable: false
    });
}

/**
function to close the loading dialog.
*/
function closeLoadingDialog() {
    Ext.MessageBox.hide();
}

function htmlDecode(input) {
    try {
        var e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes[0].nodeValue;
    } catch (err) {
        logData(input + '  ' + err);
        return input;
    }
}

function addIconAndHoverMessageWithIdAndMarginFloat(parentObject, message, topMargin, leftMargin) {
    //here element name and margin is provided.
    addIconAndHoverMessage(parentObject, message, true, topMargin, true, leftMargin);
}

function addIconAndHoverMessage(parentObject, message, isElementId, topMargin, isFloat, leftMargin) {
    var objParent = $('[name="' + parentObject + '"]');
    if (isElementId) {
        objParent = $("#" + parentObject);
    }
    var imgStyle = "margin-top: -" + topMargin + "px;";
    if (isFloat) {
        imgStyle += "float:left;";
    }
    imgStyle += "margin-left:" + leftMargin + "px;";
    $("<img border='0' id='" + parentObject + "help' src='/images/icons/information.png' class='myhoverElement' data='" + message + "' style='" + imgStyle + "'/>").insertAfter(objParent);
    bindToMouseHover("myhoverElement");
}

function bindToMouseHover(elementName) {

    $('.' + elementName).mouseenter(
        function() {
            /*when mouse enters displaying the message dialog.*/
            showOnHoverDialog(this);
        }
    );

    $('.' + elementName).mouseout(
        function() {
            /*when leaves then closing the message dialog.*/
            closeLoadingDialog();
            showHideDialogTitle(true);
        }
    );
}

function showOnHoverDialog(obj) {
    var msgToDisplay = $(obj).attr("data");
    messageBoxRef = Ext.MessageBox.show({
        msg: msgToDisplay,
        minWidth: messageBoxMinWidth,
        closable: false,
        modal: false
    });
    var position = $(obj).offset();
    messageBoxRef.getDialog().setPosition(position.left + $(obj).width(), (position.top + $(obj).height() - 10));
    //removing the title bar
    showHideDialogTitle(false);
}

//to hide or show the dialog title bar.
function showHideDialogTitle(isShow) {
    if (isShow) {
        //showing the title bar
        $(".x-tool-close").show();
        $(".x-window-header-text").show();
    } else {
        //removing the title bar
        $(".x-tool-close").hide();
        $(".x-window-header-text").hide();
    }
}


function checkObjAvailable(object, isId) {
    if (isId) {
        if (document.getElementById(object) !== undefined || document.getElementById(object) !== null) {
            return true;
        }
    } else {
        if (document.getElementByClass(object) !== undefined || document.getElementByClass(object) !== null) {
            return true;
        }
    }
    return false;
}

$(window).resize(function() {
    if (messageBoxRef != null && messageBoxRef != undefined && messageBoxRef.getDialog().isVisible()) {
        messageBoxRef.getDialog().center();
    }
});

function elasticTextArea(elementId, focusEvent) {

}