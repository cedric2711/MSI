var resultRsk = '';
var tempRskId = '';
var tempRskIdArr = '';
var isInserRsktMultirows = false;

function populateRskIntgDataInPlanSection(ids) {
    if (window.console)
        console.log('Inside populateRskIntgDataInPlanSection');

    Ext.Ajax.request({
        url: "Bcmplanintgservlet/ajax/Rskintgjson",
        method: 'POST',
        params: {
            objectIds: ids
        },
        success: function(response, options) {
            logData('populateRskIntgDataInPlanSection responseData: ' + response.responseText);
            resultRsk = response.responseText;
            manipulateRskJson();
            return;
        },
        failure: function(response, options) {
            logData('populateRskIntgDataInPlanSection failure ajax call: ' + response.responseText);
            return;
        }
    });
}

function manipulateRskJson() {

    //var templatePlanHeader = null;
    //var templatePlanFooter = null;
    //var templatePlanCopyRight = null;

    var planSectionRskObject = Ext.decode(resultRsk);
    // var planSectionArray = planSectionRskObject.PlansTemplateData;
    var rows = planSectionRskObject.length;

    structureLoadingFlag = true;
    //F.SEC.makeEmpty();
    sectionPaerntList = [];
    var i = 0;
    var repeater = new RepeatingOperation(function() {
        var rowinfo = planSectionRskObject[i];
        tempRskId = F.FLEX_VAR2.read();
        tempRskIdArr = tempRskId.split(",");
        isInserRsktMultirows = false;
        //for(j=0;j<tempRskIdArr.length;j++)
        //{
        if (tempRskId.indexOf(rowinfo.assessableEntityId + '#' + rowinfo.riskId) == -1) {
            tempRskId = tempRskId + (rowinfo.assessableEntityId + '#' + rowinfo.riskId) + ',';
            F.FLEX_VAR2.write(tempRskId);
            isInserRsktMultirows = true;
            //break;
        }
        //}
        if (isInserRsktMultirows)
            inserRsktMultirows(rowinfo);

        if (++i < rows) {
            repeater.step();
        } else {
            F.SEC.refreshTreeView();
            F.SEC.getNode(-1).expandChildNodes(true);
            structureLoadingFlag = false;
        }
    }, 70);
    repeater.step();
    F.SEC.refreshTreeView();
    for (i = 1; i <= F.SEC.getRowCount(); i++)
        fnSECMakeMandatory(i);
    F.SEC.getNode(-1).expandChildNodes(true);
    structureLoadingFlag = false;

    //F.PLAN_HEADER.write(templatePlanHeader);
    //F.PLAN_FOOTER.write(templatePlanFooter);
    //manipulateFieldsBySectionTypeVal();
    return;
}

function inserRsktMultirows(planSectionArray) {

    var sectionDetailsSec = '';
    sectionDetailsSec = 'Object Type : '.bold() + '<br>' + 'Assessed Entity(ies) : '.bold() + planSectionArray.assessableEntityName + '<br>' + 'Risk Name : '.bold() + planSectionArray.riskName + '<br>' + 'Risk Category : '.bold() + '<br>' + 'Inherent Score : '.bold() + planSectionArray.inhScore + '<br>' + 'Inherent Rating : '.bold() + planSectionArray.inherentRating + '<br>' + 'Residual Score : '.bold() + planSectionArray.residualScore + '<br>' + 'Residual Rating : '.bold() + planSectionArray.residualRating + '<br>' + 'Assessed on (Date) : '.bold() + planSectionArray.assessedOn;
    if (F.SECTION_TITLE_SEC.read(1) === '')
        F.SEC.makeEmpty();
    F.SEC.addRow(true, true);
    var row = F.SEC.getRowCount();
    F.SECTION_ID_SEC.write(row, row);
    F.SECTION_TITLE_SEC.write(planSectionArray.riskName, row);
    //fnSECAfterClickNode(row);
    F.SECTION_DETAILS_SEC.write(sectionDetailsSec, row);
    //F.SECTION_ATTR_SEC.write(planSectionArray.secLevelMan,row);
    //F.TEMP_SEC_ID.write(planSectionArray.sectionIdSec,row);
    //sectionId++;
}