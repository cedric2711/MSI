    var relArr = [];
    var loadFirstTime = 'X';
    var grcReportDiv;
    var cntORB = 1;
    var cntCORB = 1;
    var recPerPage = 20;
    var supplemText;
    var conf_itmDispVal;
    var conf_itmStorVal;
    var conf_itmObjTyp;
    var g_obj_type;
    var newObjectType = 'NewObjectType';

    var myDirectfn = function(opts, fn, proxy) {
        var start = opts.start,
            end = opts.limit + opts.start,
            data = [];
        if (end > relArr.length) end = relArr.length;
        for (var i = start; i < end; i++)
            data.push(relArr[i]);
        data.total = relArr.length;
        fn(data, {
            status: true,
            result: data
        });
    };

    var relStore = new Ext.data.GroupingStore({
        data: relArr,

        pageSize: recPerPage,
        sortInfo: {
            field: 'ObjectName',
            direction: "ASC"
        },

        proxy: new Ext.data.DirectProxy({
            directFn: myDirectfn
        }),
        groupField: 'ObjectType',
        reader: new Ext.data.ArrayReader({
            id: 'ObjectID'
        }, ['ObjectType', 'ObjectName', 'ObjectID', 'Comments', 'Valid_From', 'Valid_Until', 'Row_Count', 'Location', 'CauseConsequence', 'Stakeholders', 'KeyRisk', 'applicableTo', 'additionalDetails', 'formUrl', 'NatureofRelationship', 'NatureofRelationshipPTOA', 'TypeOfOwner', 'ObjectiveType', 'ObjectiveExists', 'NewObjectType'])
    });


    var gridGroupView = new Ext.grid.GroupingView({
        groupByText: "$group_by",
        showGroupsText: "$show_group",
        sortAscText: "$sortAscText",
        sortDescText: "$sortDescText",
        columnsText: "$columnsText",
        forceFit: true,

        groupTextTpl: '{text} [{[values.rs.length]} {[values.rs.length> 1 ? "Item(s)" : "Item"]}]'

    });

    function extReady() {
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
            menuFilterText: "$menuFilterText",
            local: local,
            filters: [

                {
                    type: 'string',
                    dataIndex: 'ObjectName'
                }

            ]
        });
        var sm = new Ext.grid.CheckboxSelectionModel({

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
                '<p><i>&nbsp;&nbsp;{additionalDetails}</i></p>'),

            listeners: {
                collapse: function(rowIdx) {
                    relGrid.getView().refresh(true);
                }
            }
        });

        var RenderColor = function(value, meta, record, rowIndex) {
            var color;
            if (decodeHtmlContent(record.data.NewObjectType) == 'MS_GRC_ORGANIZATION') {
                cm.setHidden(12, true);
                cm.setHidden(15, true);
            }

            if (decodeHtmlContent(record.data.NewObjectType) != 'MS_GRC_ORGANIZATION') {

                color = '#D8D8D8';

                try {
                    meta.attr = 'style="background-color:' + color + ';"';
                } catch (err) {}
            } else if ((decodeHtmlContent(record.data.NewObjectType) == 'MS_GRC_ORGANIZATION') && value !== "") {
                if (value == 1) {
                    return 'Selected Org';
                } else if (value == 2) {
                    return 'Selected Org & Child Orgs';
                }
            }
        };

        var RenderColorforNature = function(value, meta, record, rowIndex) {
            var color;
            if ((decodeHtmlContent(record.data.NewObjectType) == 'MS_GRC_ASSET') ||
                (decodeHtmlContent(record.data.NewObjectType) == 'MS_GRC_PROCESS')) {
                cm.setHidden(15, true);
            }

            if ((decodeHtmlContent(record.data.NewObjectType) != 'MS_GRC_ASSET') &&
                (decodeHtmlContent(record.data.NewObjectType) != 'MS_GRC_PROCESS')) {
                color = '#D8D8D8';

                try {
                    meta.attr = 'style="background-color:' + color + ';"';
                } catch (err) {}
            }
            if (((F.DD_OBJECT_TYPE.read() == 'MS_GRC_CONTROL') && ((decodeHtmlContent(record.data.NewObjectType) == 'MS_GRC_ASSET') || (decodeHtmlContent(record.data.NewObjectType) == 'MS_GRC_PROCESS'))) ||
                ((F.DD_OBJECT_TYPE.read() == 'MS_GRC_EXCEPTION') && ((decodeHtmlContent(record.data.NewObjectType) == 'MS_GRC_ASSET') || (decodeHtmlContent(record.data.NewObjectType) == 'MS_GRC_PROCESS'))) ||
                ((F.DD_OBJECT_TYPE.read() == 'MS_GRC_EVIDENCE') && ((decodeHtmlContent(record.data.NewObjectType) == 'MS_GRC_ASSET') || (decodeHtmlContent(record.data.NewObjectType) == 'MS_GRC_PROCESS'))) ||
                ((F.DD_OBJECT_TYPE.read() == 'MS_GRC_QUESTION_PROCEDURE') && ((decodeHtmlContent(record.data.NewObjectType) == 'MS_GRC_ASSET') || (decodeHtmlContent(record.data.NewObjectType) == 'MS_GRC_PROCESS'))) ||
                ((F.DD_OBJECT_TYPE.read() == 'MS_GRC_KPI_KRI_DEFINITION') && (decodeHtmlContent(record.data.NewObjectType) == 'MS_GRC_PROCESS'))
            ) {
                color = '#D8D8D8';
                cm.setHidden(15, true);
                cm.setHidden(8, true);

                try {
                    meta.attr = 'style="background-color:' + color + ';"';
                } catch (err) {}

            }
            if ((F.DD_OBJECT_TYPE.read() == 'MS_GRC_PROCESS') && //added && condition instead of ||,so the grey color shed gone
                (decodeHtmlContent(record.data.NewObjectType) == 'MS_GRC_ASSET')) {
                color = '#D8D8D8';

                try {
                    meta.attr = 'style="background-color:' + color + ';"';
                } catch (err) {}

            } else if ((decodeHtmlContent(record.data.NewObjectType) == 'MS_GRC_ASSET') && value !== "") {
                if (value == 1) {
                    return 'Resides Within';
                } else if (value == 2) {
                    return 'Sequentially Connected To';
                } else if (value == 3) {
                    return 'Active Standby For';
                } else if (value == 4) {
                    return 'Passive Standby For';
                } else if (value == 5) {
                    return 'Other';
                }
            } else if ((decodeHtmlContent(record.data.NewObjectType) == 'MS_GRC_PROCESS') && value !== "") //added new
            {

                if (value == 1) {
                    return 'Supported By';
                } else if (value == 2) {
                    return 'Predecessor To';
                } else if (value == 3) {
                    return 'Successor For';
                } else if (value == 4) {
                    return 'Standby For';
                } else if (value == 5) {
                    return 'Other';
                }
            }

        };

        var RenderColorforNaturePtoA = function(value, meta, record, rowIndex) {
            var color;
            if ((decodeHtmlContent(record.data.NewObjectType) == 'Asset(s)') && (F.DD_OBJECT_TYPE.read() == 'MS_GRC_PROCESS')) {
                cm.setHidden(15, true);
                cm.setHidden(16, true);
            }

            if (decodeHtmlContent(record.data.NewObjectType) != 'Asset(s)') {
                color = '#D8D8D8';
                try {
                    meta.attr = 'style="background-color:' + color + ';"';
                } catch (err) {}
            }
            if (((F.DD_OBJECT_TYPE.read() == 'MS_GRC_CONTROL') && (decodeHtmlContent(record.data.NewObjectType) == 'MS_GRC_ASSET')) ||
                ((F.DD_OBJECT_TYPE.read() == 'MS_GRC_EXCEPTION') && (decodeHtmlContent(record.data.NewObjectType) == 'MS_GRC_ASSET')) ||
                ((F.DD_OBJECT_TYPE.read() == 'MS_GRC_EVIDENCE') && (decodeHtmlContent(record.data.NewObjectType) == 'MS_GRC_ASSET')) ||
                ((F.DD_OBJECT_TYPE.read() == 'MS_GRC_QUESTION_PROCEDURE') && (decodeHtmlContent(record.data.NewObjectType) == 'MS_GRC_ASSET'))

            ) {
                color = '#D8D8D8';
                cm.setHidden(15, true);
                cm.setHidden(8, true);

                try {
                    meta.attr = 'style="background-color:' + color + ';"';
                } catch (err) {}

            } else if ((decodeHtmlContent(record.data.NewObjectType) == 'MS_GRC_ASSET') && value !== "") {
                if (value == 1) {
                    return 'Supported By';
                } else if (value == 2) {
                    return 'Other';
                }
            }

        };


        var RenderColorforOwner = function(value, meta, record, rowIndex) {
            var color;
            if ((F.DD_OBJECT_TYPE.read() == 'MS_GRC_ASSET') && (decodeHtmlContent(record.data.NewObjectType) == 'MS_GRC_ORGANIZATION')) {
                cm.setHidden(17, true); //new change
            }
            if (decodeHtmlContent(record.data.NewObjectType) != 'MS_GRC_ORGANIZATION') {
                color = '#D8D8D8';

                try {
                    meta.attr = 'style="background-color:' + color + ';"';
                } catch (err) {}
            } else if ((decodeHtmlContent(record.data.NewObjectType) == 'MS_GRC_ORGANIZATION') && value !== "") {
                if (value == 1) {
                    return 'Business';
                } else if (value == 2) {
                    return 'Technical';
                }
            }
        };
        var get_colour_stakeholders = function(value, meta, record, rowIndex) {
            var color;
            if (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_ORGANIZATION') {
                cm.setHidden(10, true);
            }

            if (decodeHtmlContent(record.data.NewObjectType) !== 'MS_GRC_ORGANIZATION') {

                //color = '#D8D8D8';
                //color = '#fcfcfc';
                try {
                    meta.attr = 'style="background-color:' + color + ';"';
                } catch (err) {}
            } else if ((decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_ORGANIZATION') && value !== '') {
                return value;
            }



        };

        // below function is to change cell color fo applicable to based on library type
        var get_colour = function(value, meta, record, rowIndex) {
            var color;
            if (((F.DD_OBJECT_TYPE.read() === 'MS_GRC_ASSET') || (F.DD_OBJECT_TYPE.read() === 'MS_GRC_CONTROL') ||
                    (F.DD_OBJECT_TYPE.read() === 'MS_GRC_FUNCTION') || (F.DD_OBJECT_TYPE.read() === 'MS_GRC_PROCESS') ||
                    (F.DD_OBJECT_TYPE.read() === 'MS_GRC_PRODUCT') || (F.DD_OBJECT_TYPE.read() === 'MS_GRC_REQUIREMENT') ||
                    (F.DD_OBJECT_TYPE.read() === 'MS_GRC_RISK') || (F.DD_OBJECT_TYPE.read() === 'MS_GRC_STANDARD')
                )) {
                if (
                    (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_ASSET') ||
                    (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_CONTROL') ||
                    (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_FUNCTION') ||
                    (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_PROCESS') ||
                    (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_PRODUCT') ||
                    (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_REQUIREMENT') ||
                    (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_RISK') ||
                    (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_STANDARD')
                ) {
                    cm.setHidden(9, true); //Showing Cause/Consequence of other types other than Applies to Org.
                }


                if (
                    (decodeHtmlContent(record.data.NewObjectType) !== 'MS_GRC_ASSET') &&
                    (decodeHtmlContent(record.data.NewObjectType) !== 'MS_GRC_CONTROL') &&
                    (decodeHtmlContent(record.data.NewObjectType) !== 'MS_GRC_FUNCTION') &&
                    (decodeHtmlContent(record.data.NewObjectType) !== 'MS_GRC_PROCESS') &&
                    (decodeHtmlContent(record.data.NewObjectType) !== 'MS_GRC_PRODUCT') &&
                    (decodeHtmlContent(record.data.NewObjectType) !== 'MS_GRC_REQUIREMENT') &&
                    (decodeHtmlContent(record.data.NewObjectType) !== 'MS_GRC_RISK') &&
                    (decodeHtmlContent(record.data.NewObjectType) !== 'MS_GRC_STANDARD')) {
                    try {
                        meta.attr = 'style="background-color:' + color + ';"';
                    } catch (err) {}
                } else if (
                    ((decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_ASSET') ||
                        (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_CONTROL') ||
                        (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_FUNCTION') ||
                        (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_PROCESS') ||
                        (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_PRODUCT') ||
                        (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_REQUIREMENT') ||
                        (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_RISK') ||
                        (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_STANDARD')
                    ) && value !== '') {
                    return value;
                }
            }
        };

        var getkeyrisk = function(value, meta, record, rowIndex) {

            var color;
            if (((F.DD_OBJECT_TYPE.read() === 'MS_GRC_CONTROL') || (F.DD_OBJECT_TYPE.read() === 'MS_GRC_RISK') ||
                    (F.DD_OBJECT_TYPE.read() === 'MS_GRC_REQUIREMENT') || (F.DD_OBJECT_TYPE.read() === 'MS_GRC_OBJECTIVES')) &&
                (
                    (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_AREA_OF_COMPLIANCE') ||
                    (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_ASSET') ||
                    (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_ASSET_CLASS') ||
                    (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_CONTROL') ||
                    (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_FINANCIAL_ACCOUNTS') ||
                    (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_OBJECTIVES') ||
                    (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_PRODUCT') ||
                    (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_RISK') ||
                    (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_PROCESS') ||
                    (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_STANDARD') ||
                    (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_FUNCTION') //||
                    //(decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_ORGANIZATION')


                ))


            {
                cm.setHidden(11, true);
                if (value !== '') {
                    return value;
                }
            }
        };
        /*	else
        {	
        	if (decodeHtmlContent(record.data.NewObjectType) === 'MS_GRC_ORGANIZATION' )
        		{
        			try
        			{
        				meta.attr = 'style="background-color:'+ color +';"';
        			}
        			catch(err)
        			{
        			}
        		}
        		
        	
        	else if ((decodeHtmlContent(record.data.NewObjectType) !== 'MS_GRC_ORGANIZATION' ) && value !== '')
        		{	 
        			return value;
        			
        		}
        	}	
        	}
        	;
        	*/
        var RenderColorForLoc = function(value, meta, record, rowIndex) {
            var color;
            if (decodeHtmlContent((record.data.NewObjectType) == 'MS_GRC_ORGANIZATION') && ((F.DD_OBJECT_TYPE.read() == 'MS_GRC_CONTROL') ||
                    (F.DD_OBJECT_TYPE.read() == 'MS_GRC_EVIDENCE')
                )) {
                cm.setHidden(8, true);
            }
            if (
                (decodeHtmlContent(record.data.NewObjectType) != 'MS_GRC_ORGANIZATION') || ((F.DD_OBJECT_TYPE.read() != 'MS_GRC_CONTROL') && (F.DD_OBJECT_TYPE.read() != 'MS_GRC_EVIDENCE'))
            ) {
                color = '#D8D8D8';

                try {
                    meta.attr = 'style="background-color:' + color + ';"';
                } catch (err) {}
            } else if ((decodeHtmlContent(record.data.NewObjectType) == 'Applies to Organization(s)') && value !== "") {
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

        myDirectfn.directCfg = {
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


        var comboNature1 = new Ext.form.ComboBox({
            store: new Ext.data.ArrayStore({
                fields: ['dispVal', 'storedVal'],
                data: [
                    ['Resides Within', '1'],
                    ['Sequentially Connected To', '2'],
                    ['Active Standby For', '3'],
                    ['Passive Standby For', '4'],
                    ['Other', '5']
                ]
            }),
            displayField: 'dispVal',
            valueField: 'storedVal',
            mode: 'local',
            typeAhead: false,
            triggerAction: 'all'


        });



        var comboNature2 = new Ext.form.ComboBox({
            store: new Ext.data.ArrayStore({
                fields: ['dispVal', 'storedVal'],
                data: [
                    ['Supported By', '1'],
                    ['Other', '2']
                ]
            }),

            displayField: 'dispVal',
            valueField: 'storedVal',
            mode: 'local',
            typeAhead: false,
            triggerAction: 'all',

            value: 'Supported By'
        });


        var comboNature = new Ext.form.ComboBox({

            store: new Ext.data.ArrayStore({
                fields: ['dispVal', 'storedVal'],
                data: [
                    ['Supported By', '1'],
                    ['Predecessor To', '2'],
                    ['Successor For', '3'],
                    ['Standby For', '4'],
                    ['Other', '5']
                ]
            }),
            displayField: 'dispVal',
            valueField: 'storedVal',
            mode: 'local',
            typeAhead: false,
            triggerAction: 'all'

        });


        var comboOwner = new Ext.form.ComboBox({
            store: new Ext.data.ArrayStore({
                fields: ['dispVal', 'storedVal'],
                data: [
                    ['Business', '1'],
                    ['Technical', '2']
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
                    ['20'],
                    ['40'],
                    ['80'],
                    ['$All']
                ]
            }),
            mode: 'local',
            value: recPerPage,
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
                    header: '${Type}',
                    width: 1,
                    resizable: false,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'ObjectType' /* , editor : {xtype : 'textfield', allowBlank : false, editable : false} */
                }, {
                    header: '${Name}',
                    width: 125,
                    autoSizeColumn: true,
                    sortable: true,
                    hideable: false,
                    // for bugzilla 44892
                    dataIndex: 'ObjectName',
                    renderer: function formLink(value, metaData, record, rowIndex, colIndex, store) {
                        var linkVal = record.get('formUrl');

                        if ((decodeHtmlContent(record.get(newObjectType)) !== 'MS_GRC_ORGANIZATION') &&
                            (decodeHtmlContent(record.get(newObjectType)) !== 'ASSERTION') && (decodeHtmlContent(record.get(newObjectType)) !== 'MS_BCM_LOCATIONS') && (decodeHtmlContent(record.get(newObjectType)) !== 'MS_EMN_CONTACT') && (record.get('ObjectType') !== '$appliesToOrganizations') && (record.get('ObjectType') !== '$locations') && (record.get('ObjectType') !== '$assertions') && (record.get('ObjectType') != '$contactsAppliesTo')) {
                            if ((linkVal.toLowerCase().indexOf("fastform?id") !== -1) || (linkVal.toLowerCase().indexOf("pushinfolet?id=") !== -1)) {
                                return '<a target="_blank" href=' + htmlEncode(linkVal) + ' style ="color:#003377">' + value + '</a>';
                            } else {
                                return '<a href=' + linkVal + ' style ="color:#003377">' + value + '</a>';
                            }
                        } else {
                            return value;
                        }
                    }
                }, {
                    header: '${Library_ID}',
                    width: 1,
                    sortable: true,
                    dataIndex: 'ObjectID',
                    hidden: true /* , editor : {xtype : 'textfield', allowBlank : false} */
                }, {
                    header: 'Valid From',
                    width: 1,
                    sortable: true,
                    hideable: false,
                    // as per disc with Ashwini
                    hidden: true,
                    renderer: Ext.util.Format.dateRenderer('d/m/Y'),
                    dataIndex: 'Valid_From',
                    editor: {
                        xtype: 'datefield',
                        allowBlank: true
                    }
                }, {
                    header: 'Valid Until',
                    width: 1,
                    sortable: true,
                    hideable: false,
                    // as per disc with Ashwini
                    hidden: true,
                    renderer: Ext.util.Format.dateRenderer('d/m/Y'),
                    dataIndex: 'Valid_Until',
                    editor: {
                        xtype: 'datefield',
                        allowBlank: true
                    }
                }, {
                    header: '${Row_Number}',
                    width: 1,
                    sortable: true,
                    dataIndex: 'Row_Count',
                    hidden: true,
                    xtype: 'numbercolumn',
                    format: 0
                }, {
                    header: '${Location}',
                    width: 1,
                    sortable: true,
                    hideable: true,
                    dataIndex: 'Location',
                    editor: comboLoc,
                    //   renderer: Ext.util.Format.comboRenderer(comboLoc), // This is to override default behaviour of combo box if showing stored value
                    renderer: RenderColorForLoc
                }, {
                    header: '${Nature_of_Relationship}',
                    width: 1,
                    sortable: true,
                    dataIndex: 'CauseConsequence',
                    renderer: get_colour,
                    editor: new Ext.form.ComboBox({
                        store: [],
                        displayField: 'displayValue',
                        mode: 'local',
                        triggerAction: 'all',
                        hideTrigger: false,
                        emptyText: 'Select One',
                        typeAhead: false,
                        editable: false,
                        listeners: {
                            'select': selectCauseConsequence,
                            'render': function(combo) {
                                var sVal = ['Select One'];
                                var r = sVal.concat(decodeHtmlContent(text2dArr[F.CAUSE_CONSEQUENCE.getSequence() - 1]).split(','));
                                combo.store.loadData(r);
                            }
                        }
                    })

                }, {
                    header: '${Stakeholders}',
                    dataIndex: 'Stakeholders',
                    width: 1,
                    hidden: false,
                    renderer: get_colour_stakeholders,
                    editor: {
                        xtype: 'trigger',
                        width: 100,
                        triggerClass: 'triggerlens',
                        onTriggerClick: getstakeholders,
                        //editable:false,
                        //  focus:blurFocusedField,
                        //allowBlank:false,
                        emptyText: 'Click to Enter Value'
                    }
                },
                //10 
                {
                    header: F.ORB_KEY_RISK.getLabel(1),
                    tooltip: F.ORB_KEY_RISK.getLabel(1),
                    width: 1,
                    sortable: true,
                    dataIndex: 'KeyRisk',
                    renderer: getkeyrisk,
                    editor: new Ext.form.ComboBox({
                        store: [],
                        displayField: 'displayValue',
                        mode: 'local',
                        triggerAction: 'all',
                        hideTrigger: false,
                        emptyText: 'Select One',
                        typeAhead: false,
                        editable: false,
                        listeners: {
                            'select': selectKeyRisk,
                            'render': function(combo) {
                                var sVal = ['Select One'];
                                var r = sVal.concat(decodeHtmlContent(text2dArr[F.ORB_KEY_RISK.getSequence() - 1]).split(','));
                                combo.store.loadData(r);
                            }
                        }
                    })

                },

                //11
                {
                    header: '${Applicable_To}',
                    width: 150,
                    autoSizeColumn: true,
                    sortable: true,
                    hidden: false,
                    dataIndex: 'applicableTo',
                    editor: comboApp,
                    //    renderer: Ext.util.Format.comboRenderer(comboApp), // This is to override default behaviour of combo box if showing stored value
                    renderer: RenderColor
                }, {

                    header: '${Additional_Details}',
                    width: 1,
                    height: 100,
                    sortable: false,
                    hidden: true,
                    dataIndex: 'additionalDetails'
                }, {
                    header: '${Comments}',
                    width: 200,
                    autoSizeColumn: true,
                    sortable: true,
                    dataIndex: 'Comments',
                    // below rendered to show comments text as tooltip if any when on mouseover
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
                            // imposes a max length on this textarea even if the value is pasted in.
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
                }, {
                    // Nature of Relationship
                    header: '${Nature_of_Relationship}',
                    width: 150,
                    autoSizeColumn: true,
                    sortable: true,
                    hideable: true,
                    //hidden : true,
                    dataIndex: 'NatureofRelationship',
                    editor: (F.DD_OBJECT_TYPE.read() === 'MS_GRC_PROCESS') ? comboNature : comboNature1,
                    renderer: (F.DD_OBJECT_TYPE.read() === 'MS_GRC_PROCESS') ? Ext.util.Format.comboRenderer(comboNature) : Ext.util.Format.comboRenderer(comboNature1),
                    renderer: RenderColorforNature
                }, {
                    // Nature of Relationship for Process To Asset
                    header: '${Nature_of_Relationship_PtoA}',
                    width: 1,
                    sortable: true,
                    dataIndex: 'NatureofRelationshipPTOA',
                    editor: comboNature2,
                    renderer: Ext.util.Format.comboRenderer(comboNature2) // This is to override default behaviour of combo box if showing stored value
                }, {
                    // TYPE OF OWNER
                    header: '${type_of_Owner}',
                    width: 1,
                    sortable: true,
                    hideable: true,
                    //   hidden : true,
                    dataIndex: 'TypeOfOwner',
                    editor: comboOwner,
                    //     renderer: Ext.util.Format.comboRenderer(comboOwner), // This is to override default behaviour of combo box if showing stored value
                    renderer: RenderColorforOwner
                }, {
                    header: '${Type}',
                    width: 1,
                    resizable: false,
                    sortable: true,
                    hidden: true,
                    dataIndex: newObjectType
                }
            ],
            isCellEditable: function(col, row) {
                var field = relGrid.getColumnModel().getDataIndex(col);

                if (field === 'Location') {
                    var recordLoc = relStore.getAt(row);
                    if ((F.DD_OBJECT_TYPE.read() !== 'MS_GRC_CONTROL') && (F.DD_OBJECT_TYPE.read() !== 'MS_GRC_EVIDENCE') //OR CONDITION ADDED FOR EVIDENCE
                    ) {
                        return false;
                    } else if ((decodeHtmlContent(recordLoc.get(newObjectType)) !== 'MS_GRC_ORGANIZATION') ||
                        ((decodeHtmlContent(recordLoc.get(newObjectType)) === 'MS_GRC_ORGANIZATION') &&
                            ((edit_flag === 'N') || ((edit_flag === 'Y') && (invokedFromDataBrowser === true))))
                    ) {
                        return false;
                    }
                }
                if (field === 'applicableTo') {
                    var recordApplicable = relStore.getAt(row);
                    if ((decodeHtmlContent(recordApplicable.get(newObjectType)) !== 'MS_GRC_ORGANIZATION') ||
                        ((decodeHtmlContent(recordApplicable.get(newObjectType)) === 'MS_GRC_ORGANIZATION') &&
                            ((edit_flag === 'N') || ((edit_flag === 'Y') && (invokedFromDataBrowser === true))))) {
                        return false;
                    }
                }
                if (field === 'Stakeholders') {
                    //alert(1);
                    var recordStake = relStore.getAt(row);
                    if ((decodeHtmlContent(recordStake.get(newObjectType)) !== 'MS_GRC_ORGANIZATION') ||
                        ((decodeHtmlContent(recordStake.get(newObjectType)) === 'MS_GRC_ORGANIZATION') &&
                            ((edit_flag === 'N') || ((edit_flag === 'Y') && (invokedFromDataBrowser === true))))) {
                        return false;
                    }
                }
                if (field === 'CauseConsequence') {
                    var recordCause = relStore.getAt(row);
                    if ((
                            ((F.DD_OBJECT_TYPE.read() === 'MS_GRC_ASSET') || (F.DD_OBJECT_TYPE.read() === 'MS_GRC_CONTROL') ||
                                (F.DD_OBJECT_TYPE.read() === 'MS_GRC_FUNCTION') || (F.DD_OBJECT_TYPE.read() === 'MS_GRC_PROCESS') ||
                                (F.DD_OBJECT_TYPE.read() === 'MS_GRC_PRODUCT') || (F.DD_OBJECT_TYPE.read() === 'MS_GRC_REQUIREMENT') ||
                                (F.DD_OBJECT_TYPE.read() === 'MS_GRC_RISK') || (F.DD_OBJECT_TYPE.read() === 'MS_GRC_STANDARD')
                            ) &&
                            (
                                (decodeHtmlContent(recordCause.data[newObjectType]) === 'MS_GRC_ASSET') ||
                                (decodeHtmlContent(recordCause.data[newObjectType]) === 'MS_GRC_CONTROL') ||
                                (decodeHtmlContent(recordCause.data[newObjectType]) === 'MS_GRC_FUNCTION') ||
                                (decodeHtmlContent(recordCause.data[newObjectType]) === 'MS_GRC_PROCESS') ||
                                (decodeHtmlContent(recordCause.data[newObjectType]) === 'MS_GRC_PRODUCT') ||
                                (decodeHtmlContent(recordCause.data[newObjectType]) === 'MS_GRC_REQUIREMENT') ||
                                (decodeHtmlContent(recordCause.data[newObjectType]) === 'MS_GRC_RISK') ||
                                (decodeHtmlContent(recordCause.data[newObjectType]) === 'MS_GRC_STANDARD')
                            ) && ((edit_flag === 'Y') && (invokedFromDataBrowser === false))

                        )) {
                        return true;
                    } else
                        return false;
                }
                if (field === 'KeyRisk') {
                    //debugger;
                    var recordKeyRisk = relStore.getAt(row);
                    if ((((F.DD_OBJECT_TYPE.read() === 'MS_GRC_CONTROL') || (F.DD_OBJECT_TYPE.read() === 'MS_GRC_RISK') ||
                                (F.DD_OBJECT_TYPE.read() === 'MS_GRC_REQUIREMENT') || (F.DD_OBJECT_TYPE.read() === 'MS_GRC_OBJECTIVES')) &&
                            ((decodeHtmlContent(recordKeyRisk.data[newObjectType]) === 'MS_GRC_AREA_OF_COMPLIANCE') ||
                                (decodeHtmlContent(recordKeyRisk.data[newObjectType]) === 'MS_GRC_ASSET') ||
                                (decodeHtmlContent(recordKeyRisk.data[newObjectType]) === 'MS_GRC_ASSET_CLASS') ||
                                (decodeHtmlContent(recordKeyRisk.data[newObjectType]) === 'MS_GRC_CONTROL') ||
                                (decodeHtmlContent(recordKeyRisk.data[newObjectType]) === 'MS_GRC_FINANCIAL_ACCOUNTS') ||
                                (decodeHtmlContent(recordKeyRisk.data[newObjectType]) === 'MS_GRC_OBJECTIVES') ||
                                (decodeHtmlContent(recordKeyRisk.data[newObjectType]) === 'MS_GRC_PRODUCT') ||
                                (decodeHtmlContent(recordKeyRisk.data[newObjectType]) === 'MS_GRC_RISK') ||
                                (decodeHtmlContent(recordKeyRisk.data[newObjectType]) === 'MS_GRC_PROCESS') ||
                                (decodeHtmlContent(recordKeyRisk.data[newObjectType]) === 'MS_GRC_STANDARD') ||
                                (decodeHtmlContent(recordKeyRisk.data[newObjectType]) === 'MS_GRC_REQUIREMENT') ||
                                (decodeHtmlContent(recordKeyRisk.data[newObjectType]) === 'MS_GRC_FUNCTION')
                                /* ||
                                                               (decodeHtmlContent(recordKeyRisk.data[newObjectType]) === 'MS_GRC_ORGANIZATION') */
                            ) && ((edit_flag === 'Y') && (invokedFromDataBrowser === false))

                        )) {
                        return true;
                    } else
                        return false;
                }

                // below block is to disable comments field when it is in published mode
                if (field === 'Comments') {
                    var recordComments = relStore.getAt(row);
                    if ((edit_flag === 'N') || ((edit_flag === 'Y') && (invokedFromDataBrowser === true))) {
                        return false;
                    }
                }
                if (field === 'NatureofRelationship_removed') // Nature of Relationship
                {
                    var recordNature = relStore.getAt(row);
                    if (((F.DD_OBJECT_TYPE.read() === 'MS_GRC_PROCESS') && (decodeHtmlContent(recordNature.get(newObjectType)) === 'MS_GRC_ASSET')) ||
                        ((F.DD_OBJECT_TYPE.read() === 'MS_GRC_CONTROL') ||
                            (F.DD_OBJECT_TYPE.read() === 'MS_GRC_EXCEPTION') ||
                            (F.DD_OBJECT_TYPE.read() === 'MS_GRC_EVIDENCE') ||
                            (F.DD_OBJECT_TYPE.read() === 'MS_GRC_QUESTION_PROCEDURE') ||
                            (F.DD_OBJECT_TYPE.read() === 'MS_GRC_KPI_KRI_DEFINITION')))

                    {
                        return false;
                    } else if (((decodeHtmlContent(recordNature.get(newObjectType)) !== 'MS_GRC_ASSET') &&
                            (decodeHtmlContent(recordNature.get(newObjectType)) !== 'MS_GRC_PROCESS')) ||
                        ((decodeHtmlContent(recordNature.get(newObjectType)) === 'MS_GRC_ASSET') &&
                            ((edit_flag === 'N') || ((edit_flag === 'Y') && (invokedFromDataBrowser === true))))) {
                        return false;
                    }

                }
                //nature of relationship for process to asset
                if (field === 'NatureofRelationshipPTOA_removed') // Nature of Relationship
                {
                    var recordNaturePTOA = relStore.getAt(row);
                    if (F.DD_OBJECT_TYPE.read() !== 'MS_GRC_PROCESS') {
                        return false;
                    }
                    if ((decodeHtmlContent(recordNaturePTOA.get(newObjectType)) !== 'MS_GRC_ASSET') ||
                        ((decodeHtmlContent(recordNaturePTOA.get(newObjectType)) === 'MS_GRC_ASSET') &&
                            ((edit_flag === 'N') || ((edit_flag === 'Y') && (invokedFromDataBrowser === true))))) {
                        return false;
                    }

                }

                if (field === 'TypeOfOwner') // Type Of Owner
                {
                    if (F.DD_OBJECT_TYPE.read() !== 'MS_GRC_ASSET') {
                        return false;
                    }
                    var recordOwner = relStore.getAt(row);
                    if ((decodeHtmlContent(recordOwner.get(newObjectType)) !== 'MS_GRC_ORGANIZATION') ||
                        ((decodeHtmlContent(recordOwner.get(newObjectType)) === 'MS_GRC_ORGANIZATION') &&
                            ((edit_flag === 'N') || ((edit_flag === 'Y') && (invokedFromDataBrowser === true))))) {
                        return false;
                    }
                }

                return Ext.grid.ColumnModel.prototype.isCellEditable.call(this, col, row);
            }
        });
        var bbar = new Ext.PagingToolbar({
            store: relStore,
            pageSize: recPerPage,
            displayInfo: true,

            beforePageText: "$orb_beforePageText",
            firstText: "$orb_first_page",
            lastText: "$orb_last_page",
            nextText: "$orb_next_page",
            prevText: "$orb_prev_page",
            refreshText: "$orb_refresh_page",
            items: ['-', '$Objects_per_page', comboPage],
            displayMsg: "${Displaying_objects}",
            emptyMsg: '$No_objects_to_show'
        });
        comboPage.on('select', function(comboPage, record) {

            if ('$txt_All' == record.get('id')) {
                bbar.pageSize = this.relStore.getTotalCount();
            } else {
                bbar.pageSize = parseInt(record.get('id'), 10);
            }
            recPerPage = bbar.pageSize;
            bbar.doLoad(0);
        }, this);

        var relGrid = new Ext.grid.EditorGridPanel({
            store: relStore,
            id: 'relGrid',
            clicksToEdit: 1,
            plugins: [expander, filters],
            groupField: 'ObjectType',
            cm: cm,
            sm: sm,
            animCollapse: false,
            autoExpandColumn: 'ObjectType',
            tbar: [{
                    ctCls: 'mainToolbar',
                    text: '${delete_rows}',
                    id: 'btnDelete',
                    tooltip: '${Remove_the_selected_item}',
                    iconCls: 'msai_delete',
                    handler: function() {
                        var sm1 = relGrid.getSelectionModel();
                        var sel = sm1.getSelections();
                        var selectedRowIndexes = [];
                        var new_index1;

                        Ext.iterate(sel, function(banner, index) {
                            new_index1 = relGrid.getStore().indexOf(banner);

                            var rec = relGrid.getStore().getAt(new_index1);


                            setMarkedDeleteRow(F.ORB.getID(), rec.get('Row_Count'), rec.get('Row_Count'));
                            F.log('Object ' + F.TGT_OBJ_NAME.read(rec.get('Row_Count')) + ' deleted succesfully');

                            for (var i = 0; i < relArr.length; i++) {

                                if (relArr[i][2] == rec.get('ObjectID')) {
                                    if (rec.get('NewObjectType') == 'MS_GRC_ASSET' || rec.get('NewObjectType') == 'MS_GRC_PROCESS') {
                                        appl_To_delIds[appl_To_delIds.length] = relArr[i][2];
                                    }

                                    relStore.removeAt(new_index1);
                                    relArr.splice(i, 1);
                                    break;
                                }
                            }
                            for (var cnt1 = rec.get('Row_Count') + 1; cnt1 <= F.ORB.getRowCount(); cnt1++) {
                                if (!F.ORB.isMarkedForDeletion(cnt1)) {
                                    F.ROW_NUM.write(F.ROW_NUM.read(cnt1) - 1, cnt1);
                                }
                            }
                        });
                        relStore.loadData(relArr);
                        updateAutoBIASecProcess();

                    },
                    scope: this
                }, {
                    xtype: 'tbseparator'
                }, {
                    text: '${Expand_Collapse}',
                    menu: {
                        xtype: 'menu',
                        items: [{
                            text: '${Expand_All}',
                            iconCls: 'msai_expandall',
                            tooltip: '${Expand_Rows}',
                            handler: function() {
                                for (i = 0; i < relGrid.getStore().getCount(); i++) {
                                    expander.expandRow(i);
                                    relGrid.getView().refresh(true);
                                }
                            }
                        }, {
                            text: '${Collapse_All}',
                            iconCls: 'msai_collpaseall',
                            tooltip: '${Collapse_All_Rows}',
                            handler: function() {
                                for (i = 0; i < relGrid.getStore().getCount(); i++) {
                                    expander.collapseRow(i);
                                    relGrid.getView().refresh(true);
                                }
                            }
                        }]
                    }
                }, {
                    xtype: 'tbseparator'
                },

                {
                    xtype: 'tbseparator'
                }, {
                    id: 'clearFilter',
                    text: '${Clear_Filters}',
                    tooltip: '${Clear_Filtered_Data}',
                    iconCls: 'msai_filter',
                    handler: function() {
                        document.getElementById('ext-comp-1003').value = "";
                        relGrid.filters.clearFilters();
                    }
                }
            ],
            autoHeight: true,

            width: 650,

            stateful: true,

            region: 'center',
            stateId: 'grid',

            bbar: bbar,
            view: gridGroupView,

            listeners: {
                render: function() {
                    relGrid.getView().refresh(true);
                    var initParams = Ext.apply({}, {
                        start: 0,
                        limit: recPerPage
                    });
                    this.store.load({
                        params: initParams
                    });
                },
                'beforerender': function(grid) {
                    cm.setHidden(1, false);
                    cm.setHidden(3, false);
                    cm.setHidden(15, true);
                    cm.setHidden(14, false);
                    cm.setHidden(2, true);
                    cm.setHidden(4, true);
                    cm.setHidden(5, true);
                    cm.setHidden(6, true);
                    cm.setHidden(7, true);
                    cm.setHidden(8, true);
                    cm.setHidden(9, true);
                    cm.setHidden(10, true);
                    cm.setHidden(11, true);
                    cm.setHidden(12, true);
                    cm.setHidden(13, true);
                    cm.setHidden(16, true);
                    cm.setHidden(17, true);
                    cm.setHidden(18, true);

                },
                afteredit: function(e) {
                    var recUpd = relGrid.getStore().getAt(e.row);

                    F.REL_COMMENTS.write(recUpd.get('Comments'), recUpd.get('Row_Count'));
                    F.REL_VALID_FROM.write(recUpd.get('Valid_From'), recUpd.get('Row_Count'));
                    F.REL_VALID_UNTIL.write(recUpd.get('Valid_Until'), recUpd.get('Row_Count'));
                    F.SELF_REL_TYPE.write(recUpd.get('Location'), recUpd.get('Row_Count'));
                    F.APPLICABLE_TO.write(recUpd.get('applicableTo'), recUpd.get('Row_Count'));

                    if (F.NATURE_OF_RELATIONSHIP) {
                        F.NATURE_OF_RELATIONSHIP.write(recUpd.get('NatureofRelationship'), recUpd.get('Row_Count'));

                    }
                    if (F.NATURE_OF_REL_PTOA) {
                        F.NATURE_OF_REL_PTOA.write(recUpd.get('NatureofRelationshipPTOA'), recUpd.get('Row_Count'));
                    }
                    if (F.TYPE_OF_OWNER) {
                        F.TYPE_OF_OWNER.write(recUpd.get('TypeOfOwner'), recUpd.get('Row_Count'));
                    }

                    for (var i = 0; i < relArr.length; i++) {

                        if (relArr[i][2] == recUpd.get('ObjectID')) {
                            relArr[i][3] = recUpd.get('Comments');
                            relArr[i][4] = recUpd.get('Valid_From');
                            relArr[i][5] = recUpd.get('Valid_Until');
                            relArr[i][7] = recUpd.get('Location');
                            relArr[i][8] = recUpd.get('CauseConsequence');
                            relArr[i][9] = recUpd.get('Stakeholders');
                            relArr[i][10] = recUpd.get('KeyRisk');
                            relArr[i][11] = recUpd.get('applicableTo');
                            relArr[i][14] = recUpd.get('NatureofRelationship');
                            relArr[i][15] = recUpd.get('NatureofRelationshipPTOA');
                            relArr[i][16] = recUpd.get('TypeOfOwner');
                            e.record.commit();
                            break;
                        }
                    }
                }
            }
        });
        relGrid.render('MSAI_MULTI_ORB');
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
            }
        }
        return results;
    }


    function getReportDiv(repId) {
        grcReportDiv = grcReportDiv || getReportLinkId();


        for (var i in grcReportDiv) {
            if (repId == i) {
                return grcReportDiv[i];
            }
        }
        return false;
    }

    function selectKeyRisk(combo, record, index) {
        updateFieldsOfMultirow('KeyRisk', record.data.field1);
        var r = getRecordFromGrid();
        if (record.data.field1 === 'Select One') {
            r.data.KeyRisk = '';
        } else {
            r.data.KeyRisk = record.data.field1;
        }
    }


    function selectCauseConsequence(combo, record, index) {
        updateFieldsOfMultirow('CauseConsequence', record.data.field1);
        var r = getRecordFromGrid();
        if (record.data.field1 === 'Select One') {
            r.data.CauseConsequence = '';
        } else {
            r.data.CauseConsequence = record.data.field1;
        }
    }

    function updateFieldsOfMultirow(fieldKey, value, notMr) {
        console.log('rupdateFieldsOfMultirow ');
        var grid = Ext.getCmp('relGrid');
        var selectedRecord = grid.getSelectionModel().getSelected();
        var row2 = selectedRecord.get('Row_Count');
        var storedValue;

        if (fieldKey === 'CauseConsequence') {
            if (value === 'Select One') {
                storedValue = "";
                flagSelectOneO = true;
            } else {
                var rowseq = F.CAUSE_CONSEQUENCE.getSequence();
                storedValue = values2dArr[rowseq - 1][decodeHtmlContent(text2dArr[rowseq - 1]).split(',').indexOf(value)];
            }
            console.log('row count ' + row2);
            F.CAUSE_CONSEQUENCE.write(storedValue, row2);
        } else if (fieldKey === 'KeyRisk') {
            if (value === 'Select One') {
                storedValue = "";
                flagSelectOneO = true;
            } else {
                //debugger;
                var rowseqOrbKey = F.ORB_KEY_RISK.getSequence();
                storedValue = values2dArr[rowseqOrbKey - 1][decodeHtmlContent(text2dArr[rowseqOrbKey - 1]).split(',').indexOf(value)];
            }
            F.ORB_KEY_RISK.write(storedValue, row2);
        }
    }

    function getstakeholders(e) {

        var gridACD = Ext.getCmp('relGrid');
        var selectedRecord = gridACD.getSelectionModel().getSelected();
        var row1 = selectedRecord.get('Row_Count');
        //var seqNo = getSeq(F.STAKE_HOLDERS.getSequence(), row1);
        //Ext.getCmp('relGrid').getView().refresh();
        //getmlov(seqNo, F.STAKE_HOLDERS.getSequence(), row1);
        //alert(row1);
        stk_called = 'Y';
        if (F.STAKE_HOLDERS.read(row1) === '') {
            F.ORB.showPage(row1);
            F.ATO_ORB_TEMP.callInfolet(row1);
        } else {
            var seqNo = getSeq(F.STAKE_HOLDERS.getSequence(), row1);
            Ext.getCmp('relGrid').getView().refresh();
            //getmlov(seqNo, F.STAKE_HOLDERS.getSequence(), row1);
            getmlov(seqNo, F.STAKE_HOLDERS.getSequence(), row1);
            stk_called = 'N';
        }

    }

/*    function itemDisplayORB(row, storedval, dispval, supplemVal1, supplemId1, form_url) {
        var orbRowCnt;
        F.ORB.addRow(true, true);
        orbRowCnt = F.ORB.getRowCount();



        F.TGT_OBJ_TYPE.write(conf_itmDispVal, orbRowCnt);
        F.TGT_OBJ_ID.write(storedval, orbRowCnt);
        F.TGT_OBJ_NAME.write(dispval, orbRowCnt);



        if (decodeHtmlContent(conf_itmObjTyp) == 'MS_GRC_AREA_OF_COMPLIANCE') {
            supplemText = 'Requirement(s): \n';
        } else {
            supplemText = '';
            supplemVal1 = '';
        }

        F.REL_CONFIG_ID.write(conf_itmStorVal, orbRowCnt);
        F.ROW_NUM.write(row, orbRowCnt);
        F.ADDITIONAL_DETAILS.write(supplemVal1, orbRowCnt);
        F.ADDITIONAL_DETAILS_WITH_ID.write(supplemId1, orbRowCnt);
        F.ORB_FORM_URL.write(form_url, orbRowCnt);
        F.ADDITIONAL_COLUMN3.write(conf_itmObjTyp, orbRowCnt);
        var relEntry = [
            F.TGT_OBJ_TYPE.read(orbRowCnt),
            dispval,
            storedval,
            '',
            '',
            '',
            orbRowCnt,
            '',
            '',
            '',
            '',
            '',
            supplemText + supplemVal1,
            form_url,
            '',
            '',
            '',
            g_obj_type,
            '',
            conf_itmObjTyp
        ];

        relArr.push(relEntry);
        relStore.loadData(relArr);


    }*/

    function updateAutoBIASecProcess() {
        for (var i = 0; i <= appl_To_delIds.length; i++) {
            var idIndex = proc_Asset_Ids.indexOf(appl_To_delIds[i]);

            if (idIndex > -1)
                proc_Asset_Ids.splice(idIndex, 1);
        }

        if (appl_To_delIds.length > 0) {
            delGRCFFlag = true;
            addGRCF_BIAFlag = false;
            F.PROC_ASSET_ID.write(appl_To_delIds);
            appl_To_delIds = [];
            F.PROC_ASSET_ID.callInfolet();
        }

    }

    function showInfo(val) {}