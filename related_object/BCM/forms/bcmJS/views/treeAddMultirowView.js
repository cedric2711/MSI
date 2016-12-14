/**
 * treeNodeAssessView
 * It as been created to render a modal window layout which will contain all the child elements of the related Risk.
 * Within this view we render the inhrent, residual, control and additional information section
 * This whole section is rendered to have three major blocks
 * The top most block is the summary block
 * The left most block is the naviagion block
 * The remainning blocks are the Assessment block
 * It is invoked in the treeNodeView.assess function
 * Created by cedricm
 *
 * @class treeNodeAssessView
 * @return TreeNodeEditViewRSK The required custom view
 */

define(['libs', 'utils', 'forms/views/TreeNodeEditView', 'forms/helpers/resourceHelper'],

    function(libs, utils, TreeNodeEditView, resourceHelper) {
        var UUID = utils.UUID;
        var TreeNodeEditViewRSK = TreeNodeEditView.extend({
            className: 'cartridge-Empty-node',
            events: function() {
                var myevents = {};
                _.extend(myevents, TreeNodeEditView.prototype.events, {
                    'click @ui.actionButton': 'addCartridgeRow'
                });
                return myevents;
            },
            /**
             * The view is innitalized in this method.
             *
             * @method innitalized
             * @param {Object} node this is the model that is passed to the view
             */
            initialize: function(node) {
                TreeNodeEditView.prototype.initialize.call(this, node);
                this.info = node.info;
                // Code to do operation for escape key on assessment window
                this.$el.keydown(function(e, myObject) {
                    if (e.keyCode == 27) {
                        treeNodeAssessView.addCartridgeRow(e);
                    }
                });
            },

            /**
             * Draws the elements of the Risk Child Node
             * It extracts the three grids and displays them in the popin window
             *
             * @method onRender
             */
            onRender: function() {
                var that = this;
                var fieldViews = this.cartridge.get('fieldViews');
                var layout = this.cartridge.get('layout');
                var data = this.model.attributes;
                var elements = this.cartridge.get('elements');
                var uid = that.model.get('unique-id');
                var info = this.info;
                var newLayout = [];
                var newElements = {};
                if (info.sectionType == "cartridge") {
                    for (var i = 0; i < layout.length; i++) {
                        if (layout[i].id == info.sectionID) {
                            newLayout.push(layout[i]);
                            break;
                        }
                    }

                    _.each(elements, function(currEle) {
                        var t = '';
                        if (info.sectionID === currEle.id) {
                            newElements[currEle.id] = currEle;
                        }
                    });
                    if (newLayout.length > 0)
                        that._renderSection(newLayout, newElements);
                } else if (info.sectionType == "grid") {
                    this.$el.find('fieldset').attr('id', 'newID');
                    var filterFK = info.filterFK.split(',');
                    var filterPK = info.filterPK.split(',');
                    this.$el.find('#newID').append(F[info.ID].multirow.$el);
                    var filterPKValue = [];
                    for (var i = 0; i < filterPK.length; i++) {
                        filterPKValue.push(this.model.get(filterPK[i]));
                    }
                    var filterFKField = [];
                    for (var i = 0; i < filterFK.length; i++) {
                        filterFKField.push(F[filterFK[i]]);
                    }
                    F[info.ID].filter(filterFKField, filterPKValue, '=');
                }
                //                var

                var dataToRender = {
                    "La": "LA"
                };
                var that = this;
                //    this.$el.html(this.template(dataToRender));

                //that._renderSection(field.layout, elements[field.id].elements, field.id);
                /*      if (newLayout.length > 0)
                          that._renderSection(newLayout, newElements);
                      else {
                          this.$el.find('fieldset').attr('id', 'newID');
                          this.$el.find('#newID').append(F.ORB.multirow.$el);
                      }*/
                this.$el.find('.content-section').scrollspy({
                    target: ".side-nav-risk-popup"
                })
                return this;

            },
            destroy: function() {
                this.$el.hide();
            },
            addCartridgeRow: function(evt) {
                TreeNodeEditView.prototype.addCartridgeRow.call(this, evt);
                if (this.info.sectionType == "grid") {
                    F[this.info.ID].multirow.backgrid.collection.fullCollection.reset(F[this.info.ID].multirow.backgrid.shadowCollection.models, {
                        reindex: false
                    });
                    //F[this.info.ID].multirow.clearFilter(); //uncomment when fix obtained for bug ECP-3409
                }
            }


        });

        return TreeNodeEditViewRSK;

    });
