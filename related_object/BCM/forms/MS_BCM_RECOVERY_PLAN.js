define(['modules/BCM/forms/MS_BCM_STAGE_INDICATOR','modules/BCM/forms/MS_BCM_COMMON_JS','modules/BCM/forms/MS_BCM_RECOVERY_PLAN_GANTT_JS','modules/BCM/forms/MS_BCM_PLAN_INTG_JS'], function() {
	var bganttConstants = new Object();
	var gv_resourceajaxcall_ct = 0;
    var rowCount = 0;
    var values;
    var dates;
    var SERVLET_URL = document.location.protocol+"//"+document.location.host+"/ui/";
    var proc_Asset_Ids = [];
    var appl_To_delIds = [];
    var AddOrb = 'MSAI_93';
    var localeIdValue;
    var localeStringValue;
    var bryntumLocaleFile;
    var extJS4LocaleFile;
    var localeDelimiter = '&';
    F.onLoad(formOnLoad);
    F.PLAN_OWNER.onChange(BCMLSI);
    F.PLAN_APPROVER.onChange(BCMLSI);
    F.LEVEL2_APPROVER.onChange(BCMLSI);
    F.PLAN_APPROVER.onChange(fnCheckApprover1);
    F.LEVEL2_APPROVER.onChange(fnCheckApprover2);
    F.VALID_FROM.onChange(validFromDateCheckPast);
    F.VALID_TO.onChange(validToDateCheckPast);
    F.NEXT_REVIEW_DATE.onChange(nextReviewDateCheckPast);
    F.TIER_VALUE.onChange(fnTierValue);
    F.PLAN_TYPE_PARAM_ID.onChange(fnplantype);
    var templateId = null;
    var templateName = null;
    var isFormOnLoad = false;
    var delGRCFFlag = false;
    var delChildRow = false;
    var addGRCF_BIAFlag = false;
    var BIASecTitles = [];
    var sec_bia_ids = [];
    bganttConstants.gnt_baseline_start = F.getMessage('gnt_baseline_start');
    bganttConstants.gnt_baseline_finish = F.getMessage('gnt_baseline_finish');
    bganttConstants.gnt_additional_info =  F.getMessage('gnt_additional_info');
    bganttConstants.gnt_priority =  F.getMessage('gnt_priority');
    bganttConstants.gnt_plan =  F.getMessage('gnt_plan');
    bganttConstants.gnt_close =  F.getMessage('gnt_close');
    bganttConstants.gnt_done =F.getMessage('gnt_done');
    bganttConstants.gnt_change_task_color =  F.getMessage('gnt_change_task_color');
    bganttConstants.gnt_new_task =  F.getMessage('gnt_new_task');
	bganttConstants.localeIdValue;
    bganttConstants.localeStringValue;
    bganttConstants.bryntumLocaleFile;
    bganttConstants.extJS4LocaleFile;
	var OBJECT_ACTION_REQ_FOR_CLARIFICATION = "REQ_CLR";
	var OBJECT_ACTION_CANCEL = "CNCL";
	
    var sectionParentList = [];
    var jPlanTemplateDataStr = null;
    var template_object_Id = null;
	
	F.getObject('MSAI_489').onClick(function () {
		initializeData();
		callBryntumGantt(bganttConstants);
	});
	
	F.getObject('MSAI_628').onClick(function () {
		initializeData();
		callBryntumGantt(bganttConstants);
	});

    F.CREATE_PLAN_AS.onChange(function() {
        template_object_Id = F.CREATE_PLAN_AS.read();
        if (template_object_Id === '') {
      
            for (var i = 1; i <= F.ORB.getRowCount(); i++) {
                F.TGT_OBJ_TYPE.write('', i);
                F.TGT_OBJ_ID.write('', i);
                F.TGT_OBJ_NAME.write('', i);
                F.REL_CONFIG_ID.write('', i);
                F.ROW_NUM.write('', i);
                F.ADDITIONAL_DETAILS.write('', i);
                F.ADDITIONAL_DETAILS_WITH_ID.write('', i);
                F.ORB_FORM_URL.write('', i);
                F.ADDITIONAL_COLUMN3.write('', i);
                F.REL_SOURCE_ID.write('', i);
            }
            var relArLength = relArr.length;
            relArr.splice(0, relArLength);
            relStore.loadData(relArr);
            F.ORB.setRowCount(0);
        } else {
            fetchPlanTemplateData();
            template_object_Id = '';
        }
        $('#MSAI_51').click();
    });

    function formOnLoad() {
		
		if (F.PREV_STAGE_DETAILS.read() === '') {
            F.PREV_STAGE_DETAILS.write('NONE');
        }
		
		if (F.PREV_COMMENTS.read() === '') {
            F.PREV_COMMENTS.write('NONE');
        }
		
		if (F.OBJECT_ID.read() === '') {
            F.OBJECT_ID.write('');
			F.getHeader().hideReportButton();
        }
		
		try {
			$($('legend.section-legend ')[1]).append('<html><font color="#de5958">*</font></html>');
			F.getSection('section_33').hide(); //hidden field section
			F.getSection('MSAI_84').hide(); //hidinng publish upversion field
			F.getObject('MSAI_7').hide();
			F.getObject('MSAI_864').hide();
			F.getObject('MSAI_781').hide();
			F.PLAN_HEADER.hide();
			F.PLAN_FOOTER.hide();
			F.getObject('MSAI_489').show();
			F.getObject('MSAI_628').hide();
			F.SEC.hide();
			F.TSK.hide();
			F.DPN.hide();
			F.ASG.hide();
			
            isFormOnLoad = true;
			
            if (returnEmptyIfNull(F.PDFPREVIEWID.read()) === '') {
                F.PDFPREVIEWID.callInfolet();
            }
			
            F.PLAN_ACTIVATION_TEAM.hide();
            F.ACTION_TEAM.hide();
            fnplantype();
            if (F.getFormParameter('emd') == 1 && F.getFormParameter('edit_flag') == 'Y') {
                F.getObject("MSAI_781").hide(); 
                F.getObject("MSAI_864").hide();
            }
            if (F.getFormParameter('ObjectType') === 'AllExercise' || F.getFormParameter('ObjectType') === 'PlannedExercise') {
                $('#MSAI_864').hide();
            }
			
            if (F.SYS_PARAM_APPR_REQ.read() === 'N') {
                F.PLAN_APPROVER.hide();
                F.LEVEL2_APPROVER.hide();
            } else {
                F.PLAN_APPROVER.show();
                F.LEVEL2_APPROVER.show();
            }
            if (F.SYS_PARAM_APPR_REQ.read() === 'Y') {
                F.PLAN_APPROVER.makeRequired();
                F.LEVEL2_APPROVER.makeRequired();
            }
			
            assignDefaultValues();
			
			if(document.getElementById("btn-edit").offsetLeft === 0) {
				BCMLSI();
			}
			
            if (F.getFormParameter('emd') != '5') {
                if (F.getFormParameter('showtoolBar') != 'No')
                    if (F.getFormParameter('showtoolBar') === 'N' || F.getFormParameter('edit_flag') === 'N') {
                }
            } else {
                $('#MSAI_864').hide();
            }
            showHideFields();
			
            F.DD_OBJECT_TYPE.callInfolet();
			
            if (F.LAST_REVIEW_DATE.read() === '') {
                F.LAST_REVIEW_DATE.hide();
            }
            
			F.DD_PROCESS_CODE.write('MS_BCM_PLAN_WORKFLOW');
			
			if (F.TGT_OBJ_ID.read(F.ORB.getRowCount()) === '' || F.TGT_OBJ_ID.read(F.ORB.getRowCount()) === 'undefined'){
				F.ORB.deleteRow(F.ORB.getRowCount());
				F.ORB.makeEmpty();
			}
			
            if (F.PLAN_STATUS.read() === 'NEW' && F.OBJECT_ID.read() !== '' && F.DD_CURRENT_STAGE.read() === 'CREATE_EDIT'|| F.UPVERSION.read() !== '') {
					F.UPVERSION.makeRequired();
			}else{
                F.UPVERSION.hide();
			}
			
			if(F.getFormParameter('action_type')==='copy'){
				F.UPVERSION.makeNotRequired();
				F.UPVERSION.hide();
			}
			
            if (showEditIcon) {
                if (checkObjAvailable('ACTION_COMMENTS_label__div', true)) {
                }
            }
            if (F.CHECK_CREATE_ACCESS.read() == 'N' && F.PLAN_STATUS.read() == 'NEW' && F.OBJECT_ID.read() == '') {
                Dialog.alert(F.getMessage('cancelFormAccess'));
                F.cancel();
            }
            if (F.TSK.getRowCount() === 1) {
                if (F.TSK_ID.read(1) === '') {
                    F.TSK.makeEmpty();
                }
            }
            if (F.DPN.getRowCount() === 1) {
                if (F.DPN_ID.read(1) === '') {
                    F.DPN.makeEmpty();
                }
            }
            if (F.ASG.getRowCount() === 1) {
                if (F.ASG_ID.read(1) === '') {
                    F.ASG.makeEmpty();
                }
            }
			recoveryStepsLink();
            var recoveryTab = document.getElementById('MSAI_222');
            if (recoveryTab.addEventListener)
                recoveryTab.addEventListener('click', initializeData, false);
            else if (recoveryTab.attachEvent)
                recoveryTab.attachEvent('onclick', initializeData);
            if (F.getFormParameter('emd') === '5' && typeof F.getFormParameter('showtoolBar') === 'undefined') {
                if (checkObjAvailable('msai_tree_tbar_addsection_' + F.SEC.getID(), true)) {
                    document.getElementById('msai_tree_tbar_addsection_' + F.SEC.getID()).style.display = 'none';
                }
            }
            if (checkObjAvailable('PLAN_VERSION_label__div', true))
                document.getElementById('PLAN_VERSION_label__div').style.textAlign = 'center';
            if (checkObjAvailable('PLAN_VERSION_field__div', true))
                document.getElementById('PLAN_VERSION_field__div').style.textAlign = 'center';
       
       } catch (err) {
            logData('Failure: ' + err);
        }
		
		var reportLinks = F.APPLIES_TO_LINK_NOT_REQ.read().split(",");
		
		for(var j =0 ; j<= reportLinks.length-1; j++){
			F.ORB.hideImportLink(reportLinks[j]);
		}
				
		if(F.getFormParameter('action_type')==='VIEWVERSION'){
			F.getHeader().hideWorkflowIndicator();
			F.getHeader().hideEditButton();
			F.getHeader().hideReportButton();
		}
        isFormOnLoad = false;
		
    }

    function fnTemplateLovInitialize() {
        templateId = F.CREATE_PLAN_AS.read();
        templateName = F.CREATE_PLAN_AS.readLov();
    }
	
    F.onSave(function() {
        F.SERVLET_URL.write(SERVLET_URL);
    });
	
	F.DD_ACTION.onChange(function () {
		var totalORBRowCount = F.ORB.getRowCount();
		var totalORBRowsMarkedForDel = 0;
	
		for (var counterORB in F.ORB.rows()) {
			if (F.ORB.isMarkedForDeletion(counterORB)) {
				totalORBRowsMarkedForDel++;
			}
		}
		
		if (F.ORB.getRowCount() === 0 || totalORBRowCount === totalORBRowsMarkedForDel) {
			F.APPLIES_TO.write('');
		} else {
			F.APPLIES_TO.write('RELGRID-UPDATED').makeNotRequired();
		}
		
		if (F.APPLIES_TO.isEmpty()) {
			F.APPLIES_TO.makeRequired();
		}
		
		if (OBJECT_ACTION_REQ_FOR_CLARIFICATION === F.DD_ACTION.read() || OBJECT_ACTION_CANCEL === F.DD_ACTION.read()) {
            F.ACTION_COMMENTS.makeRequired();
        } else {
            F.ACTION_COMMENTS.makeNotRequired();
        }
	});
    
	F.onSubmit(function() {
        F.SERVLET_URL.write(SERVLET_URL);       
        F.APPLIES_TO_LINK_NOT_REQ.write('');
        
		if (F.SYS_PARAM_APPR_REQ.read() == 'N'){
            F.PLAN_APPROVER.write('');
		}
		
        var diff = validate_start_and_end_date(new Date(), F.NEXT_REVIEW_DATE.readValue());
        if (diff === '-1') {
            Dialog.alert(F.getMessage('nextReviewDateCheckPast'));
            return false;
        }
		
        if (F.RECOVERY_PLAN_NAME.read().length > 0 && F.PLAN_TYPE.read().length > 0 && F.OWNER_ORGANIZATION.read().length > 0 && F.PLAN_OWNER.read().length > 0 && F.ORB.getRowCount() > 0) {
            F.ORB_RPT_NAME.write('');
        }
		
        F.LOGGED_USER_LOCALE.write('');
		
		if (F.OBJECT_ID.read() === '') {
            F.OBJECT_ID.write('NONE');
        }
		
        return true;
    });

    function fnCheckApprover1() {
        var approver1 = F.PLAN_APPROVER.read();
        var approver2 = F.LEVEL2_APPROVER.read();
        var approver1IsSelected = approver1.length > 0;
        var approver2IsSelected = approver2.length > 0;
        if (!approver1IsSelected && approver2IsSelected) {
            Dialog.alert(F.getMessage('approverOneMessage'));
            F.LEVEL2_APPROVER.writeLov('');
            F.LEVEL2_APPROVER.write('');
        }
        if (approver1IsSelected && approver2IsSelected) {
            if (approver1 === approver2) {
                Dialog.alert(F.getMessage('duplicateApprovermsg'));
                F.LEVEL2_APPROVER.writeLov('');
                F.LEVEL2_APPROVER.write('');
            }
        }
    }

    function fnCheckApprover2() {
        var approver1 = F.PLAN_APPROVER.read();
        var approver2 = F.LEVEL2_APPROVER.read();
        var approver1IsSelected = approver1.length > 0;
        var approver2IsSelected = approver2.length > 0;
        if (approver1IsSelected && approver2IsSelected) {
            if (approver1 === approver2) {
                Dialog.alert(F.getMessage('duplicateApprovermsg'));
                F.LEVEL2_APPROVER.writeLov('');
                F.LEVEL2_APPROVER.write('');
            }
        }
        if (!approver1IsSelected && approver2IsSelected) {
            Dialog.alert(F.getMessage('approverOneMessage'));
            F.LEVEL2_APPROVER.writeLov('');
            F.LEVEL2_APPROVER.write('');
        }
    }

    function validFromDateCheckPast() {
        F.VALID_TO.write('');
        F.TIER_VALUE.write('');
        F.NEXT_REVIEW_DATE.write('');
    }

    function validToDateCheckPast() {
        var diff = validate_start_and_end_date(F.VALID_FROM.readValue(), F.VALID_TO.readValue());
        if (diff === '-1') {
            F.VALID_TO.write('');
            Dialog.alert(F.getMessage('validToDateCheckPast'));
        }
    }

    function nextReviewDateCheckPast() {
        var tempCurrentDate = new Date();
        var diff = validate_start_and_end_date(tempCurrentDate, F.NEXT_REVIEW_DATE.readValue());
        if (diff === '-1') {
            F.NEXT_REVIEW_DATE.write('');
            Dialog.alert(F.getMessage('nextReviewDateCheckPast'));
        }
		
		if (F.TIER_VALUE.read() === 1 || F.TIER_VALUE.read() === 2) {
            F.TIER_VALUE.write(3);
        }
    }

    function assignDefaultValues() {
        if (F.DD_CURRENT_STAGE.read() === '') {
            F.DD_CURRENT_STAGE.write('CREATE_EDIT');
            F.DD_CURRENT_STAGE.callInfolet();
        }
		
        if (F.DD_CURRENT_STAGE.read() === 'CREATE_EDIT') {
            F.INITIATOR.write(F.DD_CURRENT_USER_NAME.read());
			F.INITIATOR.callInfolet();
        }
		
        F.RECOVERY_PLAN_NAME.makeRequired();
        F.OWNER_ORGANIZATION.makeRequired();
        F.PLAN_OWNER.makeRequired();
        if (F.SYS_PARAM_APPR_REQ.read() === 'Y') {
            F.PLAN_APPROVER.makeRequired();
        } else {
            if (F.SYS_PARAM_APPR_REQ.read() === 'N')
                F.PLAN_APPROVER.hide();
        }
        F.OBJECT_ACTION.makeRequired();
        if (F.VALID_FROM.read() === '' && F.PLAN_STATUS.read() === 'NEW' && F.OBJECT_ID.read() === '') {
            var currentDate = new Date();
            F.VALID_FROM.writeValue(currentDate);
        }
        if (F.PLAN_STATUS.read() == 'NEW' && F.OBJECT_ID.read() == '' || F.getFormParameter('emd') == 5) {
            F.getObject('MSAI_304').hide();
        }
        if (F.PLAN_VERSION.read() == '1.0') {
            F.getObject('MSAI_304').hide();
        }

        var localeValueTemp = F.LOGGED_USER_LOCALE.read();
        localeValueTemp = localeValueTemp.split(localeDelimiter);
        localeIdValue = localeValueTemp[0];
        localeStringValue = localeValueTemp[1];
        bryntumLocaleFile = localeValueTemp[2];
        extJS4LocaleFile = localeValueTemp[3];
        if (F.PROC_ASSET_ID.read().length > 0) {
            proc_Asset_Ids = F.PROC_ASSET_ID.read().split(',');
        }
    }

    function fnTierValue() {
        if (F.VALID_FROM.read() !== '') {
            var newDate = new Date(F.VALID_FROM.readDisplayedValue());
			
            if (F.TIER_VALUE.read()  === "" || F.TIER_VALUE.read() === 3) {
				F.NEXT_REVIEW_DATE.write('');
			}else{
                newDate.setFullYear(newDate.getFullYear() + F.TIER_VALUE.read());
				newDate.setDate(newDate.getDate() + 1);
                F.NEXT_REVIEW_DATE.write(newDate);
			}
        }
    }

    function fnNextReview() {
        
    }

    function fnplantype() {
        if (F.PLAN_TYPE.read() !== '') {
            var planType = F.PLAN_TYPE_PARAM_ID.read().substring(0, 1);
            if (planType === '1') { 
				//Recovery procedure and stratergy
				F.getSection('section_39').show();
				F.getSection('MSAI_222').hide();
                addGRCF_BIAFlag = true;
                //fnBIADetails();
                F.CREATE_PLAN_AS.show();
            } else if (planType === '2') { 
				//Recovery Timeline
				F.getSection('MSAI_222').show();
				F.getSection('section_39').hide(); 
                F.CREATE_PLAN_AS.hide();
            } else {
				F.getSection('section_39').show();
				F.getSection('MSAI_222').show();
                addGRCF_BIAFlag = true;
                //fnBIADetails();
                F.CREATE_PLAN_AS.show();
            }
        }
    }

    function showHideFields() {
        F.PLAN_TYPE.makeRequired();
     
        if (!showEditIcon) {
            if (enableDisableMrow())
                F.getObject('MSAI_7').hide();
        }
        F.UNIQ_OBJECT_ID.makeNotRequired();
    }

    function downloadPlan() {
        var locale_value = F.LOGGED_USER_LOCALE.read();
        var attachLink = F.DOWNLOAD_PDF.read();
        locale_value = locale_value.substring(0, locale_value.indexOf('&'));
        if (attachLink === '') {
            showLoadingDialog('$downloadingplanpdf');
            var planId = F.OBJECT_ID.read();
            getPdfLinkAndDownlaodPlan(planId, locale_value);
        } else {
            downloadPlanPdf(locale_value, planId, attachLink);
        }
    }

    function getPdfLinkAndDownlaodPlan(planId, locale) {
     /*   Ext.Ajax.request({
            url: 'Bcmplanpreviewservlet/ajax/Planpdf',
            method: 'POST',
            params: {
                objectId: planId,
                localeId: locale
            },
            success: function(response, options) {
                closeLoadingDialog();
                downloadPlanPdf(locale, planId, response.responseText);
            },
            failure: function(response, options) {
                closeLoadingDialog();
                return;
            }
        });*/
    }

    function downloadPlanPdf(locale_value, planId, attachLink) {
        var downloadpdf;
        var param_values;
        var localeFlag = true;
        if (attachLink.indexOf(';') !== -1) {
            downloadpdf = attachLink.split(';');
            for (var i = 0; i <= downloadpdf.length - 1; i++) {
                var localevalue_Index = downloadpdf[i].lastIndexOf(locale_value);
                if (localevalue_Index !== -1) {
                    localeFlag = false;
                    attachLink = downloadpdf[i].substring(0, localevalue_Index - 1);
                    break;
                }
            }
        } else if (attachLink.indexOf(locale_value) !== -1) {
            localeFlag = false;
            attachLink = attachLink.substring(0, attachLink.lastIndexOf(locale_value) - 1);
        }
        if (localeFlag) {
            Dialog.alert(F.getMessage('PDFnotFoundAlert'));
            return;
        }
        var formattedAttachLink = attachLink.replace(/#/g, '%23');
        downloadattach(66, formattedAttachLink);
    }

    function createRecoveryPlan() {
        return;
    }
	
    checkClob = function() {
        return false;
    };
	
    var currentTab = '';
  
    function printPreview() {
        if (!IS_PREVIEW_DOWNLOADING) {
            showLoadingDialog('$previewLoading');
            IS_PREVIEW_DOWNLOADING = true;
            var pdfPrevId = F.PDFPREVIEWID.read();
            var planId = '';
            var destFile = 'preview';
            var delayTime = 0;
            if (F.getFormParameter('edit_flag') == 'Y') {
                planId = F.OBJECT_ID.read();
                destFile += '_' + planId;
            } else {
                F.SERVLET_URL.write(SERVLET_URL);
                formchecknsave();
                destFile += '_' + pdfPrevId;
                delayTime = 5000;
            }
            setTimeout(function() {
                Ext.Ajax.request({
                    url: 'Bcmplanpreviewservlet/ajax/Previewpdf',
                    method: 'POST',
                    params: {
                        previewId: pdfPrevId,
                        planobjectId: planId,
                        userName: F.DD_CURRENT_USER_NAME.read()
                    },
                    success: function(response, options) {
                        closeLoadingDialog();
                        downloadattach(66, 'preview.pdf%23ms_attach_delimiter%23' + destFile + '.pdf');
                        IS_PREVIEW_DOWNLOADING = false;
                    },
                    failure: function(response, options) {
                        closeLoadingDialog();
                        IS_PREVIEW_DOWNLOADING = false;
                        logData('Failure: ' + response.responseText);
                        displayErrorMsg(response.responseText);
                    }
                });
            }, delayTime);
        }
    }
})