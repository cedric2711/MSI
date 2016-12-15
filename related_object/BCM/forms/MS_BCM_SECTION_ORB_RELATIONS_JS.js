var relContentArr = [];
var loadFirstTime_C = 'X';
var grcContentReportDiv;
var recPerPage_ORBC = 5;
var supplemContentText;
var edit_flag;
var invokedFromDataBrowser;
var parentRow;
var currRowAdd;


var conf_itmDispVal_C;
var conf_itmStorVal_C;
var conf_orbRelID_C;
var conf_orbRelTypeArr_C;


var myDirectfn_C = function(opts, fn, proxy) {
    var start = opts.start,
        end = opts.limit + opts.start,
        data = [];
    if (end > relContentArr.length) end = relContentArr.length;
    for (var i = start; i < end; i++)
        data.push(relContentArr[i]);
    data.total = relContentArr.length;
    fn(data, {
        status: true,
        result: data
    });
};


var relContentStore = new Ext.data.GroupingStore({
    data: relContentArr,

    pageSize: recPerPage_ORBC,
    sortInfo: {
        field: 'ObjectName',
        direction: "ASC"
    },

    proxy: new Ext.data.DirectProxy({
        directFn: myDirectfn_C
    }),
    groupField: 'ObjectType',
    reader: new Ext.data.ArrayReader({
        id: 'ObjectID'
    }, ['ObjectType', 'ObjectName', 'ObjectID', 'Comments', 'Valid_From', 'Valid_Until', 'Row_Count', 'Location', 'applicableTo', 'additionalDetails', 'formUrl'])
});


var gridGroupView = new Ext.grid.GroupingView({
    forceFit: true,

    groupTextTpl: '{text} [{[values.rs.length]} {[values.rs.length> 1 ? "$txt_items" : "$txt_item"]}]'
});

function extContentReady() {
    Ext.QuickTips.init();
    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

    Ext.ux.grid.filter.StringFilter.prototype.icon = '@WEBROOT@/ext/GridFilters/images/find.png';
    Ext.ux.menu.RangeMenu.prototype.icons = {
        gt: 'images/greater_than.png',
        lt: 'images/less_than.png',
        eq: 'images/equals.png'
    };

    var encode = false;

    var local = true;
    var filters = new Ext.ux.grid.GridFilters({
        encode: encode,
        local: local,
        filters: [{
            type: 'string',
            dataIndex: 'ObjectName'
        }]
    });
    var sm = new Ext.grid.CheckboxSelectionModel({

        width: '20px !important',
        listeners: {
            beforerowselect: function(sm, rowIndex, keep, rec) {
                if ((edit_flag == 'N') || ((edit_flag == 'Y') && (invokedFromDataBrowser))) {
                    if (F.HDN_EDIT_ORB_RELATION_TAB.read() === '0') {
                        Ext.getCmp('btnDelete').disable();
                        return false;
                    }
                }
            }
        }
    });


    var expander = new Ext.ux.grid.RowExpander({
        tpl: new Ext.Template(
            '<p>&nbsp;&nbsp;&nbsp;ID:&nbsp;<i>{ObjectID}</i></p>',
            '<p><i>&nbsp;&nbsp;{additionalDetails}</i></p>')
    });

    var RenderColor = function(value, meta, record, rowIndex) {
        var color;

        if (record.data.ObjectType == 'Applies to Organizations') {
            cm.setHidden(9, false);
        }
        if (record.data.ObjectType != 'Applies to Organizations') {
            color = '#D8D8D8';

            try {
                meta.attr = 'style="background-color:' + color + ';"';
            } catch (err) {}
        } else if ((record.data.ObjectType == 'Applies to Organizations') && value !== "") {
            if (value == 1) {
                return 'Selected Org';
            } else if (value == 2) {
                return 'Selected Org & Child Orgs';
            }
        }
    };


    var RenderColorForLoc = function(value, meta, record, rowIndex) {
        var color;
        if ((record.data.ObjectType == 'Applies to Organizations') &&
            ((F.DD_OBJECT_TYPE.read() == 'MS_GRC_CONTROL') ||
                (F.DD_OBJECT_TYPE.read() == 'MS_GRC_EVIDENCE')
            )
        ) {
            cm.setHidden(8, false);
        }

        if ((record.data.ObjectType != 'Applies to Organizations') || ((F.DD_OBJECT_TYPE.read() != 'MS_GRC_CONTROL') && (F.DD_OBJECT_TYPE.read() != 'MS_GRC_EVIDENCE'))) {
            color = '#D8D8D8';

            try {
                meta.attr = 'style="background-color:' + color + ';"';
            } catch (err) {}
        } else if ((record.data.ObjectType == 'Applies to Organizations') && value !== "") {
            if (value == 1) {
                return 'Location 1';
            } else if (value == 2) {
                return 'Location 2';
            } else if (value == 3) {
                return 'Location 3';
            } else if (value == 4) {
                return 'Location 4';
            }
        }
    };


    var InputTip = new Ext.Tip({
        id: 'InputTip',
        maxWidth: 500,
        items: [{
            xtype: 'box',
            autoEl: {
                tag: 'div',
                html: '',
                autoWidth: true,
                autoHeight: true
            }
        }]
    });

    InputTip.HideTask = new Ext.util.DelayedTask(function() {
        InputTip.el.fadeOut({
            endOpacity: 0,

            easing: 'easeOut',
            callback: function() {
                InputTip.hide();
            },
            scope: InputTip,
            duration: 0.5,
            remove: false,
            useDisplay: true
        });
    });

    myDirectfn_C.directCfg = {
        method: {
            len: 1
        }
    };

    Ext.util.Format.comboRenderer = function(combo) {
        return function(value) {
            var record = combo.findRecord(combo.valueField, value);
            return record ? record.get(combo.displayField) : combo.valueNotFoundText;
        };
    };
    var comboLoc = new Ext.form.ComboBox({
        store: new Ext.data.ArrayStore({
            fields: ['dispVal', 'storedVal'],
            data: [
                ['Location 1', '1'],
                ['Location 2', '2'],
                ['Location 3', '3'],
                ['Location 4', '4']
            ]
        }),
        displayField: 'dispVal',
        valueField: 'storedVal',
        mode: 'local',
        typeAhead: false,
        triggerAction: 'all',
        lazyRender: true,
        emptyText: 'Select Relation'
    });


    var comboApp = new Ext.form.ComboBox({
        store: new Ext.data.ArrayStore({
            fields: ['dispVal', 'storedVal'],
            data: [
                ['Selected Org', '1'],
                ['Selected Org & Child Orgs', '2']
            ]
        }),
        displayField: 'dispVal',
        valueField: 'storedVal',
        mode: 'local',
        typeAhead: false,
        triggerAction: 'all'

    });
    var comboPage = new Ext.form.ComboBox({
        name: 'perpage',
        width: 60,
        store: new Ext.data.SimpleStore({
            fields: ['id'],
            data: [
                ['5'],
                ['10'],
                ['20'],
                ['$txt_All']
            ]
        }),
        mode: 'local',
        value: recPerPage_ORBC,
        listWidth: 40,
        triggerAction: 'all',
        displayField: 'id',
        valueField: 'id',
        editable: false,
        forceSelection: true
    });
    var cm = new Ext.grid.ColumnModel({
        columns: [

            expander, sm, {
                header: '$ttl_Type',
                width: 110,
                sortable: true,
                hidden: true,
                dataIndex: 'ObjectType'
            }, {
                header: '$ttl_Name',
                width: 250,

                sortable: true,
                hideable: false,

                dataIndex: 'ObjectName',
                renderer: function formLink(value, metaData, record, rowIndex, colIndex, store) {
                    var linkVal = record.get('formUrl');
                    if ((record.get('ObjectType') != '$applies_to_Organizations') && (record.get('ObjectType') != '$location') &&
                        (record.get('ObjectType') != '$assertions') && (record.get('ObjectType') != '$contacts')
                    ) {
                        return '<a target="_blank" href=' + linkVal + ' style ="color:#003377">' + value + '</a>';
                    } else {
                        return value;
                    }
                }
            }, {
                header: '$ttl_Library_ID',
                width: 10,
                sortable: true,
                dataIndex: 'ObjectID',
                hidden: true
            }, {
                header: '$ttl_ValidFrom',
                width: 1,
                sortable: true,
                hideable: false,

                hidden: true,
                renderer: Ext.util.Format.dateRenderer('d/m/Y'),
                dataIndex: 'Valid_From',
                editor: {
                    xtype: 'datefield',
                    allowBlank: true
                }
            }, {
                header: '$ttl_ValidUntil',
                width: 1,
                sortable: true,
                hideable: false,

                hidden: true,
                renderer: Ext.util.Format.dateRenderer('d/m/Y'),
                dataIndex: 'Valid_Until',
                editor: {
                    xtype: 'datefield',
                    allowBlank: true
                }
            }, {
                header: '$ttl_Row_Number',
                width: 5,
                sortable: true,
                dataIndex: 'Row_Count',
                hidden: true,
                xtype: 'numbercolumn',
                format: 0
            }, {
                header: '$ttl_Location',
                width: 70,
                sortable: true,
                hideable: false,

                dataIndex: 'Location',
                editor: comboLoc,

                renderer: RenderColorForLoc
            }, {
                header: '$ttl_ApplicableTo',
                width: 400,
                sortable: true,
                hidden: false,
                dataIndex: 'applicableTo',
                editor: comboApp,

                renderer: RenderColor
            }, {
                header: '$ttl_Additional_Details',
                width: 150,
                height: 100,
                sortable: false,
                hidden: true,
                dataIndex: 'additionalDetails'
            }, {
                header: '$ttl_Comments',
                width: 200,
                sortable: true,
                dataIndex: 'Comments',

                renderer: function renderDescription(value, metaData, record, rowIndex, colIndex, store) {
                    try {
                        metaData.attr = 'ext:qtip="' + value + '"';
                        return value;
                    } catch (err) {}
                },
                editor: {
                    xtype: 'textarea',
                    boxMaxHeight: 46,
                    maxLength: 4000,
                    allowBlank: true,
                    maxLengthText: 'Comments exceeded maximum length 4000',
                    enableKeyEvents: true,
                    listeners: {

                        'keyup': function() {
                            var value = this.getValue();
                            if ((this.maxLength - value.length) < 100) {
                                InputTip.showBy(this.id, 'tl-bl');
                                InputTip.body.update('Comments field accomodates ' + (this.maxLength - value.length) + ' characters');
                                InputTip.HideTask.delay(2000);
                            }
                            if (value.length >= this.maxLength) this.setValue(value.slice(0, value.length - (value.length - this.maxLength)));
                        }
                    }
                }
            }
        ],
        isCellEditable: function(col, row) {
            var field = relContentGrid.getColumnModel().getDataIndex(col);
            var record;
            if (field === 'Location') {
                record = relContentStore.getAt(row);
                if ((F.DD_OBJECT_TYPE.read() != 'MS_GRC_CONTROL') && (F.DD_OBJECT_TYPE.read() != 'MS_GRC_EVIDENCE')) {
                    return false;
                } else if ((record.get('ObjectType') != 'Applies to Organizations') ||
                    ((record.get('ObjectType') == 'Applies to Organizations') &&
                        ((edit_flag == 'N') || ((edit_flag == 'Y') && (invokedFromDataBrowser))))
                ) {
                    return false;
                }
            }
            if (field === 'applicableTo') {
                record = relContentStore.getAt(row);
                if ((record.get('ObjectType') != 'Applies to Organizations') ||
                    ((record.get('ObjectType') == 'Applies to Organizations') &&
                        ((edit_flag == 'N') || ((edit_flag == 'Y') && (invokedFromDataBrowser))))
                ) {
                    return false;
                }
            }
            if (field === 'Comments') {
                record = relContentStore.getAt(row);
                if ((edit_flag == 'N') || ((edit_flag == 'Y') && (invokedFromDataBrowser))) {
                    return false;
                }
            }
            return Ext.grid.ColumnModel.prototype.isCellEditable.call(this, col, row);
        }
    });
    var bbar = new Ext.PagingToolbar({
        store: relContentStore,
        pageSize: recPerPage_ORBC,
        displayInfo: true,
        items: ['-', '$txt_Objects_per_page', comboPage],
        displayMsg: '$txt_Displaying_objects',
        emptyMsg: '$txt_No_objects_to_show'
    });
    comboPage.on('select', function(comboPage, record) {

        if ('$txt_All' == record.get('id')) {
            bbar.pageSize = this.relContentStore.getTotalCount();

        } else {
            bbar.pageSize = parseInt(record.get('id'), 10);
        }
        recPerPage_ORBC = bbar.pageSize;
        bbar.doLoad(0);
    }, this);

    var relContentGrid = new Ext.grid.EditorGridPanel({
        store: relContentStore,
        id: 'relContentGrid',
        clicksToEdit: 1,
        plugins: [expander, filters],
        groupField: 'ObjectType',
        cm: cm,
        sm: sm,
        frame: true,
        animCollapse: false,
        autoExpandColumn: 'ObjectType',
        tbar: [{
            text: '$txt_delete_rows',
            id: 'btnDelete',
            tooltip: '$txt_Remove_the_selected_item',
            iconCls: 'msai_delete',
            ref: '../deleteButton',
            handler: function() {

                var sm1 = relContentGrid.getSelectionModel();
                var sel = sm1.getSelections();
                var selectedRowIndexes = [];
                var new_index1;

                Ext.iterate(sel, function(banner, index) {
                    new_index1 = relContentGrid.getStore().indexOf(banner);


                    var rec = relContentGrid.getStore().getAt(new_index1);


                    setMarkedDeleteRow(F.COR.getID(), rec.get('Row_Count'), rec.get('Row_Count'));


                    for (var i = 0; i < relContentArr.length; i++) {



                        if (relContentArr[i][2] == rec.get('ObjectID')) {


                            relContentStore.removeAt(new_index1);
                            relContentArr.splice(i, 1);
                            break;
                        }
                    }

                    for (var cnt1 = rec.get('Row_Count') + 1; cnt1 <= F.COR.getRowCount(); cnt1++) {
                        if (!F.COR.isMarkedForDeletion(cnt1)) {
                            F.ROW_NUM.write(F.ROW_NUM.read(cnt1) - 1, cnt1);
                        }
                    }
                });
                relContentStore.loadData(relContentArr);
                Ext.getCmp('relContentGrid').getStore().reload();
                Ext.getCmp('relContentGrid').getView().refresh();

            },
            scope: this
        }, {
            xtype: 'tbseparator'
        }, {
            text: '$txt_Expand_Collapse',
            menu: {
                xtype: 'menu',
                items: [{
                    text: '$txt_Expand_All',
                    iconCls: 'msai_expandall',
                    tooltip: '$txt_Expand_Rows',
                    handler: function() {
                        for (i = 0; i < relContentGrid.getStore().getCount(); i++) {
                            expander.expandRow(i);
                        }
                    }
                }, {
                    text: '$txt_Collapse_All',
                    iconCls: 'msai_collpaseall',
                    tooltip: '$txt_Collapse_All_Rows',
                    handler: function() {
                        for (i = 0; i < relContentGrid.getStore().getCount(); i++) {
                            expander.collapseRow(i);
                            relContentGrid.getView().refresh(true);
                        }
                    }
                }]
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'tbseparator'
        }, {
            id: 'clearFilter',
            text: '$txt_Clear_Filters',
            tooltip: '$txt_Clear_Filtered_Data',
            iconCls: 'msai_filter',
            ref: '../clearFilter',
            handler: function() {
                relContentGrid.filters.clearFilters();
            }
        }],
        autoHeight: true,
        width: 650,

        stateful: true,

        region: 'center',
        stateId: 'grid',

        bbar: bbar,
        view: gridGroupView,

        listeners: {
            render: function() {
                relContentGrid.getView().refresh(true);
                var initParams = Ext.apply({}, {
                    start: 0,
                    limit: recPerPage_ORBC
                });
                this.store.load({
                    params: initParams
                });
            },
            'beforerender': function(grid) {
                cm.setHidden(8, true);
                cm.setHidden(9, true);
            },
            afteredit: function(e) {

                var recUpd = relContentGrid.getStore().getAt(e.row);
                F.REL_COMMENTS_C.write(recUpd.get('Comments'), recUpd.get('Row_Count'));
                F.SELF_REL_TYPE_C.write(recUpd.get('Location'), recUpd.get('Row_Count'));
                F.APPLICABLE_TO_C.write(recUpd.get('applicableTo'), recUpd.get('Row_Count'));


                for (var i = 0; i < relContentArr.length; i++) {

                    if (relContentArr[i][2] == recUpd.get('ObjectID')) {

                        relContentArr[i][3] = recUpd.get('Comments');
                        relContentArr[i][4] = recUpd.get('Valid_From');
                        relContentArr[i][5] = recUpd.get('Valid_Until');
                        relContentArr[i][7] = recUpd.get('Location');
                        relContentArr[i][8] = recUpd.get('applicableTo');
                        e.record.commit();
                        break;
                    }
                }
            }
        }
    });

    var tempDivName = 'MSAI_CONTENT_ORB_GRID_' + currRowAdd;
    var tempDomObjName = 'MSAI_621_' + currRowAdd;
    var cDiv = document.createElement('div');
    cDiv.id = tempDivName;
    document.getElementById(tempDomObjName).innerHTML = '';
    document.getElementById(tempDomObjName).appendChild(cDiv);
    relContentGrid.render(tempDivName);

}

function getContentReportLinkId() {
    var className = 'msai_attached_content_report_name';
    var hasClassName = new RegExp("(?:^|\\s)" + className + "(?:$|\\s)");
    var allElements = document.getElementsByTagName("span");
    var results = [];

    for (var i = 0;
        (allElements[i]) !== null; i++) {
        var element = allElements[i];
        var temparr = [];
        var elementClass = element.className;
        if (elementClass && elementClass.indexOf(className) != -1 && hasClassName.test(elementClass)) {
            results[element.innerHTML] = element;
        }
    }


    return results;
}

function getContentReportDiv(repId) {

    for (var i in grcContentReportDiv) {
        if (repId == i) return grcContentReportDiv[i];
    }
    return false;
}

function hideContentReportLinks() {
    divelem = getContentReportDiv(('$rpt_AddRisk'));
    if (divelem) divelem.style.display = 'none';
    divelem = getHyperLinkDiv(('$rpt_AddRisk'));
    if (divelem) divelem.style.display = 'none';
    divelem = getContentReportDiv(('$rpt_AddAssetClass'));
    if (divelem) divelem.style.display = 'none';
    divelem = getContentReportDiv(('$rpt_AddFinancialAccount'));
    if (divelem) divelem.style.display = 'none';
    divelem = getContentReportDiv(('Add Asset(s)'));
    if (divelem) divelem.style.display = 'none';
    divelem = getContentReportDiv(('$rpt_AddReference'));
    if (divelem) divelem.style.display = 'none';
    divelem = getContentReportDiv(('$rpt_AddRequirement'));
    if (divelem) divelem.style.display = 'none';
    divelem = getContentReportDiv(('$rpt_AddFrameworkReference'));
    if (divelem) divelem.style.display = 'none';
    divelem = getContentReportDiv(('$rpt_AddAreaofCompliance'));
    if (divelem) divelem.style.display = 'none';
    divelem = getContentReportDiv(('$rpt_AddObjectives'));
    if (divelem) divelem.style.display = 'none';
    divelem = getContentReportDiv(('$rpt_AddFunction'));
    if (divelem) divelem.style.display = 'none';
    divelem = getContentReportDiv(('$rpt_AddRegulatoryBodies'));
    if (divelem) divelem.style.display = 'none';
    divelem = getContentReportDiv(('$rpt_AddProcess'));
    if (divelem) divelem.style.display = 'none';
    divelem = getContentReportDiv(('$rpt_AddControl'));
    if (divelem) divelem.style.display = 'none';
    divelem = getContentReportDiv(('Add Organization(s)'));
    if (divelem) divelem.style.display = 'none';
    divelem = getContentReportDiv(('$rpt_AddAssertion'));
    if (divelem) divelem.style.display = 'none';
    divelem = getContentReportDiv(('$rpt_AddStandard'));
    if (divelem) divelem.style.display = 'none';
}



var ContentORBflag = false;

function getContentORBReport(dd_object_name) {
    for (var i = 0; i < relRepNameArr.length; i++) {
        relRepNameArr[i] = relRepNameArr[i].replace('&#40;', '(');
        relRepNameArr[i] = relRepNameArr[i].replace('&#41;', ')');

        if (relRepNameArr[i] == dd_object_name) {
            getReport(relRepMetricArr[i], relRepArr[i]);
            ContentORBflag = true;
        }
    }


    for (var counter = 0; counter < orbRptTitleArr_C.length; counter++) {
        if (orbRptTitleArr_C[counter] === dd_object_name) {
            conf_itmDispVal_C = orbDispLinkArr_C[counter];
            conf_orbRelID_C = orbRelIDArr_C[counter];
            conf_orbRelTypeArr_C = orbRelTypeArr_C[counter];
        }
    }
}


function showHideContentReportLinks() {
    var divelem = '';
    var objType = F.CONFIGURED_OBJECT_TYPES_C.readValue(parentRow).toUpperCase();
    supplemContentText = '';

    hideContentReportLinks();

    var invokedFromDataBrowser = false;

    if ((edit_flag == 'N') || ((edit_flag == 'Y') && (invokedFromDataBrowser))) {
        hideContentReportLinks();
    } else {
        if (objType == 'RISK(S)') {
            divelem = getContentReportDiv(('$rpt_AddRisk'));
            divelem.style.display = '';
        } else if (objType == 'REFERENCE(S)') {
            divelem = getContentReportDiv(('$rpt_AddReference'));
            divelem.style.display = '';
            supplemContentText = 'Reference Type: \n';
        } else if (objType == 'REQUIREMENT(S)') {
            divelem = getContentReportDiv(('$rpt_AddRequirement'));
            divelem.style.display = '';
        } else if (objType == 'FRAMEWORK REFERENCE(S)') {
            divelem = getContentReportDiv(('$rpt_AddFrameworkReference'));
            divelem.style.display = '';
            supplemContentText = 'Framework Reference Type: \n';
        } else if (objType == 'AREA(S) OF COMPLIANCE') {
            divelem = getContentReportDiv(('$rpt_AddAreaofCompliance'));
            divelem.style.display = '';
            supplemContentText = 'Requirement(s): \n';
        } else if (objType == 'OBJECTIVE(S)') {
            divelem = getContentReportDiv(('$rpt_AddObjectives'));
            divelem.style.display = '';
        } else if (objType == 'FUNCTION(S)') {
            divelem = getContentReportDiv(('$rpt_AddFunction'));
            divelem.style.display = '';
        } else if (objType == 'ASSET(S)') {
            divelem = getContentReportDiv(('$rpt_AddAssets'));
            divelem.style.display = '';
        } else if (objType == 'REGULATORY BOD(IES)') {
            divelem = getContentReportDiv(('$rpt_AddRegulatoryBodies'));
            divelem.style.display = '';
        } else if (objType == 'PROCESS(S)') {
            divelem = getContentReportDiv(('$rpt_AddProcess'));
            divelem.style.display = '';
        } else if (objType == 'CONTROL(S)') {
            divelem = getContentReportDiv(('$rpt_AddControl'));
            divelem.style.display = '';
        } else if (objType == 'APPLIES TO ORGANIZATION(S)') {
            divelem = getContentReportDiv(('Add Organization(s)'));
            divelem.style.display = '';
            supplemContentText = 'Owner(s): \n';
        } else if (objType == 'FINANCIAL ACCOUNT(S)') {
            divelem = getContentReportDiv(('$rpt_AddFinancialAccount'));
            divelem.style.display = '';
        } else if (objType == 'ASSET CLASS(ES)') {
            divelem = getContentReportDiv(('$rpt_AddAssetClass'));
            divelem.style.display = '';
        } else if (objType == 'ASSERTION(S)') {
            divelem = getContentReportDiv(('$rpt_AddAssertion'));
            divelem.style.display = '';
        } else if (objType == 'STANDARD(S)') {
            divelem = getContentReportDiv(('$rpt_AddStandard'));
            divelem.style.display = '';
        }
    }
}


F.CONFIGURED_OBJECT_TYPES_C.onChange(function(row) {
    parentRow = row;
    showHideContentReportLinks();
});


function itemDisplayContentORB(row, storedval, dispval, supplemVal1, supplemId1, form_url) {
    var orbRowCnt;
    F.COR.addRow(true, true);

    orbRowCnt = F.COR.getRowCount();

    F.ADDITIONAL_COLUMN5_C.write(F.SECTION_ID_SEC.read(parentRow), orbRowCnt);

    F.ADDITIONAL_COLUMN3_C.write(conf_orbRelTypeArr_C, orbRowCnt);




    F.TGT_OBJ_TYPE_C.write(conf_itmDispVal_C, orbRowCnt);

    F.TGT_OBJ_ID_C.write(storedval, orbRowCnt);

    F.TGT_OBJ_NAME_C.write(dispval, orbRowCnt);

    F.REL_CONFIG_ID_C.write(conf_orbRelID_C, orbRowCnt);

    F.ROW_NUM_C.write(row, orbRowCnt);

    F.ADDITIONAL_DETAILS_C.write(supplemVal1, orbRowCnt);

    F.ADDITIONAL_DETAILS_WITH_ID_C.write(supplemId1, orbRowCnt);

    F.ORB_FORM_URL_C.write(form_url, orbRowCnt);

    var relEntry = [F.TGT_OBJ_TYPE_C.read(orbRowCnt),
        dispval,
        storedval,
        '',
        '',
        '',
        orbRowCnt,
        '',
        '',
        supplemContentText + supplemVal1,
        form_url
    ];

    ContentORBflag = false;
    relContentArr.push(relEntry);
    relContentStore.loadData(relContentArr);
    Ext.getCmp('relContentGrid').getStore().reload();
}

function GRCContent_OnLoad(parentCurrentRow) {
    if (F.COR) {
        includeContentORB(parentCurrentRow);
    }


}

function includeContentORB(parentCurrentRow) {
    currRowAdd = parentCurrentRow;
    Ext.onReady(extContentReady);

    relationshipLink_C(currRowAdd);

    var mrDivId = 'MSAI_MULTI_DIV_' + F.COR.getID();
    F.getObject(mrDivId).style.display = 'none';

    if (F.REL_SOURCE_ID_C.read() === "") {
        F.REL_SOURCE_ID_C.write('NONE');
        F.REL_INST_ID_C.write('NONE', 1);
    }

    var parentField = F.SECTION_ID_SEC.read(parentCurrentRow);
    relContentArr = [];
    relContentStore.loadData(relContentArr);

    var tmpOrbRelTypeArr_C = [];
    var tmpOrbRptTitleArr_C = [];
    orbArray = F.ORB_RPT_NAME.read().split(",");
    for (i = 0; i < orbArray.length; i++) {
        tmpOrbRelTypeArr_C[i] = orbArray[i].substring(0, orbArray[i].indexOf("^*^"));
        tmpOrbRptTitleArr_C[i] = orbArray[i].substring(orbArray[i].indexOf("$#$") + 3, orbArray[i].indexOf("@#@"));
    }

    for (var i = 1;
        (i <= F.COR.getRowCount()); i++) {

        for (var k = 0; k < tmpOrbRelTypeArr_C.length; k++) {
            if (tmpOrbRelTypeArr_C[k] == F.ADDITIONAL_COLUMN3_C.read(i)) {
                F.TGT_OBJ_TYPE_C.write(tmpOrbRptTitleArr_C[k], i);
            }
        }
        if (F.ADDITIONAL_COLUMN5_C.read(i) !== "" && F.ADDITIONAL_COLUMN5_C.read(i) == parentField && !F.COR.isMarkedForDeletion(i)) {

            var OrgEntry = [decodeHtmlContent(F.TGT_OBJ_TYPE_C.read(i)), F.TGT_OBJ_NAME_C.read(i), F.TGT_OBJ_ID_C.read(i), F.REL_COMMENTS_C.read(i), '', '', i, F.SELF_REL_TYPE_C.read(i), F.APPLICABLE_TO_C.read(i), F.ADDITIONAL_DETAILS_C.read(i), F.ORB_FORM_URL_C.read(i)];
            relContentArr.push(OrgEntry);
            relContentStore.loadData(relContentArr);

        }
    }

}

function callParentORB(storedValues, displayValues) {
    var dispVal = displayValues.split("~");
    var origstorVal = storedValues.split("~");
    var supplemVal1 = '';
    var supplemId1 = '';
    var objExistsAlertFlag = false;
    var objExists = 'N';
    var objExistsName = '';
    var objFoundAt = '';
    if (currentTab === 2 && ContentORBflag) {
        ContentORBflag = false;
    }

    if (!ContentORBflag) {

        if (origstorVal[0] !== "") {
            if ((loadFirstTime == 'X') && (F.ORB.getRowCount() === 0)) {
                loadFirstTime = 'Y';
            } else {
                var cntUnMarkedForDel_ORB = 0;
                for (idx = 1; idx <= F.ORB.getRowCount(); idx++) {
                    if (!F.ORB.isMarkedForDeletion(idx)) {
                        cntUnMarkedForDel_ORB = cntUnMarkedForDel_ORB + 1;
                    }
                }
                cntORB = cntUnMarkedForDel_ORB + 1;
                loadFirstTime = 'N';
            }

            for (var i = 1; i <= origstorVal.length; i++) {
                var tgtObjName;
                var tgtObjId;
                var supplemLink = dispVal[i - 1].split('$#$');
                var supplemArr = supplemLink[0].split('^*^');

                if (decodeHtmlContent(conf_itmObjTyp) != 'MS_GRC_AREA_OF_COMPLIANCE') {
                    tgtObjName = supplemArr[0];
                    supplemVal1 = supplemArr[1];

                    if (loadFirstTime == 'N') {
                        objExists = 'N';
                        for (var j = 0; j < relArr.length; j++) {
                            if (relArr[j][2] == origstorVal[i - 1] && conf_itmDispVal === decodeHtmlContent(F.TGT_OBJ_TYPE.read(j))) {

                                objExists = 'Y';
                                objExistsAlertFlag = true;
                                if (objExistsName === "") {
                                    objExistsName = tgtObjName;
                                } else {
                                    objExistsName = objExistsName + ', ' + tgtObjName;
                                }

                            }
                        }

                        if (objExists == 'N') {
                            itemDisplayORB(cntORB, origstorVal[i - 1], tgtObjName, supplemVal1, '', supplemLink[1]);
                            cntORB = parseInt(cntORB) + 1;
                        }
                    } else {


                        itemDisplayORB(cntORB, origstorVal[i - 1], tgtObjName, supplemVal1, '', supplemLink[1]);

                        cntORB = parseInt(cntORB) + 1;
                    }

                    if (decodeHtmlContent(conf_itmObjTyp) == 'MS_GRC_PROCESS' || decodeHtmlContent(conf_itmObjTyp) == 'MS_GRC_ASSET') {
                        if (objExists == 'N') {
                            addGRCF_BIAFlag = true;
                            proc_Asset_Ids[proc_Asset_Ids.length] = origstorVal[i - 1];
                        }
                    } else {
                        addGRCF_BIAFlag = false;
                    }

                } else if (decodeHtmlContent(conf_itmObjTyp) == 'MS_GRC_AREA_OF_COMPLIANCE') {

                    objExists = 'N';
                    if (loadFirstTime == 'N') {

                        for (var k = 0; k < relArr.length; k++) {
                            F.log('relArr[k][2] : ' + relArr[k][2]);
                            F.log('relArr[k][6] : ' + relArr[k][6]);
                            F.log('supplemArr[1] : ' + supplemArr[1]);

                            if (relArr[k][2] == supplemArr[1] &&

                                (decodeHtmlContent(conf_itmObjTyp) == 'MS_GRC_AREA_OF_COMPLIANCE')) {
                                objExists = 'Y';
                                objFoundAt = relArr[k][6];

                                F.log('additional column1' + F.ADDITIONAL_DETAILS_WITH_ID.read(objFoundAt));

                                var existValCheckArray = F.ADDITIONAL_DETAILS_WITH_ID.read(objFoundAt).split(',');
                                F.log('existValCheckArray: ' + existValCheckArray);
                                F.log('origstorVal[i - 1]: ' + origstorVal[i - 1]);
                                var valExists = 'N';
                                valExists = 'N';
                                for (l = 0; l <= existValCheckArray.length; l++) {
                                    F.log('existValCheckArray[l]: ' + existValCheckArray[l]);
                                    if (existValCheckArray[l] == origstorVal[i - 1]) {
                                        objExistsAlertFlag = true;
                                        if (objExistsName === "") {
                                            objExistsName = supplemArr[0] + ': [' + supplemArr[2];
                                        } else {
                                            objExistsName = objExistsName + ', ' + supplemArr[2];
                                        }
                                        valExists = 'Y';
                                        break;
                                    }
                                }

                                if ((valExists != 'Y') && (origstorVal[i - 1] != '-1')) {

                                    F.ADDITIONAL_DETAILS.write(F.ADDITIONAL_DETAILS.read(objFoundAt) + ', ' + supplemArr[2], relArr[k][6]);
                                    F.ADDITIONAL_DETAILS_WITH_ID.write(F.ADDITIONAL_DETAILS_WITH_ID.read(objFoundAt) + ',' + origstorVal[i - 1], relArr[k][6]);

                                    var record = relStore.getAt(k);
                                    record.set('additionalDetails', F.ADDITIONAL_DETAILS.read(objFoundAt));

                                    relArr[k][9] = F.ADDITIONAL_DETAILS.read(objFoundAt);
                                    record.commit();
                                }
                            }
                        }
                    }
                    if (objExists == 'N') {
                        if (i == 1) {
                            tgtObjName = supplemArr[0];
                            tgtObjId = supplemArr[1];
                        }
                        F.log('Additional Name' + supplemArr[2]);

                        if (origstorVal[i - 1] !== "") {

                            if (supplemVal1 === "") {

                                supplemVal1 = supplemArr[2];
                                supplemId1 = origstorVal[i - 1];

                                if (origstorVal[i - 1] == '-1') {
                                    supplemVal1 = 'None';
                                    supplemId1 = origstorVal[i - 1];
                                }
                            } else {

                                supplemVal1 = supplemVal1 + ', ' + supplemArr[2];

                                supplemId1 = supplemId1 + ',' + origstorVal[i - 1];

                                if (origstorVal[i - 1] == '-1') {

                                    supplemVal1 = supplemVal1 + ', ' + 'None';
                                    supplemId1 = supplemId1 + ',' + origstorVal[i - 1];
                                }
                            }
                        }
                        if (i == origstorVal.length) {
                            F.log('callling itemdisplayorb from pos 3');

                            itemDisplayORB(cntORB, tgtObjId, tgtObjName, supplemVal1, supplemId1, supplemLink[1]);
                            cntORB = cntORB + 1;
                        }
                    }
                }
            }

        }
        if (objExistsAlertFlag) {

            objExistsName = objExistsName.replace('undefined', 'None');
            if ((decodeHtmlContent(conf_itmObjTyp) != 'MS_GRC_ORGANIZATION') &&
                (decodeHtmlContent(conf_itmObjTyp) != 'MS_GRC_AREA_OF_COMPLIANCE')) {
                msgbox1(conf_itmDispVal + ': [' + objExistsName + ']' + "${existobjcheck}");
            } else if (decodeHtmlContent(conf_itmObjTyp) == 'MS_GRC_ORGANIZATION') {

                msgbox1('[' + objExistsName + ']' + "${existorgcheck}");
            } else if (decodeHtmlContent(conf_itmObjTyp) == 'MS_GRC_AREA_OF_COMPLIANCE') {

                msgbox1(objExistsName + ']' + "${existaoccheck}");
            }
        }

    } else {
        addGRCF_BIAFlag = false;
        if (origstorVal[0] !== "") {
            if ((loadFirstTime_C == 'X') && (F.COR.getRowCount() === 0)) {
                loadFirstTime_C = 'Y';
            } else {

                var cntUnMarkedForDel = 0;

                for (idx = 1; idx <= F.COR.getRowCount(); idx++) {
                    if (!F.COR.isMarkedForDeletion(idx)) {
                        cntUnMarkedForDel = cntUnMarkedForDel + 1;
                    }
                }
                cntCORB = cntUnMarkedForDel + 1;
                loadFirstTime_C = 'N';
            }


            for (var l = 1; l <= origstorVal.length; l++) {
                var tgtObjName1;
                var tgtObjId1;
                var supplemLink1 = dispVal[l - 1].split('$#$');

                var supplemArr1 = supplemLink1[0].split('^*^');



                if ((F.CONFIGURED_OBJECT_TYPES_C.readValue(parentRow) != 'Applies to Organization(s)') && (F.CONFIGURED_OBJECT_TYPES_C.readValue(parentRow) != 'Area(s) of Compliance')) {

                    for (var x = 1; x <= supplemArr1.length; x++) {
                        if (x == 1) {
                            tgtObjName1 = supplemArr1[x - 1];
                        } else if (x == 2) {
                            supplemVal1 = supplemArr1[x - 1];
                        }
                    }

                    if (loadFirstTime_C == 'N') {

                        objExists = 'N';
                        for (var y = 0; y < relContentArr.length; y++) {
                            if (relContentArr[y][2] == origstorVal[l - 1] && conf_itmDispVal_C == relContentArr[y][0]) {
                                objExists = 'Y';
                                objExistsAlertFlag = true;
                                if (objExistsName === "") {
                                    objExistsName = tgtObjName1;
                                } else {
                                    objExistsName = objExistsName + ', ' + tgtObjName1;
                                }
                                break;
                            }
                        }
                        if (objExists == 'N') {

                            itemDisplayContentORB(cntCORB, origstorVal[l - 1], tgtObjName1, supplemVal1, '', supplemLink1[1]);
                            cntCORB = cntCORB + 1;
                        }
                    } else {
                        F.TGT_OBJ_ID_C.write(origstorVal[l - 1], cntCORB);
                        F.TGT_OBJ_NAME_C.write(tgtObjName1, cntCORB);
                        F.ROW_NUM_C.write(cntCORB, cntCORB);
                        itemDisplayContentORB(cntCORB, origstorVal[l - 1], tgtObjName1, supplemVal1, '', supplemLink1[1]);
                        cntCORB = cntCORB + 1;
                    }

                } else {

                    objExists = 'N';

                    if (loadFirstTime_C == 'N') {

                        for (var z = 0; z < relArr.length; z++) {
                            F.log('relArr[z][2] : ' + relArr[z][2]);
                            F.log('relArr[z][6] : ' + relArr[z][6]);
                            F.log('supplemArr1[1] : ' + supplemArr1[1]);

                            if (relArr[z][2] == supplemArr1[1] &&
                                ((F.CONFIGURED_OBJECT_TYPES_C.readValue(parentRow) == 'Applies to Organization(s)') || (F.CONFIGURED_OBJECT_TYPES_C.readValue(parentRow) == 'Area(s) of Compliance'))) {
                                F.log('inside object exists');
                                objExists = 'Y';
                                objFoundAt = relArr[z][6];

                                F.log('additional column1' + F.ADDITIONAL_DETAILS_WITH_ID_C.read(objFoundAt));
                                var existValCheckArray1 = F.ADDITIONAL_DETAILS_WITH_ID_C.read(objFoundAt).split(',');
                                F.log('existValCheckArray1: ' + existValCheckArray1);
                                F.log('origstorVal[l - 1]: ' + origstorVal[l - 1]);
                                var valExists1 = 'N';
                                valExists1 = 'N';
                                for (l = 0; l <= existValCheckArray1.length; l++) {
                                    F.log('existValCheckArray1[l]: ' + existValCheckArray1[l]);
                                    if (existValCheckArray1[l] == origstorVal[l - 1]) {
                                        objExistsAlertFlag = true;
                                        if (objExistsName === '') {
                                            objExistsName = supplemArr1[0] + ': [' + supplemArr1[2];
                                        } else {
                                            objExistsName = objExistsName + ', ' + supplemArr1[2];
                                        }
                                        valExists1 = 'Y';
                                        break;
                                    }
                                }
                                if ((valExists1 != 'Y') && (origstorVal[l - 1] != '-1')) {
                                    F.ADDITIONAL_DETAILS_C.write(F.ADDITIONAL_DETAILS_C.read(objFoundAt) + ', ' + supplemArr1[2], relArr[z][6]);
                                    F.ADDITIONAL_DETAILS_WITH_ID_C.write(F.ADDITIONAL_DETAILS_WITH_ID_C.read(objFoundAt) + ',' + origstorVal[l - 1], relArr[z][6]);
                                    var record1 = relStore.getAt(z);
                                    record1.set('additionalDetails', F.ADDITIONAL_DETAILS_C.read(objFoundAt));

                                    relArr[z][9] = F.ADDITIONAL_DETAILS_C.read(objFoundAt);
                                    record1.commit();
                                }
                            }
                        }
                    }
                    if (objExists == 'N') {
                        tgtObjName1 = supplemArr1[0];
                        tgtObjId1 = supplemArr1[1];

                        F.log('Additional Name' + supplemArr1[2]);
                        if (origstorVal[l - 1] != '-1') {

                            if (supplemVal1 === '') {

                                supplemVal1 = supplemArr1[2];
                                supplemId1 = origstorVal[l - 1];
                            } else {

                                supplemVal1 = supplemVal1 + ', ' + supplemArr1[2];
                                supplemId1 = supplemId1 + ',' + origstorVal[l - 1];
                            }
                        }

                        itemDisplayContentORB(cntCORB, tgtObjId1, tgtObjName1, supplemVal1, supplemId1, supplemLink1[1]);
                        cntCORB = cntCORB + 1;

                    }
                }
            }
        }
        if (objExistsAlertFlag) {
            if ((F.CONFIGURED_OBJECT_TYPES_C.readValue(parentRow) != 'Applies to Organization(s)') && (F.CONFIGURED_OBJECT_TYPES_C.readValue(parentRow) != 'Area(s) of Compliance')) {
                msgbox1(F.CONFIGURED_OBJECT_TYPES_C.readValue(parentRow) + ': [' + objExistsName + '] is/are ignored; as they are already associated in the current content creation.');
            } else if (F.CONFIGURED_OBJECT_TYPES_C.readValue(parentRow) == 'Applies to Organization(s)') {
                msgbox1(objExistsName + '$txt_existorgcheck');
            } else if (F.CONFIGURED_OBJECT_TYPES_C.readValue(parentRow) == 'Area(s) of Compliance') {
                msgbox1(objExistsName + '$txt_existaoccheck');
            }
        }

    }
    F.PROC_ASSET_ID.write(proc_Asset_Ids);
    addPlanSectionDetails();
}


function addPlanSectionDetails() {

    if (addGRCF_BIAFlag) {
        if (F.PROC_ASSET_ID.read().length > 0) {
            proc_Asset_Ids = F.PROC_ASSET_ID.read().split(',');

        }
        var applies_to_ids = proc_Asset_Ids + '';
        if (applies_to_ids.length > 0) {
            F.PROC_ASSET_ID.write(applies_to_ids);
            delGRCFFlag = false;
            addGRCF_BIAFlag = true;
            F.PROC_ASSET_ID.callInfolet();
        }
        $('#MSAI_52').click();
    }

}