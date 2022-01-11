(function(window, $) {

var _editorLanguage = {"color":{"auto":"Auto","clear":"Clear","color":"","create":true,"edit":true,"save":"Save"},"create":{"cancel":"","message":"","submit":"Create","title":"Create new entry"},"datetime":{"previous":"Previous","next":"Next","months":{"0":"January","1":"February","2":"March","3":"April","4":"May","5":"June","6":"July","7":"August","8":"September","9":"October","10":"November","11":"December"},"weekdays":{"0":"Sun","1":"Mon","2":"Tue","3":"Wed","4":"Thu","5":"Fri","6":"Sat"},"amPm":{"0":"am","1":"pm"},"hours":"Hour","minutes":"Minute","seconds":"Second","unknown":"-"},"edit":{"cancel":"","message":"","submit":"Update","title":"Edit entry"},"multi":{"title":"Multiple values","info":"The selected items contain different values for this input. To edit and set all items for this input to the same value, click or tap here, otherwise they will retain their individual values.","restore":"Undo changes","noMulti":"This input can be edited individually, but not part of a group."},"remove":{"cancel":"","confirm":{"1":"Are you sure you wish to delete this record?","_":"Are you sure you wish to delete %d records?"},"submit":"Delete","title":"Delete"}};
var _cleanIngnoreTimer = null;
var _logoSvg = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"' +
'	 style="box-sizing: content-box; display: inline; vertical-align: middle; height: 24px !important;"' +
'	 viewBox="0 0 152.7 136" style="enable-background:new 0 0 152.7 136;" xml:space="preserve">' +
'<g>' +
'	<g>' +
'		<path class="st0" d="M107.8,31C95.7-20.8,28-2.3,28,47h0c-36.1,0-39.9,56,3.7,56h16l0-72"/>' +
'	</g>' +
'	<rect x="55.2" y="38.5" class="st1" width="45" height="16.5"/>' +
'	<path class="st0" d="M94.2,136h-36c-2.5,0-4.5-2-4.5-4.5v0c0-2.5,2-4.5,4.5-4.5h36c2.5,0,4.5,2,4.5,4.5v0' +
'		C98.7,134,96.7,136,94.2,136z"/>' +
'	<path class="st0" d="M122.7,119.5h-42c-2.5,0-4.5-2-4.5-4.5v0c0-2.5,2-4.5,4.5-4.5h42c2.5,0,4.5,2,4.5,4.5v0' +
'		C127.2,117.5,125.2,119.5,122.7,119.5z"/>' +
'	<path class="st0" d="M64.3,119.5H40.7c-2.5,0-4.5-2-4.5-4.5v0c0-2.5,2-4.5,4.5-4.5h23.6c2.5,0,4.5,2,4.5,4.5v0' +
'		C68.8,117.5,66.8,119.5,64.3,119.5z"/>' +
'	<path class="st0" d="M134,31h-13.5c-2.5,0-4.5-2-4.5-4.5v0c0-2.5,2-4.5,4.5-4.5H134c2.5,0,4.5,2,4.5,4.5v0' +
'		C138.5,29,136.5,31,134,31z"/>' +
'	<path class="st0" d="M122.7,16H115c-2.5,0-4.5-2-4.5-4.5v0c0-2.5,2-4.5,4.5-4.5h7.8c2.5,0,4.5,2,4.5,4.5v0' +
'		C127.2,14,125.2,16,122.7,16z"/>' +
'	<rect x="107.7" y="38.5" class="st1" width="45" height="16.5"/>' +
'	<rect x="55.2" y="62.5" class="st1" width="45" height="16.5"/>' +
'	<rect x="107.7" y="62.5" class="st1" width="45" height="16.5"/>' +
'	<rect x="55.2" y="86.5" class="st1" width="45" height="16.5"/>' +
'	<rect x="107.7" y="86.5" class="st1" width="45" height="16.5"/>' +
'</g>' +
'</svg>';

function buttonClass(primary) {
	switch (window.__ct_style) {
		case 'dt': return 'btn';
		case 'zf': return primary ? 'button small primary' : 'button small secondary';
		case 'ju': return 'ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only';
		case 'bm': return primary ? 'button is-primary' : 'button';
		case 'se': return primary ? 'ui primary button' : 'ui button';

		case 'bs':
		case 'bs4':
		case 'bs5':
			return primary ? 'btn btn-primary' : 'button btn-light';
	}
}

function assignEditorButtons(buttons, editor) {
	for (var i=0 ; i<buttons.length ; i++ ) {
		var button = buttons[i];
		var extend = button.extend;
		var lang = _editorLanguage[extend];

		if (extend === 'create' || extend === 'duplicate' || extend === 'edit' || extend === 'remove') {
			button.editor = editor;

			if (lang && lang.cancel) {
				button.formButtons = [
					{
						action: function () {
							this.submit();
						},
						className: buttonClass(true),
						text: lang.submit
					},
					{
						action: function () {
							this.close();
						},
						className: buttonClass(false),
						text: lang.cancel
					}
				];
			}
		}
	}
}

// Create a unique value
function makeId(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;

   for (var i = 0; i < length; i++) {
	  result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }

   return result;
}

function showError(container, msg, reload) {
	var fg = $('<div class="cloudtables__error-foreground"></div>').text(msg);

	if (reload) {
		fg.on('click', function () {
			window.location.reload();
		});
	}

	container
		.addClass('cloudtables--error')
		.children('div.cloudtables__error')
		.append('<div class="cloudtables__error-background"></div>')
		.append(fg);
}

function hideError(container) {
	container.removeClass('cloudtables--error');
	container.find('div.cloudtables__error-background').remove();
	container.find('div.cloudtables__error-foreground').remove();
}

function _highlight(row, owned, id) {
	// Highlight a row using CSS transitions. The timeouts need to match the
	// transition duration from the CSS
	let node = $(row.node());
	let idx = owned.indexOf(id);
	let klass = 'ct-highlight-other';

	if (idx !== -1) {
		owned.splice(idx, 1);
		klass = 'ct-highlight-own';
	}

	setTimeout( function () {
		node.addClass(klass);

		setTimeout( function () {
			node.removeClass(klass);
		}, 1100 );
	}, 20 );
}

function sequenceDefaults(editor, json) {
	if (json.sequence) {
		$.each(json.sequence, function(key, val) {
			editor.field(key).def(val);
		});
	}
}

// Remove Editors default DataTables integration - we are going to use
// the socket to update the table
var dtSource = $.fn.dataTable.Editor.dataSources.dataTable;
dtSource.create = function () {}
dtSource.edit = function () {}
dtSource.remove = function () {}
dtSource.prep = function () {}
dtSource.commit = function () {}

$(document).ready(function() {
	var tableId = 'ct-a53ffc96-7326-11ec-8a89-0b82dfc73f11';
	var i18nErrors = {"unknownColumn":"CloudTables access condition error: The column specified for the condition ({id}) is unknown.","disconnected":"Disconnected. Automatically trying to reconnect, please wait...","dsLimit":"Unable to show CloudTable (error code: DS-LIMIT - {count}/{limit}). Please contact your system administrator to resolve this issue.","expired":"Access expired. Please reload to continue using this CloudTable. ↻","invalidCondition":"CloudTables access condition error: The condition value for field is not valid: {err}.","limitRows":"Unable to add new records to the data set (maximum {limit}). Please upgrade your plan to insert additional rows into this data set.","noAccess":"Unable to show CloudTable (error code: NOACCESS). Please contact your system administrator to resolve this issue.","rowLimit":"Unable to show CloudTable (error code: ROW-LIMIT - {count}/{limit}). Please contact your system administrator to resolve this issue.","setValue":"CloudTables access condition error: You must specify a `setValue` when using a condition which is not `=` or disable writing of the value using `set=false`."};
	var editor, dt;
	var owned = {
		create: [],
		edit: [],
		remove: []
	};

	if ($('#'+tableId).length) {
		tableId = tableId + Math.floor(Math.random() * 100);
	}

	// Create table and insert where the script tag is
	var errorContainer = $('<div class="cloudtables__error"></div');
	var tableContainer = $('<div class="cloudtables__table"></div');
	var table = $('<table style="width:100%"></table>')
		.attr('id', tableId)
		.appendTo(tableContainer);
	var container = $('<div class="cloudtables"/>')
		.append(errorContainer)
		.append(tableContainer);
	var insertData = '1641939481196';
	var inserted = false;
	var noAccess = false;

	if (insertData) {
		var insertPoint = $('[data-ct-insert="' + insertData + '"]');

		if (! insertPoint.length) {
			console.warn('CloudTables warning: Could not find insert point "' + insertData + '". No element with a `data-ct-insert` attribute matches that value.');

			insertPoint = $('body').children(':last-child');
		}
		else if (insertPoint.parents('head').length) {
			console.warn('CloudTables warning: Insert point for table ' + tableId + ' was in the document header. Inserting instead at the bottom of the body. Use the `insert` option to specify where the table should go on the page. Please see https://cloudtables.com/manual? for more information.');

			insertPoint = $('body').children(':last-child');
		}

		if (insertPoint.length) {
			insertPoint.after(container);
			inserted = true;
		}
	}

	if (! inserted) {
		console.warn('CloudTables warning: No insert point - falling back to appending to the end of the document');
		$('body').append(container);
	}

	var colorBtnClass = 'btn';

	switch (window.__ct_style) {
		case 'dt':
			table.addClass('display');
			break;

		case 'zf':
			colorBtnClass = 'button small secondary';
			table.addClass('display');
			break;

		case 'ju':
			colorBtnClass = 'ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only';
			table.addClass('display');
			break;

		case 'bm':
			colorBtnClass = 'button';
			table.addClass('table is-striped');
			break;

		case 'bs':
		case 'bs4':
		case 'bs5':
			colorBtnClass = 'btn btn-light';
			table.addClass('table table-striped');
			break;

		case 'se':
			colorBtnClass = 'ui button';
			table.addClass('ui unstackable celled table');
			break;
	}

	var origin = window.location.origin + '';
	if (origin === 'null') { // firefox
		origin = 'file://'
	}

	// Create a session identifier if there is not already one
	let sessionId = localStorage.getItem('ct-session');
	if (! sessionId) {
		sessionId = makeId(32);
		localStorage.setItem('ct-session', sessionId);
	}

	var socket = io( 'https://m8haxjspcw.cloudtables.io', {
		path: '/sock',
		query: {
			lang: 'en-GB',
			referer: origin + window.location.pathname,
			sessionId: sessionId,
			token: 'xjvK79fNm7ttUn3pV03pwl1oiCB39DMI',
		},
		withCredentials: false,
	} );
	// TODO show a loading indicator until socket connection

	socket.on('no-access', () => {
		noAccess = true;
	});

	var disconnectMsgTo;
	socket.on('disconnect', function (reason) {
		// No access allowed, so no point in trying to reconnect on disconnect
		if (noAccess) {
			return;
		}

		if (reason === 'io server disconnect') {
			// Server restarting is the most likely reason
			setTimeout(() => {
				socket.connect();
			}, 500);
		}
		// Socket io will attempt to auto connect for other errors

		// 5 sec delay before showing error message to prevent flickering
		disconnectMsgTo = setTimeout(function () {
			showError(container, i18nErrors.disconnected);
		}, 5000);
	});

	socket.on('no-access', function () {
		// Token is already in use or app not found
		showError(container, i18nErrors.expired, true);
	});

	socket.on('connect', function () {
		clearTimeout(disconnectMsgTo);

		hideError(container);
	});

	socket.on('table-a53ffc96-7326-11ec-8a89-0b82dfc73f11', function ( json ) {
		var recalc = false;

		if ( json.action === 'insert' || json.action === 'edit' ) {
			// Check if Editor is working on this row.
			if (editor.display() && $.inArray(json.row.id, editor.ids()) !== -1) {
				editor.message('Notice: The data in this row has been updated by someone else. This data does not reflect those changes.');
			}

			var row = dt.row( '#'+json.row.id );

			if (row.any()) {
				row.data( json.row );
			}
			else {
				row = dt.row.add( json.row );
			}

			dt.draw( false );

			_highlight(row, owned.edit, json.row.id + ':' + json.row.dv);
			recalc = true;
		}
		else if ( json.action === 'remove' ) {
			// Check if Editor is working on this row.
			if (editor.display() && $.inArray(json.row, editor.ids()) !== -1) {
				// TODO should show a message
				editor.close();
			}

			var row = dt.row( '#'+json.row );
			
			if (row.any()) {
				row.remove().draw( false );
				recalc = true;
			}
		}
		else if ( json.action === 'change' ) {
			// Data set structure change
			var reload = confirm('The data structure of the table has changed. To ensure everything is up to date, please reload this window by clicking "OK" below.');

			if (reload) {
				window.location.reload();
			}
		}
		else if ( json.action === 'options' ) {
			// List options updated - refresh the table since linked data might
			// have changed
			dt.ajax.reload(null, false);
		}

		// Data change, so update dependent components
		if (recalc) {
			dt.columns.adjust();

			if ( dt.responsive ) {
				dt.responsive.recalc();
			}

			if ( dt.searchPanes ) {
				dt.searchPanes.rebuildPane(undefined, true);
				$(window).trigger('resize.dtsp');
			}

			dt.colFilterRebuild();
		}
	} );

	socket.on( 'connection_setup', function () {
		socket.emit( 'table-subscribe', {
			datasetId: 'a53ffc96-7326-11ec-8a89-0b82dfc73f11'
		}, function ( json ) {
			// Error handling
		} );
	
		if ( $.fn.dataTable.isDataTable('#'+tableId) ) {
			// TODO should refresh data here in case missed anything
			// while disconnected
			return;
		}

		var editorFields = [{"_canCreate":true,"_canEdit":true,"_order":1,"attr":{"placeholder":""},"def":"","format":"","label":"Beneficiaries","name":"dp-9","type":"trumbowyg","fieldInfo":"","setFormatter":["delta","set-html"],"entityDecode":false,"nullDefault":true},{"_canCreate":true,"_canEdit":true,"_order":2,"attr":{"placeholder":""},"def":"","format":"","label":"Region","name":"dp-10","type":"text","fieldInfo":"","setFormatter":["delta","set-unformatted"],"entityDecode":false,"nullDefault":true},{"_canCreate":true,"_canEdit":true,"_order":3,"attr":{"placeholder":""},"def":"","format":"","label":"Country","name":"dp-11","type":"text","fieldInfo":"","setFormatter":["delta","set-unformatted"],"entityDecode":false,"nullDefault":true},{"_canCreate":true,"_canEdit":true,"_order":4,"attr":{"placeholder":""},"def":"","format":"","label":"Amount","name":"dp-12","type":"trumbowyg","fieldInfo":"","setFormatter":["delta","set-html"],"entityDecode":false,"nullDefault":true},{"_canCreate":true,"_canEdit":true,"_order":5,"attr":{"placeholder":""},"def":"","format":"","label":"Project Type","name":"dp-13","type":"text","fieldInfo":"","setFormatter":["delta","set-unformatted"],"entityDecode":false,"nullDefault":true},{"_canCreate":true,"_canEdit":true,"_order":6,"attr":{"placeholder":""},"def":"","format":"","label":"Org Type","name":"dp-14","type":"text","fieldInfo":"","setFormatter":["delta","set-unformatted"],"entityDecode":false,"nullDefault":true},{"_canCreate":true,"_canEdit":true,"_order":7,"attr":{"placeholder":""},"def":"","format":"","label":"Year","name":"dp-15","type":"trumbowyg","fieldInfo":"","setFormatter":["delta","set-html"],"entityDecode":false,"nullDefault":true},{"_canCreate":true,"_canEdit":true,"_order":8,"attr":{"placeholder":""},"def":"","format":"","label":"Comments","name":"dp-16","type":"trumbowyg","fieldInfo":"","setFormatter":["delta","set-html"],"entityDecode":false,"nullDefault":true},{"name":"dv","type":"hidden"},{"name":"nonce","type":"hidden"},{"name":"color","type":"hidden"}];
		editor = new $.fn.dataTable.Editor( {
			ajax: function ( method, url, data, success, error ) {
				socket.emit( 'table-data', $.extend( data, {
					datasetId: 'a53ffc96-7326-11ec-8a89-0b82dfc73f11'
				} ), function ( errors, json ) {
					if (errors && errors.length) {
						json.error = errors[0].msg;
					}

					success( json );
				} );
			},
			table: table,
			fields: editorFields,
			i18n: _editorLanguage,
			idSrc: 'id'
		} );

		editor.on( 'initCreate', function () {
			editor.field('nonce').val(
				Math.floor( Math.random()*10000 )
			);

			var show = [];
			var hide = [];

			for (var i=0 ; i<editorFields.length ; i++) {
				var field = editorFields[i];

				if (field._canCreate) {
					show.push(field.name);
				}
				else {
					hide.push(field.name);
				}
			}

			editor.show(show);
			editor.hide(hide);

			// Auto colouring by default
			editor.field('color').val(-1);
			rowColour
				.addClass('none')
				.html(colorI18n.auto);
		} );

		editor.on( 'initEdit', function () {
			var show = [];
			var hide = [];

			for (var i=0 ; i<editorFields.length ; i++) {
				var field = editorFields[i];

				if (field._canEdit) {
					show.push(field.name);
				}
				else {
					hide.push(field.name);
				}
			}

			editor.show(show);
			editor.hide(hide);

			// Set row colour (triggers change on pickr)
			var color = editor.field('color').val();

			if (color !== undefined) {
				pickr.setColor(color);
			}
			else {
				rowColour
					.html('-')
					.addClass('none');
			}
		} );

		editor.on( 'preSubmit', function ( e, data, action ) {
			if ( action === 'create' ) {
				$.each( data.data, function ( i, d ) {
					owned.create.push( d.nonce )
				} );
			}
			else {
				$.each( data.data, function ( i, d ) {
					owned[ action ].push( i + ':' + (d.dv+1) )
				} );
			}
		} );

		editor.on( 'submitComplete', function ( e, json ) {
			sequenceDefaults(editor, json);
		});

		// Row colour picker
		var colorI18n = _editorLanguage.color;
		var colourPicker = $('<div class="dte-row-options"><button class="'+colorBtnClass+'"><span class="dte-row-i18n">'+colorI18n.color+'</span><span class="dte-row-color"></span></button></div>');
		var rowColour = colourPicker.find('.dte-row-color');
		var pickr = Pickr.create({
			el: colourPicker.find('button')[0],
			theme: 'cloudtables',
			useAsButton: true,
			appClass: 'ct-pickr',
			lockOpacity: true,
			position: 'top-start',
			swatches: [
				'#b8ddf7',
				'#c2e6e6',
				'#cbe5be',
				'#d1cfe7',
				'#f9d7e7',
				'#fbdeda',
				'#f1cb9d',
				'#fff5a0',
				'#dfd1b4',
				'#a7bfe3'
			],
			components: {
				preview: true,
				opacity: false,
				hue: true,
				interaction: {
					hex: false,
					rgba: false,
					hsla: false,
					hsva: false,
					cmyk: false,
					input: true,
					clear: true,
					save: true
				}
			},
			i18n: {
				'btn:save': colorI18n.save,
				'btn:clear': colorI18n.clear,
			}
		});

		pickr.on('change', function (color) {
			var hex = color.toHEXA().toString();

			editor.field('color').val(hex);
			rowColour
				.removeClass('none')
				.html('')
				.css('background', hex);
		});

		pickr.on('save', function () {
			pickr.hide();
		});

		pickr.on('clear', function () {
			editor.field('color').val('');
			rowColour
				.html('&times;')
				.addClass('none');

			pickr.hide();
		});

		window.editor = editor;

		editor.on( 'open displayOrder', function (e, mode, action) {
			if (
				(action === 'create' && colorI18n.create) ||
				(action === 'edit' && colorI18n.edit)
			) {
				$('div.DTE_Footer', editor.displayNode()).prepend(colourPicker);
				
				// jQuery UI layout is slightly different. This does nothing if not jui
				$('div.DTED.ui-dialog div.ui-dialog-buttonpane').prepend(colourPicker);
			}
			else {
				colourPicker.detach();
			}
		});

		// Assign Editor variable to Editor buttons
		var layout = {"topLeft":null,"topRight":null,"bottomLeft":null,"bottomRight":null,"top1":{"args":[{"cascadePanes":false,"columns":["11:name","12:name"],"hideCount":false,"i18n":{"clearMessage":"Clear All","clearPane":"&times;","collapse":{"0":"Search panels","_":"Search panels (%d)"},"count":"","countFiltered":"{shown}","emptyMessage":"<em>No Data</em>","emptyPanes":"No search panels","loadMessage":"Loading...","title":"Active filters: %d"},"threshold":0.67,"viewTotal":true}],"feature":"searchPanes"},"top2Right":{"args":[{"placeholder":"","text":"Search: _INPUT_"}],"feature":"search"},"bottom1Left":{"args":[{"empty":"Showing 0 to 0 of 0 entries","search":"(filtered from _MAX_ total entries)","text":"Showing _START_ to _END_ of _TOTAL_ entries"}],"feature":"info"},"bottom1Right":{"args":["simple_numbers"],"feature":"paging"}};
		var maxBottom = 0;
		$.each(layout, function (key, item) {
			if (item && item.feature === 'buttons') {
				assignEditorButtons(item.args[0].buttons, editor);
			}

			// Find the insert point for the "Powered by..." text
			if (key.indexOf('bottom') === 0) {
				var idx = key.replace(/[^\d]/g, '') * 1;

				if (idx > maxBottom) {
					maxBottom = idx;
				}
			}
		});

		// Allow for light and dark backgrounds
		var calculatedBg = window.getComputedStyle(document.body).backgroundColor;
		var rgbBg = calculatedBg.match(/\d+/g)
		var background = rgbBg[0] > 150 && rgbBg[1] > 150 && rgbBg[2] > 150
			? '#16232A'
			: '#000000';
		var logoCheck = false;
		var logo = $(_logoSvg);
		logo.find('.st0').css('fill', '#458AE0');
		logo.find('.st1').css('fill', background);

		var poweredBy = $('<div></div>')
			.css({
				textAlign: 'left',
				whiteSpace: 'nowrap'
			})
			.append(
				$('<a href="https://cloudtables.com" target="_blank" style="color: #458AE0 !important; text-decoration: none;"></a>')
					.append(logo)
					.append(
						$('<span style="font-size: 1em; padding-left: 10px;">Powered by CloudTables</span>')
					)
			);

		// Add "Powered by" to the layout
		layout['bottom' + (maxBottom+1) + 'Left'] = poweredBy;

		var opts = $.extend({
			layout: layout,
			ajax: function ( data, callback, settings ) {
				socket.emit(
					'table-data',
					{
						datasetId: 'a53ffc96-7326-11ec-8a89-0b82dfc73f11'
					},
					function ( errors, json ) {
						if (errors.length) {
							let err = errors[0].msg;

							// Look up error message for translation and substitute values
							if (i18nErrors[err]) {
								err = i18nErrors[err];

								if (errors[0].data) {
									$.each(errors[0].data, function (key, val) {
										err = err.replace('{' + key + '}', val);
									});
								}
							}

							console.log('showError', err);

							showError(container, err);
						}
						else {
							callback( json );

							if (dt.searchPanes) {
								dt.searchPanes.rebuildPane();
								$(window).trigger('resize.dtsp');
							}

							sequenceDefaults(editor, json);
						}
					}
				);
			},
			columns: [{"className":"dtr-control","orderable":false,"searchable":false,"data":null,"defaultContent":"","title":""},{"className":"ct-column__color ct-column__color--pill","orderable":false,"searchable":false,"data":"color","render":["color"],"defaultContent":"","title":"","buttonTitle":"<span class=\"ct-button--colors\"></span>","width":"50px"},{"_order":1,"className":"ct-column__dp-9 dt-left","data":"dp-9","name":"10","title":"Beneficiaries","type":"string","render":["delta","html"],"defaultContent":""},{"_order":2,"className":"ct-column__dp-10 dt-left","data":"dp-10","name":"11","title":"Region","type":"string","render":["delta","plain",false],"defaultContent":""},{"_order":3,"className":"ct-column__dp-11 dt-left","data":"dp-11","name":"12","title":"Country","type":"string","render":["delta","plain",false],"defaultContent":""},{"_order":4,"className":"ct-column__dp-12 dt-left","data":"dp-12","name":"13","title":"Amount","type":"string","render":["delta","html"],"defaultContent":""},{"_order":5,"className":"ct-column__dp-13 dt-left","data":"dp-13","name":"14","title":"Project Type","type":"string","render":["delta","plain",false],"defaultContent":""},{"_order":6,"className":"ct-column__dp-14 dt-left","data":"dp-14","name":"15","title":"Org Type","type":"string","render":["delta","plain",false],"defaultContent":""},{"_order":7,"className":"ct-column__dp-15 dt-left","data":"dp-15","name":"16","title":"Year","type":"string","render":["delta","html"],"defaultContent":""},{"_order":8,"className":"ct-column__dp-16 dt-left","data":"dp-16","name":"17","title":"Comments","type":"string","render":["delta","html"],"defaultContent":""}],
			language: {"buttons":{"colvis":"Column visibility","copy":"Copy","copyTitle":"Copy to clipboard","copySuccess":{"1":"Copied one row to clipboard","_":"Copied %d rows to clipboard"},"create":"New","csv":"CSV","duplicate":"Duplicate","edit":"Edit","excel":"Excel","pageLength":{"-1":"All","_":"Show %d entries"},"pdf":"PDF","print":"Print","remove":"Delete"},"emptyTable":"No data available in table.","form":{"duplicate":{"submit":"Create from existing","title":"Duplicate record"}},"loadingRecords":"Loading...","paginate":{"first":"First","last":"Last","next":"Next","previous":"Previous"},"processing":"Processing...","zeroRecords":"No matching records found."},
			initComplete: function (settings) {
				logoCheck = true;
			},
			drawCallback: function (settings) {
				if (logoCheck && ! $('a', poweredBy).is(':visible')) {
					alert('This table is powered by CloudTables: https://cloudtables.com');
				}

				if (dt) {
					// Bar chart adjustments
					$.fn.DataTable.ctBar(dt);

					// Boolean style assignment
					for (var i=0; i<opts.columns.length; i++) {
						var col = opts.columns[i];

						if (col.extBoolean) {
							var ext = col.extBoolean;

							dt.cells(null, i, {page: 'current'}).every(function () {
								var d = this.data();

								// Array handling for linked data - need to know if the value consistent
								if (Array.isArray(d)) {
									var t = 0;
									var f = 0;

									for (var j=0; j<d.length; j++) {
										if (d[j] === true) {
											t++;
										}
										else if (d[j] === false) {
											f++;
										}
									}

									if (t && !f) {
										d = true;
									}
									else if (!t && f) {
										d = false;
									}
									else {
										d = null;
									}
								}

								if (d === true) {
									$(this.node()).css({
										color: ext.trueFgColor,
										background: ext.trueBg === 'cell'
											? ext.trueBgColor
											: ''
									});
								}
								else if (d === false) {
									$(this.node()).css({
										color: ext.falseFgColor,
										background: ext.falseBg === 'cell'
											? ext.falseBgColor
											: ''
									});
								}
							});
						}
					}

					// Index column
					if (dt.init().indexColumn) {
						var start = dt.page.info().start;

						dt
							.column('.dt-column-index', {page: 'current'})
							.nodes()
							.each( function (cell, i) {
								cell.innerHTML = start + i + 1;
							} );
					}
				}
			},
			rowId: 'id'
		}, {"caption":"","captionAlign":"center","captionSide":"bottom","select":{"style":"os","selector":"td:not(.dtr-control)"},"order":[{"name":"10","dir":"asc"}],"paging":true,"pageLength":10,"lengthMenu":[{"label":10,"value":10},{"label":25,"value":25},{"label":50,"value":50},{"label":100,"value":100}],"responsive":{"details":{"target":".dtr-control","type":"column"}},"indexColumn":false});

		dt = table
			.css({
				captionSide: opts.captionSide
			})
			.DataTable(opts);

		// DataTables will create the caption, but we need to apply the text alignment to it
		table.find('caption').css({
			textAlign: opts.captionAlign,
		});

		var event = new CustomEvent('ct-ready', {
			target: table
		})
		event.editor = editor;
		event.table = dt;
		document.dispatchEvent(event);
	} );
} );

})(window, jQuery);