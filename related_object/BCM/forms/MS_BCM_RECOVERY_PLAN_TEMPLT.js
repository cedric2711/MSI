define(['modules/BCM/forms/MS_BCM_COMMON_JS'], function(CommonJs) {
    var MAX_SECTIONS = F.getMessage('maxSections');
    var MAX_LEVELS = F.getMessage('maxLevels'); //$maxLevels;
    var MAX_SUBSECTIONS = F.getMessage('maxSubSections'); //$maxSubSections;
    var sectionRowCount = 0;
    var rowCount = 0;
    var values;
    var dates;
    var SERVLET_URL = '$!{SERVLET_URL}/';
    F.SECTION_TITLE_SEC.onChange(fnSecTitlevalidation);
    F.SECTION_TITLE_SEC.onChange(fnaddNodename);
    F.SEC.afterDeleteRow(fnCheckForLastRow);
    F.SEC.onDeleteRow(fnonDeleteNode);
    F.onLoad(formOnLoad);

    function formOnLoad() {
		
        F.RECOVERY_PLAN_TEMPLT_NAME.makeRequired();
        assignDefaultValues();
        showHideFields();
        F.DD_OBJECT_TYPE.callInfolet();
        initialize();
        objectCreationInfo();
        objectModificationInfo();
        addIconAndHoverMessageWithIdAndMarginFloat('VIEW_ORGANIZATIONS_label__div', F.getMessage('viewOrgsHelpText'), 15, 215);
        if (F.getFormParameter('emd') === '5') {
            if (document.getElementById('msai_tree_tbar_addsection_' + F.SEC.getID())) {
                document.getElementById('msai_tree_tbar_addsection_' + F.SEC.getID()).style.display = 'none';
            }
        }
    }

    function fnLoggedUserLocaleonChange() {}

    function makeTreeOnLoad() {
        F.SEC.parentOf([F.SEC]);
        F.SEC.setAttributes('Section', F.SECTION_ID_SEC, F.HDN_SECTION_FK_SEC);
        F.SEC.setNodeProperties('/images/DOC.png', [F.SECTION_TITLE_SEC], [F.SECTION_TITLE_SEC]);
        F.SEC.sort(F.HDN_SECTION_VERSION_SEC, 'asc');
        F.SEC.setAdvancedProperties({
            'orderKey': F.HDN_SECTION_VERSION_SEC
        });
        F.SEC.useTreeView(1000);
        if (F.SECTION_ID_SEC.isEmpty(1)) {
            F.SECTION_ID_SEC.write('1', 1, false);
        }
        if (!enableDisableMrow()) {
            if (document.getElementById('msai_tree_tbar_addsection_' + F.SEC.getID())) {
                document.getElementById('msai_tree_tbar_addsection_' + F.SEC.getID()).style.display = 'none';
            }
        }
    }

    F.onSubmit(function() {
        F.SECTION_ID_SEC.write('1', 1, false);
        F.SECTION_ID_SEC.write('1', 1, false);
        for (i = 1; i <= F.SEC.getRowCount(); i++) {
            F.SECTION_ID_SEC.write(i + '', i, false);
            F.HDN_SECTION_FK_SEC.write(i + '', i, false);
        }
		
		if (F.OBJECT_ID.read() === '') {
					F.OBJECT_ID.write('NONE');
		}
        return true;
    });

    function assignDefaultValues() {
        if (F.DD_CURRENT_STAGE.read() === '') {
            F.DD_CURRENT_STAGE.write('CREATE_EDIT');
            F.DD_CURRENT_STAGE.callInfolet();
        }
        if (F.DD_CURRENT_STAGE.read() === 'CREATE_EDIT') {
            F.INITIATOR.write(F.DD_CURRENT_USER_NAME.read());
        }
        F.OWNER_ORGANIZATION.makeRequired();
        F.PLAN_OWNER.hide();
        if (F.OBJECT_ID.read() === '') {
            F.OBJECT_ID.write('');
            F.CHG_PROCESS_ID.write('NONE');
            F.CHG_INSTANCE_ID.write('NONE');
            F.CHG_EMAIL_STATUS.write('NONE');
        }
    }

    function showHideFields() {
        F.LEVEL1_APPROVER.hide();
        F.LEVEL2_APPROVER.hide();
        F.OBJECT_ACTION.hide();
        F.ACTION_COMMENTS.hide();
    }

    function createRecoveryPlan() {
        return;
    }
    F.SEC.afterEditViewRendered(function fnSECAfterAddRow(row) {
        var rc = F.SEC.getRowCount();
        var multiId = F.SECTION_TITLE_SEC.getMultiRowId();
        var secId = rc;
        for (var rowNum in F.SEC.rows()) {
            if (parseInt(secId) < parseInt(F.SECTION_ID_SEC.read(rowNum))) {
                secId = parseInt(F.SECTION_ID_SEC.read(rowNum)) + 1;
            }
        }
        F.SECTION_ID_SEC.write(secId + '', rc, false);
        F.HDN_SECTION_FK_SEC.write(secId + '', rc, false);
        if (F.SEC.isMarkedForDeletion(rc)) {
            document.getElementById('mrrowdb' + rc + 'id' + multiId).checked = false;
            F.SEC.markRowForDelete(rc, this);
        }

        F.SECTION_NODE_NAME_SEC.write(F.SECTION_TITLE_SEC.read());
        if (sectionRowCount === MAX_SECTIONS) {
            return;
        } else {
            sectionRowCount++;
        }
    });

    function fnSECAfterPageLoad(srow, erow) {}

    function fnSECAfterClickNode() {}
    F.SEC.onAddRow(function fnSECOnAddRow(pRow) {
        var section_count = F.SEC.getRowCount(); //F.SEC.getChildCount(pRow);
        if (parseInt(MAX_SECTIONS) + 1 == section_count) {
            Dialog.alert(F.getMessage('alert_SectionLength') + MAX_SECTIONS + F.getMessage('alert_Lengthalert1'));
            return false;
        }
        var child_count = F.SEC.getChildCount(pRow) + 1; //parseInt(node.childNodes.length) + 1;
        if (parseInt(MAX_SUBSECTIONS) + 1 == child_count) {
            Dialog.alert(F.getMessage('alert_SubsectionLength') + MAX_SUBSECTIONS + F.getMessage('alert_Lengthalert2'));
            return false;
        }
        var secRowCount = F.SEC.getRowCount();
        var flag = false;
        for (var row = 1; row <= secRowCount; row++) {
            var sec_title = F.SECTION_TITLE_SEC.read(row);
            if (sec_title === '' && !F.SEC.isMarkedForDeletion(row)) {
                flag = true;
                break;
            }
        }
        if (flag) {
            Dialog.alert(F.getMessage('alert_parentNodewithBlankData'));
            return false;
        }
        return true;
    });

    function fnSecTitlevalidation(pRow) {
        var queryString = F.SECTION_TITLE_SEC.read(pRow);
        if (queryString.length > 100) {
            Dialog.alert(F.getMessage('alert_SecTitle100Chars'));
            F.SECTION_TITLE_SEC.write('', pRow, false);
        }
        if (queryString.indexOf('!', 0) >= 0 || queryString.indexOf('^', 0) >= 0 || queryString.indexOf('\'', 0) >= 0 || queryString.indexOf('%', 0) >= 0 || queryString.indexOf('"', 0) >= 0 || queryString.indexOf('#', 0) >= 0 || queryString.indexOf('\\', 0) >= 0 || queryString.indexOf('/', 0) >= 0 || queryString.indexOf('~', 0) >= 0) {
            Dialog.alert(F.getMessage('alert_SpecCharSecName'));
            F.SECTION_TITLE_SEC.write('', pRow, false);
        }
    }

    function fnSecNumbervalidation(pRow) {
        var queryString = F.SECTION_NUMBER_SEC.read(pRow);
        if (queryString.length > 10) {
            Dialog.alert(F.getMessage('alert_SecNumber10Chars'));
            F.SECTION_NUMBER_SEC.write('', pRow, false);
        }
        if (queryString !== '' && !queryString.match(/^[0-9a-zA-Z.]+$/)) {
            Dialog.alert(F.getMessage('alert_SpecCharSecNumber'));
            F.SECTION_NUMBER_SEC.write('', pRow, false);
        }
        if (queryString.indexOf('..') != '-1') {
            Dialog.alert(F.getMessage('alert_ConsecdecimalSecNumber'));
            F.SECTION_NUMBER_SEC.write('');
            return false;
        }
        var cur_node = F.SEC.getNode(pRow);
        var cur_level = '';
        if ('undefined' != typeof cur_node)
            cur_level = cur_node.getDepth();
        var sec_row_count = F.SEC.getRowCount();
        if (queryString !== '') {
            for (var row = 1; row <= sec_row_count; row++) {
                if (!F.SEC.isMarkedForDeletion(row)) {
                    var node = F.SEC.getNode(row);
                    var level = '';
                    if ('undefined' != typeof node)
                        level = node.getDepth();
                    var sec_no = F.SECTION_NUMBER_SEC.read(row);
                    if (row !== pRow && cur_level === level && queryString.toUpperCase() === sec_no.toUpperCase()) {
                        Dialog.alert(F.getMessage('alert_UniqueSecNumber'));
                        F.SECTION_NUMBER_SEC.write('', pRow, false);
                    }
                }
            }
        }
    }

    function fnonDeleteNode(row) {
        var childLength = parseInt(F.SEC.getChildCount(row));
        if (childLength >= 1) {
		Dialog.confirm({
					title: F.getMessage('sec_delete_msg'),
					confirm: 'Ok',
					cancel: 'Cancel'
                },
                function() {
                   return true;
				},
				function(){
					return false;
				}); 
			
			//return Dialog.alert(F.getMessage('sec_delete_msg'));
			//return confirm(F.getMessage('sec_delete_msg'));
        }
        return true;
    }

    function fnSECvalidate(prow, pnode) {
        F.SECTION_NODE_NAME_SEC.write(F.SECTION_TITLE_SEC.read());
        if (sectionRowCount === MAX_SECTIONS) {
            return;
        } else {
            sectionRowCount++;
        }
    }

    function fnonContextMenuDisplayed(thisRow, primaryKey, cMenu) {
        cMenu.items.items[0].setText('Create Section');
        if (cMenu.items.items.length > 1) {
            cMenu.items.items[1].setText('Remove Section');
            cMenu.items.items[2].hide();
            cMenu.items.items[4].setText('Create Subsection');
        }
        if (!enableDisableMrow()) {
            for (var i = 0; i < cMenu.items.items.length; i++) {
                cMenu.items.items[i].setDisabled(true);
            }
        }
        return true;
    }

    function fnaddNodename(prow, pnode) {
        var name = F.SECTION_TITLE_SEC.read(prow);
        var number;
        if (name === 'undefined') {
            name = '';
        }
        if (number === 'undefined') {
            number = '';
        }
        F.SECTION_NODE_NAME_SEC.write(name, prow, false);
        F.SECTION_NODE_NAME_SEC.triggerEvent('updateTree', [prow]);
    }

    function fnCheckForLastRow(prow) {
        var lastSECRow = 0;
        F.SECTION_DETAILS_SEC.write('', prow);
        for (var counterSEC in F.SEC.rows()) {
            if (!F.SEC.isMarkedForDeletion(counterSEC)) {
                lastSECRow++;
            }
        }

        if (lastSECRow === 0) {
            deleteMultirows();
			F.SEC.makeEmpty();
            //F.SEC.addRow(true, true);
            F.SEC.refreshTreeView();
            F.SEC.clickNode(1);
        } else
            F.SEC.clickNode(F.SECTION_ID_SEC.read(F.SEC.getRowCount()));
    }

    function deleteMultirows() {
        for (var i = 1; i <= F.SEC.getRowCount(); i++) {
            F.HDN_SECTION_PARENT_TYPE_SEC.write('', i, false);
            F.HDN_SECTION_FK_SEC.write('', i, false);
            F.SECTION_NUMBER_SEC.write('', i, false);
            F.SECTION_TITLE_SEC.write('', i, false);
            F.HDN_SECTION_VERSION_SEC.write('', i, false);
            F.SECTION_NODE_NAME_SEC.write('', i, false);
            F.SECTION_ID_SEC.write('', i, false);
        }
    }

    function enableDisableMrow() {
        if (invokedFromDataBrowser || F.getFormParameter('emd') === '5') {
            return false;
        }
        return true;
    }
    checkClob = function() {
        return false;
    };

    function initialize() {
        F.DD_PROCESS_CODE.write('MS_BCM_PLN_TEMPLT_WF');
        F.SECTION_ID_SEC.write(1, 1, false);
        F.SECTION_ID_SEC.write(1, 1, false);
        F.HDN_SECTION_FK_SEC.write(1, 1, false);
        F.HDN_SECTION_FK_SEC.write(1, 1);
    }
})