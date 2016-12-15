/**
 * Tree - sub-module
 * The view extends the treeNodeView of ECP
 * We use this view in order to provide the user with addtional event handlers
 * two primary event handlers are assess and overRideView
 * Created by nagesh.gowtham
 * Enhanced by cedricm
 *
 * @class treeNodeView
 * @return treeNodeView which is every individual row in the treeView
 */
var validationArray = {};
/*F.relatedGrids = [{
    id: "ORB",
    name: "ORB",
    sectionId: "ORB",
    sectionType: 'grid',
    imports: [],
    filterFK: "SECTION_ID_SEC,SECTION_ID_SEC",
    filterPK: "APPLICABLE_TO,APPLICABLE_TO",
    behavior: "SECTIONTYPE"
}, {
    id: "RELORB",
    name: "RELORB",
    sectionId: "RELORB",
    sectionType: 'grid',
    imports: [],
    filterFK: "SECTION_ID_SEC,SECTION_ID_SEC",
    filterPK: "RELORB_SECTION_ID_SEC,RELORB_SECTION_ID_SEC",
    behavior: "SECTIONTYPE"
}];*/
define(['libs', 'utils', 'i18n!nls/formLabels', 'forms/views/treeNodeView', 'hbs!modules/BCM/forms/bcmJS/templates/treeNodeTemplate',
        'forms/models/TreeCollection', 'forms/models/TreeNodeModel', 'forms/views/TreeNodeEditView', 'forms/helpers/treeNodeSorter', 'modules/RSK/forms/riskJS/views/treeNodeAssessView', 'modules/BCM/forms/bcmJS/views/treeAddMultirowView', 'modules/RSK/forms/riskJS/views/overRideView', 'views/hoverCard', 'forms/helpers/reportHelper'
    ],


    function(libs, utils, formLabels, TreeNodeView, treeNodeTemplate, TreeCollection, TreeNodeModel, TreeNodeEditView, TreeNodeSorter, TreeNodeAssessView, TreeAddMultirowView, OverRideView, HoverCard, ReportHelper) {
        // global variable used for HoverCard
        var lastVisited = '',
            timeoutId, isHoverCardVisited;

        var treeNodeView = TreeNodeView.extend({
            template: treeNodeTemplate,
            templateHelpers: function() {
                var editableProperty = this.meta.root.get('editable');
                return {
                    'editable': editableProperty,
                };

            },
            /**
             * These are addtional UI components that are register to the dom elements.
             * We are extending the alrealy populated ui object.
             *
             * @method {Object} ui
             * @return {Object} myui the custom ui block
             */
            ui: function() {
                var myui = {};
                _.extend(myui, TreeNodeView.prototype.ui, {
                    assessLink: '.node-data',
                    editCustom: '.edit-mode-custom',
                    toggle: '.node-toggle-icon',
                    colorMe: '.colorMe'
                });
                return myui;
            },
            /**
             * Addtional events are required to be registed without deleting the original events
             * this is done by extending the events provided by ECP
             *
             * @method events
             * @return myevents
             */
            events: function() {
                var myevents = {};
                _.extend(myevents, TreeNodeView.prototype.events, {
                    'click @ui.toggle': 'onToggleSingleActive',
                    'click .rsk-override-node': 'overideEitorCliked', //,	//cedricm: for editing field on node
                    'mouseenter .rsk-summaryHover': 'mouseEnterShowHovercard', //cedricm: for editing field on node
                    'mouseleave .rsk-summaryHover': 'mouseLeaveHideHovercard'
                });
                return myevents;
            },
            /**
             * We need to registed triggers in order to obtain the view and work on it.
             * This is done by extendig ECP triggers
             *
             * @method triggers
             * @return mytriggers
             */
            triggers: function() {
                var mytriggers = {};
                _.extend(mytriggers, TreeNodeView.prototype.triggers, {
                    'click @ui.assessLink': {
                        event: "assess",
                        preventDefault: true,
                        stopPropagation: true
                    },
                    'click @ui.editCustom': {
                        event: "customEdit",
                        preventDefault: true,
                        stopPropagation: true
                    },
                    'click @ui.colorMe': {
                        event: "callOnloadEnd",
                        preventDefault: true,
                        stopPropagation: true
                    }
                });
                return mytriggers;
            },
            /**
             * This block is called when the view object is instansiated.
             * In addtion to extending ECP initialize method we perfrom a couple of additional tasks
             * We add two listerns and set the color set.
             *
             * @method initialize
             * @param {Object} options
             */
            initialize: function(options) {
                console.log(new Date().getTime());
                //    this.listenTo(this, 'assess', this.assess); //cedricm: for assessing Risk on node
                this.listenTo(this, 'customEdit', this.customEdit);
                //      this.listenTo(this, 'callOnloadEnd', this.callOnloadEnd); //cedricm: for assessing Risk on node
                TreeNodeView.prototype.initialize.call(this, options);

            },
            TreeCollection: TreeCollection,

            /**
             * We need to disable the dragDrop functionality of the Tree.
             * this method alowys us to modify this setting
             *
             * @method _enableDragAndDrop
             */
            _enableDragAndDrop: function() {
                this.meta.rootView.disableDragDrop();
            },

            /**
             * This method is used to render the node to the dom element.
             * Here were extend the ECP provided method and do a few custom step.
             * The custom steps involve binding custom events and modifying color of the
             * summary blocks
             *
             *@method onRender
             */
            onRender: function() {
                var that = this;
                TreeNodeView.prototype.onRender.call(this);

            },
            serializeData: function() {
                var self = this;
                var currCartridgeName = this.model.meta.cartridge;
                var hierarchyParticipents = this.meta.root.get('hierarchyParticipents');
                var currCartridge = hierarchyParticipents.get(currCartridgeName);
                var heirarchy = this.meta.root.get('heirarchy');
                var uid = this.model.get('unique-id');
                var keyField = currCartridge.get('key-field');
                var summaryFields = currCartridge.get('summary-fields') || [];

                var keyFieldData = {};
                //below line commented to enable AP-3785
                //keyFieldData[(this.fetchDisplayValue(this.getConf(keyField, 'displayValues'), this.getConf(keyField, 'resources'), this.getConf(keyField, 'resource'), this.model.get(keyField), currCartridge.get('fieldViews')[keyField].model.get('data-type')) || (formLabels.Add + " " + currCartridge.get('item-label')))] = '';
                keyFieldData.keyId = keyField;
                keyFieldData.label = this.getConf(keyField, 'label');
                var keyFieldResources = _.clone(this.getConf(keyField, 'resources'));
                keyFieldData.keyValue = (this.fetchDisplayValue(this.getConf(keyField, 'displayValues'), keyFieldResources, this.getConf(keyField, 'resource'), this.model.get(keyField), currCartridge.get('fieldViews')[keyField].model.get('data-type')) || (formLabels.Add + " " + currCartridge.get('item-label')));


                var summary = [];
                var treeSummary = summaryFields.slice(0, 3);
                _.each(treeSummary, function(key) {
                    var label = self.getConf(key, 'label') || currCartridge.getLabel(key);
                    if (currCartridge.get('fieldConfigs')[uid][key].hidden === false) {
                        var fieldResources = _.clone(this.getConf(key, 'resources'));
                        summary.push({
                            id: key,
                            label: label,
                            value: self.fetchDisplayValue(this.getConf(key, 'displayValues'), fieldResources, this.getConf(key, 'resource'), this.model.get(key), currCartridge.get('fieldViews')[key].model.get('data-type')) || '-'
                        });
                    }
                    //below line commented to enable AP-3785
                    //summary[label] = self.fetchDisplayValue(this.getConf(key, 'displayValues'), this.getConf(key, 'resources'), this.getConf(key, 'resource'), this.model.get(key), currCartridge.get('fieldViews')[key].model.get('data-type')) || '-';
                }, this);

                var menuItems = [];

                _.each(heirarchy[currCartridgeName], function(id) {

                    var cartridge = hierarchyParticipents.get(id);
                    if (cartridge.get('show-add-item') === 'Y') {
                        menuItems.push({
                            id: id,
                            name: hierarchyParticipents.get(id).get('item-label'),
                            imports: cartridge.get('items'),
                            behavior: cartridge.get('behavior')
                        });
                    }

                });

                var currCartridge = this.meta.root.get('hierarchyParticipents').get(this.model.meta.cartridge);
                var cartridgeElements = currCartridge.get('elements');
                _.each(cartridgeElements, function(ob) {
                    if (ob.type === "section") {
                        if (ob.label.indexOf("Grid") != -1) {
                            if (ob.description != undefined) {
                                F.gridRelatedObject = (F.gridRelatedObject == undefined) ? JSON.parse(ob.description) : F.gridRelatedObject;
                                for (var i = 0; i < F.gridRelatedObject.length; i++) {
                                    if (F.gridRelatedObject[i].displayGrid) {
                                        menuItems.push(F.gridRelatedObject[i]);
                                    }
                                    var menuLinks = F.formData.multirows[F.gridRelatedObject[i].id].gridConfigs["import-source"];
                                    if (menuLinks.length > 0 && F.gridRelatedObject[i].displayMenu) {
                                        for (var j = 0; j < menuLinks.length; j++) {
                                            menuItems.push({
                                                id: F.gridRelatedObject[i].id,
                                                name: menuLinks[j]['item-type'], //F[gridID].getLabel();
                                                sectionId: F.gridRelatedObject[i].id,
                                                sectionType: menuLinks[j]['data-source-type'],
                                                imports: [],
                                                item: menuLinks[j]['item-type'],
                                                filterFK: F.gridRelatedObject[i].filterFK,
                                                filterPK: F.gridRelatedObject[i].filterPK,
                                                behavior: menuLinks[j]['data-source-type']
                                            });
                                        }
                                    }
                                }
                            }
                        } else {
                            menuItems.push({
                                id: ob.parentId,
                                name: ob.label,
                                sectionId: ob.id,
                                sectionType: 'cartridge',
                                imports: [],
                                filterFK: "NA", //used to fiter the grid, NA for cartridge
                                filterPK: "NA", //used to fiter the grid, NA for cartridge
                                behavior: "SECTIONTYPE"
                            });
                        }
                    }
                });
                /*
                      //Common JSON defined at the JS level
                      for (var i = 0; i < F.relatedGrids.length; i++) {
                          menuItems.push(F.relatedGrids[i]);
                      }
                      */

                if (this.model.requiredValNotSet === undefined) {
                    var onlyRequiredRows = {};
                    _.filter(currCartridge.get('initFieldConfigs'), function(val, key) {
                        if (val.required === true) {
                            onlyRequiredRows[key] = val;
                        }
                    });
                    if (_.isEmpty(onlyRequiredRows)) {
                        this.model.requiredValNotSet = false;
                    } else {
                        this.model.requiredValNotSet = _.filter(onlyRequiredRows, function(val, key) {
                            if (val.required === true && !(_.isEmpty(self.model.get(key)) && !_.isNumber(self.model.get(key)))) return true;
                        }).length === 0 ? true : false;
                    }
                }


                var isValSet = this.model.requiredValNotSet;

                if (_.indexOf(_.map(this.model.meta._errorState, _.isEmpty), false) > -1) {
                    this.$el.find('.cartridgeHasErrors').remove();
                    this.$el.find('.cartridge-node-actions .edit-node').prepend('<i class="icn cartridgeHasErrors icn-circle-error"></i>');
                    isValSet = false;
                }

                this.isDeleteEnabled = currCartridge.get('show-delete-item') || true;


                return {
                    icon: (currCartridge.get('icon-source') || 'icn icn-folder-open'),
                    key: keyFieldData,
                    summary: summary,
                    offset: (this.meta.level - 1),
                    offsetwidth: ((this.meta.level - 1) * 30),
                    width: (10 - this.meta.level),
                    menuItems: menuItems,
                    requiredValuesNotSet: isValSet,
                    isDeleteEnabled: this.isDeleteEnabled,
                    mrUniqueId: this.model.get('unique-id')
                };
            },
            onAddChildren: function(e) {
                e.stopPropagation();
                e.preventDefault();
                this.ui.menu.dropdown("toggle");
                var addType = $(e.target).attr('type');
                var id = $(e.target).attr('cartridge-id');
                if (addType == 'import') {
                    this.displayImportReport(e);
                } else if (addType == 'manual') {
                    this.trigger('add', id);
                } else if (addType == 'sectionType' || addType == 'report') {
                    F.currentTreeRow = F[this.model.meta.cartridge].getRowNumber(this.model.get('unique-id'));
                    var sectionID = $(e.target).attr('sectionId');
                    var sectionType = $(e.target).attr('visualization');
                    var filterFK = $(e.target).attr('filterFK');
                    var filterPK = $(e.target).attr('filterPK');
                    F.windowInfo = {
                        "ID": id,
                        "sectionID": sectionID,
                        "sectionType": sectionType,
                        "filterFK": filterFK,
                        "filterPK": filterPK,
                        "parentView": this
                    }
                    if (addType == 'sectionType') {
                        this.trigger('customEdit', F.windowInfo);
                        if (sectionType == 'grid') {
                            F[F.windowInfo.ID].multirow.listenTo(F[F.windowInfo.ID].multirow, 'afterAddRow', function(row) {
                                var filterFK = F.windowInfo.filterFK.split(',');
                                var filterPK = F.windowInfo.filterPK.split(',');
                                for (var j = 0; j < filterPK.length; j++) {
                                    F[filterFK[j]].write(F[filterPK[j]].read(F.currentTreeRow), row);
                                }
                                //commented code is operation for filteration
                                setTimeout(function() {
                                    var filterFK = F.windowInfo.filterFK.split(',');
                                    var filterPK = F.windowInfo.filterPK.split(',');
                                    var filterPKValue = [];
                                    for (var i = 0; i < filterFK.length; i++) {
                                        filterPKValue.push(F[filterPK[i]].read(F.currentTreeRow));
                                    }
                                    var filterFKField = [];
                                    for (var i = 0; i < filterPK.length; i++) {
                                        filterFKField.push(F[filterFK[i]]);
                                    }
                                    F[F.windowInfo.ID].filter(filterFKField, filterPKValue, '=');
                                }, 300);

                                F.windowInfo.parentView.postReportImportOperation();
                                return true;
                            });
                        }

                    } else if (addType == 'report') {
                        var reportObject = F.formData.multirows[F.windowInfo.ID].gridConfigs['import-source'];
                        for (var len = 0; len < reportObject.length; len++) {
                            if (e.target.getAttribute('item') == reportObject[len]['item-type']) {
                                F[F.windowInfo.ID].multirow.reportLink = reportObject[len]['item-type'];
                                F.callReport(reportObject[len]['data-source-value'], reportObject[len].parameters, function(record) {
                                    var info = '';
                                    F[F.windowInfo.ID].multirow.loadReportData(record);
                                    debugger
                                });
                            }
                        }


                        F[id].multirow.listenTo(F[id].multirow, 'afterImport', function(addedObject) {
                            var filterFK = F.windowInfo.filterFK.split(',');
                            var filterPK = F.windowInfo.filterPK.split(',');
                            var newRecord = addedObject['import-data'];
                            for (var i = 0; i < newRecord.length; i++) {
                                var rowNo = F[F.windowInfo.ID].getRowNumber(newRecord[i].rowId);
                                for (var j = 0; j < filterPK.length; j++) {
                                    F[filterFK[j]].write(F[filterPK[j]].read(F.currentTreeRow), rowNo);
                                }
                            }
                            F.windowInfo.parentView.postReportImportOperation();
                            return true;
                        });
                    }
                }

            },
            postReportImportOperation: function() {

            },
            customEdit: function(info) {
                window.clearTimeout(timeoutId);
                var option = {
                    "collection": this.collection,
                    "model": this.model,
                    "view": this,
                    "info": info
                };
                timeoutId = null;

                option.TreeAddMultirowView = TreeAddMultirowView;
                treeAddMultirowView = new TreeAddMultirowView(option);

                this.$el.children('.children').before(treeAddMultirowView.render().el);
                treeAddMultirowView.$el.find('.column-filter-dropdown').css('display', 'none'); // remove the sort function from grids
                this.treeNodeEditView = treeAddMultirowView;


            },

            /**
             * We are just extending the ECP provide method
             *
             * @method addChildren
             * @param {String} id
             */
            addChildren: function(id) {
                TreeNodeView.prototype.addChildren.call(this, id);
                var that = this;
            }


        });

        return treeNodeView;

    });
