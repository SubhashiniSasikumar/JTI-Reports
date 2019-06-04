
(function (exports) {

    var _assetId;
    var assetIdList = "";
    var _withdrawElement;
    var resource;
    var _assets = [];
    var mailToString = "";
    var mailCCString = "";
    var mailSubjectString = "";
    var mailBodyString = "";
    var mimeType = false;
    var container = false;

    exports.MergePDF = otui.define("MergePDF", function () {
        // Properties for the view.
        this.properties = {
            'name': 'MergePDF', // Name is mandatory
            'asset_id': '',
            'title': otui.tr("Merge PDF"), // We set a displayable title for when showing this as a dialog.
            // 'userName': undefined // We set the userName as undefined so it is marked as required for instantiation.
        };

        // Function called to create the content for this view. Note that initContent functions must always have a name.
        this._initContent = function initBrightcove(self, placeContent) {
            var self = this;
            // this.thumbnail_content_url = this.properties.thumbnail_content_url;
            // First retrieve our content template, and use the "placeContent" callback to tell the framework to display it.
            var contents = this.getTemplate('MergePDFContent');
            otui.Templates.applyObject(contents, this.properties);
            _assetId = self.properties.asset_id;
            // $(contents).find("#assetCount").append("<p>You're about to merge the selected PDFs. Are sure you want to proceed?</p>");
            placeContent(contents);

            // $('.ot-modal-dialog-footer').empty();
            // $('.ot-modal-dialog-footer').append('<div class="ot-modal-dialog-footer-buttons" style="margin-right: 8px;"> ' +
            //     '<button type="submit" class="ot-button ls-newRequest-submissionButton" onclick="MergePDF.launchBrightcoveJob(this)">Send Email</button>');

            //Brightcove.launchBrightcoveJob(this)
            // var imageSrc = self.properties.thumbnail_content_url;
            // if (!imageSrc || imageSrc == '') {
            //     imageSrc = 'style/img/mime_type_unknown96.png'
            // }
            // $(".ot-rendition-img").attr('src', imageSrc);
        };

        this.bind("setup", function () {

        });
    });

    function setupBrightcove(event, resource) {
        return true;
    }


    //launch Send For Processing Workflow
    function launchMergePDF(event) {
        var view = otui.Views.containing(this); // Get the view for this entry.
        // The user may have chosen "select all", which means the UI needs to ask the server for the full list of asset IDs.

        view.getSelectedAssets(function (assets) {// Only give us the asset IDs

            for (var i = 0; i < assets.length; i++) {
                var allMimeTypes=[];
          
                $.ajax({
                    type: "GET",
                    url: otui.service + "/assets/" + assets[i],
                    cache: false,
                    crossDomain: true,
                    dataType: 'json',
                    xhrFields: {
                        withCredentials: true
                    }
                }).then(function (data) {

                    if (data.asset_resource.asset.type) {
                        allMimeTypes.push(data.asset_resource.asset.type);
                        console.log(data.asset_resource.asset.type);
                    }
                    else if (data.asset_resource.asset.mime_type != "application/pdf") {
                        console.log(data.asset_resource.asset.mime_type);
                        allMimeTypes.push(data.asset_resource.asset.mime_type)
                    }
                    else if (data.asset_resource.asset.mime_type == "application/pdf") {
                        allMimeTypes.push(data.asset_resource.asset.mime_type)
                        console.log(data.asset_resource.asset.mime_type);
                    }

                    if(allMimeTypes.length==assets.length)
                    {
                        console.log(allMimeTypes)
                        if (assets.length < 2) {
                            showAlert("Please select more than 1 asset to merge .", true);
                        }
                        else  if(allMimeTypes.every( (val, i, allMimeTypes) => val == "application/pdf" ) ){
                            _assetId = assets[0];
                            _assets = assets;
                            assetIdList = "";
                            for (var i = 0; i < assets.length; i++) {
                                if (assets.length > 1 && i != 0) {
                                    assetIdList += ",";
            
                                }
                                assetIdList += '"';
                                assetIdList += assets[i];
                                assetIdList += '"';
                            }
            
                            mergePDFAssetImg(_assetId);
                        }
            
                        else {
                            showAlert("Please select only pdfs .", true);
                           
                        }
                    }
              


                }).fail(function (data) {
                    console.log("fail")
                });
            }

         

        });

    }

    function getAssetMimeType(assetID) {
        $.ajax({
            type: "GET",
            url: otui.service + "/assets/" + assetID,
            cache: false,
            crossDomain: true,
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            }
        }).then(function (data) {

            if (data.asset_resource.asset.type) {
                console.log("type  " + data.asset_resource.asset.type);
                container = true;
                mimeType = false;
            }
            else if (data.asset_resource.asset.mime_type != "application/pdf") {
                // console.log("type  " + data.asset_resource.asset.mime_type );
                container = false;
                mimeType = false;
            }
            else if (data.asset_resource.asset.mime_type == "application/pdf") {
                container = false;
                mimeType = true;
            }

            //    console.log("container " + container + "mimetype " + mimeType);
        }).fail(function (data) {
            console.log("fail")
        });
    }

    this.assetID = _assetId;

    // function to get selected asset
    this.getSelectedasset = function (asset) {
        var params = {
            asset: asset,
        };

        //alert("You selected : " +params.asset);
        otui.NotificationManager.showNotification({
            'message': otui.tr("asset Selected: " + params.asset)
        });
    };

    //show alert Message
    function showAlert(message, isError) {
        if (isError) {
            otui.NotificationManager.showNotification({
                'message': otui.tr(message),
                'status': 'error',
                'stayOpen': isError
            });
        } else {
            otui.NotificationManager.showNotification({
                'message': otui.tr(message)
            });
        }
    }


    MergePDF.getMergedPDF = function (el) {
        var self = this
        var fields = document.querySelectorAll('[editable]');
        var formFilds = {
            'mailto': '',
            'mailcc': '',
            'mailsubject': '',
            'mailbody': '',
        }
        if (fields.length && fields.length > 0) {
            $.each(fields, function (index, value) {
                var dataName = $(value).attr("ot-fields")
                var dataValue = $(value).attr("data-value")
                if (dataValue == undefined) {
                    dataValue = value.value
                }
                formFilds[dataName] = dataValue
            })
        }
        mailToString = formFilds['mailto'];
        mailCCString = formFilds['mailcc'];
        mailSubjectString = formFilds['mailsubject'];
        mailBodyString = formFilds['mailbody'];

        console.log("mail to " + mailToString + mailCCString + mailSubjectString + mailBodyString);

        var asset = [];
        if (!formFilds['mailto'] || formFilds['mailto'].length == 0 || !formFilds['mailsubject'] || formFilds['mailsubject'].length == 0) {
            showAlert("Kindly Enter all the Mandatory Fields ");


        }
        else {
            MergePDF.mergePDFJob(el);
        }
    }

    MergePDF.mergePDFJob = function (el) {
        _withdrawElement = el;
        console.log("assets " + _assets);
        // This is the configured activity type in the system
        var activityType = "mergePDF";
        var serviceUrl = otui.service + "/jobs";


        var jobRequestParam = '{"job_request_param": { "job_request": { "asset_ids":[' + assetIdList + ' ], "job_type": "mergePDF","job_context_map" :[{ "key" :"To","value": {"type": "string","value": "' + mailToString + '"}},{ "key" :"CC","value": {"type": "string","value": "' + mailCCString + '"}},{ "key" :"Subject","value": {"type": "string","value": "' + mailSubjectString + '"}},{"key" :"Body","value": {"type": "string","value": "' + mailBodyString + '"}}]}}}';
        console.log(jobRequestParam);
        console.log("assets " + _assets);
        var data = "job_request=" + jobRequestParam;
        otui.post(serviceUrl, data, otui.contentTypes.formData, function (response) {
            if ((response) && response.job_handle != undefined && response.job_handle.job_id != undefined) {
                console.log(response.job_handle.job1_id);
                otui.DialogUtils.cancelDialog(_withdrawElement);
                showAlert("MergePDF has been launched with Job ID " + response.job_handle.job_id + ". Please check the status in Activities.", false);
            } else {
                console.log("http_response_code: " + response.exception_body.http_response_code);
                console.log("error_code: " + response.exception_body.error_code);
                console.log("debug_message: " + response.exception_body.debug_message);
                console.log("message: " + response.exception_body.message);
                showAlert("Merge PDF failed.", true);
            }
        });

    }



    this.mergePDFAssetImg = function (assetID) {
        $.ajax({
            type: "GET",
            url: otui.service + "/assets/" + assetID,
            cache: false,
            crossDomain: true,
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            }
        }).then(function (data) {
            // var thumbnail = data.asset_resource.asset.rendition_content.thumbnail_content.id;
            resource = data.asset_resource.asset;
            // var contentName = resource.master_content_info.name;
            // var splitName = contentName.split(".");
            // $("#previewimage").attr("src", otui.service + "/renditions/" + thumbnail + "");
            // var containe = $("#previewName")
            // containe.append('<p style= "font-size: 13px;">' + contentName + '</p>');
            MergePDF.asDialog({
                'userName': '',
                'asset_id': resource.asset_id,
                // 'thumbnail_content_url': ''
            });

        }).fail(function (data) {
            console.log("fail")
        });
    };

    otui.ready(function () {
        // Send for Processing.

        var sendForProcessingEntry = {
            'name': 'MergePDF',
            'text': 'Merge PDF',
            'img': '/otmm/ux-html/style/img/format_flip16_sprite.png',
            'setup': GalleryActions.hasCount(function () {
                return true;
            }),
            'select': launchMergePDF
        };
        // Then add it to all the locations available. Adding here only for Gallery View

        otui.GalleryAssetActions.register(sendForProcessingEntry);
        otui.GalleryViewActions.register(sendForProcessingEntry);
        //otui.Menus.register(sendForProcessingEntry);
    }, true);


})(window);
